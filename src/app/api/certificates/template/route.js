import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";

export async function GET(req) {
    const unauthorized = requireRole(req, ["developer", "superadmin", "sekretaris"]);
    if (unauthorized) return unauthorized;

    const result = await query(`
        SELECT id, name
        FROM certificate_templates
        ORDER BY name
    `);

    return NextResponse.json({ data: result.rows });
}