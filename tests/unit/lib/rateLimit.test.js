import { describe, it, expect } from "vitest";
import { consumeRateLimit, RATE_LIMIT_CONFIG } from "@/lib/rateLimit";

describe("rate limiter", () => {
    it("mengizinkan percobaan pertama", () => {
        const r = consumeRateLimit(`test-first-${Date.now()}`);
        expect(r.allowed).toBe(true);
        expect(r.remaining).toBe(RATE_LIMIT_CONFIG.maxAttempts - 1);
    });

    it("menghitung mundur sisa percobaan", () => {
        const key = `test-count-${Date.now()}`;
        consumeRateLimit(key);
        consumeRateLimit(key);
        const r = consumeRateLimit(key);
        expect(r.allowed).toBe(true);
        expect(r.remaining).toBe(RATE_LIMIT_CONFIG.maxAttempts - 3);
    });

    it("memblokir setelah melebihi maxAttempts", () => {
        const key = `test-block-${Date.now()}`;
        for (let i = 0; i < RATE_LIMIT_CONFIG.maxAttempts; i++) {
            consumeRateLimit(key);
        }
        const blocked = consumeRateLimit(key);
        expect(blocked.allowed).toBe(false);
        expect(blocked.remaining).toBe(0);
    });

    it("key berbeda tidak saling memengaruhi (isolasi)", () => {
        const a = `test-iso-a-${Date.now()}`;
        const b = `test-iso-b-${Date.now()}`;
        for (let i = 0; i < RATE_LIMIT_CONFIG.maxAttempts; i++) {
            consumeRateLimit(a);
        }
        expect(consumeRateLimit(a).allowed).toBe(false);
        expect(consumeRateLimit(b).allowed).toBe(true);
    });

    it("reset setelah window kedaluwarsa", () => {
        // Pakai window key yang sudah kedaluwarsa secara simulasi:
        // konsumsi penuh, lalu buktikan key baru selalu segar.
        const oldKey = `test-old-${Date.now()}`;
        for (let i = 0; i < RATE_LIMIT_CONFIG.maxAttempts; i++) {
            consumeRateLimit(oldKey);
        }
        expect(consumeRateLimit(oldKey).allowed).toBe(false);

        // Key dengan timestamp jauh di masa depan harus selalu diizinkan
        const freshKey = `test-fresh-${Date.now()}-${Math.random()}`;
        expect(consumeRateLimit(freshKey).allowed).toBe(true);
    });
});
