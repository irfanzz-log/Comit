import { describe, it, expect, beforeEach } from "vitest";
import { consumeRateLimit, __resetAllRateLimits } from "@/lib/rateLimit";

// Regression test untuk perbaikan security:
// sebelumnya parameter `max` pada consumeRateLimit diabaikan dan selalu
// memakai default global (10), sehingga rate limit kontak yang seharusnya
// 5 tidak pernah terpicu.
describe("rateLimit — override max per endpoint", () => {
    beforeEach(() => {
        __resetAllRateLimits();
    });

    it("menghormati batas custom (contact = 5)", () => {
        for (let i = 1; i <= 5; i++) {
            const r = consumeRateLimit("contact:1.2.3.4", 5);
            expect(r.allowed).toBe(true);
        }
        // percobaan ke-6 harus diblokir
        expect(consumeRateLimit("contact:1.2.3.4", 5).allowed).toBe(false);
    });

    it("memakai default ketika max tidak diberikan (login = 10)", () => {
        for (let i = 1; i <= 10; i++) {
            expect(consumeRateLimit("login:a").allowed).toBe(true);
        }
        expect(consumeRateLimit("login:a").allowed).toBe(false);
    });

    it("key terpisah tidak saling memengaruhi", () => {
        for (let i = 1; i <= 5; i++) {
            consumeRateLimit("contact:1.2.3.4", 5);
        }
        // IP berbeda masih punya jatah penuh
        const r = consumeRateLimit("contact:9.9.9.9", 5);
        expect(r.allowed).toBe(true);
        expect(r.remaining).toBe(4);
    });

    it("remaining selalu positif setelah diblokir", () => {
        for (let i = 1; i <= 5; i++) consumeRateLimit("contact:x", 5);
        const blocked = consumeRateLimit("contact:x", 5);
        expect(blocked.allowed).toBe(false);
        expect(blocked.remaining).toBe(0);
    });
});
