// ==========================================================================
// Client-side cache untuk apiFetch.
//
// Pola: stale-while-revalidate.
//   1. GET pertama → simpan hasil + TTL.
//   2. GET berikutnya → kembalikan cache langsung (render instan, tanpa
//      loading spinner), DAN tarik ulang di background; kalau data baru
//      berbeda, komponen re-render.
//   3. Mutasi (POST/PUT/PATCH/DELETE) yang sukses → invalidate key yang
//      berhubungan, jadi GET berikutnya dapat data segar, bukan data basi.
//   4. Request identik yang bersamaan → di-dedupe (satu fetch, banyak
//      pemanggil), menghilangkan waterfall request di dashboard.
//
// Cache dibatasi (LRU-ish) agar tidak tumbuh tanpa batas di session panjang.
// ==========================================================================

const MAX_ENTRIES = 64;

/** key → { data, expiresAt } */
const cache = new Map();

/** key → Promise in-flight (dedupe) */
const inflight = new Map();

/**
 * TTL default. Data dashboard (keuangan, anggota, absensi) cukup
 * 60 detik — perubahan oleh user lain butuh waktu untuk muncul, tapi
 * biaya fetch berulang tiap render hilang.
 */
export const DEFAULT_TTL = 60_000;

function now() {
    return Date.now();
}

/** Ada entri cache yang masih valid? */
export function getCached(key) {
    const entry = cache.get(key);
    if (!entry) return null;
    if (entry.expiresAt <= now()) {
        cache.delete(key);
        return null;
    }
    return entry.data;
}

/** Simpan hasil fetch. Bawa TTL sendiri untuk data yang lebih/ kurang sensitif. */
export function setCached(key, data, ttl = DEFAULT_TTL) {
    if (cache.size >= MAX_ENTRIES) {
        // Buang entri paling tua (Map menjaga urutan insert).
        const oldest = cache.keys().next().value;
        cache.delete(oldest);
    }
    cache.set(key, { data, expiresAt: now() + ttl });
}

/**
 * Hapus entri cache. Terima prefix ("/api/transactions" akan menghapus
 * "/api/transactions?page=1", "?page=2", "/api/transactions/summary").
 */
export function invalidateCache(prefix) {
    if (!prefix) return;
    for (const key of cache.keys()) {
        if (key === prefix || key.startsWith(prefix + "?") || key.startsWith(prefix + "&")) {
            cache.delete(key);
        }
    }
    // Inflight request tidak diintervensi — hasilnya akan menulis ulang
    // cache, dan itu sudah data terbaru dari server.
}

/** Buang seluruh cache (mis. setelah logout). */
export function clearApiCache() {
    cache.clear();
}

// ==========================================================================
// In-flight dedupe
// ==========================================================================

export function getInflight(key) {
    return inflight.get(key) || null;
}

export function setInflight(key, promise) {
    inflight.set(key, promise);
}

export function deleteInflight(key) {
    inflight.delete(key);
}
