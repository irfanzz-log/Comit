import { NextResponse } from 'next/server';
import { query } from '@/lib/db'; 

export async function POST(req) {
    try {
        const body = await req.json();
        const { user_id, status_absen, keterangan, acara } = body;

        if (!user_id || !status_absen) {
            return NextResponse.json({ message: "Data tidak valid" }, { status: 400 });
        }

        const result = await query(
           "INSERT INTO attendance (user_id, status_absen, keterangan, acara, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *",
           [user_id, status_absen, keterangan, acara]
        );

        return NextResponse.json({ success: true, res: result }, { status: 201 });
    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
}