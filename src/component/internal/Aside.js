"use client";

import Image from "next/image";
import Link from "next/link";
import { useLastPath } from "@/hooks";
import useSlideNav from "@/hooks/ui/useSlideNav";
import useOutFocus from "@/hooks/ui/useOutFocus";
import { useAuth } from "@/app/context/AuthContext";

export default function Aside() {
    const lastPath = useLastPath();
    const { isOpen, setIsOpen } = useSlideNav();
    const outFocusRef = useOutFocus(null);
    const { user } = useAuth();

    const isAuthorizedForCertificates =
        user?.user_role === "developer" ||
        user?.user_role === "sekretaris" ||
        user?.user_role === "superadmin";

    const navItemClass = (path) => {
        const isActive = lastPath === path;
        return `px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-3 ${
            isActive
                ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        }`;
    };

    return (
        <>
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden transition-opacity"
                    aria-hidden="true"
                />
            )}

            <aside
                ref={outFocusRef}
                className={`fixed md:sticky top-0 left-0 h-screen z-50 md:z-10 flex flex-col
                            w-72 md:w-64 shrink-0
                            bg-white
                            border-r border-gray-200
                            transition-transform duration-300 ease-out
                            ${isOpen ? "translate-x-0 shadow-2xl md:shadow-none" : "-translate-x-full md:translate-x-0"}`}
            >
                <header className="p-5 flex items-center justify-between border-b border-gray-100">
                    <Link href="/" className="flex items-center gap-3">
                        <Image
                            src="/logo/commitLogo.png"
                            width={36}
                            height={36}
                            className="w-9 h-9 object-contain"
                            alt="COMIT Logo"
                        />
                        <div className="flex flex-col">
                            <span className="font-bold text-lg text-gray-900 tracking-wide">COMIT</span>
                            <span className="text-[10px] uppercase tracking-wider text-gray-500 -mt-1">Internal Panel</span>
                        </div>
                    </Link>
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="md:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 text-sm"
                        aria-label="Tutup sidebar"
                    >
                        ✕
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
                    {/* Dashboard Section */}
                    <div>
                        <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                            Dashboard
                        </span>
                        <div className="mt-2 space-y-1">
                            <Link onClick={() => setIsOpen(false)} href="/internal/home" className={navItemClass("home")}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="14" rx="1"></rect><rect width="7" height="7" x="3" y="14" rx="1"></rect></svg>
                                <span>Overview</span>
                            </Link>
                            <Link onClick={() => setIsOpen(false)} href="/internal/pendaftaran" className={navItemClass("pendaftaran")}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="18" x="4" y="3" rx="2"></rect><path d="M9 3v2h6V3"></path><path d="M8 10h8"></path><path d="M8 14h5"></path><path d="M8 18h3"></path></svg>
                                <span>Pendaftaran</span>
                            </Link>
                            <Link onClick={() => setIsOpen(false)} href="/internal/absensi" className={navItemClass("absensi")}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>
                                <span>Absensi</span>
                            </Link>
                            {isAuthorizedForCertificates && (
                                <Link onClick={() => setIsOpen(false)} href="/internal/sertifikat" className={navItemClass("sertifikat")}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.11"></path></svg>
                                    <span>Sertifikat</span>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Data Section */}
                    <div>
                        <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                            Kelola Data
                        </span>
                        <div className="mt-2 space-y-1">
                            <Link onClick={() => setIsOpen(false)} href="/internal/data_anggota" className={navItemClass("data_anggota")}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                                <span>Data Anggota</span>
                            </Link>
                            <Link onClick={() => setIsOpen(false)} href="/internal/data_absensi" className={navItemClass("data_absensi")}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 21a8 8 0 0 0-16 0"></path><circle cx="10" cy="8" r="5"></circle><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"></path></svg>
                                <span>Data Absensi</span>
                            </Link>
                            <Link onClick={() => setIsOpen(false)} href="/internal/data_kegiatan" className={navItemClass("data_kegiatan")}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>
                                <span>Data Kegiatan</span>
                            </Link>
                            <Link onClick={() => setIsOpen(false)} href="/internal/data_uang_kas" className={navItemClass("data_uang_kas")}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 8h20"></path><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="M6 16h12"></path></svg>
                                <span>Data Uang Kas</span>
                            </Link>
                            <Link onClick={() => setIsOpen(false)} href="/internal/data_pemasukkan" className={navItemClass("data_pemasukkan")}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6v6h4l-7 7-7-7h4V6h6z"></path></svg>
                                <span>Data Pemasukkan</span>
                            </Link>
                            <Link onClick={() => setIsOpen(false)} href="/internal/data_pengeluaran" className={navItemClass("data_pengeluaran")}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18v-6H5l7-7 7 7h-4v6H9z"></path></svg>
                                <span>Data Pengeluaran</span>
                            </Link>
                        </div>
                    </div>

                    {/* Settings Section */}
                    <div>
                        <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                            Akun & Pengaturan
                        </span>
                        <div className="mt-2 space-y-1">
                            <Link onClick={() => setIsOpen(false)} href="/internal/profil_pengguna" className={navItemClass("profil_pengguna")}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                <span>Profil Pengguna</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}