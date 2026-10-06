"use client";

import useSlideNav from "@/hooks/ui/useSlideNav";
import { useAuth } from "@/app/context/AuthContext";
import { useState, useRef, useEffect } from "react";
import Icon from "@/component/internal/Icon";
import { ROLE_LABELS } from "@/lib/constants";

/**
 * Header halaman internal: toggle sidebar (mobile), judul, dan menu user.
 * Konteks `title` dipertahankan agar halaman yang masih memakai header
 * lama tidak perlu mengimpor komponen yang berbeda.
 */
export default function HeaderSectionBody({ title }) {
    const { isOpen, setIsOpen } = useSlideNav();
    const [menuOpen, setMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const initials =
        String(user?.nama || "U")
            .split(" ")
            .map((n) => n.charAt(0))
            .join("")
            .slice(0, 2)
            .toUpperCase();

    return (
        <header className="sticky top-0 z-20 border-b border-gray-100 bg-white/80 backdrop-blur-md w-full px-4 md:px-6 py-3.5 flex flex-row justify-between items-center">
            <div className="flex flex-row items-center gap-3 min-w-0">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle sidebar"
                    className="inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer md:hidden"
                >
                    <Icon name="chevron" size={18} className="rotate-90" />
                </button>
                {title ? <h1 className="text-lg font-bold text-gray-900 truncate">{title}</h1> : null}
            </div>

            <div className="flex flex-row items-center gap-3">
                <div className="hidden sm:flex flex-col items-end">
                    <span className="text-sm font-semibold text-gray-900 leading-tight max-w-[180px] truncate">
                        {user?.nama || "Pengguna"}
                    </span>
                    <span className="text-xs text-gray-500 capitalize">
                        {ROLE_LABELS[user?.user_role] || user?.user_role || "Anggota"}
                    </span>
                </div>

                <div ref={menuRef} className="relative">
                    <button
                        type="button"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Menu pengguna"
                        aria-expanded={menuOpen}
                        className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-sm shadow-sm hover:ring-2 hover:ring-blue-500/40 transition-all cursor-pointer"
                    >
                        {initials}
                    </button>

                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 shadow-xl rounded-xl p-1.5 z-50">
                            <div className="px-3 py-2.5 border-b border-gray-100">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {user?.nama || "Pengguna"}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    NPM {user?.user_npm || "-"}
                                </p>
                                <p className="text-xs text-blue-600 capitalize mt-0.5">
                                    {ROLE_LABELS[user?.user_role] || user?.user_role || "Anggota"}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={logout}
                                className="w-full flex items-center gap-2.5 px-3 py-2 mt-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer text-left"
                            >
                                <Icon name="logout" size={16} />
                                <span>Keluar</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
