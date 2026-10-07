import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import { requireAuth, getAuthPayload, STAFF_ROLES } from "@/lib/auth";

// Ringkasan keuangan untuk dashboard: total pemasukkan/pengeluaran plus
// agregat per bulan (untuk ChartLine). Semua dihitung di database, jadi
// client tidak perlu menarik seluruh baris transaksi.
//
// Catatan keamanan: anggota biasa sebelumnya bisa melihat total kas
// organisasi (saldo penuh). Anggota hanya boleh melihat transaksi yang
// ditujukan ke dirinya sendiri; staf (yg mengelola keuangan) melihat semua.
export async function GET(req) {
    const unauthorized = requireAuth(req);
    if (unauthorized) return unauthorized;

    const payload = getAuthPayload(req);
    const isStaff = STAFF_ROLES.includes(payload?.role);

    // Kondisi scope: non-staff hanya melihat transaksi miliknya
    const scope = isStaff ? "" : "WHERE target_user_id = $1";
    const scopeValues = isStaff ? [] : [payload.id];

    try {
        const sumRes = await query(`
            SELECT
                COALESCE(SUM(jumlah) FILTER (WHERE tipe = 'pemasukkan'), 0)::bigint AS total_pemasukkan,
                COALESCE(SUM(jumlah) FILTER (WHERE tipe = 'pengeluaran'), 0)::bigint AS total_pengeluaran
            FROM transactions
            ${scope}
        `, scopeValues);

        const monthRes = await query(`
            SELECT
                EXTRACT(MONTH FROM created_at)::int AS month,
                tipe,
                COALESCE(SUM(jumlah), 0)::bigint AS total
            FROM transactions
            ${scope}
            GROUP BY EXTRACT(MONTH FROM created_at), tipe
        `, scopeValues);

        const byMonth = {
            Pemasukkan: Array(12).fill(0),
            Pengeluaran: Array(12).fill(0),
        };

        for (const row of monthRes.rows) {
            const idx = row.month - 1;
            if (idx < 0 || idx > 11) continue;
            if (row.tipe === "pemasukkan") byMonth.Pemasukkan[idx] = Number(row.total);
            if (row.tipe === "pengeluaran") byMonth.Pengeluaran[idx] = Number(row.total);
        }

        const row = sumRes.rows[0] || {};

        return NextResponse.json({
            totalPemasukkan: Number(row.total_pemasukkan ?? 0),
            totalPengeluaran: Number(row.total_pengeluaran ?? 0),
            saldo: Number(row.total_pemasukkan ?? 0) - Number(row.total_pengeluaran ?? 0),
            byMonth,
        });
    } catch (error) {
        console.error("GET /api/transactions/summary error:", error);
        return NextResponse.json(
            { error: "Gagal mengambil ringkasan transaksi" },
            { status: 500 }
        );
    }
}
