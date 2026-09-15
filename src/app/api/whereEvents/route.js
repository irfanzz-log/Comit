import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const uuid = searchParams.get("uuid");

    if (!uuid || typeof uuid !== "string" || uuid.trim() === "") {
        return NextResponse.json({ error: "UUID tidak valid" }, { status: 400 });
    }

    try {
        const result = await query(
            `SELECT * FROM events WHERE uuid = $1`,
            [uuid.trim()]
        );
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error("GET /api/whereEvents error:", error);
        return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
    }
}