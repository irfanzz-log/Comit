import { useState } from "react";
import { apiFetch, ApiError } from "@/lib/api";

const EMPTY_FORM = {
    namaUser: "",
    user_id: "",
    posisi: "",
    status_absen: "",
    keterangan: "",
    acara: "",
};

export default function useAttendanceInput() {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ ...EMPTY_FORM });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const submitAbsensi = async () => {
        if (!form.user_id || !form.status_absen) {
            return { success: false, error: "Pilih anggota dan status terlebih dahulu." };
        }

        setLoading(true);
        try {
            await apiFetch("/api/insertAttendance", {
                method: "POST",
                body: JSON.stringify({
                    user_id: form.user_id,
                    status_absen: form.status_absen,
                    keterangan: form.keterangan || "-",
                    acara: form.acara || null,
                }),
            });

            setForm({ ...EMPTY_FORM });
            return { success: true };
        } catch (error) {
            const message =
                error instanceof ApiError && error.status === 403
                    ? "Anda tidak memiliki izin mencatat absensi."
                    : error instanceof ApiError && error.status === 400
                      ? "Data absensi tidak valid."
                      : "Gagal mencatat absensi.";
            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    };

    return { form, setForm, handleChange, submitAbsensi, loading };
}
