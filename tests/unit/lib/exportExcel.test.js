import { describe, it, expect, vi, beforeEach } from "vitest";
import { exportTableToExcel } from "@/lib/exportExcel";

// exportTableToExcel memakai `document` dan `Blob` (browser API). Test ini
// berjalan di environment node, jadi API DOM di-mock minimal — bukan untuk
// menyembunyikan bug, tapi karena fungsi memang dirancang untuk browser.

describe("exportExcel — export tabel HTML ke xlsx", () => {
    let mockClick;

    beforeEach(() => {
        mockClick = vi.fn();
        // Hanya elemen <a> (untuk download) yang di-mock; <table>, <tr>,
        // <td> butuh DOM asli jsdom.
        vi.spyOn(document, "createElement").mockImplementation((tag) => {
            if (tag === "a") {
                return {
                    href: "",
                    download: "",
                    click: mockClick,
                    remove: vi.fn(),
                };
            }
            return document.__origCreateElement(tag);
        });
        vi.spyOn(document.body, "appendChild").mockImplementation(() => {});
        vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:mock");
        vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
    });

    function makeTable(rows) {
        const table = document.createElement("table");
        for (const cells of rows) {
            const tr = document.createElement("tr");
            for (const cell of cells) {
                const td = document.createElement("td");
                td.textContent = cell;
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
        return table;
    }

    function stubTable(table) {
        vi.spyOn(document, "getElementById").mockReturnValue(table);
    }

    it("menolak jika tabel tidak ditemukan", () => {
        stubTable(null);
        expect(exportTableToExcel("missing", "test")).toBe(false);
    });

    it("mengexport tabel sederhana", () => {
        stubTable(
            makeTable([
                ["Nama", "NPM"],
                ["Abella", "2024102234"],
            ])
        );
        expect(exportTableToExcel("tbl", "test")).toBe(true);
        expect(mockClick).toHaveBeenCalled();
    });

    it("melewati baris duplikat", () => {
        stubTable(
            makeTable([
                ["A", "1"],
                ["A", "1"],
                ["B", "2"],
            ])
        );
        expect(exportTableToExcel("tbl", "test")).toBe(true);
    });

    it("menangani tabel kosong", () => {
        stubTable(document.createElement("table"));
        expect(exportTableToExcel("tbl", "test")).toBe(false);
    });

    it("menangani nilai null/undefined tanpa crash", () => {
        const table = document.createElement("table");
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.textContent = "";
        tr.appendChild(td);
        table.appendChild(tr);
        stubTable(table);
        expect(exportTableToExcel("tbl", "test")).toBe(true);
    });

    it("menangani kolom lebih dari 26 (multi-huruf)", () => {
        const cells = Array.from({ length: 30 }, (_, i) => `c${i}`);
        stubTable(makeTable([cells]));
        expect(exportTableToExcel("tbl", "test")).toBe(true);
    });

    it("meng-escape karakter XML berbahaya di sel", () => {
        const table = document.createElement("table");
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.textContent = '<script>alert("xss")</script>';
        tr.appendChild(td);
        table.appendChild(tr);
        stubTable(table);
        expect(exportTableToExcel("tbl", "test")).toBe(true);
    });
});
