import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const res = await query('SELECT user_npm, password, user_role FROM users');
        const users = res.rows;
        
        return NextResponse.json(
            { users }, 
            { status: 200 }
        );
        
    } catch (error) {
        return NextResponse.json(
            { error : "Gagal mengambil data pengguna" },
            { status: 500 }
        )
    }
}