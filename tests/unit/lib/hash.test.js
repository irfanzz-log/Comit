import { describe, it, expect } from "vitest";
import { hashPassword, comparePassword } from "@/lib/hash";

describe("hash & compare password", () => {
    it("meng-hash password dan memverifikasinya", async () => {
        const hash = await hashPassword("password123");
        expect(hash).not.toBe("password123");
        expect(await comparePassword("password123", hash)).toBe(true);
    });

    it("menolak password salah", async () => {
        const hash = await hashPassword("password123");
        expect(await comparePassword("wrong", hash)).toBe(false);
    });

    it("menghasilkan hash yang berbeda untuk input sama (salt)", async () => {
        const a = await hashPassword("password123");
        const b = await hashPassword("password123");
        expect(a).not.toBe(b);
    });

    it("memverifikasi hash bcrypt yang sudah ada", async () => {
        // Hash bcrypt rounds=10 untuk "rahasia123" — fixture ini memastikan
        // comparePassword() bisa memvalidasi hash yang dibuat di luar test
        // ini (mis. hash lama di production), bukan hanya hash dari hashPassword().
        const existingHash =
            "$2b$10$agM5HGoiNkbWldF7NvFN4.9m21Ud1f32SWQxOM5rTRyaFJ8/hkJHi";
        expect(await comparePassword("rahasia123", existingHash)).toBe(true);
        expect(await comparePassword("wrong", existingHash)).toBe(false);
    });

    it("menangani input kosong", async () => {
        const hash = await hashPassword("");
        expect(await comparePassword("", hash)).toBe(true);
        expect(await comparePassword("a", hash)).toBe(false);
    });
});
