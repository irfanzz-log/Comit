import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import { requireRole, getAuthPayload } from "@/lib/auth";

export async function POST(req) {
    const unauthorized = requireRole(req);
    if (unauthorized) return unauthorized;

    try {
        const { fileUrl, fileKey, nameEvent, date, comment, tipe } = await req.json();

        if (!nameEvent || !date || !tipe) {
            return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
        }

        const payload = getAuthPayload(req);
        const userId = payload.id;

        const nameEventValue = String(nameEvent).trim().slice(0, 200);
        const commentValue = comment ? String(comment).trim().slice(0, 500) : null;
        const tipeValue = String(tipe).trim().slice(0, 50);

        const res = await query(
            `INSERT INTO events (nama_acara, tanggal_acara, komentar, tipe_acara, file_url, file_key, user_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [nameEventValue, date, commentValue, tipeValue, fileUrl || null, fileKey || null, userId]
        );

        return NextResponse.json(res.rows[0], { status: 201 });
    } catch (error) {
        console.error("POST /api/addEvents error:", error);
        return NextResponse.json({ error: "Insert gagal" }, { status: 500 });
    }
}