"use client";

import { useEffect, useState } from "react";
import { apiFetch, ApiError } from "@/lib/api";
import PageContainer from "@/component/internal/PageContainer";
import { TextField, TextArea, SelectField } from "@/component/internal/FormField";
import Button from "@/component/internal/Button";
import Icon from "@/component/internal/Icon";
import { useAuth } from "@/app/context/AuthContext";
import { canManageCertificate } from "@/lib/constants";

const EMPTY_FORM = {
    template_id: "",
    certificate_number: "",
    participant_name: "",
    activity_name: "",
    activity_info: "",
    issue_date: "",
    signer_name: "",
    signer_position: "",
    qr_code: "",
};

export default function Sertifikat() {
    const { user } = useAuth();
    const canManage = canManageCertificate(user?.user_role);

    const [templates, setTemplates] = useState([]);
    const [form, setForm] = useState({ ...EMPTY_FORM });
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [error, setError] = useState(null);

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

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setFeedback(null);

        if (!form.template_id) {
            setFeedback({ type: "error", message: "Pilih template terlebih dahulu." });
            return;
        }

        setLoading(true);
        try {
            await apiFetch("/api/certificates", {
                method: "POST",
                body: JSON.stringify(form),
            });

            setFeedback({ type: "success", message: "Sertifikat berhasil dibuat." });
            setForm({ ...EMPTY_FORM });
        } catch (err) {
            setFeedback({
                type: "error",
                message:
                    err instanceof ApiError
                        ? err.message
                        : "Gagal membuat sertifikat. Nomor sertifikat mungkin sudah digunakan.",
            });
        } finally {
            setLoading(false);
        }
    }

    if (!canManage) {
        return (
            <PageContainer title="Data Sertifikat" subtitle="Penerbitan sertifikat">
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
            <PageContainer title="Data Sertifikat" subtitle="Penerbitan sertifikat">
                <div className="px-4 py-3 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm flex items-center gap-2">
                    <Icon name="alert" size={16} />
                    {error}
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer
            title="Data Sertifikat"
            subtitle="Buat dan terbitkan sertifikat kegiatan"
        >
            {feedback ? (
                <div
                    className={`px-4 py-3 rounded-lg text-sm border flex items-center gap-2 ${
                        feedback.type === "success"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-red-50 text-red-700 border-red-200"
                    }`}
                >
                    <Icon name={feedback.type === "success" ? "check" : "alert"} size={16} />
                    {feedback.message}
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
                            label="Nomor Sertifikat"
                            name="certificate_number"
                            value={form.certificate_number}
                            onChange={handleChange}
                            placeholder="Contoh: COMIT-2026-001"
                            required
                        />
                        <TextField
                            label="Nama Peserta"
                            name="participant_name"
                            value={form.participant_name}
                            onChange={handleChange}
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
                            Buat Sertifikat
                        </Button>
                    </div>
                </form>
            )}
        </PageContainer>
    );
}
