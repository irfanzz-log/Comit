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
            conditions.push(`ui.nama ILIKE $${idx}`);
            values.push(`%${searchParams.get('name')}%`);
            idx++;
        }

        // POSISI
        if (searchParams.get('posisi')) {
            conditions.push(`ui.posisi = $${idx}`);
            values.push(searchParams.get('posisi'));
            idx++;
        }

        // STATUS ABSEN
        if (searchParams.get('status_absen')) {
            conditions.push(`a.status_absen = $${idx}`);
            values.push(searchParams.get('status_absen'));
            idx++;
        }
        // ACARA
        if (searchParams.get('acara')) {
            conditions.push(`a.acara = $${idx}`);
            values.push(searchParams.get('acara'));
            idx++;
        }

        const whereClause = conditions.length
            ? `WHERE ${conditions.join(' AND ')}`
            : '';

        // COUNT
        const countQuery = `
            SELECT COUNT(*) 
            FROM attendance a 
            INNER JOIN users_info ui ON a.user_id = ui.user_id
            ${whereClause}
        `;

        const countAcara = `
            SELECT a.acara
            FROM attendance a 
            INNER JOIN users_info ui ON a.user_id = ui.user_id
        `;

        // LEADERBOARD
        const leaderboardQuery = `
            SELECT 
                ui.nama,
                COUNT(a.id) FILTER (WHERE a.status_absen = 'Hadir') AS hadir,
                COUNT(a.id) FILTER (WHERE a.status_absen = 'Izin') AS izin,
                COUNT(a.id) FILTER (WHERE a.status_absen = 'Sakit') AS sakit,
                COUNT(a.id) AS total_data
            FROM users_info ui
            LEFT JOIN attendance a ON ui.user_id = a.user_id
            GROUP BY ui.id, ui.nama
            ORDER BY hadir DESC, nama ASC
            LIMIT 3
        `;

        const LeaderboardAll = `
            SELECT 
                ui.nama,
                COUNT(a.id) FILTER (WHERE a.status_absen = 'Hadir') AS hadir,
                COUNT(a.id) FILTER (WHERE a.status_absen = 'Izin') AS izin,
                COUNT(a.id) FILTER (WHERE a.status_absen = 'Sakit') AS sakit,
                COUNT(a.id) AS total_data
            FROM users_info ui
            LEFT JOIN attendance a ON ui.user_id = a.user_id
            ${whereClause}
            GROUP BY ui.id, ui.nama
            ORDER BY hadir DESC, nama ASC
            LIMIT $${idx} OFFSET $${idx + 1}
        `;

        const leaderboardAllrows = `
            SELECT 
                ui.nama,
                COUNT(a.id) FILTER (WHERE a.status_absen = 'Hadir') AS hadir,
                COUNT(a.id) FILTER (WHERE a.status_absen = 'Izin') AS izin,
                COUNT(a.id) FILTER (WHERE a.status_absen = 'Sakit') AS sakit,
                COUNT(a.id) AS total_data
            FROM users_info ui
            LEFT JOIN attendance a ON ui.user_id = a.user_id
            GROUP BY ui.id, ui.nama
            ORDER BY hadir DESC, nama ASC
        `;

        const leaderboardRes = await query(leaderboardQuery);
        const leaderboard = leaderboardRes.rows;

        const leaderboardAllRes = await query(LeaderboardAll, [...values, limit, offset]);
        const leaderboardAll = leaderboardAllRes.rows;

        const leaderboardAllRows = await query(leaderboardAllrows);
        const totalLeaderboard = leaderboardAllRows.rows;

        const countRes = await query(countQuery, values);
        const totalUsers = parseInt(countRes.rows[0].count);
        const totalPages = Math.ceil(totalUsers / limit);

        const acaraRes = await query(countAcara);
        const acara = acaraRes.rows;
        

        // DATA
        const dataQuery = `
           SELECT 
            a.id, 
            ui.nama, 
            ui.posisi, 
            a.status_absen, 
            a.keterangan, 
            a.acara,
            TO_CHAR(a.created_at, 'DD-MM-YYYY HH24:MI') as waktu_absen
            FROM attendance a 
            INNER JOIN users_info ui ON a.user_id = ui.user_id
            ${whereClause}
            ORDER BY a.created_at DESC
            LIMIT $${idx} OFFSET $${idx + 1}
        `;

        const dataRes = await query(dataQuery, [...values, limit, offset]);

        return NextResponse.json({
            users: dataRes.rows,
            totalPages,
            totalUsers,
            leaderboard,
            leaderboardAll,
            totalLeaderboard,
            acara
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Gagal mengambil data pengguna" },
            { status: 500 }
        );
    }
}