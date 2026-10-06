const VARIANTS = {
    gray: "bg-gray-100 text-gray-700",
    blue: "bg-blue-100 text-blue-700",
    green: "bg-emerald-100 text-emerald-700",
    red: "bg-red-100 text-red-700",
    yellow: "bg-amber-100 text-amber-700",
    purple: "bg-violet-100 text-violet-700",
};

// Status domain aplikasi yang sudah dipetakan ke warna semantik.
const STATUS_MAP = {
    aktif: "green",
    "tidak aktif": "gray",
    pending: "yellow",
    approved: "green",
    rejected: "red",
    hadir: "green",
    izin: "blue",
    sakit: "yellow",
    alpha: "red",
    diterima: "green",
    ditolak: "red",
    menunggu: "yellow",
};

export function StatusBadge({ status, className = "" }) {
    const value = String(status || "").toLowerCase();
    const variant = STATUS_MAP[value] || "gray";
    const label = String(status || "-");

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${VARIANTS[variant]} ${className}`}
        >
            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
            {label}
        </span>
    );
}

export default function Badge({ children, variant = "gray", className = "" }) {
    return (
        <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${VARIANTS[variant] || VARIANTS.gray} ${className}`}
        >
            {children}
        </span>
    );
}
