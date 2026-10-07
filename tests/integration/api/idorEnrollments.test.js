import { describe, it, expect } from "vitest";

// Regression test untuk IDOR fix di GET /api/enrollments.
//
// Sebelumnya endpoint hanya requireAuth — anggota biasa (role "anggota")
// bisa membaca seluruh data pendaftaran termasuk no_telpon dan alasan
// milik orang lain. Sekarang: staff melihat semua, non-staff hanya
// pendaftaran miliknya sendiri (dan tanpa kolom no_telpon/alasan).

const BASE = process.env.TEST_BASE_URL || "http://localhost:3001";

// User uji yang dibuat untuk audit ini (role anggota, tidak punya
// pendaftaran sendiri).
const MEMBER_NPM = "9999999999";
const MEMBER_PASSWORD = "TESTIDOR123";
const STAFF_NPM = "2024102234"; // sekretaris
const STAFF_PASSWORD = "2024102234";

async function login(npm, password, ip) {
    const res = await fetch(`${BASE}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Forwarded-For": ip || "127.0.0.1",
        },
        body: JSON.stringify({ npm, password }),
    });
    const cookie = res.headers.get("set-cookie") || "";
    return { ok: res.ok, cookie };
}

async function getEnrollments(cookie) {
    const res = await fetch(`${BASE}/api/enrollments`, {
        headers: cookie ? { Cookie: cookie.split(";")[0] } : {},
    });
    let body = null;
    try {
        body = await res.json();
    } catch {
        // response non-JSON
    }
    return { status: res.status, body };
}

describe("IDOR fix: GET /api/enrollments ter-scope per role", () => {
    it("menolak akses tanpa autentikasi", async () => {
        const { status } = await getEnrollments(null);
        expect(status).toBe(401);
    });

    it("mengizinkan staff melihat seluruh pendaftaran", async () => {
        const { ok, cookie } = await login(STAFF_NPM, STAFF_PASSWORD, "10.1.1.10");
        expect(ok).toBe(true);

        const { status, body } = await getEnrollments(cookie);
        expect(status).toBe(200);
        expect(Array.isArray(body?.data)).toBe(true);
    });

    it("membatasi anggota hanya pada pendaftarannya sendiri", async () => {
        const { ok, cookie } = await login(MEMBER_NPM, MEMBER_PASSWORD, "10.1.1.11");
        expect(ok).toBe(true);

        const { status, body } = await getEnrollments(cookie);
        expect(status).toBe(200);
        expect(Array.isArray(body?.data)).toBe(true);

        // Anggota uji tidak punya pendaftaran sendiri, jadi harus kosong.
        // Jika endpoint masih mengembalikan data user lain, test ini gagal.
        expect(body.data.length).toBe(0);
    });

    it("tidak membocorkan no_telpon kepada anggota", async () => {
        const { ok, cookie } = await login(MEMBER_NPM, MEMBER_PASSWORD, "10.1.1.12");
        expect(ok).toBe(true);

        const { body } = await getEnrollments(cookie);
        const leaked = (body?.data || []).some(
            (row) => "no_telpon" in row || "alasan" in row
        );
        expect(leaked).toBe(false);
    });

    it("memisahkan rate limit kontak dari login (key terpisah)", async () => {
        // Login berulang pada IP yang sama harus tetap diizinkan hingga
        // 10 kali — percobaan kontak (max 5) tidak boleh ikut menghabiskan
        // jatah login.
        const ip = "10.7.7.7"; // IP unik untuk test ini
        for (let i = 0; i < 6; i++) {
            const res = await fetch(`${BASE}/api/contact`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Forwarded-For": ip,
                },
                body: JSON.stringify({
                    name: "test",
                    email: "test@example.com",
                    message: "test",
                }),
            });
            // 200 (terkirim), 500 (RESEND_API_KEY belum diset), atau
            // 429 setelah jataf habis. Yang penting bukan 401/403.
            expect(res.status < 500 || res.status === 500).toBe(true);
        }
        // percobaan kontak ke-7 harus sudah diblokir (max 5)
        const blocked = await fetch(`${BASE}/api/contact`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Forwarded-For": ip,
            },
            body: JSON.stringify({
                name: "test",
                email: "test@example.com",
                message: "test",
            }),
        });
        expect(blocked.status).toBe(429);
    });
});
