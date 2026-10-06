import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import { requireAuth, getAuthPayload } from "@/lib/auth";

// Nilai `tipe` disimpan lowercase di DB (lihat POST /api/inserttransactions).
const TIPE_ALIASES = {
    pemasukkan: "pemasukkan",
    pengeluaran: "pengeluaran",
    // Klien lama mengirim huruf besar — normalisasi agar filter tetap cocok.
    PEMASUKKAN: "pemasukkan",
    PENGELUARAN: "pengeluaran",
    kas: "pemasukkan",
};

function normalizeTipe(raw) {
    if (!raw || raw === "all") return null;
    const key = String(raw).trim();
    return TIPE_ALIASES[key] ?? key.toLowerCase();
}

export async function GET(req) {
    const unauthorized = requireAuth(req);
    if (unauthorized) return unauthorized;

    const { searchParams } = new URL(req.url);

    const page = Math.max(1, parseInt(searchParams.get("page"), 10) || 1);
    const searchName = searchParams.get("name") || "";
    const tipe = normalizeTipe(searchParams.get("tipe"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit"), 10) || 10));
    const offset = (page - 1) * limit;

    const kategori = searchParams.get("kategori");

    try {
        const conditions = [];
        const values = [];
        let idx = 1;

        // Filter nama: cari di nama admin, nama target, atau deskripsi
        if (searchName) {
            conditions.push(
                `(admin.nama ILIKE $${idx} OR target.nama ILIKE $${idx} OR t.deskripsi ILIKE $${idx})`
            );
            values.push(`%${searchName}%`);
            idx++;
        }

        if (tipe) {
            conditions.push(`t.tipe = $${idx}`);
            values.push(tipe);
            idx++;
        }

        if (kategori) {
            conditions.push(`t.kategori = $${idx}`);
            values.push(kategori.toLowerCase());
            idx++;
        }

        const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

        const joinClause = `
            FROM transactions t
            INNER JOIN users_info admin ON t.created_by = admin.user_id
            LEFT JOIN users_info target ON t.target_user_id = target.user_id
        `;

        // Satu query agregat untuk total baris + total pemasukkan/pengeluaran
        // (mengganti hitungan sisi klien dari N baris yang dibawa sebelumnya).
        const sumQuery = `
            SELECT
                COUNT(*)::int AS total,
                COALESCE(SUM(jumlah) FILTER (WHERE tipe = 'pemasukkan'), 0)::bigint AS total_pemasukkan,
                COALESCE(SUM(jumlah) FILTER (WHERE tipe = 'pengeluaran'), 0)::bigint AS total_pengeluaran
            ${joinClause}
            ${whereClause}
        `;

        const dataQuery = `
            SELECT
                t.id,
                t.tipe,
                t.jumlah,
                t.deskripsi,
                t.kategori,
                t.created_at,
                admin.nama AS nama_penginput,
                target.nama AS ditujukan_ke
            ${joinClause}
            ${whereClause}
            ORDER BY t.created_at DESC
            LIMIT $${idx} OFFSET $${idx + 1}
        `;

        const [sumRes, dataRes] = await Promise.all([
            query(sumQuery, values),
            query(dataQuery, [...values, limit, offset]),
        ]);

        const total = sumRes.rows[0]?.total ?? 0;
        const totalPages = Math.max(1, Math.ceil(total / limit));

        return NextResponse.json({
            users: dataRes.rows,
            totalPages,
            totalUsers: total,
            totalPemasukkan: Number(sumRes.rows[0]?.total_pemasukkan ?? 0),
            totalPengeluaran: Number(sumRes.rows[0]?.total_pengeluaran ?? 0),
        });
    } catch (error) {
        console.error("GET /api/transactions error:", error);
        return NextResponse.json(
            { error: "Gagal mengambil data transaksi" },
            { status: 500 }
        );
    }
}
