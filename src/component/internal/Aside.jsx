"use client";

import Image from "next/image";
import Link from "next/link";
import { useLastPath } from "@/hooks";
import useSlideNav from "@/hooks/ui/useSlideNav";
import useOutFocus from "@/hooks/ui/useOutFocus";
import { useAuth } from "@/app/context/AuthContext";
import Icon from "@/component/internal/Icon";
import { ROLE_LABELS, canManageCertificate } from "@/lib/constants";

const NAV_GROUPS = [
    {
        label: "Dashboard",
        items: [
            { path: "home", label: "Overview", icon: "chart", href: "/internal/home" },
            { path: "pendaftaran", label: "Pendaftaran", icon: "inbox", href: "/internal/pendaftaran" },
            { path: "absensi", label: "Absensi", icon: "calendar", href: "/internal/absensi" },
        ],
    },
    {
        label: "Kelola Data",
        items: [
            { path: "data_anggota", label: "Data Anggota", icon: "users", href: "/internal/data_anggota" },
            { path: "data_absensi", label: "Data Absensi", icon: "calendar", href: "/internal/data_absensi" },
            { path: "data_kegiatan", label: "Data Kegiatan", icon: "qr", href: "/internal/data_kegiatan" },
            { path: "data_uang_kas", label: "Data Uang Kas", icon: "wallet", href: "/internal/data_uang_kas" },
            { path: "data_pemasukkan", label: "Data Pemasukkan", icon: "cash", href: "/internal/data_pemasukkan" },
            { path: "data_pengeluaran", label: "Data Pengeluaran", icon: "cash", href: "/internal/data_pengeluaran" },
        ],
    },
];

export default function Aside() {
    const lastPath = useLastPath();
    const { isOpen, setIsOpen } = useSlideNav();
    const outFocusRef = useOutFocus(null);
    const { user } = useAuth();

    const showCertificate = canManageCertificate(user?.user_role);

    const navItemClass = (path) => {
        const isActive = lastPath === path;
        return `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
            isActive
                ? "bg-blue-600 text-white shadow-sm shadow-blue-500/25"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        }`;
    };

    const iconClass = (path) =>
        `shrink-0 transition-colors ${lastPath === path ? "text-white" : "text-gray-400 group-hover:text-gray-600"}`;

    return (
        <>
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 md:hidden"
                    aria-hidden="true"
                />
            )}

            <aside
                ref={outFocusRef}
                className={`fixed md:sticky top-0 left-0 h-screen z-50 md:z-10 flex flex-col
                    w-72 md:w-64 shrink-0 bg-white border-r border-gray-200
                    transition-transform duration-300 ease-out
                    ${isOpen ? "translate-x-0 shadow-2xl md:shadow-none" : "-translate-x-full md:translate-x-0"}`}
            >
                <header className="p-5 flex items-center justify-between border-b border-gray-100">
                    <Link href="/" className="flex items-center gap-3 min-w-0">
                        <Image
                            src="/logo/commitLogo.png"
                            width={36}
                            height={36}
                            className="w-9 h-9 object-contain shrink-0"
                            alt="COMIT Logo"
                        />
                        <div className="flex flex-col min-w-0">
                            <span className="font-bold text-lg text-gray-900 tracking-wide leading-none">
                                COMIT
                            </span>
                            <span className="text-[10px] uppercase tracking-wider text-gray-400 mt-0.5">
                                Internal Panel
                            </span>
                        </div>
                    </Link>
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="md:hidden p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"
                        aria-label="Tutup sidebar"
                    >
                        <Icon name="x" size={16} />
                    </button>
                </header>

                <nav className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
                    {NAV_GROUPS.map((group) => (
                        <div key={group.label}>
                            <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                {group.label}
                            </span>
                            <div className="mt-2 space-y-1">
                                {group.items.map((item) => (
                                    <Link
                                        key={item.path}
                                        onClick={() => setIsOpen(false)}
                                        href={item.href}
                                        className={navItemClass(item.path)}
                                    >
                                        <Icon name={item.icon} size={18} className={iconClass(item.path)} />
                                        <span className="truncate">{item.label}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div>
                        <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                            Sertifikat
                        </span>
                        <div className="mt-2 space-y-1">
                            {showCertificate ? (
                                <Link
                                    onClick={() => setIsOpen(false)}
                                    href="/internal/sertifikat"
                                    className={navItemClass("sertifikat")}
                                >
                                    <Icon
                                        name="sparkles"
                                        size={18}
                                        className={iconClass("sertifikat")}
                                    />
                                    <span className="truncate">Sertifikat</span>
                                </Link>
                            ) : (
                                <p className="px-3 py-2 text-xs text-gray-400 leading-relaxed">
                                    Hanya developer, superadmin, dan sekretaris yang dapat mengelola
                                    sertifikat.
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                            Akun
                        </span>
                        <div className="mt-2 space-y-1">
                            <Link
                                onClick={() => setIsOpen(false)}
                                href="/internal/profil_pengguna"
                                className={navItemClass("profil_pengguna")}
                            >
                                <Icon name="shield" size={18} className={iconClass("profil_pengguna")} />
                                <span className="truncate">Profil Pengguna</span>
                            </Link>
                        </div>
                    </div>
                </nav>

                {user ? (
                    <div className="p-4 border-t border-gray-100">
                        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50">
                            <div className="w-9 h-9 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center shrink-0">
                                {String(user.nama || "U")
                                    .split(" ")
                                    .map((n) => n.charAt(0))
                                    .join("")
                                    .slice(0, 2)
                                    .toUpperCase()}
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {user.nama || "Pengguna"}
                                </p>
                                <p className="text-xs text-gray-500 capitalize truncate">
                                    {ROLE_LABELS[user.user_role] || user.user_role || "Anggota"}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : null}
            </aside>
        </>
    );
}
