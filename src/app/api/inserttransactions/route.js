import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireRole, getAuthPayload } from "@/lib/auth";

const VALID_TIPE = ["pemasukkan", "pengeluaran"];
const VALID_KATEGORI = ["kas", "donasi", "kegiatan", "lainnya"];

export async function POST(req) {
    const unauthorized = requireRole(req, ["developer", "superadmin", "bendahara"]);
    if (unauthorized) return unauthorized;

    try {
        const body = await req.json();
        const { tipe, jumlah, deskripsi, kategori, target_user_id } = body;

        if (!tipe || jumlah === undefined || !kategori) {
            return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
        }

        if (!VALID_TIPE.includes(tipe)) {
            return NextResponse.json({ error: "Tipe tidak valid" }, { status: 400 });
        }

        const jumlahNum = parseInt(jumlah, 10);
        if (isNaN(jumlahNum) || jumlahNum <= 0) {
            return NextResponse.json({ error: "Jumlah tidak valid" }, { status: 400 });
        }

        // Use authenticated user as created_by instead of hardcoded value
        const payload = getAuthPayload(req);
        const createdBy = payload.id;

        const deskripsiValue = deskripsi ? String(deskripsi).trim().slice(0, 500) : null;
        const targetUserId = target_user_id ? parseInt(target_user_id, 10) : null;

        const insertQuery = `
            INSERT INTO transactions (tipe, jumlah, deskripsi, kategori, created_by, target_user_id, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, NOW())
            RETURNING id, tipe, jumlah, deskripsi, kategori, created_at;
        `;

        const values = [tipe, jumlahNum, deskripsiValue, kategori, createdBy, targetUserId];
        const result = await query(insertQuery, values);

        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
        console.error("POST /api/inserttransactions error:", error);
        return NextResponse.json({ error: "Gagal insert ke database" }, { status: 500 });
    }
}