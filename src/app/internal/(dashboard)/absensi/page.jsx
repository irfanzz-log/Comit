"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import PageContainer from "@/component/internal/PageContainer";
import Pagination from "@/component/internal/Pagination";
import ExportTableButton from "@/component/internal/ExportTableButton";
import Icon from "@/component/internal/Icon";

const MEDALS = [
    { bg: "bg-amber-400", text: "text-amber-950", label: "1" },
    { bg: "bg-slate-300", text: "text-slate-900", label: "2" },
    { bg: "bg-amber-600", text: "text-white", label: "3" },
];

export default function Absensi() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [leaderboardAll, setLeaderboardAll] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchLeaderboard() {
            setLoading(true);
            setError(null);
            try {
                const data = await apiFetch(`/api/userAttendance?page=${page}`);
                if (!isMounted) return;
                setLeaderboard(data.leaderboard || []);
                setLeaderboardAll(data.leaderboardAll || []);
                setTotalPages(data.pageAll || 1);
                setTotalUsers((data.totalLeaderboard || []).length);
            } catch (err) {
                if (!isMounted) return;
                setError("Gagal memuat data absensi.");
                console.error("Error fetching leaderboard:", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchLeaderboard();
        return () => {
            isMounted = false;
        };
    }, [page]);

    return (
        <PageContainer
            title="Dashboard Absensi"
            subtitle="Rekapitulasi kehadiran anggota"
            actions={<ExportTableButton tableId="table-data" filename="Data_Absensi_COMIT" />}
        >
            {error ? (
                <div className="px-4 py-3 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm flex items-center gap-2">
                    <Icon name="alert" size={16} />
                    {error}
                </div>
            ) : null}

            {/* Leaderboard Top 3 */}
            <div className="p-5 md:p-6 rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <span className="p-2 rounded-lg bg-amber-50 text-amber-600">
                            <Icon name="trophy" size={18} />
                        </span>
                        <h2 className="text-base font-bold text-gray-900">Leaderboard Kehadiran</h2>
                    </div>
                    <span className="text-xs text-gray-500 hidden sm:block">Top 3 kehadiran tertinggi</span>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[0, 1, 2].map((i) => (
                            <div key={i} className="h-20 rounded-xl bg-gray-100 animate-pulse" />
                        ))}
                    </div>
                ) : leaderboard.length === 0 ? (
                    <div className="py-10 text-center text-sm text-gray-400">
                        <Icon name="inbox" size={28} className="mx-auto mb-2 text-gray-300" />
                        Belum ada data kehadiran.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {leaderboard.map((user, index) => {
                            const medal = MEDALS[index] || MEDALS[2];
                            return (
                                <div
                                    key={user.id ?? index}
                                    className="flex items-center p-4 rounded-xl bg-white border border-gray-200 shadow-sm transition-transform hover:scale-[1.02]"
                                >
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 mr-3.5 shadow-sm ${medal.bg} ${medal.text}`}
                                    >
                                        {medal.label}
                                    </div>

                                    <div className="w-11 h-11 rounded-full bg-gray-100 mr-3.5 overflow-hidden shrink-0 flex items-center justify-center border border-gray-200">
                                        <span className="text-sm font-bold text-gray-500">
                                            {user.nama?.charAt(0)?.toUpperCase()}
                                        </span>
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold text-sm text-gray-900 truncate">
                                            {user.nama}
                                        </p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-xs text-emerald-600 font-medium">
                                                {user.hadir} Hadir
                                            </span>
                                            <span className="text-xs text-gray-300">•</span>
                                            <span className="text-xs text-gray-500">
                                                {user.total_data} Kegiatan
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Tabel rekap */}
            <div>
                <h3 className="text-base font-bold text-gray-900 mb-3">Rekapitulasi Kehadiran</h3>

                <div className="hidden lg:block overflow-x-auto border border-gray-200 rounded-xl bg-white">
                    <table id="table-data" className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50/80">
                            <tr>
                                {["No", "Nama Lengkap", "Hadir", "Izin", "Sakit"].map((h) => (
                                    <th
                                        key={h}
                                        scope="col"
                                        className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-10 text-center text-sm text-gray-400">
                                        Memuat data...
                                    </td>
                                </tr>
                            ) : leaderboardAll.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-10 text-center text-sm text-gray-400">
                                        Tidak ada data absensi ditemukan.
                                    </td>
                                </tr>
                            ) : (
                                leaderboardAll.map((data, idx) => (
                                    <tr key={data.id ?? idx} className="hover:bg-gray-50/70 transition-colors">
                                        <td className="px-4 py-3 text-sm text-gray-500">
                                            {(page - 1) * 10 + idx + 1}
                                        </td>
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                            {data.nama}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-emerald-600 font-semibold">
                                            {data.hadir}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-blue-600 font-semibold">
                                            {data.izin}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-amber-600 font-semibold">
                                            {data.sakit}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="grid grid-cols-1 gap-3 lg:hidden">
                    {leaderboardAll.map((data, index) => (
                        <div
                            key={data.id ?? index}
                            className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm"
                        >
                            <h4 className="font-bold text-gray-900 mb-2">{data.nama}</h4>
                            <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                                    <p className="font-bold text-base">{data.hadir}</p>
                                    <p>Hadir</p>
                                </div>
                                <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
                                    <p className="font-bold text-base">{data.izin}</p>
                                    <p>Izin</p>
                                </div>
                                <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
                                    <p className="font-bold text-base">{data.sakit}</p>
                                    <p>Sakit</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Pagination
                currentPage={page}
                onPageChange={setPage}
                totalPages={totalPages}
                totalItems={totalUsers}
            />
        </PageContainer>
    );
}
