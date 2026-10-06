import { exportTableToExcel } from "@/lib/exportExcel";

// Catatan: sebelumnya hook ini memakai paket `xlsx` (SheetJS) yang punya
// advisory keamanan tanpa fix upstream (prototype pollution + ReDoS).
// Logika export dipindahkan ke src/lib/exportExcel.js — implementasi
// SpreadsheetML murni tanpa dependensi — agar bisa diuji langsung dan
// tidak membawa paket yang rentan ke production.
export const useExportxlsx = () => {
    return { exportTableToExcel };
};
