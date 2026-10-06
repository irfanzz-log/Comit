import { describe, it, expect } from "vitest";
import {
    isStaff,
    canManageFinance,
    canManageEnrollment,
    canManageCertificate,
    canManageEvent,
    canManageAttendance,
    formatCurrency,
    formatNumber,
    formatDate,
    formatDateTime,
    ROLE_LABELS,
    STAFF_ROLES,
} from "@/lib/constants";

describe("authorization helpers", () => {
    describe("isStaff", () => {
        it("mengembalikan true untuk semua role staf", () => {
            for (const role of STAFF_ROLES) {
                expect(isStaff(role)).toBe(true);
            }
        });

        it("mengembalikan false untuk anggota", () => {
            expect(isStaff("anggota")).toBe(false);
        });

        it("menolak role tidak dikenal", () => {
            expect(isStaff("superuser")).toBe(false);
            expect(isStaff("admin")).toBe(false);
        });

        it("menolak input kosong/null", () => {
            expect(isStaff("")).toBe(false);
            expect(isStaff(null)).toBe(false);
            expect(isStaff(undefined)).toBe(false);
        });
    });

    describe("canManageFinance", () => {
        it("hanya developer/superadmin/bendahara", () => {
            expect(canManageFinance("developer")).toBe(true);
            expect(canManageFinance("superadmin")).toBe(true);
            expect(canManageFinance("bendahara")).toBe(true);
        });

        it("menolak sekretaris/staff/anggota", () => {
            expect(canManageFinance("sekretaris")).toBe(false);
            expect(canManageFinance("staff")).toBe(false);
            expect(canManageFinance("anggota")).toBe(false);
        });
    });

    describe("canManageEnrollment / canManageCertificate", () => {
        it("hanya developer/superadmin/sekretaris", () => {
            for (const fn of [canManageEnrollment, canManageCertificate]) {
                expect(fn("developer")).toBe(true);
                expect(fn("superadmin")).toBe(true);
                expect(fn("sekretaris")).toBe(true);
                expect(fn("bendahara")).toBe(false);
                expect(fn("staff")).toBe(false);
                expect(fn("anggota")).toBe(false);
            }
        });
    });

    describe("canManageEvent / canManageAttendance", () => {
        it("developer/superadmin/sekretaris/staff", () => {
            for (const fn of [canManageEvent, canManageAttendance]) {
                expect(fn("developer")).toBe(true);
                expect(fn("superadmin")).toBe(true);
                expect(fn("sekretaris")).toBe(true);
                expect(fn("staff")).toBe(true);
                expect(fn("bendahara")).toBe(false);
                expect(fn("anggota")).toBe(false);
            }
        });
    });

    describe("ROLE_LABELS", () => {
        it("memetakan role ke label terbaca", () => {
            expect(ROLE_LABELS.developer).toBe("Developer");
            expect(ROLE_LABELS.superadmin).toBe("Super Admin");
            expect(ROLE_LABELS.anggota).toBe("Anggota");
        });

        it("punya label untuk setiap role staf", () => {
            for (const role of STAFF_ROLES) {
                expect(ROLE_LABELS[role]).toBeTruthy();
            }
        });
    });
});

describe("formatter", () => {
    describe("formatCurrency", () => {
        it("memformat angka ke Rupiah", () => {
            expect(formatCurrency(50000)).toMatch(/50\.000/);
        });

        it("menangani nol", () => {
            expect(formatCurrency(0)).toMatch(/0/);
        });

        it("menangani input non-angka tanpa lempar exception", () => {
            expect(() => formatCurrency("abc")).not.toThrow();
            expect(() => formatCurrency(null)).not.toThrow();
            expect(() => formatCurrency(undefined)).not.toThrow();
        });

        it("mengkonversi string numerik", () => {
            expect(formatCurrency("1000")).toMatch(/1\.000/);
        });
    });

    describe("formatNumber", () => {
        it("memformat ribuan", () => {
            expect(formatNumber(1234567)).toBe("1.234.567");
        });

        it("menangani input non-angka", () => {
            expect(() => formatNumber(null)).not.toThrow();
            expect(() => formatNumber(undefined)).not.toThrow();
        });
    });

    describe("formatDate", () => {
        it("memformat tanggal ISO", () => {
            expect(formatDate("2026-10-06")).toBeTruthy();
            expect(formatDate("2026-10-06")).not.toBe("-");
        });

        it('mengembalikan "-" untuk input kosong', () => {
            expect(formatDate("")).toBe("-");
            expect(formatDate(null)).toBe("-");
            expect(formatDate(undefined)).toBe("-");
        });
    });

    describe("formatDateTime", () => {
        it('mengembalikan "-" untuk input kosong', () => {
            expect(formatDateTime(null)).toBe("-");
        });

        it("memformat datetime", () => {
            expect(formatDateTime("2026-10-06T09:00:00Z")).not.toBe("-");
        });
    });
});
