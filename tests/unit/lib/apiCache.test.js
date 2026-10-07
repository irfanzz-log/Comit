import { describe, it, expect, beforeEach, vi } from "vitest";

// Unit test untuk cache layer (src/lib/apiCache.js + apiFetch).
//
// Alasan: cache di-cache di Map modul-scope. Behavior-nya harus teruji
// eksplisit agar tidak ada perubahan yang diam-diam mematahkan SWR atau
// invalidasi mutasi — keduanya akan muncul sebagai data basi di UI.
//
// fetch di-mock total; tidak ada request network/database.

const now = Date.now;

function loadFresh() {
    // Map modul tidak di-reset antar file oleh vitest (module registry
    // per test file). Reset manual lewat vi.resetModules + import dinamis.
    vi.resetModules();
    return import("@/lib/apiCache");
}

describe("apiCache: primitif", () => {
    it("getCached null saat kosong", async () => {
        const { getCached } = await loadFresh();
        expect(getCached("/x")).toBeNull();
    });

    it("setCached → getCached mengembalikan data", async () => {
        const { setCached, getCached } = await loadFresh();
        setCached("/x", { a: 1 });
        expect(getCached("/x")).toEqual({ a: 1 });
    });

    it("getCached null setelah TTL habis", async () => {
        const { setCached, getCached } = await loadFresh();
        setCached("/x", "v1", 1000);
        // Maju waktu 2 detik.
        Date.now = () => now() + 2000;
        expect(getCached("/x")).toBeNull();
        Date.now = now;
    });

    it("setCached menghormati TTL per-key", async () => {
        const { setCached, getCached } = await loadFresh();
        setCached("/short", 1, 1000);
        setCached("/long", 2, 60_000);
        Date.now = () => now() + 2000;
        expect(getCached("/short")).toBeNull();
        expect(getCached("/long")).toBe(2);
        Date.now = now;
    });

    it("eviction saat melebihi MAX_ENTRIES", async () => {
        const { setCached, getCached } = await loadFresh();
        for (let i = 0; i < 100; i++) {
            setCached(`/k${i}`, i);
        }
        // Yang pertama dimasukkan pasti sudah tergusur.
        expect(getCached("/k0")).toBeNull();
        expect(getCached("/k99")).toBe(99);
    });
});

describe("apiCache: invalidasi", () => {
    it("invalidateCache(prefix) menghapus key dengan search params", async () => {
        const { setCached, getCached, invalidateCache } = await loadFresh();
        setCached("/api/transactions?page=1", 1);
        setCached("/api/transactions?page=2", 2);
        setCached("/api/transactions/summary", 3);
        invalidateCache("/api/transactions");
        expect(getCached("/api/transactions?page=1")).toBeNull();
        expect(getCached("/api/transactions?page=2")).toBeNull();
        // /summary TIDAKKAN ikut — bukan search param dari /transactions.
        expect(getCached("/api/transactions/summary")).toBe(3);
    });

    it("invalidateCache menghapus exact match", async () => {
        const { setCached, getCached, invalidateCache } = await loadFresh();
        setCached("/api/events", 1);
        invalidateCache("/api/events");
        expect(getCached("/api/events")).toBeNull();
    });

    it("clearApiCache mengosongkan semua", async () => {
        const { setCached, getCached, clearApiCache } = await loadFresh();
        setCached("/a", 1);
        setCached("/b", 2);
        clearApiCache();
        expect(getCached("/a")).toBeNull();
        expect(getCached("/b")).toBeNull();
    });

    it("invalidateCache tidak menghapus prefix lain yang mirip", async () => {
        const { setCached, getCached, invalidateCache } = await loadFresh();
        setCached("/api/userAttendance?page=1", 1);
        invalidateCache("/api/userInfo");
        expect(getCached("/api/userAttendance?page=1")).toBe(1);
    });
});
