import { describe, it, expect, beforeAll } from "vitest";

const BASE = process.env.TEST_BASE_URL || "http://localhost:3001";

// Helper: login dan kembalikan cookie jar supaya test berurutan bisa
// memakai sesi yang sama tanpa mengulang login.
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

describe("auth: login", () => {
    it("menerima kredensial valid (superadmin)", async () => {
        const res = await fetch(`${BASE}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ npm: "2023804102", password: "2023804102" }),
        });
        expect(res.status).toBe(200);
        const body = await json(res);
        expect(body.success).toBe(true);
        expect(res.headers.get("set-cookie")).toContain("token=");
    });

    it("menolak password salah dengan 401", async () => {
        const res = await fetch(`${BASE}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ npm: "2023804102", password: "wrong" }),
        });
        expect(res.status).toBe(401);
    });

    it("menolak NPM tidak terdaftar dengan 401", async () => {
        const res = await fetch(`${BASE}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ npm: "9999999999", password: "x" }),
        });
        expect(res.status).toBe(401);
    });

    it("menolak payload kosong", async () => {
        const res = await fetch(`${BASE}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
        });
        expect(res.status).toBe(401);
    });

    it("cookie httpOnly + sameSite", async () => {
        const res = await fetch(`${BASE}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ npm: "2023804102", password: "2023804102" }),
        });
        const cookie = res.headers.get("set-cookie") || "";
        expect(cookie).toContain("HttpOnly");
        expect(cookie.toLowerCase()).toContain("samesite=lax");
        expect(cookie).toContain("Path=/");
    });
});

describe("auth: /me", () => {
    it("mengembalikan user terautentikasi", async () => {
        const { cookie } = await login("2024102234");
        const res = await fetch(`${BASE}/api/auth/me`, withAuth(cookie));
        expect(res.status).toBe(200);
        const body = await json(res);
        expect(body.user.user_npm).toBe("2024102234");
        expect(body.user.user_role).toBe("sekretaris");
    });

    it("menolak tanpa token (401)", async () => {
        const res = await fetch(`${BASE}/api/auth/me`);
        expect(res.status).toBe(401);
    });

    it("menolak token invalid (401)", async () => {
        const res = await fetch(`${BASE}/api/auth/me`, {
            headers: { Cookie: "token=bogus.token.value" },
        });
        expect(res.status).toBe(401);
    });

    it("response tidak membocorkan password hash", async () => {
        const { cookie } = await login("2024102234");
        const res = await fetch(`${BASE}/api/auth/me`, withAuth(cookie));
        const text = await res.text();
        expect(text).not.toMatch(/password/i);
        expect(text).not.toMatch(/\$2b\$10\$/);
    });
});

describe("middleware: proteksi halaman internal", () => {
    it("redirect ke login saat anonim", async () => {
        const res = await fetch(`${BASE}/internal/home`, {
            redirect: "manual",
        });
        expect(res.status).toBe(307);
        expect(res.headers.get("location")).toContain("/internal/login");
    });

    it("mengizinkan akses dengan token valid", async () => {
        const { cookie } = await login("2023804102");
        const res = await fetch(`${BASE}/internal/home`, {
            ...withAuth(cookie),
            redirect: "manual",
        });
        expect(res.status).toBe(200);
    });

    it("halaman login tetap publik", async () => {
        const res = await fetch(`${BASE}/internal/login`, {
            redirect: "manual",
        });
        expect(res.status).toBe(200);
    });
});
