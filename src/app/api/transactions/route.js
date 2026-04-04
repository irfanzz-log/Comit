import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get('page')) || 1;
    const searchName = searchParams.get('name') || '';
    const tipe = searchParams.get('tipe');
    const limit = parseInt(searchParams.get('limit')) || 10;
    const offset = (page - 1) * limit;

    try {
        let conditions = [];
        let values = [];
        let idx = 1;

        // 1. Perbaikan Filter Nama (Mencari di deskripsi atau nama orang)
        if (searchName) {
            // Kita gunakan OR untuk mencari di deskripsi transaksi ATAU nama admin
            conditions.push(`(admin.nama ILIKE $${idx})`);
            values.push(`%${searchName}%`);
            idx++;
        }

        // 2. Filter Tipe (Pemasukkan/Pengeluaran)
        if (tipe && tipe !== 'all') {
            conditions.push(`t.tipe = $${idx}`);
            values.push(tipe);
            idx++;
        }

        const whereClause = conditions.length
            ? `WHERE ${conditions.join(' AND ')}`
            : '';

        // COUNT QUERY - Gunakan JOIN yang sama agar jumlah baris sinkron
        const countQuery = `
            SELECT COUNT(*) 
            FROM transactions t 
            INNER JOIN users_info admin ON t.created_by = admin.user_id
            LEFT JOIN users_info target ON t.target_user_id = target.user_id
            ${whereClause}
        `;

        const countRes = await query(countQuery, values);
        const totalUsers = parseInt(countRes.rows[0].count || 0);
        const totalPages = Math.ceil(totalUsers / limit);

        // DATA QUERY
        const dataQuery = `
            SELECT 
                t.id, 
                t.tipe, 
                t.jumlah, 
                t.deskripsi,
                t.created_at,
                admin.nama AS nama_penginput, 
                target.nama AS ditujukan_ke
            FROM transactions t
            INNER JOIN users_info admin ON t.created_by = admin.user_id
            LEFT JOIN users_info target ON t.target_user_id = target.user_id
            ${whereClause}
            ORDER BY t.created_at DESC
            LIMIT $${idx} OFFSET $${idx + 1}
        `;

        // Masukkan values filter, lalu tambahkan limit dan offset
        const dataRes = await query(dataQuery, [...values, limit, offset]);

        return NextResponse.json({
            users: dataRes.rows,
            totalPages,
            totalUsers
        });

    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json(
            { error: "Gagal mengambil data transaksi" },
            { status: 500 }
        );
    }
}