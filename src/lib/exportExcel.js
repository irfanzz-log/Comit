// Export tabel HTML ke file .xlsx tanpa dependensi eksternal.
//
// Catatan: sebelumnya memakai paket `xlsx` (SheetJS) yang punya advisory
// prototype-pollution dan ReDoS tanpa fix upstream (GHSA-4r6h-8v6p-xvw6,
// GHSA-5pgg-2g8v-p4x9). Penggunaan di sini hanya mengubah DOM lokal yang
// sudah dirender React menjadi spreadsheet — tidak pernah mem-parsing file
// .xlsx yang tidak terpercaya — tetapi dependensi tetap diganti agar tidak
// terbawa ke production.
//
// Implementasi: baca tabel, bangun SpreadsheetML (format yang dipakai Excel
// modern), kompres jadi zip. Hanya bagian zip yang sederhana (stored/
// tidak terkompresi) — file kecil, tidak butuh library deflate.

const FMT_NUMBER = "General";
const FMT_STRING = "@";

function esc(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

// Nama kolom spreadsheet: A..Z, AA..AZ, ...
function colName(index) {
    let n = index + 1;
    let out = "";
    while (n > 0) {
        const rem = (n - 1) % 26;
        out = String.fromCharCode(65 + rem) + out;
        n = Math.floor((n - 1) / 26);
    }
    return out;
}

function isNumeric(value) {
    if (typeof value !== "string") return typeof value === "number" && Number.isFinite(value);
    if (value.trim() === "") return false;
    // Hanya angka murni, ribuan dengan titik/koma, atau desimal dengan koma
    return /^[+-]?[\d.,]+$/.test(value.trim());
}

function toCell(value) {
    if (value === null || value === undefined) {
        return `<c r="A1" t="inlineStr"><is><t></t></is></c>`;
    }
    if (isNumeric(value)) {
        const normalized = String(value).replace(/\./g, "").replace(",", ".");
        const num = Number(normalized);
        if (Number.isFinite(num)) {
            return `<c r="A1" t="n"><v>${num}</v></c>`;
        }
    }
    return `<c r="A1" t="inlineStr"><is><t xml:space="preserve">${esc(value)}</t></is></c>`;
}

function tableToRows(table) {
    const rows = [];
    const seen = new Set();

    table.querySelectorAll("tr").forEach((tr) => {
        // Lewati baris duplikat (React StrictMode bisa render dua kali di
        // hidden table export).
        const key = tr.textContent.trim().slice(0, 200);
        if (seen.has(key)) return;
        seen.add(key);

        const cells = [];
        tr.querySelectorAll("th,td").forEach((cell) => {
            cells.push(cell.textContent.trim());
        });
        if (cells.length) rows.push(cells);
    });

    return rows;
}

// Bangun sheet XML dari array baris.
function buildSheetXml(rows) {
    let body = "";
    rows.forEach((cells, rIdx) => {
        const rowName = String(rIdx + 1);
        let row = `<row r="${rowName}">`;
        cells.forEach((cell, cIdx) => {
            // Template literal membangun cell untuk tiap kolom; `r` diisi
            // setelahnya (lihat replace di bawah) karena nama kolom belum
            // diketahui saat konstruksi string sel.
            row += toCell(cell).replace('r="A1"', `r="${colName(cIdx)}${rowName}"`);
        });
        row += "</row>";
        body += row;
    });

    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<sheetData>${body}</sheetData>
</worksheet>`;
}

// Zip entry "stored" (tidak terkompresi): [header][data][footer].
function zipEntry(name, data, offset) {
    const bytes = new TextEncoder().encode(data);
    const crc = crc32(bytes);

    const header = new Uint8Array(30);
    const dv = new DataView(header.buffer);
    dv.setUint32(0, 0x04034b50, true); // signature
    dv.setUint16(4, 20, true); // version needed
    dv.setUint16(6, 0, true); // flags
    dv.setUint16(8, 0, true); // method: stored
    dv.setUint16(10, 0, true); // time
    dv.setUint16(12, 0, true); // date
    dv.setUint32(14, crc, true);
    dv.setUint32(18, bytes.length, true); // compressed size
    dv.setUint32(22, bytes.length, true); // uncompressed size
    const nameBytes = new TextEncoder().encode(name);
    dv.setUint16(26, nameBytes.length, true);
    dv.setUint16(28, 0, true);

    // Central directory record
    const central = new Uint8Array(46 + nameBytes.length);
    const cdv = new DataView(central.buffer);
    cdv.setUint32(0, 0x02014b50, true);
    cdv.setUint16(4, 20, true); // version made by
    cdv.setUint16(6, 20, true); // version needed
    cdv.setUint16(8, 0, true); // flags
    cdv.setUint16(10, 0, true); // method
    cdv.setUint32(16, crc, true);
    cdv.setUint32(20, bytes.length, true);
    cdv.setUint32(24, bytes.length, true);
    cdv.setUint16(28, nameBytes.length, true);
    cdv.setUint16(30, 0, true); // comment length
    cdv.setUint16(32, 0, true); // disk number
    cdv.setUint16(34, 0, true); // internal attrs
    cdv.setUint32(36, 0, true); // external attrs
    cdv.setUint32(42, offset, true); // offset of header
    central.set(nameBytes, 46);

    return { header, data: bytes, central, size: 30 + nameBytes.length + bytes.length };
}

// CRC32 standar (tabel precomputed).
const CRC_TABLE = (() => {
    const table = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
        let c = n;
        for (let k = 0; k < 8; k++) {
            c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
        }
        table[n] = c;
    }
    return table;
})();

function crc32(bytes) {
    let crc = 0xffffffff;
    for (let i = 0; i < bytes.length; i++) {
        crc = CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
}

function buildWorkbookXml() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<sheets><sheet name="Sheet1" sheetId="1" r:id="rId1"/></sheets>
</workbook>`;
}

function buildRelsXml() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
</Relationships>`;
}

function buildContentTypesXml() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
</Types>`;
}

function downloadBlob(bytes, fileName) {
    const blob = new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    // Revoke di belakang agar browser sempat memulai unduhan.
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function exportTableToExcel(tableId, fileName) {
    const table = document.getElementById(tableId);
    if (!table) {
        console.warn(`Tabel "${tableId}" tidak ditemukan untuk export.`);
        return false;
    }

    const rows = tableToRows(table);
    if (rows.length === 0) {
        console.warn(`Tabel "${tableId}" kosong, tidak ada yang diexport.`);
        return false;
    }

    const sheetXml = buildSheetXml(rows);
    const workbookXml = buildWorkbookXml();
    const relsXml = buildRelsXml();
    const contentTypesXml = buildContentTypesXml();

    const entries = [
        zipEntry("[Content_Types].xml", contentTypesXml, 0),
        zipEntry("_rels/.rels", relsXml, 0),
        zipEntry("xl/workbook.xml", workbookXml, 0),
        zipEntry("xl/worksheets/sheet1.xml", sheetXml, 0),
    ];

    // Hitung offset tiap entry secara berurutan.
    let offset = 0;
    const chunks = [];
    const centrals = [];
    for (const e of entries) {
        // Tulis ulang offset yang benar pada central directory.
        const cdv = new DataView(e.central.buffer);
        cdv.setUint32(42, offset, true);
        chunks.push(e.header, e.data);
        centrals.push(e.central);
        offset += e.size;
    }

    const centralSize = centrals.reduce((s, c) => s + c.length, 0);

    // End of central directory record
    const eocd = new Uint8Array(22);
    const edv = new DataView(eocd.buffer);
    edv.setUint32(0, 0x06054b50, true);
    edv.setUint16(4, 0, true);
    edv.setUint16(6, 0, true);
    edv.setUint16(8, entries.length, true);
    edv.setUint16(10, entries.length, true);
    edv.setUint32(12, centralSize, true);
    edv.setUint32(16, offset, true);

    const totalSize = offset + centralSize + 22;
    const out = new Uint8Array(totalSize);
    let pos = 0;
    for (const c of [...chunks, ...centrals, eocd]) {
        out.set(c, pos);
        pos += c.length;
    }

    downloadBlob(out, `${fileName}.xlsx`);
    return true;
}
