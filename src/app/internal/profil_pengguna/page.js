'use client';

import Aside from "@/component/internal/Aside";
import HeaderSectionBody from "@/component/internal/HeaderSectionBody";
import { useState } from "react";

export default function ProfilPengguna() {

    // State default list
    const [prodi, setProdi] = useState("Teknologi Informasi");

    // Control active route
    const [route, setRoute] = useState("profile");

    // Control Dropdown event
    const [isOpen, setIsOpen] = useState(false);

    // Option List
    const listProdi = [
        "Teknologi Informasi",
        "Sistem Informasi",
        "Software Enginner",
        "Akuntansi",
        "Manajemen",
        "Hukum"];

    /** 
        * Change route
        * @param {string} route - Route name
    */
    function handleRoute(route) {
        setRoute(route);
    }

    /**
     * 
     * @param {string} prodi - Name of prodi if selected 
     */
    function handleProdiButton(prodi) {
        setProdi(prodi);
        setIsOpen(!isOpen);
    }

    return (
        <div className="main relative w-full h-screen flex flex-row bg-gray-100 overflow-x-hidden">
            <Aside />
            <main className="py-2 px-2 scrollbar-hide w-full h-screen overflow-y-scroll">
                <section className="main-section bg-white min-h-screen relative w-full rounded-lg shadow-md">
                    <HeaderSectionBody
                        title="Profil Pengguna"
                        profile="UP" />
                    <div className="main-section_body p-5">
                        <div className="header">
                            <h1 className="font-bold text-2xl">Pengaturan</h1>
                            <p className="text-sm text-gray-600">Kelola profile dan pengaturan akun</p>
                        </div>
                        <div className="main-section_content flex flex-row my-10">
                            <div className="w-1/3">
                                <ul>
                                    <li className={`p-2 mt-1 ${route === "profile" ? "bg-gray-100" : "hover:bg-gray-300/10"} rounded-md`}><p onClick={() => handleRoute("profile")} className="text-sm cursor-pointer ">Profile</p></li>
                                    <li className={`p-2 mt-1 ${route === "password" ? "bg-gray-100" : "hover:bg-gray-300/10"} rounded-md`}><p onClick={() => handleRoute("password")} className="text-sm cursor-pointer ">Password</p></li>
                                </ul>
                            </div>

                            {route === "profile"

                                ? // If 

                                <div className="w-full md:px-8 px-3">
                                    <h2 className="font-bold text-xl">Informasi Profile</h2>
                                    <p className="text-sm text-gray-600">Perbarui Informasi Akun</p>
                                    <form action="" className="mt-5 w-full">
                                        <div className="nama-lengkap flex flex-col mt-2">
                                            <label htmlFor="" className="text-sm">Nama Lengkap</label>
                                            <input type="text" placeholder="Nama Lengkap" className="border-1 border border-gray-600/10 shadow-lg rounded-lg p-2 text-sm text-gray-600" />
                                        </div>
                                        <div className="email flex flex-col mt-2">
                                            <label htmlFor="" className="text-sm">Email</label>
                                            <input type="email" name="" id="" placeholder="Email" className="border-1 border border-gray-600/10 shadow-lg rounded-lg p-2 text-sm text-gray-600" />
                                        </div>
                                        <div className="whatsapp flex flex-col mt-2">
                                            <label htmlFor="" className="text-sm">No Whatsapp</label>
                                            <input type="number" name="" id="" placeholder="0xxxxxxxxx" className="border-1 border border-gray-600/10 shadow-lg rounded-lg p-2 text-sm text-gray-600" />
                                        </div>
                                        <div className="jurusan flex flex-col mt-2">
                                            <label htmlFor="" className="text-sm">Jurusan</label>
                                            <div className="option relative">
                                                <ul className="shadow-lg">
                                                    <li><p onClick={() => setIsOpen(!isOpen)} className="border-1 border border-gray-600/10 shadow-lg rounded-lg p-2 text-sm text-gray-600 cursor-pointer">{prodi}</p></li>
                                                    {isOpen && listProdi.map((p, index) => {
                                                        return <li key={index}><p onClick={() => handleProdiButton(p)} className="p-2 text-sm text-gray-600 cursor-pointer hover:bg-gray-600/10">{p}</p></li>
                                                    })}
                                                </ul>
                                            </div>
                                        </div>
                                        <button className="p-2 px-3 cursor-pointer bg-black text-white mt-3 rounded-lg shadow-lg text-gray-600 text-sm">Simpan</button>
                                    </form>
                                </div>

                                : // Else 

                                <div className="w-full md:px-8 px-3">
                                    <h2 className="font-bold text-xl">Perbarui Password</h2>
                                    <p className="text-sm text-gray-600">Pastikan menggunakan kombinasi password yang sulit ditebak</p>
                                    <form action="" className="w-full">
                                        <div className="password-lama flex flex-col mt-2">
                                            <label htmlFor="" className=" text-sm">Password Lama</label>
                                            <input type="password" placeholder="Password Lama" className="p-2 border border-gray-600/10 shadow-lg rounded-lg text-sm text-gray-600" />
                                        </div>
                                        <div className="password-baru flex flex-col mt-2">
                                            <label htmlFor="" className=" text-sm">Password Baru</label>
                                            <input type="password" placeholder="Password Baru" className="p-2 border border-gray-600/10 shadow-lg rounded-lg text-sm text-gray-600" />
                                        </div>
                                        <div className="konfirmasi-password flex flex-col mt-2">
                                            <label htmlFor="" className=" text-sm">Konfirmasi Password</label>
                                            <input type="password" placeholder="Konfimasi Password" className="p-2 border border-gray-600/10 shadow-lg rounded-lg text-sm text-gray-600" />
                                        </div>
                                        <button className="mt-5 p-2 px-3 bg-black rounded-lg shadow-lg text-white text-sm  cursor-pointer">Simpan Perubahan</button>
                                    </form>
                                </div>
                            }
                        </div>
                    </div>
                </section>
            </main>

        </div>
    );
}