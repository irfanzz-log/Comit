"use client";

import Aside from "@/component/internal/Aside";
import HeaderSectionBody from "@/component/internal/HeaderSectionBody";
import { useEffect, useState } from "react";

export default function Pendaftaran() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);

    const [filter, setFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 10;

    // ==========================================
    // FETCH DATA
    // ==========================================

    async function fetchPendaftaran() {
        try {
            setLoading(true);

            const res = await fetch("/api/enrollments", {
                cache: "no-store",
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(
                    result.message ||
                    "Gagal mengambil data pendaftaran"
                );
            }

            setData(result.data || []);

        } catch (error) {
            console.error(
                "Error fetching pendaftaran:",
                error
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchPendaftaran();
    }, []);

    // ==========================================
    // UPDATE STATUS
    // ==========================================

    async function updateStatus(id, status) {
        const confirmMessage =
            status === "approved"
                ? "Apakah kamu yakin ingin menerima pendaftar ini?"
                : "Apakah kamu yakin ingin menolak pendaftar ini?";

        if (!confirm(confirmMessage)) {
            return;
        }

        try {
            setProcessingId(id);

            const res = await fetch(
                `/api/enrollments/${id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        status,
                    }),
                }
            );

            const result = await res.json();

            if (!res.ok) {
                alert(
                    result.message ||
                    "Gagal mengubah status"
                );
                return;
            }

            alert(
                result.message ||
                "Status berhasil diperbarui"
            );

            await fetchPendaftaran();

        } catch (error) {
            console.error(
                "Error update status:",
                error
            );

            alert(
                "Terjadi kesalahan pada server"
            );

        } finally {
            setProcessingId(null);
        }
    }

    // ==========================================
    // FILTER
    // ==========================================

    const filteredData = data.filter((item) => {
        if (filter === "all") {
            return true;
        }

        return item.status === filter;
    });

    // ==========================================
    // PAGINATION
    // ==========================================

    const totalPages = Math.ceil(
        filteredData.length / itemsPerPage
    );

    const startIndex =
        (currentPage - 1) * itemsPerPage;

    const paginatedData =
        filteredData.slice(
            startIndex,
            startIndex + itemsPerPage
        );

    function changeFilter(value) {
        setFilter(value);
        setCurrentPage(1);
    }

    function previousPage() {
        setCurrentPage((prev) =>
            Math.max(prev - 1, 1)
        );
    }

    function nextPage() {
        setCurrentPage((prev) =>
            Math.min(
                prev + 1,
                totalPages
            )
        );
    }

    // ==========================================
    // STATISTIK
    // ==========================================

    const totalPendaftar =
        data.length;

    const totalPending =
        data.filter(
            (item) =>
                item.status === "pending"
        ).length;

    const totalApproved =
        data.filter(
            (item) =>
                item.status === "approved"
        ).length;

    const totalRejected =
        data.filter(
            (item) =>
                item.status === "rejected"
        ).length;

    // ==========================================
    // EXPORT EXCEL
    // ==========================================

    async function exportExcel() {
        try {
            if (filteredData.length === 0) {
                alert(
                    "Tidak ada data untuk diexport."
                );
                return;
            }

            // Import xlsx hanya ketika tombol diklik
            const XLSX = await import("xlsx");

            const exportData =
                filteredData.map(
                    (item, index) => ({
                        No: index + 1,
                        Nama: item.nama || "",
                        NPM: item.npm || "",
                        "Nomor WhatsApp":
                            item.no_telpon || "",
                        Jurusan:
                            item.jurusan || "",
                        Alasan:
                            item.alasan || "",
                        Status:
                            item.status ===
                            "pending"
                                ? "Pending"
                                : item.status ===
                                  "approved"
                                ? "Diterima"
                                : item.status ===
                                  "rejected"
                                ? "Ditolak"
                                : item.status || "",
                    })
                );

            const worksheet =
                XLSX.utils.json_to_sheet(
                    exportData
                );

            // Lebar kolom
            worksheet["!cols"] = [
                { wch: 6 },
                { wch: 28 },
                { wch: 16 },
                { wch: 20 },
                { wch: 25 },
                { wch: 50 },
                { wch: 15 },
            ];

            const workbook =
                XLSX.utils.book_new();

            XLSX.utils.book_append_sheet(
                workbook,
                worksheet,
                "Pendaftaran"
            );

            const date =
                new Date()
                    .toISOString()
                    .slice(0, 10);

            XLSX.writeFile(
                workbook,
                `data-pendaftaran-${date}.xlsx`
            );

        } catch (error) {
            console.error(
                "Export Excel error:",
                error
            );

            alert(
                "Gagal membuat file Excel."
            );
        }
    }

    return (
        <div className="main relative w-full h-screen flex flex-row bg-gray-100 overflow-x-hidden">

            <Aside />

            <main className="py-2 px-2 scrollbar-hide w-full h-screen overflow-y-scroll">

                <section className="main-section bg-white h-auto relative w-full rounded-lg shadow-md">

                    <HeaderSectionBody
                        title="Pendaftaran"
                        profile="UP"
                    />

                    <div className="main-section_body p-5">

                        <div className="main-section_content">

                            {/* ==========================================
                                HEADER
                            ========================================== */}

                            <div className="content-head">

                                <h1 className="text-xl font-bold">
                                    Dashboard Pendaftaran
                                </h1>

                                <p className="text-sm text-gray-500 mt-1">
                                    Kelola pengajuan pendaftaran anggota COMIT
                                </p>

                            </div>


                            {/* ==========================================
                                STATISTIK
                            ========================================== */}

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">

                                {/* TOTAL */}

                                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">

                                    <p className="text-sm text-gray-500">
                                        Total Pendaftar
                                    </p>

                                    <h2 className="text-2xl font-bold text-blue-600 mt-1">
                                        {totalPendaftar}
                                    </h2>

                                </div>


                                {/* PENDING */}

                                <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4">

                                    <p className="text-sm text-gray-500">
                                        Menunggu
                                    </p>

                                    <h2 className="text-2xl font-bold text-yellow-600 mt-1">
                                        {totalPending}
                                    </h2>

                                </div>


                                {/* APPROVED */}

                                <div className="bg-green-50 border border-green-100 rounded-xl p-4">

                                    <p className="text-sm text-gray-500">
                                        Diterima
                                    </p>

                                    <h2 className="text-2xl font-bold text-green-600 mt-1">
                                        {totalApproved}
                                    </h2>

                                </div>


                                {/* REJECTED */}

                                <div className="bg-red-50 border border-red-100 rounded-xl p-4">

                                    <p className="text-sm text-gray-500">
                                        Ditolak
                                    </p>

                                    <h2 className="text-2xl font-bold text-red-600 mt-1">
                                        {totalRejected}
                                    </h2>

                                </div>

                            </div>


                            {/* ==========================================
                                DATA PENDAFTAR
                            ========================================== */}

                            <div className="content-body mt-8">

                                {/* HEADER DATA */}

                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">

                                    <div>

                                        <h2 className="font-bold text-lg">
                                            Data Pendaftar
                                        </h2>

                                        <p className="text-sm text-gray-500 mt-1">
                                            Menampilkan maksimal 10 data per halaman
                                        </p>

                                    </div>


                                    {/* EXPORT */}

                                    <button
                                        type="button"
                                        onClick={exportExcel}
                                        className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition"
                                    >

                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="17"
                                            height="17"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                            <polyline points="14 2 14 8 20 8" />
                                            <path d="M8 13h8" />
                                            <path d="M8 17h5" />
                                        </svg>

                                        Export Excel

                                    </button>

                                </div>


                                {/* ==========================================
                                    FILTER
                                ========================================== */}

                                <div className="flex flex-wrap gap-2 mb-5">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            changeFilter("all")
                                        }
                                        className={`px-4 py-2 rounded-lg text-sm transition ${
                                            filter === "all"
                                                ? "bg-blue-500 text-white"
                                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                    >
                                        Semua
                                    </button>


                                    <button
                                        type="button"
                                        onClick={() =>
                                            changeFilter("pending")
                                        }
                                        className={`px-4 py-2 rounded-lg text-sm transition ${
                                            filter === "pending"
                                                ? "bg-yellow-500 text-white"
                                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                    >
                                        Pending
                                    </button>


                                    <button
                                        type="button"
                                        onClick={() =>
                                            changeFilter("approved")
                                        }
                                        className={`px-4 py-2 rounded-lg text-sm transition ${
                                            filter === "approved"
                                                ? "bg-green-500 text-white"
                                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                    >
                                        Diterima
                                    </button>


                                    <button
                                        type="button"
                                        onClick={() =>
                                            changeFilter("rejected")
                                        }
                                        className={`px-4 py-2 rounded-lg text-sm transition ${
                                            filter === "rejected"
                                                ? "bg-red-500 text-white"
                                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                    >
                                        Ditolak
                                    </button>

                                </div>


                                {/* ==========================================
                                    TABLE
                                ========================================== */}

                                <div className="w-full overflow-x-auto rounded-xl border border-gray-200">

                                    <table className="w-full min-w-[1000px] text-sm">

                                        <thead className="bg-gray-50">

                                            <tr>

                                                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                                                    No
                                                </th>

                                                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                                                    Nama
                                                </th>

                                                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                                                    NPM
                                                </th>

                                                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                                                    WhatsApp
                                                </th>

                                                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                                                    Jurusan
                                                </th>

                                                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                                                    Alasan
                                                </th>

                                                <th className="px-4 py-3 text-center font-semibold text-gray-600">
                                                    Status
                                                </th>

                                                <th className="px-4 py-3 text-center font-semibold text-gray-600">
                                                    Aksi
                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {loading ? (

                                                <tr>

                                                    <td
                                                        colSpan="8"
                                                        className="text-center py-10 text-gray-500"
                                                    >
                                                        Memuat data...
                                                    </td>

                                                </tr>

                                            ) : paginatedData.length === 0 ? (

                                                <tr>

                                                    <td
                                                        colSpan="8"
                                                        className="text-center py-10 text-gray-500"
                                                    >
                                                        Tidak ada data pendaftaran
                                                    </td>

                                                </tr>

                                            ) : (

                                                paginatedData.map(
                                                    (
                                                        item,
                                                        index
                                                    ) => (

                                                        <tr
                                                            key={
                                                                item.id
                                                            }
                                                            className="border-t border-gray-100 hover:bg-gray-50"
                                                        >

                                                            {/* NO */}

                                                            <td className="px-4 py-4">
                                                                {startIndex +
                                                                    index +
                                                                    1}
                                                            </td>


                                                            {/* NAMA */}

                                                            <td className="px-4 py-4 font-medium">
                                                                {item.nama}
                                                            </td>


                                                            {/* NPM */}

                                                            <td className="px-4 py-4">
                                                                {item.npm}
                                                            </td>


                                                            {/* WHATSAPP */}

                                                            <td className="px-4 py-4">
                                                                {item.no_telpon}
                                                            </td>


                                                            {/* JURUSAN */}

                                                            <td className="px-4 py-4">
                                                                {item.jurusan}
                                                            </td>


                                                            {/* ALASAN */}

                                                            <td className="px-4 py-4 max-w-xs">

                                                                <p className="line-clamp-2">
                                                                    {
                                                                        item.alasan
                                                                    }
                                                                </p>

                                                            </td>


                                                            {/* STATUS */}

                                                            <td className="px-4 py-4 text-center">

                                                                {item.status ===
                                                                    "pending" && (

                                                                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                                                        Pending
                                                                    </span>

                                                                )}


                                                                {item.status ===
                                                                    "approved" && (

                                                                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                                        Diterima
                                                                    </span>

                                                                )}


                                                                {item.status ===
                                                                    "rejected" && (

                                                                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                                                        Ditolak
                                                                    </span>

                                                                )}

                                                            </td>


                                                            {/* AKSI */}

                                                            <td className="px-4 py-4">

                                                                {item.status ===
                                                                "pending" ? (

                                                                    <div className="flex justify-center gap-2">

                                                                        {/* ACC */}

                                                                        <button
                                                                            type="button"
                                                                            disabled={
                                                                                processingId ===
                                                                                item.id
                                                                            }
                                                                            onClick={() =>
                                                                                updateStatus(
                                                                                    item.id,
                                                                                    "approved"
                                                                                )
                                                                            }
                                                                            className="px-3 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white rounded-lg text-xs font-medium transition"
                                                                        >
                                                                            {processingId ===
                                                                            item.id
                                                                                ? "..."
                                                                                : "ACC"}
                                                                        </button>


                                                                        {/* TOLAK */}

                                                                        <button
                                                                            type="button"
                                                                            disabled={
                                                                                processingId ===
                                                                                item.id
                                                                            }
                                                                            onClick={() =>
                                                                                updateStatus(
                                                                                    item.id,
                                                                                    "rejected"
                                                                                )
                                                                            }
                                                                            className="px-3 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white rounded-lg text-xs font-medium transition"
                                                                        >
                                                                            Tolak
                                                                        </button>

                                                                    </div>

                                                                ) : (

                                                                    <div className="text-center text-gray-400 text-xs">
                                                                        -
                                                                    </div>

                                                                )}

                                                            </td>

                                                        </tr>

                                                    )
                                                )

                                            )}

                                        </tbody>

                                    </table>


                                    {/* ==========================================
                                        PAGINATION
                                    ========================================== */}

                                    {!loading &&
                                        filteredData.length >
                                            0 && (

                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-4 border-t border-gray-200 bg-white">

                                                {/* INFO */}

                                                <p className="text-sm text-gray-500">

                                                    Menampilkan{" "}

                                                    <span className="font-medium text-gray-700">
                                                        {startIndex +
                                                            1}
                                                    </span>

                                                    {" - "}

                                                    <span className="font-medium text-gray-700">
                                                        {Math.min(
                                                            startIndex +
                                                                itemsPerPage,
                                                            filteredData.length
                                                        )}
                                                    </span>

                                                    {" dari "}

                                                    <span className="font-medium text-gray-700">
                                                        {
                                                            filteredData.length
                                                        }
                                                    </span>

                                                    {" data"}

                                                </p>


                                                {/* BUTTON */}

                                                <div className="flex items-center justify-center gap-2">

                                                    {/* PREVIOUS */}

                                                    <button
                                                        type="button"
                                                        disabled={
                                                            currentPage ===
                                                            1
                                                        }
                                                        onClick={
                                                            previousPage
                                                        }
                                                        className="px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                                    >
                                                        Previous
                                                    </button>


                                                    {/* PAGE */}

                                                    <div className="min-w-[70px] text-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg">

                                                        {currentPage}

                                                        {" / "}

                                                        {totalPages ||
                                                            1}

                                                    </div>


                                                    {/* NEXT */}

                                                    <button
                                                        type="button"
                                                        disabled={
                                                            currentPage >=
                                                            totalPages
                                                        }
                                                        onClick={
                                                            nextPage
                                                        }
                                                        className="px-3 py-2 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                                                    >
                                                        Next
                                                    </button>

                                                </div>

                                            </div>

                                        )}

                                </div>

                            </div>

                        </div>

                    </div>

                </section>

            </main>

        </div>
    );
}