'use client';

import Aside from "@/component/internal/Aside";
import HeaderSectionBody from "@/component/internal/HeaderSectionBody";
import Pagination from "@/hooks/ui/pagination";
import { useEffect } from "react";
import { useRef } from "react";
import useTransactions from "@/hooks/useTransactions";
import ExportTableButton from "@/component/ExportTableButton";
import userInsertTransactions from "@/hooks/useInsertTransactions";
import { useAuth } from "@/app/context/AuthContext";
import { Suspense } from "react";

export function DataAnggota() {
    const { name, setName, dataAnggota, page, setPage, totalPages, totalUsers, handleSearch } = useTransactions({ tipe: 'Pemasukkan', kategori: 'Kas' });
    const dropdownRef = useRef(null);
    const {
        form,
        handleChange,
        submitTransaksi,
        userSuggestions,
        loading,
        pilihUser
    } = userInsertTransactions({ tipe: 'Pemasukkan', kategori: 'Kas' });

    const { user } = useAuth();

    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setFilterOpen({ status: false, posisi: false, minat: false });
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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

                                {(user?.user_role === 'developer' || user?.user_role === 'bendahara') && (
                                    <div className="m-2 flex flex-col justify-center border border-[0.5px] border-gray-300/50 rounded-md p-4 mb-4">
                                        <h2 className="font-bold m-2">Tambah Kas</h2>
                                        <div className="flex flex-col relative m-2">
                                            <label className="">Nama</label>
                                            <input
                                                value={form?.namaUser || ''}
                                                name="namaUser"
                                                onChange={handleChange}
                                                className="w-full bg-white border border-gray-600/20 border-[0.5px] p-2 rounded-md"
                                                type="text"
                                            />

                                            {userSuggestions.length > 0 && (
                                                <div className="absolute top-[70px] left-0 right-0 bg-white border border-gray-300 rounded-md z-[100] shadow-lg">
                                                    {userSuggestions.map(user => (
                                                        <div
                                                            key={user.id}
                                                            onClick={() => pilihUser(user)}
                                                            className="p-3 cursor-pointer hover:bg-blue-50"
                                                        >
                                                            {user.nama}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex md:flex-row flex-col md:m-0 m-2 items-center">
                                            <div className="w-full m-2">
                                                <label className="" htmlFor="">Jumlah</label>
                                                <input name="jumlah" value={form?.jumlah} onChange={handleChange} className="w-full bg-white border border-gray-600/20 border-[0.5px] p-2 rounded-md" type="number" />
                                            </div>

                                            <div className="md:w-1/4 w-full md:2 mx-2">
                                                <label className="invisible" htmlFor="">#</label>
                                                <button onClick={submitTransaksi} disabled={loading} className="w-full bg-blue-600/80 rounded-md p-2 flex items-center justify-center text-white cursor-pointer hover:bg-blue-700/80">
                                                    {loading ? 'Loading...' : 'Input Kas'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>

                        <div className="dataFilter p-2">
                            <form onSubmit={handleSearch} className="flex flex-row md:p-2 w-full mb-4">
                                <input type="text" name="searchName" className=" p-2 py-3 focus:outline-none focus:ring-blue-600/50 focus:border-blue-600/50 border-[0.5px] border-gray-600/10 w-full rounded-lg text-sm text-gray-600 outline-none focus:border-1 focus:ring-2 focus:ring-gray-600/20 shadow-sm" placeholder="Cari nama..." value={name} onChange={(e) => setName(e.target.value)} />
                            </form>
                            <div className="w-full flex justify-end"><ExportTableButton /></div>
                        </div>

                        <div className="content-body_data p-5">
                            <div className="head flex ">
                                <div className="dataView w-screen">
                                    <div className="hidden lg:block overflow-x-auto border border-1 border-black/10 rounded-md">
                                        <table id="table-data" className="min-w-full divide-y divide-gray-200 table-fixed shadow-lg">
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
                </section>
            </main>
        </div >
    );
}

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DataAnggota />
        </Suspense> 
    );

}