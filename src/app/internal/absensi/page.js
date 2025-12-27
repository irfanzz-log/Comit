'use client'

import Aside from "@/component/internal/Aside";
import HeaderSectionBody from "@/component/internal/HeaderSectionBody";
import { anggota } from "@/data/dummy";


export default function Absensi() {
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
                                <h1 className="text-xl font-bold">Data Absensi</h1>
                            </div>
                            <div className="content-body">
                                <form action="" className="flex flex-row w-full my-5">
                                    <input type="text" className="p-2 border-1 border-gray-600/10 w-full rounded-lg text-sm text-gray-600 outline-none focus:border-1 focus:ring-2 focus:ring-gray-600/20 shadow-md" placeholder="Cari nama..." />
                                </form>
                                <div className="content-body_data p-5">
                                    <div className="head flex">
                                        <div className="dataView w-screen">
                                            <div className="hidden lg:block overflow-x-auto">
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
                                                        {anggota.map((item, idx) => (
                                                            <tr key={idx} className="even:bg-gray-50">
                                                                <td className="px-4 py-2 text-sm text-gray-700">{idx + 1}</td>
                                                                <td className="px-4 py-2 text-sm text-gray-700">{item.nama}</td>
                                                                <td className="px-4 py-2 text-sm text-gray-700">{item.npm}</td>
                                                                <td className="px-4 py-2 text-sm text-gray-700">{item.jurusan}</td>
                                                                <td className="px-4 py-2 text-sm text-gray-700">{item.minat}</td>
                                                                <td className="px-4 py-2 text-sm text-gray-700">{item.status}</td>
                                                                <td className="px-4 py-2 text-sm text-gray-700">{item.posisi}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="dataView_card lg:hidden">
                                                {anggota.map((data, index) => {
                                                    return (
                                                        <div key={index} className="p-4 border border-1 border-black/10 rounded-md">
                                                            <div className="card_main mb-4">
                                                                <h3 className="text-xl font-bold">{data.nama}</h3>
                                                                <p className="text-gray-600/80">{data.npm}</p>
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