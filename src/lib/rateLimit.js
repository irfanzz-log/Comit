// Rate limiting sederhana in-memory untuk endpoint publik yang rawan
// brute-force (login). Tidak menyentuh database, tidak butuh Redis —
// cukup untuk melindungi dari password spraying pada skala kecil.
//
// Catatan: ini dibatasi per-instance (single Node process). Untuk
// deployment multi-instance, ganti ke store terpusat (Redis/upstash).

const windowMs = 15 * 60 * 1000; // 15 menit
const maxAttempts = 10;

const attempts = new Map();

/**
 * Catat percobaan untuk sebuah key (mis. IP). Kembalikan sisa
 * percobaan yang diizinkan dalam window ini, atau 0 jika sudah melebihi.
 */
export function consumeRateLimit(key) {
    const now = Date.now();
    const record = attempts.get(key);

    if (!record || now - record.windowStart > windowMs) {
        attempts.set(key, { windowStart: now, count: 1 });
        return { allowed: true, remaining: maxAttempts - 1 };
    }

    record.count += 1;
    if (record.count > maxAttempts) {
        return { allowed: false, remaining: 0 };
    }

    return { allowed: true, remaining: maxAttempts - record.count };
}

/**
 * Reset counter untuk sebuah key. Dipanggil setelah login BERHASIL agar
 * user yang valid tidak terkunci hanya karena ada yang mencoba menebak
 * passwordnya (account-lockout DoS).
 */
export function resetRateLimit(key) {
    attempts.delete(key);
}

/**
 * Reset semua counter (test-only). Dipakai test suite untuk memulai
 * keadaan bersih antar skenario.
 */
export function __resetAllRateLimits() {
    attempts.clear();
}

// Bersihkan entry kedaluwarsa secara berkala agar Map tidak tumbuh
// tanpa batas (memory leak).
if (typeof setInterval !== "undefined") {
    setInterval(() => {
        const now = Date.now();
        for (const [key, record] of attempts.entries()) {
            if (now - record.windowStart > windowMs) {
                attempts.delete(key);
            }
        }
    }, windowMs).unref?.();
}

export const RATE_LIMIT_CONFIG = { windowMs, maxAttempts };
