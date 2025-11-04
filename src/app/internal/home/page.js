"use client";

import Aside from "@/component/internal/Aside";
import HeaderSectionBody from "@/component/internal/HeaderSectionBody";
import ChartLine from "@/component/ChartLine";
import DataFilter from "@/component/DateFilter";
import useDateFilter from "@/hooks/ui/useDateFilter";
import { useState } from "react";

export default function Home() {
    const [dateInput, setDateInput] = useState({});
    const data = useDateFilter(dateInput.keyStart, dateInput.keyEnd);
    return (
        <div className="main relative w-full h-screen flex flex-row bg-gray-100 overflow-x-hidden">
            <Aside />
            <main className="py-2 px-2 scrollbar-hide w-full h-full overflow-y-scroll overflow-x-hidden">
                <section className="main-section relative w-full bg-white rounded-lg shadow-md">
                    <HeaderSectionBody
                        title="Dashboard"
                        profile="UP" />
                    <div className="main-section_body p-5 h-full w-full">
                        <DataFilter setDateInput={setDateInput} />
                        <ChartLine date={data} />
                        <div className="flex md:flex-row flex-col p-5 items-center">
                            <div className="pemasukkan relative w-full p-2 mx-5">
                                <div className="pemasukkan_head flex flex justify-between">
                                    <div className="title w-full flex flex-row">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trending-up h-4 w-4 sm:h-5 sm:w-5"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                                        <span className="mx-2 text-gray-600 text-sm">Total Pemasukkan</span>
                                    </div>
                                    <span className="rounded-full bg-green-500 w-3 h-3"></span>
                                </div>
                                <div className="pemasukkan_body">
                                    <span className="font-bold text-2xl">Rp 12.645.456</span>
                                </div>
                            </div>
                            <div className="pengeluaran relative w-full p-2 mx-5">
                                <div className="pemasukkan_head flex flex justify-between">
                                    <div className="title w-full flex flex-row">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trending-down h-4 w-4 sm:h-5 sm:w-5"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"></polyline><polyline points="16 17 22 17 22 11"></polyline></svg>
                                        <span className="mx-2 text-gray-600 text-sm">Total Pengeluaran</span>
                                    </div>
                                    <span className="rounded-full bg-blue-500 w-3 h-3"></span>
                                </div>
                                <div className="pemasukkan_body">
                                    <span className="font-bold text-2xl">Rp 12.645.456</span>
                                </div>
                            </div>
                            <div className="kas relative w-full p-2 mx-5">
                                <div className="pemasukkan_head flex flex justify-between">
                                    <div className="title w-full flex flex-row">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-dollar-sign h-4 w-4 sm:h-5 sm:w-5"><line x1="12" x2="12" y1="2" y2="22"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                                        <span className="mx-2 text-gray-600 text-sm">Kas</span>
                                    </div>
                                    <span className="rounded-full bg-red-500 w-3 h-3"></span>
                                </div>
                                <div className="pemasukkan_body">
                                    <span className="font-bold text-2xl">Rp 12.645.456</span>
                                </div>
                            </div>
                        </div>
                        <div className="info absolute right-10 bottom-2">
                            <span className="text-sm text-gray-600">Updated: 02 November 2025</span>
                        </div>
                    </div>
                    <div className="detail w-full flex md:flex-row flex-col items-center p-5 pb-10">
                        <div className="anggota w-full bg-blue-500/10 p-5 shadow-lg mx-2 rounded-lg text-blue-500 md:my-0 my-3">
                        <div className="title w-full flex justify-between">
                            <span className="font-medium">Total Anggota</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users h-4 w-4 text-blue-500"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        </div>
                        <div className="detail_body flex flex-col my-4">
                            <span className="text-2xl font-bold">268</span>
                            <span className="text-sm text-gray-600">Total semua anggota aktif</span>
                        </div>
                        </div>
                        <div className="anggota-aktif w-full bg-gradient-to-br from-green-500/10 to-green-600/10 p-5 shadow-lg mx-2 rounded-lg text-green-500 md:my-0 my-3">
                        <div className="title flex justify-between">
                            <span className="font-medium">Total Anggota</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-check-big h-4 w-4 text-green-500"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>
                        </div>
                        <div className="detail_body flex flex-col my-4">
                            <span className="text-2xl font-bold">268</span>
                            <span className="text-sm text-gray-600">Total semua anggota aktif</span>
                        </div>
                        </div>
                        <div className="anggota-nonaktif w-full bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 p-5 shadow-lg mx-2 rounded-lg text-yellow-500 md:my-0 my-3">
                        <div className="title flex justify-between">
                            <span className="font-medium">Total Anggota</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock h-4 w-4 text-yellow-500"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        </div>
                        <div className="detail_body flex flex-col my-4">
                            <span className="text-2xl font-bold">268</span>
                            <span className="text-sm text-gray-600">Total semua anggota aktif</span>
                        </div>
                        </div>
                        <div className="pengurus w-full bg-gradient-to-br from-purple-500/10 to-purple-600/10 p-5 shadow-lg mx-2 rounded-lg text-purple-500 md:my-0 my-3">
                        <div className="title flex justify-between">
                            <span className="font-medium">Total Anggota</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-cog h-4 w-4 text-purple-500"><circle cx="18" cy="15" r="3"></circle><circle cx="9" cy="7" r="4"></circle><path d="M10 15H6a4 4 0 0 0-4 4v2"></path><path d="m21.7 16.4-.9-.3"></path><path d="m15.2 13.9-.9-.3"></path><path d="m16.6 18.7.3-.9"></path><path d="m19.1 12.2.3-.9"></path><path d="m19.6 18.7-.4-1"></path><path d="m16.8 12.3-.4-1"></path><path d="m14.3 16.6 1-.4"></path><path d="m20.7 13.8 1-.4"></path></svg>
                        </div>
                        <div className="detail_body flex flex-col my-4">
                            <span className="text-2xl font-bold">268</span>
                            <span className="text-sm text-gray-600">Total semua anggota aktif</span>
                        </div>
                        </div>
                    </div>
                </section>
            </main>

        </div>
    );
}