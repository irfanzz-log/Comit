import { describe, it, expect } from "vitest";

const BASE = process.env.TEST_BASE_URL || "http://localhost:3001";

async function login(npm, password = npm) {
    const res = await fetch(`${BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ npm, password }),
    });
    const cookie = res.headers.get("set-cookie") || "";
    return { ok: res.ok, cookie };
}

function withAuth(cookie, init = {}) {
    const token = cookie.split(";")[0];
    return {
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...(init.headers || {}),
            Cookie: token,
        },
    };
}

async function json(res) {
    const text = await res.text();
    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
}

// Role tetap dari seed periode 2025-2026
const BENDAHARA = "2024804058"; // Sofi Utami
const SEKRETARIS = "2024102234"; // Abella Pinkan Ham
const STAFF = "2023804011"; // Ahmad Rohman
const DEV = "2023806076"; // M Irfansyah

describe("POST /api/inserttransactions — RBAC", () => {
    it("mengizinkan bendahara", async () => {
        const { cookie } = await login(BENDAHARA);
        const res = await fetch(
            `${BASE}/api/inserttransactions`,
            withAuth(cookie, {
                method: "POST",
                body: JSON.stringify({
                    tipe: "pemasukkan",
                    jumlah: 10000,
                    kategori: "kas",
                    deskripsi: "Test kas integration",
                }),
            })
        );
        expect(res.status).toBe(201);
        const body = await json(res);
        expect(body.tipe).toBe("pemasukkan");
        expect(body.jumlah).toBe(10000);
    });

    it("menolak staff (403)", async () => {
        const { cookie } = await login(STAFF);
        const res = await fetch(
            `${BASE}/api/inserttransactions`,
            withAuth(cookie, {
                method: "POST",
                body: JSON.stringify({
                    tipe: "pemasukkan",
                    jumlah: 10000,
                    kategori: "kas",
                }),
            })
        );
        expect(res.status).toBe(403);
    });

    it("menolak anonim (401)", async () => {
        const res = await fetch(`${BASE}/api/inserttransactions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                tipe: "pemasukkan",
                jumlah: 10000,
                kategori: "kas",
            }),
        });
        expect(res.status).toBe(401);
    });
});

describe("POST /api/inserttransactions — validasi", () => {
    it("menolak jumlah negatif", async () => {
        const { cookie } = await login(BENDAHARA);
        const res = await fetch(
            `${BASE}/api/inserttransactions`,
            withAuth(cookie, {
                method: "POST",
                body: JSON.stringify({
                    tipe: "pemasukkan",
                    jumlah: -1000,
                    kategori: "kas",
                }),
            })
        );
        expect(res.status).toBe(400);
    });

    it("menolak jumlah bukan angka", async () => {
        const { cookie } = await login(BENDAHARA);
        const res = await fetch(
            `${BASE}/api/inserttransactions`,
            withAuth(cookie, {
                method: "POST",
                body: JSON.stringify({
                    tipe: "pemasukkan",
                    jumlah: "abc",
                    kategori: "kas",
                }),
            })
        );
        expect(res.status).toBe(400);
    });

    it("menolak tipe tidak valid", async () => {
        const { cookie } = await login(BENDAHARA);
        const res = await fetch(
            `${BASE}/api/inserttransactions`,
            withAuth(cookie, {
                method: "POST",
                body: JSON.stringify({
                    tipe: "corrupt",
                    jumlah: 1000,
                    kategori: "kas",
                }),
            })
        );
        expect(res.status).toBe(400);
    });

    it("menolak field wajib kosong", async () => {
        const { cookie } = await login(BENDAHARA);
        const res = await fetch(
            `${BASE}/api/inserttransactions`,
            withAuth(cookie, {
                method: "POST",
                body: JSON.stringify({ jumlah: 1000 }),
            })
        );
        expect(res.status).toBe(400);
    });

    it("mencatat created_by dari token, bukan input", async () => {
        const { cookie } = await login(BENDAHARA);
        const res = await fetch(
            `${BASE}/api/inserttransactions`,
            withAuth(cookie, {
                method: "POST",
                body: JSON.stringify({
                    tipe: "pengeluaran",
                    jumlah: 5000,
                    kategori: "lainnya",
                    deskripsi: "Test created_by scoping",
                    // Client tidak boleh menentukan created_by sendiri
                    created_by: 1,
                }),
            })
        );
        expect(res.status).toBe(201);
        const body = await json(res);
        // Pastikan created_by tidak ikut disimpan (field tidak ada di response)
        expect(body.created_by).toBeUndefined();
    });
});

describe("GET /api/transactions/summary", () => {
    it("mengembalikan ringkasan terautentikasi", async () => {
        const { cookie } = await login(SEKRETARIS);
        const res = await fetch(
            `${BASE}/api/transactions/summary`,
            withAuth(cookie)
        );
        expect(res.status).toBe(200);
        const body = await json(res);
        // Kontrak: ringkasan memakai camelCase
        expect(body).toHaveProperty("totalPemasukkan");
        expect(body).toHaveProperty("totalPengeluaran");
        expect(body).toHaveProperty("saldo");
        expect(body).toHaveProperty("byMonth");
    });

    it("menolak anonim", async () => {
        const res = await fetch(`${BASE}/api/transactions/summary`);
        expect(res.status).toBe(401);
    });
});

describe("POST /api/insertAttendance — RBAC + validasi", () => {
    it("mengizinkan staff mencatat kehadiran", async () => {
        const { cookie } = await login(STAFF);
        const res = await fetch(
            `${BASE}/api/insertAttendance`,
            withAuth(cookie, {
                method: "POST",
                body: JSON.stringify({
                    user_id: 1,
                    status_absen: "Hadir",
                    acara: "Test Acara Integration",
                }),
            })
        );
        expect(res.status).toBe(201);
    });

    it("menolak status tidak valid", async () => {
        const { cookie } = await login(STAFF);
        const res = await fetch(
            `${BASE}/api/insertAttendance`,
            withAuth(cookie, {
                method: "POST",
                body: JSON.stringify({
                    user_id: 1,
                    status_absen: "TidakHadirsamaSekali",
                }),
            })
        );
        expect(res.status).toBe(400);
    });

    it("menolak user_id bukan angka", async () => {
        const { cookie } = await login(STAFF);
        const res = await fetch(
            `${BASE}/api/insertAttendance`,
            withAuth(cookie, {
                method: "POST",
                body: JSON.stringify({
                    user_id: "abc",
                    status_absen: "Hadir",
                }),
            })
        );
        expect(res.status).toBe(400);
    });

    it("menolak anonim", async () => {
        const res = await fetch(`${BASE}/api/insertAttendance`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: 1, status_absen: "Hadir" }),
        });
        expect(res.status).toBe(401);
    });
});

describe("POST /api/addEvents — RBAC", () => {
    it("mengizinkan sekretaris membuat acara", async () => {
        const { cookie } = await login(SEKRETARIS);
        const res = await fetch(
            `${BASE}/api/addEvents`,
            withAuth(cookie, {
                method: "POST",
                body: JSON.stringify({
                    nameEvent: "Test Event Integration",
                    date: "2026-12-01",
                    tipe: "internal",
                    comment: "Dibuat oleh integration test",
                }),
            })
        );
        expect(res.status).toBe(201);
        const body = await json(res);
        expect(body).toHaveProperty("uuid");
        expect(body.nama_acara).toBe("Test Event Integration");
    });

    it("menolak anggota biasa (staff punya akses, bendahara tidak)", async () => {
        // staff boleh (canManageEvent), bendahara tidak
        const { cookie: staffCookie } = await login(STAFF);
        const r1 = await fetch(
            `${BASE}/api/addEvents`,
            withAuth(staffCookie, {
                method: "POST",
                body: JSON.stringify({
                    nameEvent: "Test Event Staff",
                    date: "2026-12-01",
                    tipe: "internal",
                }),
            })
        );
        expect(r1.status).toBe(201);

        const { cookie: bendCookie } = await login(BENDAHARA);
        const r2 = await fetch(
            `${BASE}/api/addEvents`,
            withAuth(bendCookie, {
                method: "POST",
                body: JSON.stringify({
                    nameEvent: "Test Event Bendahara",
                    date: "2026-12-01",
                    tipe: "internal",
                }),
            })
        );
        expect(r2.status).toBe(403);
    });

    it("menolak anonim", async () => {
        const res = await fetch(`${BASE}/api/addEvents`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nameEvent: "X",
                date: "2026-12-01",
                tipe: "internal",
            }),
        });
        expect(res.status).toBe(401);
    });
});

describe("GET /api/userInfo — kontrak data", () => {
    it("tidak membocorkan password hash", async () => {
        const { cookie } = await login(SEKRETARIS);
        const res = await fetch(
            `${BASE}/api/userInfo?limit=5`,
            withAuth(cookie)
        );
        expect(res.status).toBe(200);
        const text = await res.text();
        expect(text).not.toMatch(/\$2b\$10\$/);
        expect(text).not.toMatch(/"password"/i);
    });

    it("mengembalikan struktur yang konsisten", async () => {
        const { cookie } = await login(SEKRETARIS);
        const res = await fetch(
            `${BASE}/api/userInfo?limit=5`,
            withAuth(cookie)
        );
        const body = await json(res);
        expect(body).toHaveProperty("users");
        expect(body).toHaveProperty("totalPages");
        expect(body).toHaveProperty("totalUsers");
        expect(body).toHaveProperty("allUsers");
        expect(Array.isArray(body.users)).toBe(true);
    });

    it("menolak anonim", async () => {
        const res = await fetch(`${BASE}/api/userInfo`);
        expect(res.status).toBe(401);
    });
});

describe("GET /api/whereEvents — pencarian publik by UUID", () => {
    it("menolak UUID kosong", async () => {
        const res = await fetch(`${BASE}/api/whereEvents`);
        expect(res.status).toBe(400);
    });

    it("mengembalikan array untuk UUID valid", async () => {
        const res = await fetch(`${BASE}/api/whereEvents?uuid=00000000-0000-0000-0000-000000000000`);
        expect(res.status).toBe(200);
        const body = await json(res);
        expect(Array.isArray(body)).toBe(true);
    });

    it("tidak error pada UUID malformed (parameterized)", async () => {
        const res = await fetch(`${BASE}/api/whereEvents?uuid=not-a-uuid' OR '1'='1`);
        expect(res.status).toBe(200);
    });
});

describe("POST /api/contact — form publik", () => {
    // Pakai header IP unik per test agar tidak menghabiskan jatah rate
    // limit (maks 5 kontak per 15 menit) sebelum semua skenario selesai.
    const ip = (n) => `10.3.3.${n}`;

    it("menolak field kosong", async () => {
        const res = await fetch(`${BASE}/api/contact`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Forwarded-For": ip(1) },
            body: JSON.stringify({ name: "", email: "", message: "" }),
        });
        expect(res.status).toBe(400);
    });

    it("menolak email tidak valid", async () => {
        const res = await fetch(`${BASE}/api/contact`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Forwarded-For": ip(2) },
            body: JSON.stringify({
                name: "Test",
                email: "bukan-email",
                message: "Halo",
            }),
        });
        expect(res.status).toBe(400);
    });

    it("menerima input valid (gagal kirim tanpa API key = 500, bukan crash)", async () => {
        const res = await fetch(`${BASE}/api/contact`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Forwarded-For": ip(3) },
            body: JSON.stringify({
                name: "Test Integration",
                email: "test@example.com",
                message: "Pesan test dari integration test",
            }),
        });
        // Tanpa RESEND_API_KEY: 500 dengan pesan jelas, bukan unhandled crash
        expect([200, 500]).toContain(res.status);
    });
});
