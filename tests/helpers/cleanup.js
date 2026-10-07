import pg from "pg";

// ==========================================================================
// Pembersih jejak integration test.
//
// Integration test pernah menulis data uji ke database aplikasi tanpa
// membersihkannya (lihat scripts/clean-test-data.mjs). Helper ini
// memastikan setiap suite yang menulis ke DB membuang jejaknya lagi.
//
// Konfigurasi koneksi mengikuti src/lib/db.js: TEST_DATABASE_URL >>
// DATABASE_URL >> pecahan PG* — test dan app berbagi satu sumber.
// ==========================================================================

const CLEAN_PATTERNS = {
    events: { column: "nama_acara", patterns: ["Test Event %"] },
    transactions: {
        column: "deskripsi",
        patterns: ["Test kas integration", "Test created_by scoping"],
    },
    attendance: { column: "acara", patterns: ["Test Acara Integration"] },
    enrollments: { column: "nama", patterns: ["Contract Test"] },
};

let cleanPool = null;

function poolConfig() {
    const url = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL || "";
    if (url) {
        const u = new URL(url);
        return {
            host: u.hostname,
            port: Number(u.port) || 5432,
            user: decodeURIComponent(u.username),
            password: decodeURIComponent(u.password),
            database: u.pathname.replace(/^\//, ""),
        };
    }
    return {
        host: process.env.PGHOST || "localhost",
        port: Number(process.env.PGPORT) || 5432,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE || "comit_db",
    };
}

function getCleanPool() {
    if (!cleanPool) cleanPool = new pg.Pool(poolConfig());
    return cleanPool;
}

/**
 * Buang baris yang ditulis integration test. Idempoten — aman dipanggil
 * berulang (afterEach/afterAll).
 */
export async function cleanupTestData() {
    const pool = getCleanPool();
    for (const [table, { column, patterns }] of Object.entries(CLEAN_PATTERNS)) {
        const likes = patterns
            .map((_, i) => `${column} LIKE $${i + 1}`)
            .join(" OR ");
        await pool.query(`DELETE FROM ${table} WHERE ${likes}`, patterns);
    }
}

/** Tutup pool; panggil di afterAll suite terakhir. */
export async function closeCleanPool() {
    if (cleanPool) {
        await cleanPool.end();
        cleanPool = null;
    }
}
