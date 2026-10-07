"use client";

import PageContainer from "@/component/internal/PageContainer";
import StatCard from "@/component/internal/StatCard";
import ChartLine from "@/component/ChartLine";
import { useEffect, useState } from "react";
import useGetAmountTransactions from "@/hooks/useGetAmountTransactions";
import { apiFetch } from "@/lib/api";
import { formatCurrency } from "@/lib/constants";
import Icon from "@/component/internal/Icon";

export default function Home() {
    const { pemasukkan, pengeluaran, kas, dataForChartByMonth, loading } = useGetAmountTransactions();
    const [totalUsers, setTotalUsers] = useState(0);
    const [pendingEnrollments, setPendingEnrollments] = useState(0);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [loadingMeta, setLoadingMeta] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function loadDashboardMeta() {
            // Tiga endpoint ini dipakai ulang di halaman lain (userInfo di
            // data anggota, transactions di data_uang_kas). apiFetch
            // mengembalikan cache hangat instan + revalidate background,
            // jadi navigasi internal tidak menampilkan loading kosong.
            const [usersRes, enrollmentsRes, txRes] = await Promise.all([
                apiFetch("/api/userInfo?page=1"),
                apiFetch("/api/enrollments"),
                apiFetch("/api/transactions?page=1"),
            ]);

            if (!isMounted) return;

            setTotalUsers(usersRes.totalUsers || 0);
            setPendingEnrollments(
                (enrollmentsRes.data || []).filter((e) => e.status === "pending").length
            );
            setRecentTransactions((txRes.users || []).slice(0, 5));
        }

        loadDashboardMeta().catch((err) => {
            console.error("Gagal mengambil data dashboard:", err);
            if (isMounted) setLoadingMeta(false);
        });
        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <PageContainer title="Dashboard Overview" subtitle="Ringkasan kegiatan organisasi COMIT">
            <div className="space-y-6">
                {/* Ringkasan keuangan */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <StatCard
                        title="Total Pemasukkan"
                        value={formatCurrency(pemasukkan)}
                        subtitle="Akumulasi seluruh transaksi masuk"
                        icon="cash"
                        variant="green"
                        loading={loading}
                    />
                    <StatCard
                        title="Total Pengeluaran"
                        value={formatCurrency(pengeluaran)}
                        subtitle="Akumulasi seluruh transaksi keluar"
                        icon="cash"
                        variant="red"
                        loading={loading}
                    />
                    <StatCard
                        title="Saldo Kas"
                        value={formatCurrency(kas)}
                        subtitle={kas >= 0 ? "Posisi kas sehat" : "Kas dalam keadaan defisit"}
                        icon="wallet"
                        variant={kas >= 0 ? "blue" : "yellow"}
                        loading={loading}
                    />
                </div>

                {/* Statistik organisasi */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <StatCard
                        title="Total Anggota"
                        value={totalUsers}
                        subtitle="Terdaftar dan aktif di sistem organisasi"
                        icon="users"
                        variant="purple"
                        loading={loadingMeta}
                    />
                    <StatCard
                        title="Pendaftaran Menunggu"
                        value={pendingEnrollments}
                        subtitle={
                            pendingEnrollments > 0
                                ? "Perlu ditinjau pada halaman Pendaftaran"
                                : "Tidak ada pendaftaran yang menunggu"
                        }
                        icon="inbox"
                        variant={pendingEnrollments > 0 ? "yellow" : "gray"}
                        loading={loadingMeta}
                    />
                </div>

                {/* Grafik keuangan */}
                <div className="w-full bg-gray-50/60 p-4 md:p-6 rounded-2xl border border-gray-100">
                    <ChartLine dataForChartByMonth={dataForChartByMonth} />
                </div>

                {/* Transaksi terakhir */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-base font-bold text-gray-900">Transaksi Terakhir</h2>
                        <a
                            href="/internal/data_pemasukkan"
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
                        >
                            Lihat semua
                            <Icon name="chevron" size={14} className="-rotate-90" />
                        </a>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                        {loadingMeta ? (
                            <div className="p-8 text-center text-sm text-gray-400">Memuat transaksi...</div>
                        ) : recentTransactions.length === 0 ? (
                            <div className="p-8 text-center text-sm text-gray-400">
                                <div className="flex flex-col items-center gap-2">
                                    <Icon name="inbox" size={28} className="text-gray-300" />
                                    Belum ada transaksi tercatat.
                                </div>
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-100">
                                {recentTransactions.map((tx) => {
                                    const masuk = tx.tipe === "pemasukkan";
                                    return (
                                        <li key={tx.id} className="flex items-center gap-3 p-4">
                                            <span
                                                className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${
                                                    masuk
                                                        ? "bg-emerald-50 text-emerald-600"
                                                        : "bg-red-50 text-red-600"
                                                }`}
                                            >
                                                <Icon name={masuk ? "cash" : "cash"} size={16} />
                                            </span>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {tx.deskripsi || tx.kategori}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {tx.nama_penginput} · {tx.kategori}
                                                </p>
                                            </div>
                                            <span
                                                className={`text-sm font-semibold whitespace-nowrap ${
                                                    masuk ? "text-emerald-600" : "text-red-600"
                                                }`}
                                            >
                                                {masuk ? "+" : "-"}
                                                {formatCurrency(tx.jumlah)}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}
