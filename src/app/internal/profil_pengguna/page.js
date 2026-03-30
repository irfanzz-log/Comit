'use client';

import Aside from "@/component/internal/Aside";
import HeaderSectionBody from "@/component/internal/HeaderSectionBody";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";

export default function ProfilPengguna() {
    const { user, updateUser } = useAuth();

    const ROUTES = {
        PROFILE: "profile",
        PASSWORD: "password"
    };

    // State
    const [route, setRoute] = useState(ROUTES.PROFILE);
    const [isOpen, setIsOpen] = useState(false);

    // Profile state
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [prodi, setProdi] = useState("Teknologi Informasi");

    // Password state
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const listProdi = [
        "Teknologi Informasi",
        "Sistem Informasi",
        "Software Enginner",
        "Akuntansi",
        "Manajemen",
        "Hukum"
    ];

    // Handlers
    function handleRoute(r) {
        setRoute(r);
    }

    function handleProdiButton(p) {
        setProdi(p);
        setIsOpen(false);
    }

    // Submit profile
    async function handleProfileSubmit(e) {
        e.preventDefault();
        setLoading(true);

        try {
            const fieldToUpdate = {};

            if (name) fieldToUpdate.name = name;
            if (email) fieldToUpdate.email = email;
            if (phone) fieldToUpdate.phone = phone;
            if (prodi) fieldToUpdate.prodi = prodi;

            await fetch('/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(fieldToUpdate)
            });

            updateUser({
                nama: name || user.nama,
                email: email || user.email,
                phone: phone || user.phone,
                jurusan: prodi || user.jurusan
            });
        } 
        finally {
            setLoading(false);
            setName("");
            setEmail("");
            setPhone("");
        }
    }

    // Submit password
    async function handlePasswordSubmit(e) {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            alert("Konfirmasi password tidak cocok");
            return;
        }

        setLoading(true);

        try {
            // await fetch('/api/user/password', ...)
            await fetch('/api/users/password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ old_password: oldPassword, new_password: newPassword })
            });
        } finally {
            setLoading(false);
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        }
    }

    return (
        <div className="main relative w-full h-screen flex flex-row bg-gray-100 overflow-x-hidden">
            <Aside />

            <main className="py-2 px-2 w-full h-screen overflow-y-scroll">
                <section className="bg-white min-h-screen w-full rounded-lg shadow-md">
                    
                    <HeaderSectionBody title="Profil Pengguna" />

                    <div className="p-5">
                        {/* Header */}
                        <div>
                            <h1 className="font-bold text-2xl">Pengaturan</h1>
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
                                            onClick={() => handleRoute(ROUTES.PROFILE)}
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
                                            onClick={() => handleRoute(ROUTES.PASSWORD)}
                                            className="text-sm cursor-pointer"
                                        >
                                            Password
                                        </p>
                                    </li>
                                </ul>
                            </div>

                            {/* CONTENT */}
                            <div className="w-full md:px-8 px-3">

                                {route === ROUTES.PROFILE ? (
                                    <>
                                        <h2 className="font-bold text-xl">Informasi Profile</h2>
                                        <p className="text-sm text-gray-600">
                                            Perbarui Informasi Akun
                                        </p>

                                        <form onSubmit={handleProfileSubmit} className="mt-5">

                                            <div className="flex flex-col mt-2">
                                                <label className="text-sm">Nama Lengkap</label>
                                                <input
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    className="border rounded-lg p-2 text-sm"
                                                />
                                            </div>

                                            <div className="flex flex-col mt-2">
                                                <label className="text-sm">Email</label>
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="border rounded-lg p-2 text-sm"
                                                />
                                            </div>

                                            <div className="flex flex-col mt-2">
                                                <label className="text-sm">No Phone</label>
                                                <input
                                                    value={phone}
                                                    type="number"
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    className="border rounded-lg p-2 text-sm"
                                                />
                                            </div>

                                            {/* Dropdown */}
                                            <div className="flex flex-col mt-2 relative">
                                                <label className="text-sm">Jurusan</label>

                                                <button
                                                    type="button"
                                                    onClick={() => setIsOpen(prev => !prev)}
                                                    className="border rounded-lg p-2 text-left"
                                                >
                                                    {prodi}
                                                </button>

                                                {isOpen && (
                                                    <ul className="absolute top-full left-0 w-full bg-white shadow-lg rounded-lg z-10">
                                                        {listProdi.map((p, i) => (
                                                            <li key={i}>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleProdiButton(p)}
                                                                    className="w-full text-left p-2 hover:bg-gray-100"
                                                                >
                                                                    {p}
                                                                </button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="mt-4 p-2 px-3 bg-black text-white rounded-lg"
                                            >
                                                {loading ? "Menyimpan..." : "Simpan Perubahan"}
                                            </button>
                                        </form>
                                    </>
                                ) : (
                                    <>
                                        <h2 className="font-bold text-xl">Perbarui Password</h2>
                                        <p className="text-sm text-gray-600">
                                            Gunakan password yang kuat
                                        </p>

                                        <form onSubmit={handlePasswordSubmit} className="mt-5">

                                            <div className="flex flex-col mt-2">
                                                <label>Password Lama</label>
                                                <input
                                                    type="password"
                                                    value={oldPassword}
                                                    onChange={(e) => setOldPassword(e.target.value)}
                                                    className="border rounded-lg p-2"
                                                />
                                            </div>

                                            <div className="flex flex-col mt-2">
                                                <label>Password Baru</label>
                                                <input
                                                    type="password"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    className="border rounded-lg p-2"
                                                />
                                            </div>

                                            <div className="flex flex-col mt-2">
                                                <label>Konfirmasi Password</label>
                                                <input
                                                    type="password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    className="border rounded-lg p-2"
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="mt-4 p-2 px-3 bg-black text-white rounded-lg"
                                            >
                                                {loading ? "Menyimpan..." : "Simpan Perubahan"}
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