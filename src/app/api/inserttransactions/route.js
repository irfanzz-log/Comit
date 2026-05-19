import { NextResponse } from 'next/server';
import { query } from '@/lib/db'; 

export async function POST(req) {
    try {
        const body = await req.json();
        const { tipe, jumlah, deskripsi, kategori, target_user_id } = body;

        // Validasi
        if (!tipe || !jumlah || !kategori) {
            return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
        }

        const queryy = `
            INSERT INTO transactions (tipe, jumlah, deskripsi, kategori, created_by, target_user_id, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, NOW())
            RETURNING *;
        `;

        // created_by default 1 sesuai data di screenshot
        const values = [tipe, jumlah, deskripsi, kategori, 1, target_user_id || null];
        
        const result = await query(queryy, values);

        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json({ error: 'Gagal insert ke database' }, { status: 500 });
    }
}