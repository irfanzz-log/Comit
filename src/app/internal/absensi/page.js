'use client'

import Aside from "@/component/internal/Aside";
import HeaderSectionBody from "@/component/internal/HeaderSectionBody";
import { useState, useEffect, use } from "react";
import Pagination from "@/hooks/ui/pagination";
import ExportTableButton from "@/component/ExportTableButton";
import Image from "next/image";

export default function Absensi() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [leaderboardAll, setLeaderboardAll] = useState([]);
    const [dataAnggota, setDataAnggota] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [linkImg, setLinkImg] = useState([]);

    useEffect(() => {
        async function fetchLeaderboard() {
            try {
                const res = await fetch(`/api/userAttendance?page=${page}`);
                const data = await res.json();
                setLeaderboard(data.leaderboard);
                setLeaderboardAll(data.leaderboardAll);
                setDataAnggota(data.users);
                setTotalPages(data.pageAll);
                setTotalUsers(data.totalLeaderboard.length);
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
            }
        }

        fetchLeaderboard();
    }, [page]);

    useEffect(() => {
        async function fetchUserProfile() {
            try {
                const res = await fetch('/api/userInfo');
                const data = await res.json();
                setLinkImg(data.allUsers);
                console.log(data);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        }

        fetchUserProfile();
    }, []);
    return (
        <div className="main relative w-full h-screen flex flex-row bg-gray-100 overflow-x-hidden">
            <Aside />
            <main className="py-2 px-2 scrollbar-hide w-full h-screen overflow-y-scroll">
                <section className="main-section bg-white h-auto relative w-full rounded-lg shadow-md">
                    <HeaderSectionBody
                        title="Absensi"
                        profile="UP" />
                    <div className="main-section_body p-5">
                        <div className="main-section_content">
                            <div className="content-head">
                                <h1 className="text-xl font-bold">Dashboard Absensi</h1>
                            </div>

                            <div className="content-body mt-10">
                                <div className="leaderboard shadow-md rounded-md p-5 mb-10">
                                    <div className="leaderboard_head flex items-center mb-4">
                                        <h2 className="text-xl font-bold">Leaderboard Absensi</h2>
                                    </div>
                                    <div className="leaderboard_body ">
                                        <div className="card_users flex md:flex-row flex-col w-full">
                                            {leaderboard.map((user, index) => (
                                                <div key={index} className="card_user transition-transform duration-300 ease-out hover:scale-105 w-full mx-2 flex items-center p-5 border border-1 border-black/10 rounded-md mb-2">
                                                    <div className="rank w-10 h-10 flex items-center justify-center bg-gray-300 rounded-full mr-4">{index + 1}</div>
                                                    <div className="profile w-15 h-15 rounded-full bg-gray-300 mr-4">
                                                        {(() => {
                                                            const matched = linkImg.find(img => img.nama === user.nama);

                                                            if (!matched) {
                                                                console.warn(`Gagal mencari gambar untuk: "${user.nama}"`);
                                                            } else {
                                                                console.log(`Berhasil menemukan gambar untuk: "${matched.nama}"`);
                                                            }

                                                            return (
                                                                <Image
                                                                    width={60}
                                                                    height={60}
                                                                    priority={true}
                                                                    className="profile_img w-full h-full rounded-full object-cover"
                                                                    src={`/pengurus/${matched?.linkimg}`}
                                                                    alt={`${user.nama}'s profile picture`}
                                                                />
                                                            );
                                                        })()}
                                                    </div>
                                                    <div className="user_info md:w-1/2 w-1/3">
                                                        <p className="name font-bold">{user.nama}</p>
                                                        <p className="status text-sm text-gray-600/80">Total Kehadiran: {user.hadir}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full flex justify-end"><ExportTableButton /></div>
                                <div className="content-body_data p-5">
                                    <div className="head flex ">
                                        <div className="dataView w-screen">
                                            <div className="hidden lg:block overflow-x-auto border border-1 border-black/10 rounded-md">
                                                <table id="table-data" className="min-w-full divide-y divide-gray-200 table-fixed shadow-lg">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th scope="col" className="px-4 py-2 text-left text-sm font-medium text-gray-700">No</th>
                                                            <th scope="col" className="px-4 py-2 text-left text-sm font-medium text-gray-700">Nama Lengkap</th>
                                                            <th scope="col" className="px-4 py-2 text-left text-sm font-medium text-gray-700">Hadir</th>
                                                            <th scope="col" className="px-4 py-2 text-left text-sm font-medium text-gray-700">Izin</th>
                                                            <th scope="col" className="px-4 py-2 text-left text-sm font-medium text-gray-700">Sakit</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {leaderboardAll.map((data, idx) => (
                                                            <tr key={idx} className="even:bg-gray-50">
                                                                <td className="px-4 py-2 text-sm text-gray-700">{(page - 1) * 10 + idx + 1}</td>
                                                                <td className="px-4 py-2 text-sm text-gray-700">{data.nama}</td>
                                                                <td className="px-4 py-2 text-sm text-gray-700">{data.hadir}</td>
                                                                <td className="px-4 py-2 text-sm text-gray-700">{data.izin}</td>
                                                                <td className="px-4 py-2 text-sm text-gray-700">{data.sakit}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                            <div className="dataView_card lg:hidden">
                                                {leaderboardAll.map((data, index) => {
                                                    return (
                                                        <div key={index} className="p-4 border border-1 border-black/10 rounded-md">
                                                            <div className="card_main mb-4">
                                                                <h3 className="text-xl font-bold">{data.nama}</h3>
                                                            </div>
                                                            <div className="card_details grid grid-cols-2">
                                                                <div className="left">
                                                                    <div className="hadir">
                                                                        <p className="text-gray-600/80">Hadir : </p>
                                                                        <p className="font-bold">{data.hadir}</p>
                                                                    </div>
                                                                    <div className="izin">
                                                                        <p className="text-gray-600/80">Izin : </p>
                                                                        <p className="font-bold">{data.izin}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="right">
                                                                    <div className="sakit">
                                                                        <p className="text-gray-600/80">Sakit : </p>
                                                                        <p className="font-bold">{data.sakit}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                            <Pagination currentPage={page} onPageChange={setPage} totalPages={totalPages} userLength={dataAnggota.length} totalUsers={totalUsers} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

        </div>
    );
}