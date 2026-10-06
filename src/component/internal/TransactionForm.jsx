"use client";

import { useState } from "react";
import { apiFetch, ApiError } from "@/lib/api";
import { TextField } from "@/component/internal/FormField";
import Button from "@/component/internal/Button";
import UserSearchInput from "@/component/internal/UserSearchInput";

/**
 * Form bersama untuk halaman pemasukkan, pengeluaran, dan uang kas.
 * `tipe` & `kategori` ditentukan oleh halaman pemanggil.
 */
export default function TransactionForm({ tipe, kategori, title, submitLabel }) {
    const [deskripsi, setDeskripsi] = useState("");
    const [jumlah, setJumlah] = useState("");
    const [targetUserId, setTargetUserId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState(null);

    const withTarget = kategori === "kas";

    async function handleSubmit(e) {
        e.preventDefault();

        const jumlahNum = parseInt(String(jumlah).replace(/\D/g, ""), 10);

        if (!jumlahNum || jumlahNum <= 0) {
            setFeedback({ type: "error", message: "Jumlah harus berupa angka positif." });
            return;
        }

        if (withTarget && !targetUserId) {
            setFeedback({ type: "error", message: "Pilih anggota terlebih dahulu." });
            return;
        }

        setLoading(true);
        setFeedback(null);

        try {
            await apiFetch("/api/inserttransactions", {
                method: "POST",
                body: JSON.stringify({
                    tipe,
                    kategori,
                    jumlah: jumlahNum,
                    deskripsi: deskripsi.trim() || (withTarget ? "Uang Kas" : kategori),
                    target_user_id: withTarget ? targetUserId : null,
                }),
            });

            setFeedback({
                type: "success",
                message: `${title} berhasil dicatat.`,
            });
            setDeskripsi("");
            setJumlah("");
            setTargetUserId(null);
        } catch (error) {
            const message =
                error instanceof ApiError
                    ? error.message
                    : `Gagal mencatat ${title.toLowerCase()}.`;
            setFeedback({ type: "error", message });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-5 rounded-2xl border border-gray-200 bg-gray-50/60">
            <h2 className="text-base font-bold text-gray-900 mb-4">{title}</h2>

            {feedback ? (
                <div
                    className={`mb-4 px-4 py-3 rounded-lg text-sm ${
                        feedback.type === "success"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                >
                    {feedback.message}
                </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-4">
                {withTarget ? (
                    <UserSearchInput
                        placeholder="Cari nama anggota..."
                        onSelect={(user) => setTargetUserId(user.id)}
                    />
                ) : null}

                {!withTarget ? (
                    <TextField
                        label="Deskripsi"
                        name="deskripsi"
                        value={deskripsi}
                        onChange={(e) => setDeskripsi(e.target.value)}
                        placeholder={`Contoh: ${kategori === "donasi" ? "Donasi alumni" : "Pengeluaran kegiatan"}`}
                        maxLength={500}
                    />
                ) : null}

                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-end">
                    <TextField
                        label="Jumlah (Rp)"
                        name="jumlah"
                        type="number"
                        min="1"
                        step="1"
                        value={jumlah}
                        onChange={(e) => setJumlah(e.target.value)}
                        placeholder="0"
                    />
                    <Button type="submit" loading={loading} className="md:w-auto">
                        {submitLabel}
                    </Button>
                </div>
            </form>
        </div>
    );
}
