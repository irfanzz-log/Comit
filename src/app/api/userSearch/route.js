// src/app/api/userSearch/route.js
import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(req) {
    const unauthorized = requireAuth(req);
    if (unauthorized) return unauthorized;
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('query') || '';

    try {
        const res = await query(
            // Pastikan menggunakan alias 'id' agar sesuai dengan 'user.id' di frontend
            'SELECT user_id AS id, nama FROM users_info WHERE nama ILIKE $1 LIMIT 5',
            [`%${q}%`]
        );
        
        // Kirim array-nya saja langsung
        return NextResponse.json(res.rows); 
    } catch (error) {
        return NextResponse.json({ error: "Gagal" }, { status: 500 });
    }
}