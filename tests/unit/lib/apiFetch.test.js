import { describe, it, expect, beforeEach, vi } from "vitest";

// Unit test untuk apiFetch: SWR, dedupe, dan invalidasi mutasi.
//
// fetch global di-mock. Setiap tes memakai modul fresh (module registry
// reset) karena cache hidup di state modul.

let fetchMock;

function loadFresh() {
    vi.resetModules();
    return import("@/lib/api");
}

beforeEach(() => {
    fetchMock = vi.fn();
    global.fetch = fetchMock;
});

function jsonResponse(body, status = 200) {
    return {
        ok: status >= 200 && status < 300,
        status,
        json: async () => body,
    };
}

describe("apiFetch: read (SWR)", () => {
    it("GET pertama fetch dan simpan ke cache", async () => {
        fetchMock.mockResolvedValue(jsonResponse({ users: [1, 2] }));
        const { apiFetch } = await loadFresh();
        const { getCached } = await import("@/lib/apiCache");

        const body = await apiFetch("/api/x");
        expect(body).toEqual({ users: [1, 2] });
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(getCached("/api/x")).toEqual({ users: [1, 2] });
    });

    it("GET kedua dalam TTL mengembalikan cache TANPA fetch baru", async () => {
        fetchMock.mockResolvedValue(jsonResponse({ n: 1 }));
        const { apiFetch } = await loadFresh();

        await apiFetch("/api/y");
        const body = await apiFetch("/api/y");

        expect(body).toEqual({ n: 1 });
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it("mutasi menginvalidasi, sehingga GET berikutnya fetch ulang", async () => {
        fetchMock.mockResolvedValue(jsonResponse({ n: 1 }));
        const { apiFetch } = await loadFresh();

        await apiFetch("/api/transactions?page=1");       // GET #1 (isi cache)
        await apiFetch("/api/transactions?page=1");        // dari cache, no fetch
        expect(fetchMock).toHaveBeenCalledTimes(1);

        await apiFetch("/api/inserttransactions", {        // POST #2
            method: "POST",
            body: JSON.stringify({ tipe: "pemasukkan", jumlah: 1 }),
        });
        expect(fetchMock).toHaveBeenCalledTimes(2);

        await apiFetch("/api/transactions?page=1"); // invalid → GET #3
        expect(fetchMock).toHaveBeenCalledTimes(3);
    });

    it("revalidate: setelah TTL habis, GET ulang melakukan fetch", async () => {
        const start = Date.now();
        fetchMock.mockResolvedValue(jsonResponse({ n: 1 }));
        const { apiFetch } = await loadFresh();

        await apiFetch("/api/z");
        expect(fetchMock).toHaveBeenCalledTimes(1);

        // TTL default 60s; majukan 61s.
        Date.now = () => start + 61_000;
        const body = await apiFetch("/api/z");
        Date.now = () => start;

        expect(body).toEqual({ n: 1 });
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });
});

describe("apiFetch: dedupe", () => {
    it("request identik bersamaan hanya memanggil fetch sekali", async () => {
        let resolve;
        const slow = new Promise((r) => (resolve = r));
        fetchMock.mockImplementation(() => slow.then(() => jsonResponse({ ok: true })));
        const { apiFetch } = await loadFresh();

        const pending = Promise.all([apiFetch("/api/same"), apiFetch("/api/same")]);
        // Selesaikan fetch lambat setelah kedua pemanggil terdaftar.
        resolve({ ok: true });
        const [a, b] = await pending;

        expect(a).toEqual({ ok: true });
        expect(b).toEqual({ ok: true });
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });
});

describe("apiFetch: mutasi → invalidasi", () => {
    it("POST sukses menginvalidasi endpoint bacaan terkait", async () => {
        const { apiFetch } = await loadFresh();
        const { getCached, setCached } = await import("@/lib/apiCache");

        // Panaskan cache transaksi & summary.
        setCached("/api/transactions?page=1", { users: ["lama"] });
        setCached("/api/transactions/summary", { total: 1 });

        fetchMock.mockResolvedValue(jsonResponse({ success: true }));
        await apiFetch("/api/inserttransactions", {
            method: "POST",
            body: JSON.stringify({ tipe: "pemasukkan", jumlah: 1000 }),
        });

        expect(getCached("/api/transactions?page=1")).toBeNull();
        expect(getCached("/api/transactions/summary")).toBeNull();
    });

    it("POST yang GAGAL tidak menginvalidasi cache", async () => {
        const { apiFetch } = await loadFresh();
        const { getCached, setCached } = await import("@/lib/apiCache");

        setCached("/api/transactions?page=1", { users: ["lama"] });
        fetchMock.mockResolvedValue(jsonResponse({ error: "validasi gagal" }, 400));

        await expect(
            apiFetch("/api/inserttransactions", {
                method: "POST",
                body: JSON.stringify({ jumlah: -1 }),
            })
        ).rejects.toThrow();

        // Data lama tetap ada — server menolak, jadi tidak ada perubahan.
        expect(getCached("/api/transactions?page=1")).toEqual({ users: ["lama"] });
    });

    it("endpoint tanpa mapping invalidasi tetap menjalankan POST", async () => {
        const { apiFetch } = await loadFresh();
        const { getCached, setCached } = await import("@/lib/apiCache");

        setCached("/api/anything", 1);
        fetchMock.mockResolvedValue(jsonResponse({ success: true }));
        const body = await apiFetch("/api/contact", {
            method: "POST",
            body: JSON.stringify({}),
        });
        expect(body).toEqual({ success: true });
        expect(getCached("/api/anything")).toBe(1);
    });
});

describe("apiFetch: error handling", () => {
    it("melempar ApiError dengan status dan message dari body", async () => {
        fetchMock.mockResolvedValue(jsonResponse({ error: "Tidak valid" }, 400));
        const { apiFetch, ApiError } = await loadFresh();

        await expect(apiFetch("/api/x")).rejects.toMatchObject({
            name: "ApiError",
            status: 400,
            message: "Tidak valid",
        });
    });

    it("network error menjadi ApiError status 0", async () => {
        fetchMock.mockRejectedValue(new Error("ECONNREFUSED"));
        const { apiFetch } = await loadFresh();

        await expect(apiFetch("/api/x")).rejects.toMatchObject({
            name: "ApiError",
            status: 0,
        });
    });

    it("respons non-JSON tetap di-resolve, body null", async () => {
        fetchMock.mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => {
                throw new SyntaxError("not json");
            },
        });
        const { apiFetch } = await loadFresh();
        expect(await apiFetch("/api/x")).toBeNull();
    });
});
