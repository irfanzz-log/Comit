import { describe, it, expect } from "vitest";
import { formatCurrency, formatNumber, formatDate } from "@/lib/constants";

// Property-based test: untuk input acak di domain valid, invariant
// harus selalu terjaga. Ini menemukan edge case yang tidak terpikirkan
// tanpa harus menulis setiap kasus manual.

describe("property: formatter round-trip & invariant", () => {
    // Deterministic pseudo-random (LCG) agar test tidak flaky
    function* lcg(seed) {
        let state = seed;
        while (true) {
            // a=1664525, c=1013904223 (Numerical Recipes)
            state = (1664525n * BigInt(state) + 1013904223n) % 4294967296n;
            yield Number(state);
        }
    }

    const rand = lcg(42);

    function nextInt(max) {
        return rand.next().value % max;
    }

    it("formatNumber tidak pernah menghasilkan NaN untuk angka positif", () => {
        for (let i = 0; i < 100; i++) {
            const value = nextInt(10_000_000);
            const out = formatNumber(value);
            expect(out).not.toBe("NaN");
            // Menghapus pemisah ribuan harus mengembalikan angka asli
            expect(out.replace(/\./g, "")).toBe(String(value));
        }
    });

    it("formatNumber(idempoten): format(format(x)) == format(x)", () => {
        for (let i = 0; i < 50; i++) {
            const value = nextInt(1_000_000);
            const once = formatNumber(value);
            // formatNumber menerima Number; parse baliknya tetap numerik
            expect(once).toBe(formatNumber(Number(once.replace(/\./g, ""))));
        }
    });

    it("formatCurrency selalu mengandung simbol mata uang", () => {
        for (let i = 0; i < 50; i++) {
            const value = nextInt(1_000_000);
            const out = formatCurrency(value);
            expect(out).toMatch(/Rp/);
            expect(out).not.toBe("NaN");
        }
    });

    it("formatNumber(monoton): a < b => format(a) leksikografis lebih pendek/kecil", () => {
        for (let i = 0; i < 50; i++) {
            const a = nextInt(500_000);
            const b = a + 1 + nextInt(100_000);
            const fa = formatNumber(a);
            const fb = formatNumber(b);
            // Panjang string format tidak pernah berkurang untuk angka lebih besar
            expect(fb.length).toBeGreaterThanOrEqual(fa.length);
        }
    });

    it("formatDate: input valid tidak pernah menghasilkan string error", () => {
        for (let i = 0; i < 30; i++) {
            const year = 2020 + nextInt(10);
            const month = 1 + nextInt(12);
            const day = 1 + nextInt(28);
            const iso = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const out = formatDate(iso);
            expect(out).not.toBe("-");
            expect(out).not.toBe("Invalid Date");
        }
    });

    it("formatDate: input invalid selalu menghasilkan placeholder", () => {
        const invalid = [null, undefined, "", "not-a-date", NaN, 0];
        for (const v of invalid) {
            expect(formatDate(v)).toBe("-");
        }
    });
});
