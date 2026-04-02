"use client"

import Aside from "@/component/internal/Aside";
import HeaderSectionBody from "@/component/internal/HeaderSectionBody";
import ToggleFilterButton from "@/hooks/ui/useToggleFilter";
import useUserFilter from "@/hooks/useAttendanceFilter";
import Pagination from "@/hooks/ui/pagination";
import { useEffect, useRef } from "react";

export default function DataAbsensi() {
    const { name, setName, dataAnggota, page, setPage, totalPages, totalUsers, toggleStatusAbsen, setToggleStatusAbsen, togglePosisi, setTogglePosisi, handleToggleFilter, filterOpen, setFilterOpen, statusOptions, posisiOptions, handleSearch, toggleAcara, setToggleAcara, acaraOptions } = useUserFilter();
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setFilterOpen({ status_absen: false, posisi: false, acara: false });
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="main relative w-full h-screen flex flex-row bg-gray-100 overflow-x-hidden">
            <Aside />
            <main className="py-2 px-2 scrollbar-hide w-full h-screen overflow-y-scroll">
                <section className="main-section bg-white h-screen relative w-full rounded-lg shadow-md">
                    <HeaderSectionBody
                        title="Data Absensi"
                        />
                    <div className="main-section_body p-5 bg-white">
                        <div className="main-section_content">
                            <div className="content-head">
                                <h1 className="text-xl font-bold">Data Absensi</h1>
                            </div>
                            <div className="content-body">
                                <div className="dataFilter p-2">
                                    <form onSubmit={handleSearch} className="flex flex-row md:p-2 w-full">
                                        <input type="text" name="searchName" className=" p-2 py-3 focus:outline-none focus:ring-blue-600/50 focus:border-blue-600/50 border-[0.5px] border-gray-600/10 w-full rounded-lg text-sm text-gray-600 outline-none focus:border-1 focus:ring-2 focus:ring-gray-600/20 shadow-sm" placeholder="Cari nama..." value={name} onChange={(e) => setName(e.target.value)} />
                                    </form>

                                    <div ref={dropdownRef} className="flex md:flex-row md:ml-0 ml-1 flex-col w-full text-sm items-center md:items-start mt-2 mb-2">

                                        <ToggleFilterButton handleToggleFilter={(e) => handleToggleFilter(e, 'posisi')} type="posisi" filterOpen={filterOpen} options={posisiOptions} setToggle={setTogglePosisi} toggle={togglePosisi} setPage={setPage} />

                                        <ToggleFilterButton handleToggleFilter={(e) => handleToggleFilter(e, 'status_absen')} type="status_absen" filterOpen={filterOpen} options={statusOptions} setToggle={setToggleStatusAbsen} toggle={toggleStatusAbsen} setPage={setPage} />

                                        <ToggleFilterButton handleToggleFilter={(e) => handleToggleFilter(e, 'acara')} type="acara" filterOpen={filterOpen} options={acaraOptions} setToggle={setToggleAcara} toggle={toggleAcara} setPage={setPage} />

                                        <div className="relative md:w-2/3 w-full m-2">
                                            <button onClick={() => {
                                                setToggleStatusAbsen('Filter by status absen');
                                                setTogglePosisi('Filter by posisi');
                                                setToggleAcara('Filter by acara');
                                                setName('');
                                            }} className="md:ml-0 -ml-1 relative bg-white border-[0.5px] border-gray-600/10 rounded-md p-2 shadow-sm w-full text-left">
                                                Reset Filter
                                            </button>
                                        </div>

                                    </div>
                                </div>
                                <div className="content-body_data p-5">
                                    <div className="head flex ">
                                        <div className="dataView w-screen">
                                            <div className="hidden lg:block overflow-x-auto border border-1 border-black/10 rounded-md">
                                                <table className="min-w-full divide-y divide-gray-200 table-fixed shadow-lg">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th scope="col" className="px-4 py-2 text-left text-sm font-medium text-gray-700">No</th>
                                                            <th scope="col" className="px-4 py-2 text-left text-sm font-medium text-gray-700">Nama Lengkap</th>
                                                            <th scope="col" className="px-4 py-2 text-left text-sm font-medium text-gray-700">Posisi</th>
                                                            <th scope="col" className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                                                            <th scope="col" className="px-4 py-2 text-left text-sm font-medium text-gray-700">Keterangan</th>
                                                            <th scope="col" className="px-4 py-2 text-left text-sm font-medium text-gray-700">Acara</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {dataAnggota.map((data, idx) => (
                                                            <tr key={idx} className="even:bg-gray-50">
                                                                <td className="px-4 py-2 text-sm text-gray-700">{(page - 1) * 10 + idx + 1}</td>
                                                                <td className="px-4 py-2 text-sm text-gray-700">{data.nama}</td>
                                                                <td className="px-4 py-2 text-sm text-gray-700">{data.posisi}</td>
                                                                <td className="px-4 py-2 text-sm text-gray-700">{data.status_absen}</td>
                                                                <td className="px-4 py-2 text-sm text-gray-700">{data.keterangan}</td>
                                                                <td className="px-4 py-2 text-sm text-gray-700">{data.acara}</td>
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
                                                                <h3 className="text-xl font-bold">{data.nama}</h3>
                                                            </div>
                                                            <div className="card_details grid grid-cols-2">
                                                                <div className="left">
                                                                    <div className="jurusan">
                                                                        <p className="text-gray-600/80">Status : </p>
                                                                        <p className="font-bold">{data.status_absen}</p>
                                                                    </div>
                                                                    <div className="posisi">
                                                                        <p className="text-gray-600/80">Posisi : </p>
                                                                        <p className="font-bold">{data.posisi}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="right">
                                                                    <div className="statusAbsen">
                                                                        <p className="text-gray-600/80">Keterangan : </p>
                                                                        <p className="font-bold">{data.keterangan}</p>
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