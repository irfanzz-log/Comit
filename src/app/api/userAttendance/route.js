import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import { requireAuth, getAuthPayload } from "@/lib/auth";

const LIMIT = 10;
const STAFF_ROLES = ["developer", "superadmin", "sekretaris", "staff", "bendahara"];

export async function GET(req) {
    const unauthorized = requireAuth(req);
    if (unauthorized) return unauthorized;

    // Identitas diverifikasi dari token — bukan dari query string — agar
    // user tidak bisa membaca absensi user lain (IDOR).
    const payload = getAuthPayload(req);
    const selfId = payload?.id;
    const isStaff = STAFF_ROLES.includes(payload?.role);

    const { searchParams } = new URL(req.url);

    const page = Math.max(1, parseInt(searchParams.get("page"), 10) || 1);
    const offset = (page - 1) * LIMIT;

    const conditions = [];
    const values = [];
    let idx = 1;

    if (searchParams.get("name")) {
        conditions.push(`ui.nama ILIKE $${idx}`);
        values.push(`%${searchParams.get("name")}%`);
        idx++;
    }

    if (searchParams.get("posisi")) {
        conditions.push(`ui.posisi = $${idx}`);
        values.push(searchParams.get("posisi"));
        idx++;
    }

    if (searchParams.get("status_absen")) {
        conditions.push(`a.status_absen = $${idx}`);
        values.push(searchParams.get("status_absen"));
        idx++;
    }

    if (searchParams.get("acara")) {
        conditions.push(`a.acara = $${idx}`);
        values.push(searchParams.get("acara"));
        idx++;
    }

    try {
        // -----------------------------------------------------
        // 1. Rekap kehadiran seluruh anggota (sekali jalan).
        //    Dipakai untuk leaderboard top-3, leaderboard terpaginasi,
        //    dan total baris — menggantikan 3 query hampir identik.
        // -----------------------------------------------------
        const recapRes = await query(`
            SELECT
                ui.id,
                ui.nama,
                COUNT(a.id) FILTER (WHERE a.status_absen = 'Hadir')::int AS hadir,
                COUNT(a.id) FILTER (WHERE a.status_absen = 'Izin')::int AS izin,
                COUNT(a.id) FILTER (WHERE a.status_absen = 'Sakit')::int AS sakit,
                COUNT(a.id) FILTER (WHERE a.status_absen = 'Alpha')::int AS alpha,
                COUNT(a.id)::int AS total_data
            FROM users_info ui
            LEFT JOIN attendance a ON ui.user_id = a.user_id
            GROUP BY ui.id, ui.nama
            ORDER BY hadir DESC, ui.nama ASC
        `);

        const leaderboard = recapRes.rows.slice(0, 3);
        const totalLeaderboard = recapRes.rows;
        const leaderboardAll = recapRes.rows.slice(offset, offset + LIMIT);
        const pageAll = Math.max(1, Math.ceil(recapRes.rows.length / LIMIT));

        // -----------------------------------------------------
        // 2. Daftar acara unik untuk dropdown filter
        // -----------------------------------------------------
        const acaraRes = await query(
            `SELECT DISTINCT acara FROM attendance WHERE acara IS NOT NULL ORDER BY acara ASC`
        );

        // -----------------------------------------------------
        // 3. Data absensi terfilter + total (paralel)
        // -----------------------------------------------------
        const scopeConditions = [...conditions];
        const scopeValues = [...values];
        let scopeIdx = idx;

        // Non-staff hanya boleh melihat baris miliknya sendiri
        if (!isStaff) {
            scopeConditions.push(`a.user_id = $${scopeIdx}`);
            scopeValues.push(selfId);
            scopeIdx++;
        }

        const scopeWhere = scopeConditions.length
            ? `WHERE ${scopeConditions.join(" AND ")}`
            : "";

        const [countRes, dataRes] = await Promise.all([
            query(
                `SELECT COUNT(*)::int AS total
                 FROM attendance a
                 INNER JOIN users_info ui ON a.user_id = ui.user_id
                 ${scopeWhere}`,
                scopeValues
            ),
            query(
                `SELECT
                    a.id,
                    ui.nama,
                    ui.posisi,
                    a.status_absen,
                    a.keterangan,
                    a.acara,
                    TO_CHAR(a.created_at, 'DD-MM-YYYY HH24:MI') AS waktu_absen
                 FROM attendance a
                 INNER JOIN users_info ui ON a.user_id = ui.user_id
                 ${scopeWhere}
                 ORDER BY a.created_at DESC
                 LIMIT $${scopeIdx} OFFSET $${scopeIdx + 1}`,
                [...scopeValues, LIMIT, offset]
            ),
        ]);

        const totalUsers = countRes.rows[0]?.total ?? 0;
        const totalPages = Math.max(1, Math.ceil(totalUsers / LIMIT));

        // -----------------------------------------------------
        // 4. Absensi sendiri — pengecekan "sudah absen" di Scanner
        // -----------------------------------------------------
        const selfAttendanceRes = await query(
            `SELECT acara FROM attendance WHERE user_id = $1`,
            [selfId]
        );

        return NextResponse.json({
            users: dataRes.rows,
            totalPages,
            pageAll,
            totalUsers,
            leaderboard,
            leaderboardAll,
            totalLeaderboard,
            acara: acaraRes.rows,
            resAttendance: selfAttendanceRes.rows,
        });
    } catch (error) {
        console.error("GET /api/userAttendance error:", error);
        return NextResponse.json(
            { error: "Gagal mengambil data absensi" },
            { status: 500 }
        );
    }
}
