import { describe, it, expect, afterEach, afterAll } from "vitest";
import { cleanupTestData, closeCleanPool } from "../../helpers/cleanup.js";

const BASE = process.env.TEST_BASE_URL || "http://localhost:3001";

// Contract test: memastikan struktur response API tetap kompatibel
// dengan konsumen (frontend). Jika backend mengubah field, test ini
// gagal — bukti eksplisit adanya breaking change.

async function login(npm, password = npm) {
    const res = await fetch(`${BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ npm, password }),
    });
    return res.headers.get("set-cookie") || "";
}

function withAuth(cookie, init = {}) {
    return {
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...(init.headers || {}),
            Cookie: cookie.split(";")[0],
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

describe("contract: /api/auth/me", () => {
    it("skema response { user: { id, user_npm, user_role, nama } }", async () => {
        const cookie = await login("2024102234");
        const res = await fetch(`${BASE}/api/auth/me`, withAuth(cookie));
        const body = await json(res);

        expect(body).toHaveProperty("user");
        const user = body.user;

        // Field wajib yang dipakai AuthContext + sidebar internal
        expect(user).toHaveProperty("id");
        expect(user).toHaveProperty("user_npm");
        expect(user).toHaveProperty("user_role");
        expect(user).toHaveProperty("nama");

        // Tipe data
        expect(typeof user.user_npm).toBe("string");
        expect(typeof user.user_role).toBe("string");
        expect(typeof user.nama).toBe("string");
    });

    it("user_role hanya berisi nilai dari ROLE_LABELS", async () => {
        const VALID_ROLES = [
            "developer",
            "superadmin",
            "sekretaris",
            "staff",
            "bendahara",
            "anggota",
        ];
        const cookie = await login("2024102234");
        const res = await fetch(`${BASE}/api/auth/me`, withAuth(cookie));
        const body = await json(res);

        expect(VALID_ROLES).toContain(body.user.user_role);
    });
});

describe("contract: /api/userInfo", () => {
    it("skema { users, totalPages, totalUsers, allUsers }", async () => {
        const cookie = await login("2024102234");
        const res = await fetch(`${BASE}/api/userInfo?limit=5`, withAuth(cookie));
        const body = await json(res);

        expect(body).toHaveProperty("users");
        expect(body).toHaveProperty("totalPages");
        expect(body).toHaveProperty("totalUsers");
        expect(body).toHaveProperty("allUsers");

        expect(Array.isArray(body.users)).toBe(true);
        expect(Array.isArray(body.allUsers)).toBe(true);
        expect(typeof body.totalPages).toBe("number");
        expect(typeof body.totalUsers).toBe("number");
    });

    it("field user tidak membocorkan data sensitif", async () => {
        const cookie = await login("2024102234");
        const res = await fetch(`${BASE}/api/userInfo?limit=5`, withAuth(cookie));
        const text = await res.text();

        // Kontrak: endpoint ini tidak boleh pernah mengembalikan
        // password hash atau field internal lain.
        expect(text).not.toMatch(/"password"/i);
        expect(text).not.toMatch(/\$2b\$10\$/);
    });
});

describe("contract: /api/transactions/summary", () => {
    it("skema { totalPemasukkan, totalPengeluaran, saldo, byMonth }", async () => {
        const cookie = await login("2024102234");
        const res = await fetch(
            `${BASE}/api/transactions/summary`,
            withAuth(cookie)
        );
        const body = await json(res);

        expect(body).toHaveProperty("totalPemasukkan");
        expect(body).toHaveProperty("totalPengeluaran");
        expect(body).toHaveProperty("saldo");
        expect(body).toHaveProperty("byMonth");

        expect(typeof body.saldo).toBe("number");

        // byMonth punya 12 slot per kategori
        expect(body.byMonth.Pemasukkan).toHaveLength(12);
        expect(body.byMonth.Pengeluaran).toHaveLength(12);
    });
});

describe("contract: /api/enrollments (POST publik)", () => {
    afterEach(() => cleanupTestData());
    afterAll(() => closeCleanPool());

    it("sukses mengembalikan { success, message, data }", async () => {
        const res = await fetch(`${BASE}/api/enrollments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nama: "Contract Test",
                npm: String(Date.now()).slice(-10),
                no_telpon: "08123456780",
                jurusan: "Hukum",
                alasan: "Contract test",
            }),
        });
        const body = await json(res);

        expect(body).toHaveProperty("success", true);
        expect(body).toHaveProperty("message");
        expect(body).toHaveProperty("data");
        expect(body.data).toHaveProperty("id");
        expect(body.data).toHaveProperty("status", "pending");
    });

    it("gagal validasi mengembalikan { success: false, message }", async () => {
        const res = await fetch(`${BASE}/api/enrollments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nama: "",
                npm: "",
                no_telpon: "",
                jurusan: "",
                alasan: "",
            }),
        });
        const body = await json(res);

        expect(body).toHaveProperty("success", false);
        expect(body).toHaveProperty("message");
    });
});
