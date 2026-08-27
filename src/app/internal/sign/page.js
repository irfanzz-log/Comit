"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";


const jurusanOptions = [
    "Teknologi Informasi",
    "Manajemen",
    "Akuntansi",
    "Sistem Informasi",
    "Hukum"
];


export default function SignPage() {

    const [isOpen, setIsOpen] =
        useState(false);


    const [formData, setFormData] =
        useState({
            nama: "",
            npm: "",
            no_telpon: "",
            jurusan: "",
            alasan: "",
        });


    const [loading, setLoading] =
        useState(false);


    // ==================================================
    // HANDLE INPUT
    // ==================================================

    function handleChange(e) {

        const {
            name,
            value,
        } = e.target;


        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }


    // ==================================================
    // HANDLE JURUSAN
    // ==================================================

    function handleJurusan(jurusan) {

        setFormData((prev) => ({
            ...prev,
            jurusan: jurusan,
        }));

        setIsOpen(false);
    }


    // ==================================================
    // SUBMIT
    // ==================================================

    async function handleSubmit(e) {

        e.preventDefault();


        // Jangan kirim kalau belum pilih jurusan
        if (!formData.jurusan) {

            alert(
                "Silakan pilih jurusan terlebih dahulu."
            );

            return;
        }


        try {

            setLoading(true);


            console.log(
                "DATA YANG DIKIRIM:",
                formData
            );


            const res = await fetch(
                "/api/enrollments",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify(
                        formData
                    ),
                }
            );


            const data =
                await res.json();


            if (!res.ok) {

                throw new Error(
                    data.message ||
                    "Gagal mengirim pendaftaran."
                );
            }


            alert(
                data.message ||
                "Pendaftaran berhasil dikirim."
            );


            // Reset form
            setFormData({
                nama: "",
                npm: "",
                no_telpon: "",
                jurusan: "",
                alasan: "",
            });


        } catch (error) {

            console.error(
                "Submit enrollment error:",
                error
            );


            alert(error.message);

        } finally {

            setLoading(false);

        }
    }


    return (

        <div className="login-page-container w-full min-h-screen bg-blue-500 flex flex-col justify-center items-center">

            <div className="login-page md:w-1/2 w-full md:h-auto min-h-screen p-10 flex flex-col justify-center items-center">


                {/* ==========================================
                    HEADER
                ========================================== */}

                <div className="login-page_header flex flex-row justify-center items-center mb-5">

                    <Image
                        src="/logo/commitLogo.png"
                        width={300}
                        height={300}
                        alt="comit logo"
                        className="max-w-1/4"
                    />


                    <div className="header_body p-5">

                        <h1 className="text-white font-bold text-xl">
                            Daftar akun COMIT
                        </h1>

                        <p className="text-white text-sm">
                            Harap masukkan data valid!
                        </p>

                    </div>

                </div>


                {/* ==========================================
                    FORM
                ========================================== */}

                <div className="login-page_body w-full">

                    <form
                        onSubmit={handleSubmit}
                    >


                        <div className="form-input flex md:flex-row flex-col gap-5">


                            {/* ==================================
                                LEFT
                            ================================== */}

                            <div className="left-side md:w-1/2 w-full">


                                {/* NAMA */}

                                <div className="name w-full my-3">

                                    <label
                                        htmlFor="nama"
                                        className="text-white"
                                    >
                                        Nama Lengkap
                                    </label>


                                    <input
                                        type="text"
                                        id="nama"
                                        name="nama"
                                        value={
                                            formData.nama
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Nama Lengkap"
                                        required
                                        className="text-sm p-2 w-full bg-white rounded-lg shadow-xl focus:ring-white focus:outline-none focus:ring-2"
                                    />

                                </div>


                                {/* NPM */}

                                <div className="npm w-full md:my-3">

                                    <label
                                        htmlFor="npm"
                                        className="text-white"
                                    >
                                        NPM
                                    </label>


                                    <input
                                        type="text"
                                        id="npm"
                                        name="npm"
                                        value={
                                            formData.npm
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="NPM"
                                        required
                                        className="text-sm p-2 w-full bg-white rounded-lg shadow-xl focus:ring-white focus:outline-none focus:ring-2"
                                    />

                                </div>

                            </div>


                            {/* ==================================
                                RIGHT
                            ================================== */}

                            <div className="right-side md:w-1/2 w-full">


                                {/* WHATSAPP */}

                                <div className="npm w-full md:my-3">

                                    <label
                                        htmlFor="no_telpon"
                                        className="text-white"
                                    >
                                        Nomor Whatsapp
                                    </label>


                                    <input
                                        type="tel"
                                        id="no_telpon"
                                        name="no_telpon"
                                        value={
                                            formData.no_telpon
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Nomor Whatsapp"
                                        required
                                        className="text-sm p-2 w-full bg-white rounded-lg shadow-xl focus:ring-white focus:outline-none focus:ring-2"
                                    />

                                </div>


                                {/* JURUSAN */}

                                <div className="jurusan w-full relative my-3">

                                    <label className="text-white">
                                        Jurusan
                                    </label>


                                    <div
                                        className="jurusan-option w-full relative flex justify-between items-center bg-white p-2 rounded-lg shadow-xl cursor-pointer"
                                        onClick={() =>
                                            setIsOpen(
                                                !isOpen
                                            )
                                        }
                                    >

                                        <p className="text-sm text-gray-500">

                                            {formData.jurusan ||
                                                "Pilih Jurusan"}

                                        </p>


                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            fill="currentColor"
                                            className="text-gray-400"
                                            viewBox="0 0 16 16"
                                        >

                                            <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />

                                        </svg>

                                    </div>


                                    {isOpen && (

                                        <ul className="absolute z-50 jurusan-dropdown bg-white mt-1 rounded-lg shadow-xl w-full p-2">

                                            {jurusanOptions.map(
                                                (
                                                    jurusan
                                                ) => (

                                                    <li
                                                        key={
                                                            jurusan
                                                        }
                                                        className="jurusan-item text-gray-500 text-sm p-2 hover:bg-blue-500 hover:text-white rounded-md cursor-pointer"
                                                        onClick={() =>
                                                            handleJurusan(
                                                                jurusan
                                                            )
                                                        }
                                                    >
                                                        {
                                                            jurusan
                                                        }
                                                    </li>

                                                )
                                            )}

                                        </ul>

                                    )}

                                </div>

                            </div>

                        </div>


                        {/* ==================================
                            ALASAN
                        ================================== */}

                        <div className="text-form">

                            <label
                                htmlFor="alasan"
                                className="text-white"
                            >
                                Alasan mengikuti
                            </label>


                            <textarea
                                id="alasan"
                                name="alasan"
                                value={
                                    formData.alasan
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Alasan mengikuti organisasi ini"
                                required
                                className="text-sm w-full bg-white p-2 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-white resize-none mt-2"
                                rows="4"
                            />

                        </div>


                        {/* ==================================
                            SUBMIT
                        ================================== */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-blue-500 p-2 rounded-lg my-3 cursor-pointer hover:scale-[1.02] transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >

                            {loading
                                ? "Mengirim..."
                                : "Ajukan Pendaftaran"}

                        </button>


                        {/* ==================================
                            FOOTER
                        ================================== */}

                        <div className="form-footer text-center">

                            <p className="text-white text-sm">

                                Sudah punya akun?{" "}

                                <Link
                                    href="/internal/login"
                                    className="font-bold underline"
                                >
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