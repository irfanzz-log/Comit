"use client";

import { useState } from "react";
import { apiFetch, ApiError } from "@/lib/api";
import PageContainer from "@/component/internal/PageContainer";
import { TextField, SelectField } from "@/component/internal/FormField";
import Button from "@/component/internal/Button";
import Icon from "@/component/internal/Icon";
import { useAuth } from "@/app/context/AuthContext";
import { JURUSAN_OPTIONS, MINAT_OPTIONS } from "@/lib/constants";

const TABS = [
    { value: "profile", label: "Profil" },
    { value: "password", label: "Password" },
];

export default function ProfilPengguna() {
    const { user, updateUser } = useAuth();

    const [route, setRoute] = useState("profile");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [prodi, setProdi] = useState(user?.jurusan || "Teknologi Informasi");
    const [minat, setMinat] = useState(user?.minat || "");

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    function handleRoute(r) {
        setRoute(r);
        setError("");
        setMessage("");
    }

    async function handleProfileSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const fieldToUpdate = {};
            if (name.trim()) fieldToUpdate.name = name.trim();
            if (phone.trim()) fieldToUpdate.phone = phone.trim();
            if (prodi) fieldToUpdate.prodi = prodi;
            if (minat) fieldToUpdate.minat = minat;

            const result = await apiFetch("/api/users/profile", {
                method: "PUT",
                body: JSON.stringify(fieldToUpdate),
            });

            updateUser({
                nama: name || user?.nama,
                phone: phone || user?.phone,
                jurusan: prodi || user?.jurusan,
                minat: minat || user?.minat,
            });

            setMessage("Profile berhasil diperbarui.");
            setName("");
            setPhone("");
        } catch (err) {
            setError(err instanceof ApiError ? err.message : "Gagal memperbarui profile.");
        } finally {
            setLoading(false);
        }
    }

    async function handlePasswordSubmit(e) {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!oldPassword || !newPassword || !confirmPassword) {
            setError("Semua field harus diisi.");
            return;
        }
        if (newPassword.length < 8) {
            setError("Password harus memiliki minimal 8 karakter.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("Konfirmasi password tidak cocok.");
            return;
        }

        setLoading(true);

        try {
            await apiFetch("/api/users/password", {
                method: "PUT",
                body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
            });

            setMessage("Password berhasil diperbarui.");
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            setError(err instanceof ApiError ? err.message : "Gagal mengubah password.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <PageContainer
            title="Profil Pengguna"
            subtitle="Kelola informasi akun dan keamanan"
        >
            <div className="flex flex-row gap-2 border-b border-gray-100">
                {TABS.map((tab) => (
                    <button
                        key={tab.value}
                        type="button"
                        onClick={() => handleRoute(tab.value)}
                        className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                            route === tab.value
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-900"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="max-w-2xl">
                {message ? (
                    <div className="mb-4 px-4 py-3 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm flex items-center gap-2">
                        <Icon name="check" size={16} />
                        {message}
                    </div>
                ) : null}

                {error ? (
                    <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm flex items-center gap-2">
                        <Icon name="alert" size={16} />
                        {error}
                    </div>
                ) : null}

                {route === "profile" ? (
                    <form onSubmit={handleProfileSubmit} className="space-y-4">
                        <TextField
                            label="Nama Lengkap"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={user?.nama || "Masukkan nama"}
                            maxLength={100}
                        />

                        <TextField
                            label="Nomor Telepon"
                            name="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder={user?.no_telpon || "08xxxxxxxxxx"}
                            maxLength={100}
                        />

                        <SelectField
                            label="Jurusan / Program Studi"
                            name="prodi"
                            options={JURUSAN_OPTIONS}
                            value={prodi}
                            onChange={(e) => setProdi(e.target.value)}
                        />

                        <SelectField
                            label="Minat Keahlian"
                            name="minat"
                            options={MINAT_OPTIONS}
                            value={minat}
                            onChange={(e) => setMinat(e.target.value)}
                            placeholder="Pilih minat keahlian"
                        />

                        <div className="pt-2">
                            <Button type="submit" loading={loading}>
                                Simpan Perubahan
                            </Button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <TextField
                            label="Password Lama"
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                        <TextField
                            label="Password Baru"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            hint="Minimal 8 karakter."
                        />
                        <TextField
                            label="Konfirmasi Password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />

                        <div className="pt-2">
                            <Button type="submit" loading={loading}>
                                Perbarui Password
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </PageContainer>
    );
}
