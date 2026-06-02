module.exports = [
"[project]/.next-internal/server/app/api/userAttendance/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/pg [external] (pg, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("pg");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/src/lib/db.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "query",
    ()=>query
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/pg [external] (pg, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
// const pool = new Pool({
//   host: "103.247.9.247",
//   user: "comit",
//   password: "fz$W9YNE6$WVFW",
//   database: "comit_db",
//   port: 5432,
// });
const pool = new __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$29$__["Pool"]({
    host: "localhost",
    user: "irfanzzs",
    password: "",
    database: "comit_db",
    port: 5432
});
async function query(text, params = []) {
    const res = await pool.query(text, params);
    return res;
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/app/api/userAttendance/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
async function GET(req) {
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
        const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
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
        const leaderboardRes = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(leaderboardQuery);
        const leaderboard = leaderboardRes.rows;
        const leaderboardAllRes = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(LeaderboardAll, [
            ...values,
            limit,
            offset
        ]);
        const leaderboardAll = leaderboardAllRes.rows;
        const leaderboardAllRows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(leaderboardAllrows);
        const totalLeaderboard = leaderboardAllRows.rows;
        const countRes = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(countQuery, values);
        const totalUsers = parseInt(countRes.rows[0].count);
        const totalPages = Math.ceil(totalUsers / limit);
        const acaraRes = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(countAcara);
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
        const dataRes = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(dataQuery, [
            ...values,
            limit,
            offset
        ]);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
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
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Gagal mengambil data pengguna"
        }, {
            status: 500
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__7d237cc1._.js.map