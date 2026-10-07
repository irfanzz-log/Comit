import { query, pool } from "@/lib/db";
import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { hashPassword } from "@/lib/hash";
import { randomBytes } from "crypto";

// ======================================================
// PATCH /api/enrollments/:id
// ACC / Tolak pendaftaran
//
// Catatan keamanan: sebelumnya pengguna baru dibuat dengan
// password = NPM. NPM adalah identifier semi-publik (tercetak di
// sertifikat, daftar anggota, struktur pengurus) — siapa pun yang
// tahu NPM bisa langsung login. Sekarang password sementara dibuat
// acak (crypto.randomBytes) dan dikembalikan SEKALI kepada admin
// yang menyetujui, untuk disampaikan ke anggota secara aman.
// ======================================================

// Password sementara: 12 byte acak base64url (~16 karakter).
function generateTempPassword() {
    return randomBytes(12).toString("base64url");
}

export async function PATCH(request, { params }) {
    const unauthorized = requireRole(request, ["developer", "superadmin", "sekretaris"]);
    if (unauthorized) return unauthorized;

    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                { success: false, message: "ID pendaftaran tidak ditemukan" },
                { status: 400 }
            );
        }

        const body = await request.json();
        const { status } = body;

        if (!["approved", "rejected"].includes(status)) {
            return NextResponse.json(
                { success: false, message: "Status tidak valid" },
                { status: 400 }
            );
        }

        const enrollmentResult = await query(
            `SELECT id, nama, npm, no_telpon, jurusan, alasan, status, created_at, updated_at
             FROM enrollments WHERE id = $1`,
            [id]
        );

        if (enrollmentResult.rows.length === 0) {
            return NextResponse.json(
                { success: false, message: "Data pendaftaran tidak ditemukan" },
                { status: 404 }
            );
        }

        const enrollment = enrollmentResult.rows[0];

        // JIKA DITOLAK
        if (status === "rejected") {
            await query(
                `UPDATE enrollments SET status = 'rejected', updated_at = NOW() WHERE id = $1`,
                [id]
            );
            return NextResponse.json({ success: true, message: "Pendaftaran berhasil ditolak" });
        }

        // JIKA APPROVED
        // Dibungkus dalam transaction agar akun + info anggota + status
        // pendaftaran selalu konsisten (sebelumnya 3 query terpisah —
        // kegagalan di tengah meninggalkan data setengah jadi).
        const tempPassword = generateTempPassword();
        const hashedDefaultPassword = await hashPassword(tempPassword);

        await pool.connect().then(async (client) => {
            try {
                await client.query("BEGIN");

                const existingUser = await client.query(
                    `SELECT id FROM users WHERE user_npm = $1 LIMIT 1`,
                    [enrollment.npm]
                );

                let userId;

                if (existingUser.rows.length === 0) {
                    const newUser = await client.query(
                        `INSERT INTO users (user_npm, password, user_role)
                         VALUES ($1, $2, 'anggota') RETURNING id`,
                        [enrollment.npm, hashedDefaultPassword]
                    );
                    userId = newUser.rows[0].id;
                } else {
                    userId = existingUser.rows[0].id;
                }

                const existingInfo = await client.query(
                    `SELECT id FROM users_info WHERE user_id = $1 LIMIT 1`,
                    [userId]
                );

                if (existingInfo.rows.length === 0) {
                    await client.query(
                        `INSERT INTO users_info (user_id, nama, posisi, jurusan, minat, status, linkimg)
                         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                        [userId, enrollment.nama, "Anggota", enrollment.jurusan, null, "aktif", null]
                    );
                } else {
                    await client.query(
                        `UPDATE users_info SET nama = $1, posisi = $2, jurusan = $3, status = $4
                         WHERE user_id = $5`,
                        [enrollment.nama, "Anggota", enrollment.jurusan, "aktif", userId]
                    );
                }

                await client.query(
                    `UPDATE enrollments SET status = 'approved', updated_at = NOW() WHERE id = $1`,
                    [id]
                );

                await client.query("COMMIT");
            } catch (txError) {
                await client.query("ROLLBACK");
                throw txError;
            } finally {
                client.release();
            }
        });

        return NextResponse.json({
            success: true,
            message: "Pendaftar berhasil diterima sebagai anggota",
            // Password sementara hanya ditampilkan SEKALI di sini — tidak
            // disimpan plaintext di mana pun. Admin harus menyalurkan ini
            // ke anggota bersangkutan. Simpan di tempat aman.
            temporary_password: tempPassword,
            npm: enrollment.npm,
        });

    } catch (error) {
        console.error("PATCH enrollments error:", error);
        return NextResponse.json(
            { success: false, message: "Gagal memproses pendaftaran" },
            { status: 500 }
        );
    }
}