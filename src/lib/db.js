import { Pool } from "pg";

// ==========================================================================
// Database layer
//
// Prisma (prisma/schema.prisma) adalah source of truth untuk struktur
// database. Aplikasi membaca/menulis melalui `pg` Pool dengan raw SQL
// (lihat src/app/api/**), dan koneksi diambil dari DATABASE_URL yang sama
// yang dipakai Prisma — sehingga tidak ada dua sumber konfigurasi.
//
// Matriks parsing:
//   DATABASE_URL="postgresql://user:pass@host:5432/db"   <- utama
//   atau pecahan lama: PGHOST/PGUSER/PGPASSWORD/PGDATABASE/PGPORT (fallback)
// ==========================================================================

/**
 * Parse DATABASE_URL (format postgresql://) menjadi bagian koneksi.
 * @param {string} url
 */
function parseDatabaseUrl(url) {
    if (!url) return null;

    try {
        const parsed = new URL(url);

        if (parsed.protocol !== "postgresql:" && parsed.protocol !== "postgres:") {
            return null;
        }

        const port = parseInt(parsed.port, 10);

        return {
            host: parsed.hostname || "localhost",
            port: Number.isFinite(port) && port > 0 ? port : 5432,
            user: decodeURIComponent(parsed.username),
            password: decodeURIComponent(parsed.password),
            database: parsed.pathname.replace(/^\//, ""),
        };
    } catch {
        return null;
    }
}

const fromUrl = parseDatabaseUrl(process.env.DATABASE_URL);

const pool = new Pool(
    fromUrl
        ? {
              host: fromUrl.host,
              port: fromUrl.port,
              user: fromUrl.user,
              password: fromUrl.password,
              database: fromUrl.database,
          }
        : {
              // Fallback: pecahan PG* lama (kompatibilitas environment existing)
              host: process.env.PGHOST || "localhost",
              user: process.env.PGUSER,
              password: process.env.PGPASSWORD,
              database: process.env.PGDATABASE || "comit_db",
              port: Number(process.env.PGPORT) || 5432,
          }
);

/**
 * Jalankan parameterized query.
 * @param {string} text - SQL statement, gunakan $1, $2, ... untuk parameter
 * @param {Array<unknown>} params
 * @returns {Promise<import("pg").QueryResult>}
 */
export async function query(text, params = []) {
    const res = await pool.query(text, params);
    return res;
}

export { pool };
