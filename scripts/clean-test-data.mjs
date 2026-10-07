// ==========================================================================
// scripts/clean-test-data.mjs
//
// Integration test pernah menulis data uji ("Test Event *", "Test kas
// integration", "Contract Test", absensi "Test Acara Integration") ke
// database yang sama dengan aplikasi, tanpa membersihkannya. Skrip ini
// membuang baris-baris itu.
//
// CARA PAKAI:
//   node scripts/clean-test-data.mjs          (default: tampilkan dry-run)
//   node scripts/clean-test-data.mjs --apply  (benar-benar hapus)
//
// Aman: semua filter berdasarkan pola nama test yang spesifik. Baris seed
// ("Rapat Bulanan COMIT" dll.) tidak tersentuh.
// ==========================================================================

import pg from "pg";

const DRY = !process.argv.includes("--apply");

const PATTERNS = {
    events: { column: "nama_acara", patterns: ["Test Event %"] },
    transactions: {
        column: "deskripsi",
        patterns: ["Test kas integration", "Test created_by scoping"],
    },
    attendance: { column: "acara", patterns: ["Test Acara Integration"] },
    enrollments: { column: "nama", patterns: ["Contract Test"] },
};

function build() {
    if (process.env.DATABASE_URL) {
        const u = new URL(process.env.DATABASE_URL);
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

const pool = new pg.Pool(build());

async function countDeleted(table, column, patterns) {
    const likes = patterns.map((_, i) => `${column} LIKE $${i + 1}`).join(" OR ");
    const r = await pool.query(`SELECT count(*)::int AS n FROM ${table} WHERE ${likes}`, patterns);
    return r.rows[0].n;
}

async function run() {
    let total = 0;

    for (const [table, { column, patterns }] of Object.entries(PATTERNS)) {
        const n = await countDeleted(table, column, patterns);
        total += n;
        if (!n) continue;
        if (DRY) {
            console.log(`[dry-run] ${table}: ${n} baris akan dihapus (${column} LIKE ${patterns.join(" / ")})`);
        } else {
            const likes = patterns.map((_, i) => `${column} LIKE $${i + 1}`).join(" OR ");
            const r = await pool.query(`DELETE FROM ${table} WHERE ${likes} RETURNING id`, patterns);
            console.log(`[applied ] ${table}: ${r.rowCount} baris dihapus`);
        }
    }

    console.log(DRY ? `\nTotal yang akan dihapus: ${total}` : `\nTotal dihapus: ${total}`);
    if (DRY && total > 0) console.log("Jalankan dengan --apply untuk mengeksekusi.");
    if (total === 0) console.log("Database bersih, tidak ada data test tersisa.");

    await pool.end();
}

run().catch((e) => {
    console.error("Gagal:", e.message);
    process.exit(1);
});
