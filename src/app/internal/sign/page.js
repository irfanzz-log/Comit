"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const jurusanOptions = [
    'Teknologi Informasi',
    'Manajemen',
    'Akuntansi',
    'Sistem Informasi'
];

export default function SignPage() {
    const [selectedJurusan, setSelectedJurusan] = useState('Pilih Jurusan');
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="login-page-container w-full h-screen bg-blue-500 flex flex-col justify-center items-center">
            <div className="login-page md:w-1/2 w-full md:h-auto h-full p-10 flex flex-col justify-center items-center">
                <div className="login-page_header flex flex-row justify-center items-center mb-5">
                    <Image
                        src="/logo/commitLogo.png"
                        width={300}
                        height={300}
                        alt="comit logo"
                        className="max-w-1/4"
                    />
                    <div className="header_body p-5">
                        <h1 className="text-white font-bold text-xl">Daftar akun COMIT</h1>
                        <p className="text-white text-sm">Harap masukkan data valid!</p>
                    </div>
                </div>
                <div className="login-page_body w-full">
                    <form className="">
                        <div className="form-input flex md:flex-row flex-col gap-5">
                            <div className="left-side md:w-1/2 w-full">
                                <div className="name w-full my-3">
                                    <label htmlFor="name" className="text-white ">
                                        Nama Lengkap
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        placeholder="Nama Lengkap"
                                        className="text-sm p-2 w-full bg-white rounded-lg shadow-xl focus:ring-white focus:outline-none focus:ring-2"
                                    />
                                </div>

                                <div className="npm w-full md:my-3">
                                    <label htmlFor="npm" className="text-white ">
                                        NPM
                                    </label>
                                    <input
                                        type="number"
                                        id="npm"
                                        name="npm"
                                        placeholder="NPM"
                                        className="text-sm p-2 w-full bg-white rounded-lg shadow-xl focus:ring-white focus:outline-none focus:ring-2"
                                    />
                                </div>

                            </div>

                            <div className="right-side md:w-1/2 w-full">

                                <div className="npm w-full md:my-3">
                                    <label htmlFor="noTelpon" className="text-white ">
                                        Nomor Whatsapp
                                    </label>
                                    <input
                                        type="number"
                                        id="noTelpon"
                                        name="noTelpon"
                                        placeholder="Nomor Whatsapp"
                                        className="text-sm p-2 w-full bg-white rounded-lg shadow-xl focus:ring-white focus:outline-none focus:ring-2"
                                    />
                                </div>

                                <div className="jurusan w-full relative my-3">
                                    <label htmlFor="" className="text-white">Jurusan</label>
                                    <div className="jurusan-option w-full relative flex justify-between items-center bg-white p-2 rounded-lg shadow-xl cursor-pointer focus:ring-white focus:outline-none focus:ring-2"
                                        onClick={() => setIsOpen(!isOpen)}
                                    >
                                        <p className="text-sm text-gray-500">{selectedJurusan}</p>
                                        {isOpen ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="text-gray-400 bi bi-caret-down-fill" viewBox="0 0 16 16">
                                            <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                                        </svg>
                                        ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="text-gray-400 bi bi-caret-up-fill" viewBox="0 0 16 16">
                                            <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                                        </svg>
                                        )}
                                    </div>
                                    {isOpen && (
                                        <ul className={`absolute jurusan-dropdown bg-white mt-1 rounded-lg shadow-xl w-full p-2`}>
                                            {jurusanOptions.map((jurusan, index) => (
                                                <li
                                                    key={index}
                                                    className="jurusan-item text-gray-500 text-sm p-2 hover:bg-blue-500 hover:text-white rounded-md cursor-pointer"
                                                    onClick={() => (setSelectedJurusan(jurusan), setIsOpen(false))}
                                                >
                                                    {jurusan}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="text-form">
                            <label htmlFor="" className="text-white">Alasan mengikuti</label>
                            <textarea name="" id="" placeholder="Alasan mengikuti organisasi ini" className="text-sm w-full bg-white p-2 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-white resize-none mt-2" rows="4">
                            </textarea>
                        </div>

                        <button className="w-full bg-white text-blue-500 p-2 rounded-lg my-3 cursor-pointer hover:scale-102 transition transition-duration-300 ease-out">
                            Ajukan Pendaftaran
                        </button>

                        <div className="form-footer text-center">
                            <p className="text-white text-sm">
                                Sudah punya akun?{" "}
                                <Link href="/internal/login" className="font-bold underline">
                                    Masuk disini
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
