import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { fileUrl, fileKey, user_id, nameEvent, date, comment } = await req.json();

        const res = await query(`INSERT INTO events (nama_acara,tanggal_acara,komentar,file_url,file_key,user_id) VALUES ($1,$2,$3,$4,$5,$6) returning *`, [nameEvent,date,comment,fileUrl,fileKey,user_id]);

        return NextResponse.json(res.rows[0], { status: 201 });
    } catch (error) {
        return NextResponse.json({error : 'Insert Failed'}, {status : 500 });
    }
}