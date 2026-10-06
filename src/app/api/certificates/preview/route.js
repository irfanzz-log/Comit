import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";

// ==========================================================================
// GET /api/certificates/preview?prefix=COMIT-2026
//
// Mengembalikan nomor urut berikutnya untuk sebuah prefix nomor
// sertifikat, dipakai UI untuk pratinjau nomor unik sebelum submit.
// ==========================================================================

export async function GET(req) {
    const unauthorized = requireRole(req, ["developer", "superadmin", "sekretaris"]);
    if (unauthorized) return unauthorized;

    const { searchParams } = new URL(req.url);
    const raw = (searchParams.get("prefix") || "").trim();

    if (!raw) {
        return NextResponse.json({ success: false, message: "Prefix wajib diisi" }, { status: 400 });
    }

    const prefix = raw.toUpperCase().slice(0, 90);

    try {
        const result = await query(
            `SELECT certificate_number
             FROM certificates
             WHERE certificate_number LIKE $1 || '%'
             ORDER BY certificate_number DESC
             LIMIT 1`,
            [prefix]
        );

        let next = 1;
        if (result.rowCount > 0) {
            const tail = String(result.rows[0].certificate_number).slice(prefix.length + 1);
            const parsed = parseInt(tail, 10);
            if (Number.isFinite(parsed)) next = parsed + 1;
        }

        return NextResponse.json({ success: true, next });
    } catch (error) {
        console.error("GET /api/certificates/preview error:", error);
        return NextResponse.json(
            { success: false, message: "Gagal menghitung nomor urut" },
            { status: 500 }
        );
    }
}
