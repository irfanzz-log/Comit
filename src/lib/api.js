// Helper fetch terpusat untuk sisi client: headers JSON, cookies same-origin,
// parsing respons, dan format error yang konsisten.
//
// GET di-cache dengan pola stale-while-revalidate (src/lib/apiCache.js):
// render instan dari cache lalu revalidate di background. Mutasi yang
// sukses memanggil invalidateCache() untuk data yang berubah.
import {
    getCached,
    setCached,
    invalidateCache,
    clearApiCache,
    getInflight,
    setInflight,
    deleteInflight,
    DEFAULT_TTL,
} from "./apiCache";

export class ApiError extends Error {
    constructor(message, status) {
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}

/**
 * Setiap key cache bisa bawa TTL sendiri. Data yang lebih sering berubah
 * (mis. absensi) lebih pendek dari data relatif statis (mis. daftar acara).
 * Tidak diisi → DEFAULT_TTL.
 */
const TTL_OVERRIDES = {
    "/api/transactions/summary": 30_000,
    "/api/enrollments": 30_000,
    "/api/userAttendance": 30_000,
    "/api/events": 120_000,
    "/api/whereEvents": 120_000,
};

function ttlFor(key) {
    const pathname = key.split("?")[0];
    return TTL_OVERRIDES[pathname] || DEFAULT_TTL;
}

/**
 * Daftar mutasi → endpoint bacaan yang harus di-invalidasi setelahnya.
 * Tanpa ini, cache akan menampilkan data basi setelah user submit form.
 */
const INVALIDATION_MAP = {
    "/api/inserttransactions": ["/api/transactions", "/api/transactions/summary"],
    "/api/insertAttendance": ["/api/userAttendance"],
    "/api/addEvents": ["/api/events", "/api/whereEvents"],
    "/api/enrollments": ["/api/enrollments"],
    "/api/certificates": ["/api/certificates", "/api/certificates/preview"],
    "/api/certificates/batch": ["/api/certificates", "/api/certificates/preview"],
    "/api/uploadthing/delete": ["/api/events"],
    "/api/users/profile": ["/api/userInfo", "/api/auth/me", "/api/users"],
    "/api/users/password": [],
    "/api/contact": [],
};

/** Apakah request ini read (bisa di-cache)? */
function isReadRequest(method) {
    return !method || method === "GET";
}

/** Key cache = URL relatif. Search params membedakan halaman/filter. */
function cacheKey(url) {
    return url;
}

export async function apiFetch(url, options = {}) {
    const method = (options.method || "GET").toUpperCase();

    // -------------------------------------------------------- READ (cached)
    if (isReadRequest(method)) {
        const key = cacheKey(url);
        const cached = getCached(key);

        // Cache masih valid → kembalikan langsung, TANPA menekan server.
        // Inilah yang membuat navigasi internal terasa instan dan mengurangi
        // beban server: halaman yang sudah pernah dibuka tidak menunggu
        // jaringan sama sekali.
        //
        // Data di-refresh otomatis lewat dua jalan:
        //   1. TTL habis → GET berikutnya menarik ulang.
        //   2. Mutasi sukses → INVALIDATION_MAP menghapus cache endpoint
        //      yang berubah, sehingga GET berikutnya (di komponen mana pun)
        //      mendapat data segar dari server.
        //
        // options.force = true → lewati cache. Dipakai tombol "Refresh"
        // manual, karena data bisa berubah di luar aplikasi (DB diedit
        // langsung, proses lain, sync dari sistem lain). Tanpa ini tombol
        // refresh menampilkan data cache yang sama persis.
        if (cached !== null && !options.force) {
            return cached;
        }

        return fetchDedupe(key, url, options);
    }

    // ------------------------------------------------------- WRITE (mutate)
    const result = await rawFetch(url, options);

    // Mutasi sukses → invalidasi endpoint bacaan terkait.
    // Invalidate sebelum return agar write-then-read selalu segar.
    if (result !== null && INVALIDATION_MAP[url]) {
        for (const readEndpoint of INVALIDATION_MAP[url]) {
            invalidateCache(readEndpoint);
        }
    }

    return result;
}

/** fetch tunggal, tanpa cache. Dipakai internal apiFetch. */
async function rawFetch(url, options = {}) {
    let res;
    try {
        res = await fetch(url, {
            credentials: "include",
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
        });
    } catch {
        throw new ApiError("Tidak dapat terhubung ke server", 0);
    }

    let body = null;
    try {
        body = await res.json();
    } catch {
        // respons non-JSON dibiarkan null
    }

    if (!res.ok) {
        const message =
            (body && (body.error || body.message)) ||
            `Request gagal (${res.status})`;
        throw new ApiError(message, res.status);
    }

    return body;
}

/**
 * GET dengan dedupe: request identik yang bersamaan hanya menekan server
 * sekali. Menghilangkan waterfall saat dashboard memuat banyak data.
 */
async function fetchDedupe(key, url, options) {
    const existing = getInflight(key);
    if (existing) return existing;

    const promise = rawFetch(url, { ...options, method: "GET" })
        .then((body) => {
            if (body !== null && typeof body === "object") {
                setCached(key, body, ttlFor(key));
            }
            return body;
        })
        .finally(() => {
            deleteInflight(key);
        });

    setInflight(key, promise);
    return promise;
}

export {
    invalidateCache,
    clearApiCache,
    getCached,
    DEFAULT_TTL,
};

