import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const limit = searchParams.get("limit") || 5;

  try {
    const result = await query(
      `SELECT *
       FROM events
       ORDER BY tanggal_acara ASC
       LIMIT $1`,
      [limit]
    );

    const res = result.rows;

    return NextResponse.json(res);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}