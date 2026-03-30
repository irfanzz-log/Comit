import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get('page')) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    try {
        let conditions = [];
        let values = [];
        let idx = 1;

        // NAME
        if (searchParams.get('name')) {
            conditions.push(`i.nama ILIKE $${idx}`);
            values.push(`%${searchParams.get('name')}%`);
            idx++;
        }

        // STATUS
        if (searchParams.get('status')) {
            conditions.push(`i.status = $${idx}`);
            values.push(searchParams.get('status'));
            idx++;
        }

        // POSISI
        if (searchParams.get('posisi')) {
            conditions.push(`i.posisi = $${idx}`);
            values.push(searchParams.get('posisi'));
            idx++;
        }

        // MINAT
        if (searchParams.get('minat')) {
            conditions.push(`i.minat = $${idx}`);
            values.push(searchParams.get('minat'));
            idx++;
        }

        const whereClause = conditions.length
            ? `WHERE ${conditions.join(' AND ')}`
            : '';

        // COUNT
        const countQuery = `
            SELECT COUNT(*) 
            FROM users u 
            INNER JOIN users_info i ON u.id = i.user_id
            ${whereClause}
        `;

        const countRes = await query(countQuery, values);
        const totalUsers = parseInt(countRes.rows[0].count);
        const totalPages = Math.ceil(totalUsers / limit);

        // DATA
        const dataQuery = `
            SELECT u.user_npm, i.nama, i.jurusan, i.minat, i.status, i.posisi 
            FROM users u 
            INNER JOIN users_info i ON u.id = i.user_id
            ${whereClause}
            ORDER BY i.nama ASC
            LIMIT $${idx} OFFSET $${idx + 1}
        `;

        const dataRes = await query(dataQuery, [...values, limit, offset]);

        return NextResponse.json({
            users: dataRes.rows,
            totalPages,
            totalUsers
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Gagal mengambil data pengguna" },
            { status: 500 }
        );
    }
}