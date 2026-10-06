import { pool } from "@/lib/db";
import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { randomUUID } from "crypto";

// ==========================================================================
// POST /api/certificates/batch
//
// Terbitkan banyak sertifikat sekaligus untuk satu kegiatan. Nomor
// sertifikat dibuat otomatis: `<prefix>-<NNN>` di mana NNN adalah nomor
// urut yang diteruskan dari nomor terakhir yang sudah ada untuk prefix
// tersebut — sehingga selalu unik dan terurut.
//
// Body:
//   template_id      BigInt (wajib)
//   number_prefix    String  mis. "COMIT-2026" (wajib)
//   activity_name    String  (wajib)
//   participants     [String] daftar nama peserta (wajib, minimal 1)
//   activity_info    String?
//   issue_date       Date    (wajib)
//   signer_name      String?
//   signer_position  String?
// ==========================================================================

const MAX_BATCH = 500;

export async function POST(req) {
    const unauthorized = requireRole(req, ["developer", "superadmin", "sekretaris"]);
    if (unauthorized) return unauthorized;

    const client = await pool.connect();

    try {
        const body = await req.json();
        const {
            template_id,
            number_prefix,
            activity_name,
            participants,
            activity_info,
            issue_date,
            signer_name,
            signer_position,
        } = body;

        // ------------------------------------------------ validasi
        if (!template_id || !number_prefix || !activity_name || !issue_date) {
            return NextResponse.json(
                { success: false, message: "Data tidak lengkap (template, prefix nomor, kegiatan, dan tanggal wajib diisi)" },
                { status: 400 }
            );
        }

        const prefix = String(number_prefix).trim().toUpperCase().slice(0, 90);
        if (!/^[A-Z0-9-]+$/.test(prefix)) {
            return NextResponse.json(
                { success: false, message: "Prefix nomor hanya boleh huruf, angka, dan tanda hubung" },
                { status: 400 }
            );
        }

        // Daftar peserta: terima array atau string multiline, lalu
        // dedupe sambil mempertahankan urutan.
        let names = Array.isArray(participants)
            ? participants
            : String(participants ?? "").split("\n");

        names = [...new Set(
            names
                .map((n) => String(n ?? "").trim())
                .filter((n) => n.length > 0)
        )];

        if (names.length === 0) {
            return NextResponse.json(
                { success: false, message: "Daftar peserta tidak boleh kosong" },
                { status: 400 }
            );
        }
        if (names.length > MAX_BATCH) {
            return NextResponse.json(
                { success: false, message: `Maksimal ${MAX_BATCH} peserta per batch` },
                { status: 400 }
            );
        }

        // Pastikan template ada (FK, sekaligus mencegah insert ke template
        // yang sudah dihapus).
        await client.query("BEGIN");

        const tpl = await client.query(
            `SELECT id FROM certificate_templates WHERE id = $1 FOR SHARE`,
            [template_id]
        );
        if (tpl.rowCount === 0) {
            await client.query("ROLLBACK");
            return NextResponse.json(
                { success: false, message: "Template sertifikat tidak ditemukan" },
                { status: 404 }
            );
        }

        // ------------------------------------------------ nomor urut
        // Ambil nomor terakhir untuk prefix ini (kunci baris agar aman
        // terhadap request batch yang berjalan bersamaan), lalu lanjutkan.
        const last = await client.query(
            `SELECT certificate_number
             FROM certificates
             WHERE certificate_number LIKE $1 || '%'
             ORDER BY certificate_number DESC
             LIMIT 1
             FOR UPDATE`,
            [prefix]
        );

        let seq = 0;
        if (last.rowCount > 0) {
            const tail = String(last.rows[0].certificate_number).slice(prefix.length + 1);
            const parsed = parseInt(tail, 10);
            if (Number.isFinite(parsed)) seq = parsed;
        }

        // ------------------------------------------------ insert
        // Generated id dikembalikan ke client (RETURNING) supaya UI bisa
        // langsung menautkan ke halaman publik /sertifikat/<uuid>.
        const values = names.map((nama, i) => {
            const num = `${prefix}-${String(seq + i + 1).padStart(3, "0")}`;
            return [
                randomUUID(),
                template_id,
                num,
                nama.slice(0, 200),
                String(activity_name).trim().slice(0, 200),
                activity_info ? String(activity_info).trim().slice(0, 500) : null,
                issue_date,
                signer_name ? String(signer_name).trim().slice(0, 200) : null,
                signer_position ? String(signer_position).trim().slice(0, 200) : null,
                null,
            ];
        });

        const placeholders = values
            .map((_, r) => `(${Array.from({ length: 10 }, (_, c) => `$${r * 10 + c + 1}`).join(",")})`)
            .join(",");

        const flat = values.flat();

        const inserted = await client.query(
            `INSERT INTO certificates(
                id, template_id, certificate_number, participant_name,
                activity_name, activity_info, issue_date,
                signer_name, signer_position, qr_code
            ) VALUES ${placeholders}
            RETURNING id, certificate_number, participant_name`,
            flat
        );

        await client.query("COMMIT");

        return NextResponse.json({
            success: true,
            created: inserted.rowCount,
            certificates: inserted.rows.map((r) => ({
                id: r.id,
                number: r.certificate_number,
                name: r.participant_name,
            })),
            numbers: inserted.rows.map((r) => r.certificate_number),
        });

    } catch (error) {
        await client.query("ROLLBACK").catch(() => {});
        console.error("POST /api/certificates/batch error:", error);

        // 23505 = unique_violation (nomor bentrok, sangat jarang setelah
        // penguncian di atas — beri pesan spesifik).
        if (error.code === "23505") {
            return NextResponse.json(
                { success: false, message: "Nomor sertifikat bentrok. Coba lagi dengan prefix berbeda." },
                { status: 409 }
            );
        }
        return NextResponse.json(
            { success: false, message: "Gagal membuat batch sertifikat" },
            { status: 500 }
        );
    } finally {
        client.release();
    }
}
