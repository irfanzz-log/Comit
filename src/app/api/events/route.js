import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import { getAuthPayload, STAFF_ROLES } from "@/lib/auth";

const MAX_LIMIT = 50;

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const rawLimit = parseInt(searchParams.get("limit"), 10);
    const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, MAX_LIMIT) : 5;

    // Halaman /announcement memang publik (menampilkan kegiatan eksternal),
    // jadi endpoint ini tidak memerlukan login. Tapi filter "internal"
    // sebelumnya hanya dilakukan di client (Announcement.jsx) — acara
    // internal + file_url-nya tetap terbaca lewat request langsung.
    // Di sini filter ditegakkan di server: pengunjung anonim/non-staff
    // hanya mendapat acara publik tanpa file_url.
    const payload = getAuthPayload(req);
    const isStaff = STAFF_ROLES.includes(payload?.role);

    try {
        let result;

        if (isStaff) {
            result = await query(
                `SELECT id, uuid, nama_acara, tanggal_acara, komentar, tipe_acara, file_url
                 FROM events
                 ORDER BY tanggal_acara DESC
                 LIMIT $1`,
                [limit]
            );
        } else {
            // Publik: hanya acara eksternal, tanpa file_url privat
            result = await query(
                `SELECT id, uuid, nama_acara, tanggal_acara, komentar, tipe_acara
                 FROM events
                 WHERE tipe_acara <> 'internal'
                 ORDER BY tanggal_acara DESC
                 LIMIT $1`,
                [limit]
            );
        }

        return NextResponse.json(result.rows);
    } catch (error) {
        console.error("GET /api/events error:", error);
        return NextResponse.json(
            { error: "Gagal mengambil data kegiatan" },
            { status: 500 }
        );
    }
}