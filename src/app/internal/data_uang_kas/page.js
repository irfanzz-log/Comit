'use client';

import Aside from "@/component/internal/Aside";
import HeaderSectionBody from "@/component/internal/HeaderSectionBody";
import Pagination from "@/hooks/ui/pagination";
import { useEffect } from "react";
import { useRef } from "react";
import useTransactions from "@/hooks/useTransactions";
import { data } from "@/lib/dataMentor";

export default function DataAnggota() {
    const { name, setName, dataAnggota, page, setPage, totalPages, totalUsers, handleSearch } = useTransactions({ tipe: 'Pemasukkan', kategori: 'Kas' });
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setFilterOpen({ status: false, posisi: false, minat: false });
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    console.log(dataAnggota);

    return (
        <div className="main relative w-full h-screen flex flex-row bg-gray-100 overflow-x-hidden">
            <Aside />
            <main className="py-2 px-2 scrollbar-hide w-full h-screen overflow-y-scroll">
                <section className="main-section bg-white h-auto relative w-full rounded-lg shadow-md">
                    <HeaderSectionBody
                        title="Data Uang Kas" />
                    <div className="main-section_body p-5">
                        <div className="main-section_content">
                            <div className="content-head">
                                <h1 className="text-xl font-bold">Data Uang Kas</h1>
                            </div>
                            <div className="content-body">

                                <div className="dataFilter p-2">
                                    <form onSubmit={handleSearch} className="flex flex-row md:p-2 w-full">
                                        <input type="text" name="searchName" className=" p-2 py-3 focus:outline-none focus:ring-blue-600/50 focus:border-blue-600/50 border-[0.5px] border-gray-600/10 w-full rounded-lg text-sm text-gray-600 outline-none focus:border-1 focus:ring-2 focus:ring-gray-600/20 shadow-sm" placeholder="Cari nama..." value={name} onChange={(e) => setName(e.target.value)} />
                                    </form>
                                </div>

                                <div className="content-body_data p-5">
                                    <div className="head flex ">
                                        <div className="dataView w-screen">
                                            <div className="hidden lg:block overflow-x-auto border border-1 border-black/10 rounded-md">
                                                <table className="min-w-full divide-y divide-gray-200 table-fixed shadow-lg">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th scope="col" className="px-4 py-2 text-left text-sm font-medium text-gray-700">No</th>
                                                            <th scope="col" className="px-4 py-2 text-left text-sm font-medium text-gray-700">Penanggung Jawab</th>
                                                            <th scope="col" className="px-4 py-2 text-left text-sm font-medium text-gray-700">Nama</th>
                                                            <th scope="col" className="px-4 py-2 text-left text-sm font-medium text-gray-700">Jumlah</th>
                                                            <th scope="col" className="px-4 py-2 text-left text-sm font-medium text-gray-700">Tanggal Input</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {dataAnggota.map((data, idx) => (
                                                            <tr key={idx} className="even:bg-gray-50">
                                                                <td className="px-4 py-2 text-sm text-gray-700">{(page - 1) * 10 + idx + 1}</td>
                                                                <td className="px-4 py-2 text-sm text-gray-700">{data.nama_penginput}</td>
                                                                <td className="px-4 py-2 text-sm text-gray-700">{data.ditujukan_ke}</td>
                                                                <td className="px-4 py-2 text-sm text-gray-700">Rp{Number(data.jumlah).toLocaleString('id-ID')}</td>
                                                                <td className="px-4 py-2 text-sm text-gray-700">{new Date(data.created_at).toLocaleString('id-ID', {
                                                                    dateStyle: 'medium',
                                                                    timeStyle: 'short'
                                                                })}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="dataView_card lg:hidden">
                                                {dataAnggota.map((data, index) => {
                                                    return (
                                                        <div key={index} className="p-4 border border-1 border-black/10 rounded-md">
                                                            <div className="card_main mb-4">
                                                                <h3 className="text-xl font-bold">{data.nama_penginput}</h3>
                                                                <p className="text-xs text-gray-600/80">Penanggung Jawab</p>
                                                            </div>
                                                            <div className="card_details grid grid-cols-2">
                                                                <div className="left">
                                                                    <div className="jurusan">
                                                                        <p className="text-xs text-gray-600/80">Deskripsi : </p>
                                                                        <p className="font-bold">{data.deskripsi}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="right">
                                                                    <div className="minat">
                                                                        <p className="text-xs text-gray-600/80">Jumlah : </p>
                                                                        <p className="font-bold">{data.jumlah}</p>
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
                    </div >
                </section >
            </main >

        </div >
    );
}