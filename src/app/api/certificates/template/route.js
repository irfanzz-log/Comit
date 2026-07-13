import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {

    const result = await query(`
        SELECT id,name
        FROM certificate_templates
        ORDER BY name
    `);

    return NextResponse.json({
        data: result.rows
    });

}