"use client";

import Aside from "@/component/internal/Aside";
import HeaderSectionBody from "@/component/internal/HeaderSectionBody";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";

export default function ProfilPengguna() {
    const { user, updateUser } = useAuth();

    const ROUTES = {
        PROFILE: "profile",
        PASSWORD: "password",
    };

    // State
    const [route, setRoute] = useState(ROUTES.PROFILE);

    // Dropdown jurusan
    const [isOpen, setIsOpen] = useState(false);

    // Dropdown minat keahlian
    const [isMinatOpen, setIsMinatOpen] = useState(false);

    // Profile state
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [prodi, setProdi] = useState(
        user?.jurusan || "Teknologi Informasi"
    );
    const [minat, setMinat] = useState(
        user?.minat || ""
    );

    // Password state
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const listProdi = [
        "Teknologi Informasi",
        "Sistem Informasi",
        "Software Enginner",
        "Akuntansi",
        "Manajemen",
        "Hukum",
    ];

    const listMinat = [
        "Office",
        "Programming",
        "Comnet",
        "Design",
    ];

    // ==========================================
    // HANDLERS
    // ==========================================

    function handleRoute(r) {
        setRoute(r);
        setError("");
        setMessage("");
    }

    function handleProdiButton(p) {
        setProdi(p);
        setIsOpen(false);
    }

    function handleMinatButton(m) {
        setMinat(m);
        setIsMinatOpen(false);
    }

    // ==========================================
    // UPDATE PROFILE
    // ==========================================

    async function handleProfileSubmit(e) {
        e.preventDefault();

        setLoading(true);
        setError("");
        setMessage("");

        try {
            const fieldToUpdate = {};

            if (name.trim()) {
                fieldToUpdate.name = name.trim();
            }

            if (phone.trim()) {
                fieldToUpdate.phone = phone.trim();
            }

            if (prodi) {
                fieldToUpdate.prodi = prodi;
            }

            if (minat) {
                fieldToUpdate.minat = minat;
            }

            const res = await fetch("/api/users/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(fieldToUpdate),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(
                    result.error ||
                    result.message ||
                    "Gagal memperbarui profile"
                );
            }

            // ==========================================
            // UPDATE AUTH CONTEXT
            // ==========================================

            updateUser({
                nama: name || user?.nama,
                phone: phone || user?.phone,
                jurusan: prodi || user?.jurusan,
                minat: minat || user?.minat,
            });

            // ==========================================
            // NOTIFIKASI SUKSES
            // ==========================================

            setMessage(
                "Profile berhasil diperbarui."
            );

            // Reset input
            setName("");
            setPhone("");

        } catch (error) {
            console.error(
                "Update profile error:",
                error
            );

            setError(
                error.message ||
                "Gagal memperbarui profile."
            );
        } finally {
            setLoading(false);
        }
    }

    // ==========================================
    // UPDATE PASSWORD
    // ==========================================

    async function handlePasswordSubmit(e) {
        e.preventDefault();

        setError("");
        setMessage("");

        if (
            !oldPassword ||
            !newPassword ||
            !confirmPassword
        ) {
            setError("Semua field harus diisi");
            return;
        }

        if (newPassword.length < 8) {
            setError(
                "Password harus memiliki minimal 8 karakter"
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            setError(
                "Konfirmasi password tidak cocok"
            );
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(
                "/api/users/password",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        old_password: oldPassword,
                        new_password: newPassword,
                    }),
                }
            );

            const result = await res.json();

            if (!res.ok) {
                throw new Error(
                    result.error ||
                    "Gagal mengubah password"
                );
            }

            setMessage(
                "Password berhasil diperbarui."
            );

            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");

        } catch (error) {
            console.error(
                "Update password error:",
                error
            );

            setError(
                error.message ||
                "Gagal mengubah password."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="main relative w-full h-screen flex flex-row bg-gray-100 overflow-x-hidden">

            <Aside />

            <main className="py-2 px-2 w-full h-screen overflow-y-scroll">

                <section className="bg-white min-h-screen w-full rounded-lg shadow-md">

                    <HeaderSectionBody
                        title="Profil Pengguna"
                    />

                    <div className="p-5">

                        {/* Header */}
                        <div>

                            <h1 className="font-bold text-2xl">
                                Pengaturan
                            </h1>

                            <p className="text-sm text-gray-600">
                                Kelola profile dan pengaturan akun
                            </p>

                        </div>


                        <div className="flex flex-row my-10">

                            {/* Sidebar */}
                            <div className="w-1/3">

                                <ul>

                                    <li
                                        className={`p-2 mt-1 rounded-md ${
                                            route === ROUTES.PROFILE
                                                ? "bg-gray-100"
                                                : "hover:bg-gray-300/10"
                                        }`}
                                    >

                                        <p
                                            onClick={() =>
                                                handleRoute(
                                                    ROUTES.PROFILE
                                                )
                                            }
                                            className="text-sm cursor-pointer"
                                        >
                                            Profile
                                        </p>

                                    </li>


                                    <li
                                        className={`p-2 mt-1 rounded-md ${
                                            route === ROUTES.PASSWORD
                                                ? "bg-gray-100"
                                                : "hover:bg-gray-300/10"
                                        }`}
                                    >

                                        <p
                                            onClick={() =>
                                                handleRoute(
                                                    ROUTES.PASSWORD
                                                )
                                            }
                                            className="text-sm cursor-pointer"
                                        >
                                            Password
                                        </p>

                                    </li>

                                </ul>

                            </div>


                            {/* CONTENT */}
                            <div className="w-full md:px-8 px-3">

                                {/* ==========================================
                                    PROFILE
                                ========================================== */}

                                {route === ROUTES.PROFILE ? (

                                    <>

                                        <h2 className="font-bold text-xl">
                                            Informasi Profile
                                        </h2>

                                        <p className="text-sm text-gray-600">
                                            Perbarui Informasi Akun
                                        </p>


                                        {/* SUCCESS */}
                                        {message && (
                                            <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
                                                {message}
                                            </div>
                                        )}


                                        {/* ERROR */}
                                        {error && (
                                            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                                                {error}
                                            </div>
                                        )}


                                        <form
                                            onSubmit={
                                                handleProfileSubmit
                                            }
                                            className="mt-5"
                                        >

                                            {/* NAMA */}
                                            <div className="flex flex-col mt-2">

                                                <label className="text-sm">
                                                    Nama Lengkap
                                                </label>

                                                <input
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) =>
                                                        setName(
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder={
                                                        user?.nama ||
                                                        "Nama Lengkap"
                                                    }
                                                    className="border-[1px] border-gray-200 rounded-lg p-2 text-sm"
                                                />

                                            </div>


                                            {/* NO TELEPHONE */}
                                            <div className="flex flex-col mt-2">

                                                <label className="text-sm">
                                                    No Telephone
                                                </label>

                                                <input
                                                    type="text"
                                                    inputMode="tel"
                                                    value={phone}
                                                    onChange={(e) =>
                                                        setPhone(
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder={
                                                        user?.phone ||
                                                        "08xxxxxxxxxx"
                                                    }
                                                    className="border-[1px] border-gray-200 rounded-lg p-2 text-sm"
                                                />

                                            </div>


                                            {/* JURUSAN */}
                                            <div className="flex flex-col mt-2 relative">

                                                <label className="text-sm">
                                                    Jurusan
                                                </label>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setIsOpen(
                                                            (prev) =>
                                                                !prev
                                                        )
                                                    }
                                                    className="border-[1px] border-gray-200 rounded-lg p-2 text-left flex justify-between items-center hover:bg-gray-100"
                                                >

                                                    {prodi}

                                                    <span className="float-right">

                                                        {isOpen ? (

                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="16"
                                                                height="16"
                                                                fill="currentColor"
                                                                viewBox="0 0 16 16"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M7.776 5.553a.5.5 0 0 1 .448 0l6 3a.5.5 0 1 1-.448.894L8 6.56 2.224 9.447a.5.5 0 1 1-.448-.894z"
                                                                />
                                                            </svg>

                                                        ) : (

                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="16"
                                                                height="16"
                                                                fill="currentColor"
                                                                viewBox="0 0 16 16"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M1.553 6.776a.5.5 0 0 1 .67-.223L8 9.44l5.776-2.888a.5.5 0 1 1 .448.894l-6 3a.5.5 0 0 1-.448 0l-6-3a.5.5 0 0 1-.223-.67"
                                                                />
                                                            </svg>

                                                        )}

                                                    </span>

                                                </button>


                                                {isOpen && (

                                                    <ul className="absolute top-full left-0 w-full bg-white shadow-lg rounded-lg z-10">

                                                        {listProdi.map(
                                                            (p, i) => (

                                                                <li
                                                                    key={i}
                                                                >

                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            handleProdiButton(
                                                                                p
                                                                            )
                                                                        }
                                                                        className="w-full text-left p-2 hover:bg-gray-100"
                                                                    >
                                                                        {p}
                                                                    </button>

                                                                </li>

                                                            )
                                                        )}

                                                    </ul>

                                                )}

                                            </div>


                                            {/* MINAT KEAHLIAN */}
                                            <div className="flex flex-col mt-2 relative">

                                                <label className="text-sm">
                                                    Minat Keahlian
                                                </label>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setIsMinatOpen(
                                                            (prev) =>
                                                                !prev
                                                        )
                                                    }
                                                    className="border-[1px] border-gray-200 rounded-lg p-2 text-left flex justify-between items-center hover:bg-gray-100"
                                                >

                                                    {minat ||
                                                        "Pilih Minat Keahlian"}

                                                    <span className="float-right">

                                                        {isMinatOpen ? (

                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="16"
                                                                height="16"
                                                                fill="currentColor"
                                                                viewBox="0 0 16 16"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M7.776 5.553a.5.5 0 0 1 .448 0l6 3a.5.5 0 1 1-.448.894L8 6.56 2.224 9.447a.5.5 0 1 1-.448-.894z"
                                                                />
                                                            </svg>

                                                        ) : (

                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="16"
                                                                height="16"
                                                                fill="currentColor"
                                                                viewBox="0 0 16 16"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M1.553 6.776a.5.5 0 0 1 .67-.223L8 9.44l5.776-2.888a.5.5 0 1 1 .448.894l-6 3a.5.5 0 0 1-.448 0l-6-3a.5.5 0 0 1-.223-.67"
                                                                />
                                                            </svg>

                                                        )}

                                                    </span>

                                                </button>


                                                {isMinatOpen && (

                                                    <ul className="absolute top-full left-0 w-full bg-white shadow-lg rounded-lg z-10">

                                                        {listMinat.map(
                                                            (m, i) => (

                                                                <li
                                                                    key={i}
                                                                >

                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            handleMinatButton(
                                                                                m
                                                                            )
                                                                        }
                                                                        className="w-full text-left p-2 hover:bg-gray-100"
                                                                    >
                                                                        {m}
                                                                    </button>

                                                                </li>

                                                            )
                                                        )}

                                                    </ul>

                                                )}

                                            </div>


                                            {/* BUTTON */}
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="mt-4 p-2 px-3 bg-black text-white rounded-lg disabled:opacity-50"
                                            >

                                                {loading
                                                    ? "Menyimpan..."
                                                    : "Simpan Perubahan"}

                                            </button>

                                        </form>

                                    </>

                                ) : (

                                    /* ==========================================
                                       PASSWORD
                                    ========================================== */

                                    <>

                                        <h2 className="font-bold text-xl">
                                            Perbarui Password
                                        </h2>

                                        <p className="text-sm text-gray-600">
                                            Gunakan password yang kuat
                                        </p>


                                        {/* SUCCESS */}
                                        {message && (
                                            <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
                                                {message}
                                            </div>
                                        )}


                                        {/* ERROR */}
                                        {error && (
                                            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                                                {error}
                                            </div>
                                        )}


                                        <form
                                            onSubmit={
                                                handlePasswordSubmit
                                            }
                                            className="mt-5"
                                        >

                                            {/* OLD PASSWORD */}
                                            <div className="flex flex-col mt-2">

                                                <label className="text-sm">
                                                    Password Lama
                                                </label>

                                                <input
                                                    type="password"
                                                    value={oldPassword}
                                                    onChange={(e) =>
                                                        setOldPassword(
                                                            e.target.value
                                                        )
                                                    }
                                                    className="border-[1px] border-gray-200 rounded-lg p-2"
                                                />

                                            </div>


                                            {/* NEW PASSWORD */}
                                            <div className="flex flex-col mt-2">

                                                <label className="text-sm">
                                                    Password Baru
                                                </label>

                                                <input
                                                    type="password"
                                                    value={newPassword}
                                                    onChange={(e) =>
                                                        setNewPassword(
                                                            e.target.value
                                                        )
                                                    }
                                                    className="border-[1px] border-gray-200 rounded-lg p-2"
                                                />

                                            </div>


                                            {/* CONFIRM PASSWORD */}
                                            <div className="flex flex-col mt-2">

                                                <label className="text-sm">
                                                    Konfirmasi Password
                                                </label>

                                                <input
                                                    type="password"
                                                    value={confirmPassword}
                                                    onChange={(e) =>
                                                        setConfirmPassword(
                                                            e.target.value
                                                        )
                                                    }
                                                    className="border-[1px] border-gray-200 rounded-lg p-2"
                                                />

                                            </div>


                                            {/* BUTTON */}
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="mt-4 p-2 px-3 bg-black text-white rounded-lg disabled:opacity-50"
                                            >

                                                {loading
                                                    ? "Menyimpan..."
                                                    : "Simpan Perubahan"}

                                            </button>

                                        </form>

                                    </>

                                )}

                            </div>

                        </div>

                    </div>

                </section>

            </main>

        </div>
    );
}