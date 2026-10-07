import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const uuid = searchParams.get("uuid");

    if (!uuid || typeof uuid !== "string" || uuid.trim() === "") {
        return NextResponse.json({ error: "UUID tidak valid" }, { status: 400 });
    }

    // `uuid` di-SELECT punya tipe data `uuid` PostgreSQL, jadi nilai non-UUID
    // (mis. "not-a-uuid") melempar 22P02 sebelum clause WHERE dievaluasi.
    // Validasi format di sini agar input invalid -> 404, bukan server error.
    const UUID_REGEX =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!UUID_REGEX.test(uuid.trim())) {
        return NextResponse.json([], { status: 200 });
    }

    try {
        // Hanya kolom yang dipakai client. Sebelumnya SELECT * membocorkan
        // file_key (Uploadthing secret) dan user_id pembuat acara.
        const result = await query(
            `SELECT id, uuid, nama_acara, tanggal_acara, komentar, tipe_acara, file_url
             FROM events WHERE uuid = $1`,
            [uuid.trim()]
        );
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error("GET /api/whereEvents error:", error);
        return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
    }
}