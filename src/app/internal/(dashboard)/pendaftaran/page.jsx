"use client";

import { useEffect, useState } from "react";
import { apiFetch, ApiError } from "@/lib/api";
import PageContainer from "@/component/internal/PageContainer";
import StatCard from "@/component/internal/StatCard";
import DataTable from "@/component/internal/DataTable";
import Pagination from "@/component/internal/Pagination";
import Button from "@/component/internal/Button";
import { StatusBadge } from "@/component/internal/Badge";
import Icon from "@/component/internal/Icon";

const FILTERS = [
    { value: "all", label: "Semua" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Diterima" },
    { value: "rejected", label: "Ditolak" },
];

const PAGE_SIZE = 10;

export default function Pendaftaran() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [processingId, setProcessingId] = useState(null);
    const [filter, setFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [confirm, setConfirm] = useState(null);
    const [toast, setToast] = useState(null);

    async function fetchPendaftaran() {
        try {
            setLoading(true);
            setError(null);
            const result = await apiFetch("/api/enrollments");
            setData(result.data || []);
        } catch (err) {
            setError(err instanceof ApiError ? err.message : "Gagal memuat data pendaftaran.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchPendaftaran();
    }, []);

    // Toast otomatis hilang
    useEffect(() => {
        if (!toast) return;
        const timer = setTimeout(() => setToast(null), 4000);
        return () => clearTimeout(timer);
    }, [toast]);

    async function confirmUpdateStatus() {
        if (!confirm) return;
        const { id, status } = confirm;
        setConfirm(null);

        try {
            setProcessingId(id);
            const result = await apiFetch(`/api/enrollments/${id}`, {
                method: "PATCH",
                body: JSON.stringify({ status }),
            });

            setToast({ type: "success", message: result.message || "Status berhasil diperbarui." });
            await fetchPendaftaran();
        } catch (err) {
            setToast({
                type: "error",
                message: err instanceof ApiError ? err.message : "Terjadi kesalahan pada server.",
            });
        } finally {
            setProcessingId(null);
        }
    }

    const filteredData = data.filter((item) => filter === "all" || item.status === filter);

    const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const paginatedData = filteredData.slice(startIndex, startIndex + PAGE_SIZE);

    function changeFilter(value) {
        setFilter(value);
        setCurrentPage(1);
    }

    const totalPending = data.filter((i) => i.status === "pending").length;
    const totalApproved = data.filter((i) => i.status === "approved").length;
    const totalRejected = data.filter((i) => i.status === "rejected").length;

    const columns = [
        { key: "no", header: "No", sortable: false, render: (_row, idx) => startIndex + idx + 1 },
        { key: "nama", header: "Nama" },
        { key: "npm", header: "NPM" },
        { key: "no_telpon", header: "WhatsApp" },
        { key: "jurusan", header: "Jurusan" },
        {
            key: "alasan",
            header: "Alasan",
            render: (row) => (
                <span className="block max-w-xs truncate text-gray-600" title={row.alasan}>
                    {row.alasan}
                </span>
            ),
        },
        {
            key: "status",
            header: "Status",
            align: "center",
            render: (row) => <StatusBadge status={row.status} />,
        },
        {
            key: "aksi",
            header: "Aksi",
            align: "center",
            sortable: false,
            render: (row) => {
                if (row.status !== "pending") {
                    return <span className="text-xs text-gray-400">Sudah diproses</span>;
                }

                return (
                    <div className="inline-flex items-center gap-1.5">
                        <Button
                            size="sm"
                            variant="success"
                            loading={processingId === row.id}
                            onClick={() => setConfirm({ id: row.id, status: "approved" })}
                        >
                            Terima
                        </Button>
                        <Button
                            size="sm"
                            variant="danger"
                            loading={processingId === row.id}
                            onClick={() => setConfirm({ id: row.id, status: "rejected" })}
                        >
                            Tolak
                        </Button>
                    </div>
                );
            },
        },
    ];

    return (
        <PageContainer
            title="Pendaftaran Anggota"
            subtitle="Kelola pengajuan pendaftaran anggota COMIT"
        >
            {error ? (
                <div className="px-4 py-3 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm flex items-center gap-2">
                    <Icon name="alert" size={16} />
                    {error}
                </div>
            ) : null}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <StatCard title="Total Pendaftar" value={data.length} icon="users" variant="blue" loading={loading} />
                <StatCard title="Menunggu" value={totalPending} icon="inbox" variant="yellow" loading={loading} />
                <StatCard title="Diterima" value={totalApproved} icon="check" variant="green" loading={loading} />
                <StatCard title="Ditolak" value={totalRejected} icon="x" variant="red" loading={loading} />
            </div>

            <div className="flex flex-wrap items-center gap-2">
                {FILTERS.map((f) => (
                    <button
                        key={f.value}
                        type="button"
                        onClick={() => changeFilter(f.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            filter === f.value
                                ? "bg-blue-600 text-white"
                                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                        }`}
                    >
                        {f.label}
                        {f.value !== "all" ? (
                            <span className="ml-1.5 opacity-70">
                                ({data.filter((i) => i.status === f.value).length})
                            </span>
                        ) : null}
                    </button>
                ))}
            </div>

            <DataTable
                columns={columns}
                data={paginatedData}
                loading={loading}
                emptyMessage={
                    filter === "all"
                        ? "Belum ada pendaftaran masuk."
                        : `Tidak ada pendaftaran dengan status “${FILTERS.find((f) => f.value === filter)?.label}”.`
                }
                pagination={
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        totalItems={filteredData.length}
                        pageSize={PAGE_SIZE}
                        syncUrl={false}
                    />
                }
            />

            {/* Modal konfirmasi */}
            {confirm ? (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4"
                    onClick={() => setConfirm(null)}
                >
                    <div
                        className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start gap-3">
                            <span
                                className={`shrink-0 p-2.5 rounded-xl ${
                                    confirm.status === "approved"
                                        ? "bg-emerald-50 text-emerald-600"
                                        : "bg-red-50 text-red-600"
                                }`}
                            >
                                <Icon name={confirm.status === "approved" ? "check" : "x"} size={18} />
                            </span>
                            <div>
                                <h3 className="text-base font-bold text-gray-900">
                                    {confirm.status === "approved" ? "Terima pendaftar?" : "Tolak pendaftar?"}
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    {confirm.status === "approved"
                                        ? "Akun anggota akan dibuat otomatis dengan password default berupa NPM."
                                        : "Pendaftar dapat mendaftar kembali setelah ditolak."}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-2">
                            <Button variant="secondary" onClick={() => setConfirm(null)}>
                                Batal
                            </Button>
                            <Button
                                variant={confirm.status === "approved" ? "success" : "danger"}
                                onClick={confirmUpdateStatus}
                            >
                                {confirm.status === "approved" ? "Ya, terima" : "Ya, tolak"}
                            </Button>
                        </div>
                    </div>
                </div>
            ) : null}

            {/* Toast */}
            {toast ? (
                <div className="fixed bottom-4 right-4 z-50 max-w-sm">
                    <div
                        className={`flex items-start gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-sm ${
                            toast.type === "success"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-red-50 text-red-700 border-red-200"
                        }`}
                    >
                        <Icon name={toast.type === "success" ? "check" : "alert"} size={16} className="mt-0.5" />
                        <span>{toast.message}</span>
                        <button
                            type="button"
                            onClick={() => setToast(null)}
                            className="ml-1 text-current opacity-50 hover:opacity-100"
                            aria-label="Tutup"
                        >
                            <Icon name="x" size={14} />
                        </button>
                    </div>
                </div>
            ) : null}
        </PageContainer>
    );
}
