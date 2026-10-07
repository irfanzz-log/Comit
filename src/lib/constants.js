export const STAFF_ROLES = ["developer", "superadmin", "sekretaris", "staff", "bendahara"];

export const ROLE_LABELS = {
    developer: "Developer",
    superadmin: "Super Admin",
    sekretaris: "Sekretaris",
    staff: "Staff",
    bendahara: "Bendahara",
    anggota: "Anggota",
};

export function isStaff(role) {
    return STAFF_ROLES.includes(role);
}

export function canManageFinance(role) {
    return ["developer", "superadmin", "bendahara"].includes(role);
}

export function canManageEnrollment(role) {
    return ["developer", "superadmin", "sekretaris"].includes(role);
}

export function canManageCertificate(role) {
    return ["developer", "superadmin", "sekretaris"].includes(role);
}

export function canManageEvent(role) {
    return ["developer", "superadmin", "sekretaris", "staff"].includes(role);
}

export function canManageAttendance(role) {
    return ["developer", "superadmin", "sekretaris", "staff"].includes(role);
}

// Opsi filter yang dipakai halaman data anggota / absensi.
export const STATUS_ANGGOTA_OPTIONS = ["Aktif", "Tidak Aktif"];

export const MINAT_OPTIONS = ["Programming", "Design", "Comnet", "Office"];

// Sumber kebenaran adalah kolom `users_info.posisi` di database — bukan
// daftar ini. Daftar ini sebelumnya ditulis tangan dan banyak yang tidak
// cocok dengan data sebenarnya ("Bendahara" vs "Bendahara I", "Staff
// Programming" vs "Staff Program", dll). Karena filter memakai exact match
// (`posisi = $1`), opsi yang tidak cocok menghasilkan hasil kosong.
//
// JANGAN ubah label di sini tanpa update data `users_info.posisi`.
// Kalau menambah jabatan baru, tambahkan ke daftar ini DAN ke seed/migrasi.
export const POSISI_OPTIONS = [
    "Ketua Umum",
    "Wakil Ketua",
    "Sekretaris I",
    "Sekretaris II",
    "Bendahara I",
    "Bendahara II",
    "Koor Akademik",
    "Koor Humas",
    "Humas Internal",
    "Humas Eksternal",
    "SDM",
    "Kominfo",
    "Prasarana",
    "Staff Program",
    "Staff Design",
    "Staff Com. Network",
    "Staff Ms. Office",
];

export const STATUS_ABSEN_OPTIONS = ["Hadir", "Izin", "Sakit", "Alpha"];

export const KATEGORI_OPTIONS = ["kas", "donasi", "kegiatan", "lainnya"];

export const JURUSAN_OPTIONS = [
    "Teknologi Informasi",
    "Sistem Informasi",
    "Software Engineering",
    "Akuntansi",
    "Manajemen",
    "Hukum",
];

export function formatCurrency(value) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(Number(value) || 0);
}

export function formatNumber(value) {
    return new Intl.NumberFormat("id-ID").format(Number(value) || 0);
}

export function formatDate(value, options) {
    if (!value) return "-";
    const date = new Date(value);
    // String seperti "not-a-date" menghasilkan Invalid Date; tanpa pengecekan
    // ini Intl.DateTimeFormat melempar RangeError dan merontokkan komponen.
    if (Number.isNaN(date.getTime())) return "-";
    return new Intl.DateTimeFormat("id-ID", options || { dateStyle: "medium" }).format(
        date
    );
}

export function formatDateTime(value) {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(
        date
    );
}
