"use client";

import { useEffect, useState } from "react";
import { apiFetch, ApiError } from "@/lib/api";
import PageContainer from "@/component/internal/PageContainer";
import { TextField, TextArea, SelectField } from "@/component/internal/FormField";
import Button from "@/component/internal/Button";
import Icon from "@/component/internal/Icon";
import { useAuth } from "@/app/context/AuthContext";
import { canManageCertificate } from "@/lib/constants";

const EMPTY_BATCH = {
    template_id: "",
    number_prefix: "",
    participants: "",
    activity_name: "",
    activity_info: "",
    issue_date: "",
    signer_name: "",
    signer_position: "",
};

// Ambil NPM/nama pengurus dari daftar anggota untuk tombol "isi otomatis".
const FALLBACK_ANGGOTA = [
    "Danang Prasetio", "Erik Susanto", "Abella Pinkan Ham", "Putriyana",
    "Sofi Utami", "Eva Fauziah", "Ahmad Rohman", "Crisvin",
    "Dewi Fatimah Nurhasiya", "Muhammad Teuku Rizal", "Ihya Ulumudin",
    "Dita Resty Pauji", "Komalasari", "Chesa Aulia", "Ryan Adi Prasetyo",
    "M Irfansyah", "Fikriyah", "Meysha Shifa Ayudia", "Nabila Salsabila",
    "Rifki Dwi Al Zari", "Galih Eza Kurniawansyah", "Reva Andini",
    "Ripki Dimas Andrea", "Rusminah", "Haikal Rifalda", "Andini Rahmayati",
    "Yuliyanti", "Giany Syahnariza Haura", "Dona Raflina", "Nufail Jazali",
    "Zunda Melandari", "Agustian Sadovin", "Bayu Indra Setiawan",
    "Muhammad Chandra Wijaya",
];

export default function BatchSertifikat() {
    const { user } = useAuth();
    const canManage = canManageCertificate(user?.user_role);

    const [templates, setTemplates] = useState([]);
    const [form, setForm] = useState({ ...EMPTY_BATCH });
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [error, setError] = useState(null);
    const [previewNumbers, setPreviewNumbers] = useState([]);
    const [result, setResult] = useState(null);

    useEffect(() => {
        async function getTemplates() {
            try {
                const data = await apiFetch("/api/certificates/template");
                setTemplates(data.data || []);
            } catch (err) {
                setError("Gagal memuat daftar template sertifikat.");
                console.error("Error fetching templates:", err);
            }
        }
        getTemplates();
    }, []);

    // Pratinjau nomor yang akan dibuat (dievaluasi client-side agar
    // pengguna langsung melihat nomor unik sebelum submit).
    const parsedNames = [
        ...new Set(
            form.participants
                .split("\n")
                .map((n) => n.trim())
                .filter(Boolean)
        ),
    ];

    useEffect(() => {
        if (!form.number_prefix.trim()) {
            setPreviewNumbers([]);
            return;
        }
        const prefix = form.number_prefix.trim().toUpperCase();
        // Cari nomor tertinggi yang sudah ada untuk prefix ini di client.
        apiFetch(`/api/certificates/preview?prefix=${encodeURIComponent(prefix)}`)
            .then((data) => {
                const next = data.next || 0;
                setPreviewNumbers(
                    parsedNames.map((_, i) => `${prefix}-${String(next + i + 1).padStart(3, "0")}`)
                );
            })
            .catch(() => setPreviewNumbers([]));
        // parsedNames sengaja tidak masuk deps agar request hanya dipicu
        // saat prefix berubah; panjang dipakai saat render.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.number_prefix]);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    async function handleIsiOtomatis() {
        try {
            const data = await apiFetch("/api/userInfo?limit=200");
            const names = (data.users || []).map((u) => u.nama).filter(Boolean);
            setForm((prev) => ({
                ...prev,
                participants: names.join("\n"),
            }));
                setFeedback({ type: "info", message: `${names.length} nama anggota terisi.` });
        } catch (err) {
            // Fallback ke daftar lokal bila API gagal.
            setForm((prev) => ({
                ...prev,
                participants: FALLBACK_ANGGOTA.join("\n"),
            }));
            setFeedback({ type: "info", message: "Memakai daftar anggota lokal (API tidak dapat diakses)." });
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setFeedback(null);
        setResult(null);

        if (!form.template_id) {
            setFeedback({ type: "error", message: "Pilih template terlebih dahulu." });
            return;
        }
        if (!form.number_prefix.trim()) {
            setFeedback({ type: "error", message: "Isi prefix nomor sertifikat (mis. COMIT-2026)." });
            return;
        }
        if (parsedNames.length === 0) {
            setFeedback({ type: "error", message: "Daftar peserta tidak boleh kosong." });
            return;
        }

        setLoading(true);
        try {
            const data = await apiFetch("/api/certificates/batch", {
                method: "POST",
                body: JSON.stringify({ ...form, participants: parsedNames }),
            });

            setFeedback({
                type: "success",
                message: `${data.created} sertifikat berhasil dibuat.`,
            });
            setResult(data);
            setForm({ ...EMPTY_BATCH });
            setPreviewNumbers([]);
        } catch (err) {
            setFeedback({
                type: "error",
                message:
                    err instanceof ApiError
                        ? err.message
                        : "Gagal membuat batch sertifikat.",
            });
        } finally {
            setLoading(false);
        }
    }

    if (!canManage) {
        return (
            <PageContainer title="Batch Sertifikat" subtitle="Terbitkan banyak sertifikat sekaligus">
                <div className="p-10 rounded-2xl border border-gray-200 bg-gray-50/60 text-center">
                    <div className="inline-flex p-3 rounded-xl bg-amber-50 text-amber-600 mb-3">
                        <Icon name="shield" size={22} />
                    </div>
                    <h3 className="text-base font-bold text-gray-900">Akses dibatasi</h3>
                    <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">
                        Hanya developer, superadmin, dan sekretaris yang dapat mengelola
                        sertifikat.
                    </p>
                </div>
            </PageContainer>
        );
    }

    if (error) {
        return (
            <PageContainer title="Batch Sertifikat" subtitle="Terbitkan banyak sertifikat sekaligus">
                <div className="px-4 py-3 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm flex items-center gap-2">
                    <Icon name="alert" size={16} />
                    {error}
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer
            title="Batch Sertifikat"
            subtitle="Terbitkan sertifikat untuk banyak peserta sekaligus"
        >
            {feedback ? (
                <div
                    className={`px-4 py-3 rounded-lg text-sm border flex items-center gap-2 ${
                        feedback.type === "success"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : feedback.type === "info"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-red-50 text-red-700 border-red-200"
                    }`}
                >
                    <Icon
                        name={
                            feedback.type === "success"
                                ? "check"
                                : "alert"
                        }
                        size={16}
                    />
                    {feedback.message}
                </div>
            ) : null}

            {result ? (
                <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/50 space-y-3">
                    <div className="flex items-center gap-2 text-emerald-700 font-semibold text-sm">
                        <Icon name="check" size={18} />
                        {result.created} sertifikat diterbitkan
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {(result.certificates || []).map((c) => (
                            <a
                                key={c.id}
                                href={`/sertifikat/${c.id}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-emerald-200 text-xs font-medium text-emerald-700 hover:bg-emerald-50"
                            >
                                <Icon name="check" size={12} />
                                <span className="font-mono">{c.number}</span>
                                <span className="font-normal text-gray-400">·</span>
                                <span className="font-normal text-gray-600">{c.name}</span>
                            </a>
                        ))}
                    </div>
                </div>
            ) : null}

            {templates.length === 0 ? (
                <div className="p-8 rounded-2xl border border-gray-200 bg-gray-50/60 text-center text-sm text-gray-500">
                    <Icon name="inbox" size={28} className="mx-auto mb-2 text-gray-300" />
                    Belum ada template sertifikat tersedia.
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4 max-w-4xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SelectField
                            label="Template"
                            name="template_id"
                            options={templates.map((t) => ({ value: String(t.id), label: t.name }))}
                            value={form.template_id}
                            onChange={handleChange}
                            placeholder="Pilih template"
                            required
                        />
                        <TextField
                            label="Prefix Nomor Sertifikat"
                            name="number_prefix"
                            value={form.number_prefix}
                            onChange={handleChange}
                            placeholder="Contoh: COMIT-2026"
                            hint="Nomor unik dilanjutkan otomatis: COMIT-2026-001, -002, …"
                            required
                        />
                        <TextField
                            label="Nama Kegiatan"
                            name="activity_name"
                            value={form.activity_name}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            label="Tanggal Terbit"
                            type="date"
                            name="issue_date"
                            value={form.issue_date}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            label="Jabatan Penandatangan"
                            name="signer_position"
                            value={form.signer_position}
                            onChange={handleChange}
                        />
                        <TextField
                            label="Nama Penandatangan"
                            name="signer_name"
                            value={form.signer_name}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label htmlFor="participants" className="text-sm font-medium text-gray-700">
                                Daftar Peserta
                                <span className="ml-2 text-xs font-normal text-gray-400">
                                    satu nama per baris
                                </span>
                            </label>
                            <button
                                type="button"
                                onClick={handleIsiOtomatis}
                                className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700"
                            >
                                <Icon name="plus" size={13} />
                                Isi dari daftar anggota
                            </button>
                        </div>
                        <textarea
                            id="participants"
                            name="participants"
                            rows={8}
                            value={form.participants}
                            onChange={handleChange}
                            placeholder={"Satu nama per baris\nNama kedua\nNama ketiga"}
                            className="w-full px-3.5 py-2.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 resize-y font-mono"
                        />
                        <p className="mt-1.5 text-xs text-gray-500">
                            {parsedNames.length} nama siap dibuat
                            {parsedNames.length > 1 ? " (duplikat otomatis dihapus)" : ""}
                        </p>
                    </div>

                    {previewNumbers.length > 0 ? (
                        <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50">
                            <p className="text-xs font-medium text-blue-700 mb-2 flex items-center gap-1.5">
                                <Icon name="alert" size={13} />
                                Pratinjau nomor sertifikat ({previewNumbers.length})
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {previewNumbers.slice(0, 24).map((n) => (
                                    <span
                                        key={n}
                                        className="px-2.5 py-1 rounded-md bg-white border border-blue-200 text-[11px] font-mono text-blue-700"
                                    >
                                        {n}
                                    </span>
                                ))}
                                {previewNumbers.length > 24 ? (
                                    <span className="px-2.5 py-1 text-[11px] text-blue-500">
                                        +{previewNumbers.length - 24} lagi
                                    </span>
                                ) : null}
                            </div>
                        </div>
                    ) : null}

                    <TextArea
                        label="Informasi Kegiatan"
                        name="activity_info"
                        value={form.activity_info}
                        onChange={handleChange}
                        placeholder="Deskripsi kegiatan dan peran peserta"
                        rows={4}
                    />

                    <div className="flex justify-end pt-2">
                        <Button type="submit" loading={loading}>
                            Buat {parsedNames.length > 0 ? `${parsedNames.length} ` : ""}Sertifikat
                        </Button>
                    </div>
                </form>
            )}
        </PageContainer>
    );
}
