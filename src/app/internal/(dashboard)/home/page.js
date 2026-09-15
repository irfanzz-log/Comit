"use client";

import HeaderSectionBody from "@/component/internal/HeaderSectionBody";
import ChartLine from "@/component/ChartLine";
import { useState, useEffect } from "react";
import useGetAmountTransactions from "@/hooks/useGetAmountTransactions";
import { apiFetch } from "@/lib/api";

export default function Home() {
    const { pemasukkan, pengeluaran, kas, dataForChartByMonth } = useGetAmountTransactions();
    const [totalUsers, setTotalUsers] = useState(0);

    useEffect(() => {
        let isMounted = true;
        async function getUsers() {
            try {
                const data = await apiFetch('/api/userInfo');
                if (isMounted) {
                    setTotalUsers(data.totalUsers || 0);
                }
            } catch (err) {
                console.error("Gagal mengambil data user:", err);
            }
        }

        getUsers();
        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <section className="main-section relative w-full bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden transition-colors">
            <HeaderSectionBody title="Dashboard Overview" />

            <div className="p-5 md:p-6 space-y-6">
                {/* Chart Container */}
                <div className="w-full bg-gray-50/50 p-4 md:p-6 rounded-2xl border border-gray-100">
                    <ChartLine dataForChartByMonth={dataForChartByMonth} />
                </div>

                {/* Financial Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Pemasukkan */}
                    <div className="p-5 rounded-2xl border border-gray-200 bg-white shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-2 text-gray-600">
                                <span className="p-2 rounded-lg bg-green-500/10 text-green-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                                </span>
                                <span className="text-sm font-medium">Total Pemasukkan</span>
                            </div>
                            <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                            Rp {pemasukkan.toLocaleString('id-ID')}
                        </p>
                    </div>

                    {/* Pengeluaran */}
                    <div className="p-5 rounded-2xl border border-gray-200 bg-white shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-2 text-gray-600">
                                <span className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"></polyline><polyline points="16 17 22 17 22 11"></polyline></svg>
                                </span>
                                <span className="text-sm font-medium">Total Pengeluaran</span>
                            </div>
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                            Rp {pengeluaran.toLocaleString('id-ID')}
                        </p>
                    </div>

                    {/* Saldo Kas */}
                    <div className="p-5 rounded-2xl border border-gray-200 bg-white shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-2 text-gray-600">
                                <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                                </span>
                                <span className="text-sm font-medium">Saldo Kas</span>
                            </div>
                            <span className={`w-2.5 h-2.5 rounded-full ${kas >= 0 ? "bg-emerald-500" : "bg-red-500"}`}></span>
                        </div>
                        <p className={`text-2xl font-bold ${kas >= 0 ? "text-gray-900" : "text-red-600"}`}>
                            Rp {kas.toLocaleString('id-ID')}
                        </p>
                    </div>
                </div>

                {/* Member / Staff Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="p-5 rounded-2xl border border-blue-100 bg-blue-50/50 shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-blue-700">Total Pengurus Aktif</span>
                            <span className="p-2 rounded-lg bg-blue-100 text-blue-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                            </span>
                        </div>
                        <p className="text-3xl font-extrabold text-blue-950">{totalUsers}</p>
                        <p className="text-xs text-blue-600/80 mt-1">Terdaftar dan aktif di sistem organisasi</p>
                    </div>

                    <div className="p-5 rounded-2xl border border-gray-200 bg-gray-50/50 shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">Status Sistem</span>
                            <span className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            </span>
                        </div>
                        <p className="text-xl font-bold text-emerald-600">Normal / Siap</p>
                        <p className="text-xs text-gray-500 mt-1">
                            Pembaruan terakhir: {new Date().toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}