import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";

export async function GET(req) {
    const unauthorized = requireRole(req, ["developer", "superadmin"]);
    if (unauthorized) return unauthorized;

    try {
        const res = await query('SELECT user_npm, user_role FROM users');
        const users = res.rows;

        return NextResponse.json(
            { users },
            { status: 200 }
        );

    } catch (error) {
        console.error("GET /api/users error:", error);
        return NextResponse.json(
            { error : "Gagal mengambil data pengguna" },
            { status: 500 }
        )
    }
}
