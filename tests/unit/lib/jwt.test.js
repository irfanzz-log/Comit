import { describe, it, expect } from "vitest";
import { signToken, verifyToken } from "@/lib/jwt";

describe("JWT sign/verify", () => {
    const PAYLOAD = { id: 1, npm: "2023804102", role: "superadmin" };

    it("menandatangani dan memverifikasi payload", () => {
        const token = signToken(PAYLOAD);
        expect(typeof token).toBe("string");
        const decoded = verifyToken(token);
        expect(decoded.npm).toBe(PAYLOAD.npm);
        expect(decoded.role).toBe(PAYLOAD.role);
    });

    it("menerima payload tambahan (id BigInt)", () => {
        const token = signToken({ id: 42, npm: "1", role: "anggota" });
        const decoded = verifyToken(token);
        expect(decoded.id).toBe(42);
    });

    it("menolak token yang ditandatangani secret lain", () => {
        const jwt = require("jsonwebtoken");
        const forged = jwt.sign(PAYLOAD, "secret-lain");
        expect(verifyToken(forged)).toBeNull();
    });

    it("menolak token kedaluwarsa", () => {
        const token = signToken(PAYLOAD, { expiresIn: "-10s" });
        expect(verifyToken(token)).toBeNull();
    });

    it("menolak string bukan token", () => {
        expect(verifyToken("not-a-token")).toBeNull();
        expect(verifyToken("")).toBeNull();
    });

    it("menolak token malformed (3 bagian tapi invalid)", () => {
        expect(verifyToken("aaa.bbb.ccc")).toBeNull();
    });

    it("payload tidak boleh dibuat berisi password", () => {
        // Sign token tidak boleh menerima field sensitif — ini verifikasi
        // kontrak internal: hanya id/npm/role yang boleh ditandatangani.
        // (Payload JWT base64 bisa dibaca siapa saja, jadi password tidak
        // boleh pernah masuk ke dalamnya.)
        const token = signToken({ ...PAYLOAD, password: "secret" });
        const decoded = verifyToken(token);
        expect(decoded.password).toBeUndefined();
    });
});
