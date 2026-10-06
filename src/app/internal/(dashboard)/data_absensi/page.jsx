"use client";

import PageContainer from "@/component/internal/PageContainer";
import DataTable from "@/component/internal/DataTable";
import Pagination from "@/component/internal/Pagination";
import FilterBar from "@/component/internal/FilterBar";
import FilterDropdown from "@/component/internal/FilterDropdown";
import ExportTableButton from "@/component/internal/ExportTableButton";
import UserSearchInput from "@/component/internal/UserSearchInput";
import { TextField, SelectField } from "@/component/internal/FormField";
import Button from "@/component/internal/Button";
import { StatusBadge } from "@/component/internal/Badge";
import useAttendanceFilter from "@/hooks/useAttendanceFilter";
import useAttendanceInput from "@/hooks/useAttendanceInput";
import { useAuth } from "@/app/context/AuthContext";
import { POSISI_OPTIONS, STATUS_ABSEN_OPTIONS, canManageAttendance } from "@/lib/constants";
import { useState } from "react";

const DEFAULTS = {
    posisi: "Filter by posisi",
    status: "Filter by status absen",
    acara: "Filter by acara",
};

export function DataAbsensi() {
    const {
        name,
        setName,
        dataAnggota,
        loading,
        page,
        setPage,
        totalPages,
        totalUsers,
        togglePosisi,
        setTogglePosisi,
        toggleStatusAbsen,
        setToggleStatusAbsen,
        toggleAcara,
        setToggleAcara,
        acaraOptions,
        handleSearch,
    } = useAttendanceFilter();

    const { form, setForm, handleChange, submitAbsensi, loading: submitting } = useAttendanceInput();
    const { user } = useAuth();
    const canInput = canManageAttendance(user?.user_role);

    const [feedback, setFeedback] = useState(null);

    const hasFilter =
        name !== "" ||
        togglePosisi !== DEFAULTS.posisi ||
        toggleStatusAbsen !== DEFAULTS.status ||
        toggleAcara !== DEFAULTS.acara;

    function resetFilters() {
        setName("");
        setTogglePosisi(DEFAULTS.posisi);
        setToggleStatusAbsen(DEFAULTS.status);
        setToggleAcara(DEFAULTS.acara);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const result = await submitAbsensi();
        if (result?.success) {
            setFeedback({ type: "success", message: "Absensi berhasil dicatat." });
        } else if (result?.error) {
            setFeedback({ type: "error", message: result.error });
        }
    }

    const columns = [
        { key: "no", header: "No", sortable: false, render: (_row, idx) => (page - 1) * 10 + idx + 1 },
        { key: "nama", header: "Nama Lengkap" },
        { key: "posisi", header: "Posisi" },
        {
            key: "status_absen",
            header: "Status",
            render: (row) => <StatusBadge status={row.status_absen} />,
        },
        { key: "keterangan", header: "Keterangan" },
        { key: "acara", header: "Acara" },
    ];

    return (
        <PageContainer
            title="Data Absensi"
            subtitle="Daftar presensi seluruh anggota"
            actions={<ExportTableButton tableId="table-data" filename="Data_Absensi_COMIT" />}
        >
            {canInput ? (
                <div className="p-5 rounded-2xl border border-gray-200 bg-gray-50/60">
                    <h2 className="text-base font-bold text-gray-900 mb-4">Input Absensi</h2>

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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <UserSearchInput
                                onSelect={(u) =>
                                    setForm((prev) => ({ ...prev, user_id: u.id, namaUser: u.nama }))
                                }
                            />
                            <SelectField
                                label="Status"
                                name="status_absen"
                                options={STATUS_ABSEN_OPTIONS}
                                value={form.status_absen}
                                onChange={handleChange}
                                placeholder="Pilih status"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <TextField
                                label="Keterangan"
                                name="keterangan"
                                value={form.keterangan}
                                onChange={handleChange}
                                placeholder="Opsional, contoh: Izin karena sakit"
                            />
                            <SelectField
                                label="Acara"
                                name="acara"
                                options={acaraOptions}
                                value={form.acara}
                                onChange={handleChange}
                                placeholder="Pilih acara"
                            />
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" loading={submitting}>
                                Simpan Absensi
                            </Button>
                        </div>
                    </form>
                </div>
            ) : null}

            <FilterBar
                searchValue={name}
                onSearchChange={(e) => setName(e.target.value)}
                onSearchSubmit={handleSearch}
                showReset={hasFilter}
                onReset={resetFilters}
            >
                <FilterDropdown
                    label="Posisi"
                    options={POSISI_OPTIONS}
                    value={togglePosisi === DEFAULTS.posisi ? "" : togglePosisi}
                    onChange={(v) => {
                        setTogglePosisi(v || DEFAULTS.posisi);
                        setPage(1);
                    }}
                    placeholder="Semua posisi"
                />
                <FilterDropdown
                    label="Status absen"
                    options={STATUS_ABSEN_OPTIONS}
                    value={toggleStatusAbsen === DEFAULTS.status ? "" : toggleStatusAbsen}
                    onChange={(v) => {
                        setToggleStatusAbsen(v || DEFAULTS.status);
                        setPage(1);
                    }}
                    placeholder="Semua status"
                />
                <FilterDropdown
                    label="Acara"
                    options={acaraOptions}
                    value={toggleAcara === DEFAULTS.acara ? "" : toggleAcara}
                    onChange={(v) => {
                        setToggleAcara(v || DEFAULTS.acara);
                        setPage(1);
                    }}
                    placeholder="Semua acara"
                />
            </FilterBar>

            <div className="hidden">
                <table id="table-data">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Nama</th>
                            <th>Posisi</th>
                            <th>Status</th>
                            <th>Keterangan</th>
                            <th>Acara</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataAnggota.map((d, i) => (
                            <tr key={`${d.id}-${i}`}>
                                <td>{(page - 1) * 10 + i + 1}</td>
                                <td>{d.nama}</td>
                                <td>{d.posisi}</td>
                                <td>{d.status_absen}</td>
                                <td>{d.keterangan}</td>
                                <td>{d.acara}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <DataTable
                columns={columns}
                data={dataAnggota}
                loading={loading}
                emptyMessage="Belum ada data absensi yang cocok."
                pagination={
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                        totalItems={totalUsers}
                    />
                }
            />
        </PageContainer>
    );
}

export default function Page() {
    return <DataAbsensi />;
}
