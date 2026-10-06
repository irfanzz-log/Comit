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

export const POSISI_OPTIONS = [
    "Ketua Umum",
    "Wakil Ketua Umum",
    "Sekretaris",
    "Bendahara",
    "Koordinator Akademik",
    "Koordinator Humas",
    "Koordinator SDM",
    "Koordinator Prasarana",
    "Koordinator Kominfo",
    "SDM",
    "Humas Internal",
    "Humas Eksternal",
    "Prasarana",
    "Kominfo",
    "Staff Programming",
    "Staff Design",
    "Staff Comnet",
    "Staff Office",
    "Anggota",
    "Alumni",
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
    return new Intl.DateTimeFormat("id-ID", options || { dateStyle: "medium" }).format(
        new Date(value)
    );
}

export function formatDateTime(value) {
    if (!value) return "-";
    return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(
        new Date(value)
    );
}
