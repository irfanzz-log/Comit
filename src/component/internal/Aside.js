"use client";

import Image from "next/image"
import Link from "next/link"
import { useLastPath } from "@/hooks"
import useSlideNav from "@/hooks/ui/useSlideNav";
import useOutFocus from "@/hooks/ui/useOutFocus";

export default function Aside() {
    const lastPath = useLastPath(); // get the last segment of the current path
    const { isOpen, setIsOpen } = useSlideNav();
    const outFocusRef = useOutFocus(null);
    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 md:bg-transparent bg-black/20 md:backdrop-blur-none backdrop-blur-sm w-full -md:z-100 z-1"></div>
            )}

            <aside
                ref={outFocusRef}
                className={`h-screen p-2 z-10 top-0 flex-col
                            transition-transform duration-300 ease-out
                            md:flex md:relative md:w-1/4
                            md:bg-transparent
                            bg-gray-200 w-3/4
                            absolute
                            md:translate-x-0
                    ${isOpen
                        ? "translate-x-0 "
                        : "-translate-x-full"
                    }`}
            >
                <header className="w-full p-5 flex flex-row items-center ">
                    <Image
                        src="/logo/commitLogo.png"
                        width={100}
                        height={100}
                        className="max-w-1/6"
                        alt="comit_logo.png"
                    />
                    <h2>COMIT</h2>
                </header>
                <div className="main-aside flex flex-col p-1">
                    <div className="main-aside_content">
                        <header className="p-2 text-sm font-bold">Dashboard</header>
                        <div className="main-aside_links flex flex-col">
                            <Link onClick={()=> setIsOpen(false)} href="/internal/home" className={`p-2 rounded-md hover:bg-gray-200 text-sm mt-1 flex flex-row items-center gap-2 ${lastPath === "home" && "bg-gray-200"}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-grid"><rect width="7" height="7" x="3" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="14" rx="1"></rect><rect width="7" height="7" x="3" y="14" rx="1"></rect></svg>
                                <span>Home</span></Link>
                            <Link onClick={()=> setIsOpen(false)} href="/internal/absensi" className={`p-2 rounded-md hover:bg-gray-200 text-sm mt-1 flex flex-row items-center gap-2 ${lastPath === "absensi" && "bg-gray-200"}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>
                                <span>Absensi</span></Link>
                        </div>
                    </div>

                    <div className="main-aside_content">
                        <header className="p-2 text-sm font-bold">Data</header>
                        <div className="main-aside_links flex flex-col">
                            <Link onClick={()=> setIsOpen(false)} href="/internal/data_anggota" className={`p-2 rounded-md hover:bg-gray-200 text-sm mt-1 flex flex-row items-center gap-2 ${lastPath === "data_anggota" && "bg-gray-200"}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                                <span>Data Anggota</span>
                            </Link>
                            <Link onClick={()=> setIsOpen(false)} href="/internal/data_absensi" className={`p-2 rounded-md hover:bg-gray-200 text-sm mt-1 flex flex-row items-center gap-2 ${lastPath === "data_absensi" && "bg-gray-200"}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users-round"><path d="M18 21a8 8 0 0 0-16 0"></path><circle cx="10" cy="8" r="5"></circle><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"></path></svg>
                                <span>Data Absensi</span>
                            </Link>
                            <Link onClick={()=> setIsOpen(false)} href="/internal/data_kegiatan" className={`p-2 rounded-md hover:bg-gray-200 text-sm mt-1 flex flex-row items-center gap-2 ${lastPath === "data_kegiatan" && "bg-gray-200"}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>
                                <span>Data Kegiatan</span>
                            </Link>
                            <Link onClick={()=> setIsOpen(false)} href="/internal/data_uang_kas" className={`p-2 rounded-md hover:bg-gray-200 text-sm mt-1 flex flex-row items-center gap-2 ${lastPath === "data_uang_kas" && "bg-gray-200"}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-dock"><path d="M2 8h20"></path><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="M6 16h12"></path></svg>
                                <span>Data Uang Kas</span>
                            </Link>
                            <Link onClick={()=> setIsOpen(false)} href="/internal/data_pemasukkan" className={`p-2 rounded-md hover:bg-gray-200 text-sm mt-1 flex flex-row items-center gap-2 ${lastPath === "data_pemasukkan" && "bg-gray-200"}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-big-down"><path d="M15 6v6h4l-7 7-7-7h4V6h6z"></path></svg>
                                <span>Data Pemasukkan</span>
                            </Link>
                            <Link onClick={()=> setIsOpen(false)} href="/internal/data_pengeluaran" className={`p-2 rounded-md hover:bg-gray-200 text-sm mt-1 flex flex-row items-center gap-2 ${lastPath === "data_pengeluaran" && "bg-gray-200"}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-big-up"><path d="M9 18v-6H5l7-7 7 7h-4v6H9z"></path></svg>
                                <span>Data Pengeluaran</span>
                            </Link>
                        </div>
                    </div>

                    <div className="main-aside_content">
                        <header className="p-2 text-sm font-bold">Pengaturan</header>
                        <div className="main-aside_links flex flex-col">
                            <Link onClick={()=> setIsOpen(false)} href="/internal/profil_pengguna" className={`p-2 rounded-md hover:bg-gray-200 text-sm mt-1 flex flex-row items-center gap-2 ${lastPath === "profil_pengguna" && "bg-gray-200"}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                <span>Profil Pengguna</span>
                            </Link>
                        </div>
                    </div>

                </div>
            </aside>
        </>
    )
}