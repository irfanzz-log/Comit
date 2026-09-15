'use client';

import HeaderSectionBody from "@/component/internal/HeaderSectionBody";
import { useState, useEffect } from "react";
import Pagination from "@/hooks/ui/pagination";
import ExportTableButton from "@/component/ExportTableButton";
import Image from "next/image";
import { apiFetch } from "@/lib/api";

export default function Absensi() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [leaderboardAll, setLeaderboardAll] = useState([]);
    const [dataAnggota, setDataAnggota] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [linkImg, setLinkImg] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        async function fetchLeaderboard() {
            setLoading(true);
            try {
                const data = await apiFetch(`/api/userAttendance?page=${page}`);
                if (isMounted) {
                    setLeaderboard(data.leaderboard || []);
                    setLeaderboardAll(data.leaderboardAll || []);
                    setDataAnggota(data.users || []);
                    setTotalPages(data.pageAll || 1);
                    setTotalUsers(data.totalLeaderboard?.length || 0);
                }
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchLeaderboard();
        return () => {
            isMounted = false;
        };
    }, [page]);

    useEffect(() => {
        let isMounted = true;
        async function fetchUserProfile() {
            try {
                const data = await apiFetch('/api/userInfo');
                if (isMounted) {
                    setLinkImg(data.allUsers || []);
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        }

        fetchUserProfile();
        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <section className="main-section bg-white bg-gray-900 border border-gray-200 border-gray-800 relative w-full rounded-2xl shadow-sm overflow-hidden transition-colors">
            <HeaderSectionBody title="Dashboard Absensi" />

            <div className="p-5 md:p-6 space-y-6">
                {/* Leaderboard Top 3 */}
                <div className="p-5 md:p-6 rounded-2xl border border-gray-200 border-gray-800 bg-gray-50/50 bg-gray-800/30">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <span className="p-2 rounded-lg bg-yellow-500/10 text-yellow-600 text-yellow-400">
                                🏆
                            </span>
                            <h2 className="text-lg font-bold text-gray-900 text-white">Leaderboard Kehadiran</h2>
                        </div>
                        <span className="text-xs text-gray-500 text-gray-400">Top 3 Kehadiran Tertinggi</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {leaderboard.map((user, index) => {
                            const matched = linkImg.find(img => img.nama === user.nama);
                            const medalColor = index === 0 ? "bg-amber-400 text-amber-950" : index === 1 ? "bg-slate-300 text-slate-900" : "bg-amber-600 text-white";

                            return (
                                <div
                                    key={index}
                                    className="flex items-center p-4 rounded-xl bg-white bg-gray-800 border border-gray-200 border-gray-700 shadow-sm transition-all hover:scale-[1.02]"
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 mr-3.5 shadow-sm ${medalColor}`}>
                                        {index + 1}
                                    </div>

                                    <div className="w-12 h-12 rounded-full bg-gray-100 bg-gray-700 mr-3.5 overflow-hidden shrink-0 flex items-center justify-center border border-gray-200 border-gray-600">
                                        {matched?.linkimg ? (
                                            <Image
                                                width={48}
                                                height={48}
                                                className="w-full h-full object-cover"
                                                src={`/pengurus/${matched.linkimg}.png`}
                                                alt={user.nama}
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            <span className="text-sm font-bold text-gray-500 text-gray-300">
                                                {user.nama?.charAt(0)?.toUpperCase()}
                                            </span>
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold text-sm text-gray-900 text-white truncate">{user.nama}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-xs text-emerald-600 text-emerald-400 font-medium">
                                                {user.hadir} Hadir
                                            </span>
                                            <span className="text-xs text-gray-400">•</span>
                                            <span className="text-xs text-gray-500 text-gray-400">
                                                {user.total_data} Kegiatan
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Table Header & Action */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
                    <div>
                        <h3 className="text-base font-bold text-gray-900 text-white">Rekapitulasi Kehadiran</h3>
                        <p className="text-xs text-gray-500 text-gray-400">Daftar presensi seluruh anggota</p>
                    </div>
                    <ExportTableButton tableId="table-data" filename="Data_Absensi_COMIT" />
                </div>

                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto border border-gray-200 border-gray-800 rounded-xl">
                    <table id="table-data" className="min-w-full divide-y divide-gray-200 divide-gray-800">
                        <thead className="bg-gray-50 bg-gray-800/80">
                            <tr>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 text-gray-300 uppercase tracking-wider">No</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 text-gray-300 uppercase tracking-wider">Nama Lengkap</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 text-gray-300 uppercase tracking-wider">Hadir</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 text-gray-300 uppercase tracking-wider">Izin</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 text-gray-300 uppercase tracking-wider">Sakit</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white bg-gray-900 divide-y divide-gray-200 divide-gray-800">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-4 py-8 text-center text-sm text-gray-500 text-gray-400">
                                        Memuat data absensi...
                                    </td>
                                </tr>
                            ) : leaderboardAll.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-4 py-8 text-center text-sm text-gray-500 text-gray-400">
                                        Tidak ada data absensi ditemukan.
                                    </td>
                                </tr>
                            ) : (
                                leaderboardAll.map((data, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 hover:bg-gray-800/50 transition-colors">
                                        <td className="px-4 py-3 text-sm text-gray-500 text-gray-400">{(page - 1) * 10 + idx + 1}</td>
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900 text-white">{data.nama}</td>
                                        <td className="px-4 py-3 text-sm text-emerald-600 text-emerald-400 font-semibold">{data.hadir}</td>
                                        <td className="px-4 py-3 text-sm text-blue-600 text-blue-400 font-semibold">{data.izin}</td>
                                        <td className="px-4 py-3 text-sm text-amber-600 text-amber-400 font-semibold">{data.sakit}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="grid grid-cols-1 gap-3 lg:hidden">
                    {leaderboardAll.map((data, index) => (
                        <div key={index} className="p-4 rounded-xl border border-gray-200 border-gray-800 bg-white bg-gray-800/60 shadow-sm">
                            <h4 className="font-bold text-gray-900 text-white mb-2">{data.nama}</h4>
                            <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                <div className="p-2 rounded-lg bg-emerald-50 bg-emerald-950/30 text-emerald-700 text-emerald-300">
                                    <p className="font-bold text-base">{data.hadir}</p>
                                    <p>Hadir</p>
                                </div>
                                <div className="p-2 rounded-lg bg-blue-50 bg-blue-950/30 text-blue-700 text-blue-300">
                                    <p className="font-bold text-base">{data.izin}</p>
                                    <p>Izin</p>
                                </div>
                                <div className="p-2 rounded-lg bg-amber-50 bg-amber-950/30 text-amber-700 text-amber-300">
                                    <p className="font-bold text-base">{data.sakit}</p>
                                    <p>Sakit</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <Pagination
                    currentPage={page}
                    onPageChange={setPage}
                    totalPages={totalPages}
                    userLength={dataAnggota.length}
                    totalUsers={totalUsers}
                />
            </div>
        </section>
    );
}