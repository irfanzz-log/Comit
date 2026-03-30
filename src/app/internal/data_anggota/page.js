'use client';

import Aside from "@/component/internal/Aside";
import HeaderSectionBody from "@/component/internal/HeaderSectionBody";
import Pagination from "@/hooks/ui/pagination";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRef } from "react";

export default function DataAnggota() {
    const searchParams = useSearchParams();

    const [dataAnggota, setDataAnggota] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [name, setName] = useState('');

    const statusOptions = ["Aktif", "Tidak Aktif"];
    const posisiOptions = ["Ketua", "Wakil Ketua", "Sekretaris", "Bendahara", "Koordinator Akademik", "Koordinator Humas", "Koordinator SDM", "Koordinator Prasarana", "Koordinator Kominfo", "SDM", "Humas Internal", "Humas Eksternal", "Prasarana", "Kominfo", "Staff Programming", "Staff Design", "Staff Comnet", "Staff Office"];
    const minatOptions = ["Programming", "Design", "Comnet", "Office"];

    const [toggleStatus, setToggleStatus] = useState('Filter by status');
    const [toggleMinat, setToggleMinat] = useState('Filter by minat');
    const [togglePosisi, setTogglePosisi] = useState('Filter by posisi');

    const [filterOpen, setFilterOpen] = useState({
        status: false,
        posisi: false,
        minat: false,
    });

    function handleToggleFilter(e, type) {
        e.stopPropagation();
        setFilterOpen((prev) => ({
            status: false,
            posisi: false,
            minat: false,
            [type]: !prev[type],
        }));
    }

    // sync URL → state
    const pathPage = searchParams.get('page');
    useEffect(() => {
        if (pathPage) {
            setPage(Number(pathPage));
        }
    }, [pathPage]);

    //search name
    function handleSearch(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const searchName = formData.get('searchName');
        setName(searchName);
    }

    // fetch data saat page berubah
    useEffect(() => {

        const params = new URLSearchParams();
        if (name) params.set('name', name);
        if (toggleStatus !== 'Filter by status') params.set('status', toggleStatus);
        if (togglePosisi !== 'Filter by posisi') params.set('posisi', togglePosisi);
        if (toggleMinat !== 'Filter by minat') params.set('minat', toggleMinat);
        params.set('page', page);

        fetch(`/api/userInfo?${params.toString()}`)
            .then((res) => res.json())
            .then((data) => {
                setDataAnggota(data.users);
                setTotalPages(data.totalPages);
                setTotalUsers(data.totalUsers);
            })
            .catch((error) => console.error('Error fetching data:', error));

        window.history.replaceState(null, '', `?${params.toString()}`);
    }, [page, name, toggleStatus, togglePosisi, toggleMinat]);

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


    return (
        <div className="main relative w-full h-screen flex flex-row bg-gray-100 overflow-x-hidden">
            <Aside />
            <main className="py-2 px-2 scrollbar-hide w-full h-screen overflow-y-scroll">
                <section className="main-section bg-white h-auto relative w-full rounded-lg shadow-md">
                    <HeaderSectionBody
                        title="Anggota" />
                    <div className="main-section_body p-5">
                        <div className="main-section_content">
                            <div className="content-head">
                                <h1 className="text-xl font-bold">Data Anggota</h1>
                            </div>
                            <div className="content-body">

                                <div className="dataFilter p-2">
                                    <form onSubmit={handleSearch} className="flex flex-row md:p-2 w-full">
                                        <input type="text" name="searchName" className=" p-2 py-3 focus:outline-none focus:ring-blue-600/50 focus:border-blue-600/50 border-[0.5px] border-gray-600/10 w-full rounded-lg text-sm text-gray-600 outline-none focus:border-1 focus:ring-2 focus:ring-gray-600/20 shadow-sm" placeholder="Cari nama..." />
                                    </form>

                                    <div ref={dropdownRef} className="flex md:flex-row md:ml-0 ml-1 flex-col w-full text-sm items-center md:items-start mt-2 mb-2">
                                        <div className="relative md:w-2/3 w-full m-2">
                                            <button onClick={(e) => {
                                                handleToggleFilter(e, 'posisi');
                                            }} className="md:ml-0 -ml-1 relative bg-white border-[0.5px] border-gray-600/10 rounded-md p-2 shadow-sm w-full text-left">{togglePosisi}<span className="absolute right-2 top-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down size-4 opacity-50" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg></span></button>
                                            <div className={` ${filterOpen.posisi ? 'block' : 'hidden'} z-10 absolute max-h-60 overflow-y-auto flex flex-col bg-white border-[0.5px] border-gray-600/10 rounded-md w-full p-2 mt-1 shadow-sm`}>
                                                {posisiOptions.map((option) => (
                                                    <button onClick={(e) => {
                                                        setTogglePosisi(option);
                                                        handleToggleFilter(e, 'posisi');
                                                    }} className="text-left hover:bg-blue-200/50 px-2 py-1 rounded-sm" key={option}>{option}</button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="relative md:w-2/3 w-full m-2">
                                            <button onClick={(e) => handleToggleFilter(e, 'minat')} className="md:ml-0 -ml-1 relative bg-white border-[0.5px] border-gray-600/10 rounded-md p-2 shadow-sm w-full text-left">{toggleMinat}<span className="absolute right-2 top-3 "><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down size-4 opacity-50" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg></span></button>
                                            <div className={` ${filterOpen.minat ? 'block' : 'hidden'} z-10 absolute max-h-60 overflow-y-auto flex flex-col bg-white border-[0.5px] border-gray-600/10 rounded-md w-full p-2 mt-1 shadow-sm`}>
                                                {minatOptions.map((option) => (
                                                    <button onClick={(e) => {
                                                        handleToggleFilter(e, 'minat');
                                                        setToggleMinat(option);
                                                    }} className="text-left hover:bg-blue-200/50 px-2 py-1 rounded-sm" key={option}>{option}</button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="relative md:w-2/3 w-full m-2">
                                            <button onClick={(e) => handleToggleFilter(e, 'status')} className="md:ml-0 -ml-1 relative bg-white border-[0.5px] border-gray-600/10 rounded-md p-2 shadow-sm w-full text-left">{toggleStatus}<span className="absolute right-2 top-3 "><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down size-4 opacity-50" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg></span></button>
                                            <div className={` ${filterOpen.status ? 'block' : 'hidden'} z-10 absolute max-h-60 overflow-y-auto flex flex-col bg-white border-[0.5px] border-gray-600/10 rounded-md w-full p-2 mt-1 shadow-sm`}>
                                                {statusOptions.map((option) => (
                                                    <button onClick={(e) => {
                                                        handleToggleFilter(e, 'status');
                                                        setToggleStatus(option);
                                                    }} className="text-left hover:bg-blue-200/50 px-2 py-1 rounded-sm" key={option}>{option}</button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="relative md:w-2/3 w-full m-2">
                                            <button className="md:ml-0 -ml-1 relative bg-white border-[0.5px] border-gray-600/10 rounded-md p-2 shadow-sm w-full text-left" onClick={() => {
                                                setToggleStatus('Filter by status');
                                                setToggleMinat('Filter by minat');
                                                setTogglePosisi('Filter by posisi');
                                                setName('');
                                            }}>
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
                                                            <th scope="col" className="px-4 py-2 text-left text-sm font-medium text-gray-700">NPM</th>
                                                            <th scope="col" className="px-4 py-2 text-left text-sm font-medium text-gray-700">Jurusan</th>
                                                            <th scope="col" className="px-4 py-2 text-left text-sm font-medium text-gray-700">Minat Keahlian</th>
                                                            <th scope="col" className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                                                            <th scope="col" className="px-4 py-2 text-left text-sm font-medium text-gray-700">Posisi</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {dataAnggota.map((data, idx) => (
                                                            <tr key={idx} className="even:bg-gray-50">
                                                                <td className="px-4 py-2 text-sm text-gray-700">{idx + 1}</td>
                                                                <td className="px-4 py-2 text-sm text-gray-700">{data.nama}</td>
                                                                <td className="px-4 py-2 text-sm text-gray-700">{data.user_npm}</td>
                                                                <td className="px-4 py-2 text-sm text-gray-700">{data.jurusan}</td>
                                                                <td className="px-4 py-2 text-sm text-gray-700">{data.minat}</td>
                                                                <td className="px-4 py-2 text-sm text-gray-700">{data.status}</td>
                                                                <td className="px-4 py-2 text-sm text-gray-700">{data.posisi}</td>
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
                                                                <p className="text-gray-600/80">{data.user_npm}</p>
                                                            </div>
                                                            <div className="card_details grid grid-cols-2">
                                                                <div className="left">
                                                                    <div className="jurusan">
                                                                        <p className="text-gray-600/80">Jurusan : </p>
                                                                        <p className="font-bold">{data.jurusan}</p>
                                                                    </div>
                                                                    <div className="popsisi">
                                                                        <p className="text-gray-600/80">Posisi : </p>
                                                                        <p className="font-bold">{data.posisi}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="right">
                                                                    <div className="minat">
                                                                        <p className="text-gray-600/80">Minat : </p>
                                                                        <p className="font-bold">{data.minat}</p>
                                                                    </div>
                                                                    <div className="status">
                                                                        <p className="text-gray-600/80">Status : </p>
                                                                        <p className="font-bold">{data.status}</p>
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