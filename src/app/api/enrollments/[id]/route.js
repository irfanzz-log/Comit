import { query } from "@/lib/db";
import { NextResponse } from "next/server";


// ======================================================
// PATCH /api/enrollments/:id
// ACC / Tolak pendaftaran
//
// Jika approved:
// - Buat akun di users
// - Masukkan data ke users_info
// - Status pendaftaran menjadi approved
// ======================================================

export async function PATCH(request, { params }) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "ID pendaftaran tidak ditemukan",
                },
                { status: 400 }
            );
        }

        const body = await request.json();
        const { status } = body;

        // ==================================================
        // VALIDASI STATUS
        // ==================================================

        if (!["approved", "rejected"].includes(status)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Status tidak valid",
                },
                { status: 400 }
            );
        }

        // ==================================================
        // AMBIL DATA PENDAFTARAN
        // ==================================================

        const enrollmentResult = await query(
            `
            SELECT
                id,
                nama,
                npm,
                no_telpon,
                jurusan,
                alasan,
                status,
                created_at,
                updated_at
            FROM enrollments
            WHERE id = $1
            `,
            [id]
        );

        if (enrollmentResult.rows.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Data pendaftaran tidak ditemukan",
                },
                { status: 404 }
            );
        }

        const enrollment = enrollmentResult.rows[0];

        // ==================================================
        // JIKA DITOLAK
        // ==================================================

        if (status === "rejected") {

            await query(
                `
                UPDATE enrollments
                SET
                    status = 'rejected',
                    updated_at = NOW()
                WHERE id = $1
                `,
                [id]
            );

            return NextResponse.json({
                success: true,
                message: "Pendaftaran berhasil ditolak",
            });
        }

        // ==================================================
        // JIKA APPROVED
        // ==================================================

        // Cek apakah NPM sudah mempunyai akun
        const existingUser = await query(
            `
            SELECT id
            FROM users
            WHERE user_npm = $1
            LIMIT 1
            `,
            [enrollment.npm]
        );

        let userId;

        // ==================================================
        // BUAT USER JIKA BELUM ADA
        // ==================================================

        if (existingUser.rows.length === 0) {

            const newUser = await query(
                `
                INSERT INTO users
                (
                    user_npm,
                    password,
                    user_role
                )
                VALUES
                (
                    $1,
                    $2,
                    'anggota'
                )
                RETURNING id
                `,
                [
                    enrollment.npm,
                    enrollment.npm
                ]
            );

            userId = newUser.rows[0].id;

        } else {

            userId = existingUser.rows[0].id;

        }

        // ==================================================
        // CEK users_info
        // ==================================================

        const existingInfo = await query(
            `
            SELECT id
            FROM users_info
            WHERE user_id = $1
            LIMIT 1
            `,
            [userId]
        );

        // ==================================================
        // INSERT users_info
        // ==================================================

        if (existingInfo.rows.length === 0) {

            await query(
                `
                INSERT INTO users_info
                (
                    user_id,
                    nama,
                    posisi,
                    jurusan,
                    minat,
                    status,
                    linkimg
                )
                VALUES
                (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6,
                    $7
                )
                `,
                [
                    userId,
                    enrollment.nama,
                    "Anggota",
                    enrollment.jurusan,
                    null,
                    "aktif",
                    null
                ]
            );

        } else {

            // ==================================================
            // UPDATE users_info
            // ==================================================

            await query(
                `
                UPDATE users_info
                SET
                    nama = $1,
                    posisi = $2,
                    jurusan = $3,
                    status = $4
                WHERE user_id = $5
                `,
                [
                    enrollment.nama,
                    "Anggota",
                    enrollment.jurusan,
                    "aktif",
                    userId
                ]
            );
        }

        // ==================================================
        // UPDATE STATUS ENROLLMENT
        // ==================================================

        await query(
            `
            UPDATE enrollments
            SET
                status = 'approved',
                updated_at = NOW()
            WHERE id = $1
            `,
            [id]
        );

        // ==================================================
        // RESPONSE
        // ==================================================

        return NextResponse.json({
            success: true,
            message: "Pendaftar berhasil diterima sebagai anggota",
        });

    } catch (error) {

        console.error(
            "PATCH enrollments error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message: "Gagal memproses pendaftaran",
                error: error.message,
            },
            { status: 500 }
        );
    }
}