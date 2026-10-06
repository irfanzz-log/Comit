"use client";

import { useEffect, useState } from "react";
import { apiFetch, ApiError } from "@/lib/api";
import PageContainer from "@/component/internal/PageContainer";
import { TextField, TextArea, SelectField } from "@/component/internal/FormField";
import Button from "@/component/internal/Button";
import MyUploadButton from "@/component/UploadButton";
import Scanner from "@/component/Scanner";
import QRGenerator from "@/component/Qr";
import Icon from "@/component/internal/Icon";
import { useAuth } from "@/app/context/AuthContext";
import { canManageEvent, formatDate } from "@/lib/constants";

const TIPE_OPTIONS = [
    { value: "internal", label: "Internal" },
    { value: "public", label: "Public" },
];

const EMPTY_INPUT = { nameEvent: "", date: "", comment: "", tipe: "internal" };

export default function DataKegiatan() {
    const { user } = useAuth();
    const canManage = canManageEvent(user?.user_role);

    const [imgUrl, setImgUrl] = useState("");
    const [fileKey, setFileKey] = useState("");
    const [input, setInput] = useState({ ...EMPTY_INPUT });
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [error, setError] = useState(null);

    function handleChange(e) {
        const { name, value } = e.target;
        setInput((prev) => ({ ...prev, [name]: value }));
    }

    useEffect(() => {
        async function getEvent() {
            try {
                const result = await apiFetch("/api/events?limit=1");
                setEvent(result?.[0] || null);
            } catch (err) {
                setError("Tidak dapat mengambil data kegiatan.");
                console.error("Error fetching events:", err);
            }
        }
        getEvent();
    }, []);

    async function handleRemove(e) {
        if (e) e.preventDefault();
        if (!fileKey) return;

        try {
            await apiFetch("/api/uploadthing/delete", {
                method: "POST",
                body: JSON.stringify({ fileKey }),
            });
            setImgUrl("");
            setFileKey("");
        } catch (err) {
            setFeedback({ type: "error", message: "Gagal menghapus file." });
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setFeedback(null);

        if (!input.nameEvent || !input.date || !input.comment) {
            setFeedback({ type: "error", message: "Harap lengkapi semua field." });
            return;
        }

        if (!canManage) {
            setFeedback({ type: "error", message: "Anda tidak memiliki izin untuk membuat acara." });
            return;
        }

        setLoading(true);
        try {
            await apiFetch("/api/addEvents", {
                method: "POST",
                body: JSON.stringify({
                    fileUrl: imgUrl || null,
                    fileKey: fileKey || null,
                    nameEvent: input.nameEvent,
                    date: input.date,
                    comment: input.comment,
                    tipe: input.tipe,
                }),
            });

            setFeedback({ type: "success", message: "Kegiatan berhasil dibuat." });
            setInput({ ...EMPTY_INPUT });
            setFileKey("");
            setImgUrl("");

            const result = await apiFetch("/api/events?limit=1");
            setEvent(result?.[0] || null);
        } catch (err) {
            setFeedback({
                type: "error",
                message: err instanceof ApiError ? err.message : "Gagal membuat kegiatan.",
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <PageContainer
            title="Data Kegiatan"
            subtitle="Kelola kegiatan dan absensi digital"
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

            {error ? (
                <div className="px-4 py-3 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm flex items-center gap-2">
                    <Icon name="alert" size={16} />
                    {error}
                </div>
            ) : null}

            {/* Absensi kegiatan mendatang */}
            <div className="p-5 rounded-2xl border border-gray-200 bg-white">
                <h2 className="text-base font-bold text-gray-900 mb-4">Absensi Kegiatan Mendatang</h2>

                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex flex-col md:flex-row border border-gray-200 rounded-xl p-4 gap-4 md:w-1/2">
                        <QRGenerator uuid={event?.uuid} />
                        <div className="flex flex-col justify-center md:text-left text-center">
                            <p className="font-semibold text-gray-900">
                                Nama Kegiatan:{" "}
                                <span className="font-normal text-gray-600">
                                    {event?.nama_acara || "-"}
                                </span>
                            </p>
                            <p className="font-semibold text-gray-900 mt-1">
                                Tanggal Kegiatan:{" "}
                                <span className="font-normal text-gray-600">
                                    {event?.tanggal_acara ? formatDate(event.tanggal_acara) : "-"}
                                </span>
                            </p>
                            {!event ? (
                                <p className="mt-2 text-xs text-gray-400">
                                    Belum ada kegiatan terjadwal.
                                </p>
                            ) : null}
                        </div>
                    </div>

                    <div className="md:w-1/2">
                        <Scanner />
                    </div>
                </div>
            </div>

            {canManage ? (
                <div className="p-5 rounded-2xl border border-gray-200 bg-white">
                    <h2 className="text-base font-bold text-gray-900 mb-4">Jadwalkan Kegiatan</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <TextField
                                    label="Nama Acara"
                                    name="nameEvent"
                                    value={input.nameEvent}
                                    onChange={handleChange}
                                    placeholder="Nama acara"
                                />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <TextField
                                        label="Tanggal Acara"
                                        type="date"
                                        name="date"
                                        value={input.date}
                                        onChange={handleChange}
                                    />
                                    <SelectField
                                        label="Tipe Acara"
                                        name="tipe"
                                        options={TIPE_OPTIONS}
                                        value={input.tipe}
                                        onChange={handleChange}
                                    />
                                </div>
                                <TextArea
                                    label="Komentar"
                                    name="comment"
                                    value={input.comment}
                                    onChange={handleChange}
                                    placeholder="Deskripsi singkat kegiatan"
                                    rows={3}
                                />
                            </div>

                            <div className="border border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center gap-4 bg-gray-50/60">
                                <label className="text-sm font-medium text-gray-700">
                                    Gambar Kegiatan
                                </label>

                                {imgUrl ? (
                                    <div className="flex flex-col items-center w-full">
                                        <img
                                            src={imgUrl}
                                            alt="Preview"
                                            className="max-h-40 w-auto object-contain rounded-lg shadow-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleRemove}
                                            className="mt-3 inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                                        >
                                            <Icon name="x" size={12} />
                                            Ganti Gambar
                                        </button>
                                    </div>
                                ) : (
                                    <MyUploadButton setImgUrl={setImgUrl} setFileKey={setFileKey} />
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button type="submit" loading={loading}>
                                Buat Acara
                            </Button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="p-5 rounded-2xl border border-gray-200 bg-gray-50/60 text-sm text-gray-500 flex items-center gap-2">
                    <Icon name="alert" size={16} />
                    Hanya developer, superadmin, sekretaris, dan staff yang dapat membuat kegiatan.
                </div>
            )}
        </PageContainer>
    );
}
