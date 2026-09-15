import { query } from "@/lib/db";
import { NextResponse } from "next/server";

const MAX_LIMIT = 50;

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const rawLimit = parseInt(searchParams.get("limit"), 10);
    const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, MAX_LIMIT) : 5;

    try {
        const result = await query(
            `SELECT id, uuid, nama_acara, tanggal_acara, komentar, tipe_acara, file_url
             FROM events
             ORDER BY tanggal_acara DESC
             LIMIT $1`,
            [limit]
        );

        return NextResponse.json(result.rows);
    } catch (error) {
        console.error("GET /api/events error:", error);
        return NextResponse.json(
            { error: "Gagal mengambil data kegiatan" },
            { status: 500 }
        );
    }
}