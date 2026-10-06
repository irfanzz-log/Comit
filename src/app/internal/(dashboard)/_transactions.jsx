"use client";

import PageContainer from "@/component/internal/PageContainer";
import DataTable from "@/component/internal/DataTable";
import Pagination from "@/component/internal/Pagination";
import FilterBar from "@/component/internal/FilterBar";
import ExportTableButton from "@/component/internal/ExportTableButton";
import TransactionForm from "@/component/internal/TransactionForm";
import useTransactions from "@/hooks/useTransactions";
import { useAuth } from "@/app/context/AuthContext";
import { formatCurrency, formatDateTime, canManageFinance } from "@/lib/constants";
import { Suspense } from "react";

function TransactionTable({ tipe, kategori, title, showTarget = false }) {
    const { name, setName, dataAnggota, loading, page, setPage, totalPages, totalUsers, handleSearch } =
        useTransactions({ tipe, kategori });

    const columns = [
        { key: "no", header: "No", sortable: false, render: (_row, idx) => (page - 1) * 10 + idx + 1 },
        { key: "nama_penginput", header: "Penanggung Jawab" },
        ...(showTarget ? [{ key: "ditujukan_ke", header: "Anggota" }] : []),
        { key: "deskripsi", header: "Deskripsi" },
        {
            key: "jumlah",
            header: "Jumlah",
            align: "right",
            render: (row) => (
                <span className={tipe === "pemasukkan" ? "text-emerald-600" : "text-red-600"}>
                    {tipe === "pemasukkan" ? "+" : "-"}
                    {formatCurrency(row.jumlah)}
                </span>
            ),
        },
        {
            key: "created_at",
            header: "Tanggal Input",
            render: (row) => formatDateTime(row.created_at),
        },
    ];

    return (
        <PageContainer
            title={title}
            actions={<ExportTableButton tableId="table-data" filename={`Data_${title.replace(/\s/g, "_")}_COMIT`} />}
        >
            <FilterBar
                searchValue={name}
                onSearchChange={(e) => setName(e.target.value)}
                onSearchSubmit={handleSearch}
                showReset={name !== ""}
                onReset={() => setName("")}
            />

            <div className="hidden">
                <table id="table-data">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Penanggung Jawab</th>
                            {showTarget ? <th>Anggota</th> : null}
                            <th>Deskripsi</th>
                            <th>Jumlah</th>
                            <th>Tanggal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataAnggota.map((d, i) => (
                            <tr key={`${d.id}-${i}`}>
                                <td>{(page - 1) * 10 + i + 1}</td>
                                <td>{d.nama_penginput}</td>
                                {showTarget ? <td>{d.ditujukan_ke}</td> : null}
                                <td>{d.deskripsi}</td>
                                <td>{Number(d.jumlah).toLocaleString("id-ID")}</td>
                                <td>{formatDateTime(d.created_at)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <DataTable
                columns={columns}
                data={dataAnggota}
                loading={loading}
                emptyMessage="Belum ada data transaksi."
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

export function DataPemasukkan() {
    const { user } = useAuth();
    return (
        <div className="space-y-6">
            {canManageFinance(user?.user_role) ? (
                <TransactionForm
                    tipe="pemasukkan"
                    kategori="lainnya"
                    title="Tambah Pemasukkan"
                    submitLabel="Simpan Pemasukkan"
                />
            ) : null}
            <TransactionTable tipe="pemasukkan" kategori="" title="Data Pemasukkan" />
        </div>
    );
}

export function DataPengeluaran() {
    const { user } = useAuth();
    return (
        <div className="space-y-6">
            {canManageFinance(user?.user_role) ? (
                <TransactionForm
                    tipe="pengeluaran"
                    kategori="lainnya"
                    title="Tambah Pengeluaran"
                    submitLabel="Simpan Pengeluaran"
                />
            ) : null}
            <TransactionTable tipe="pengeluaran" kategori="" title="Data Pengeluaran" />
        </div>
    );
}

export function DataUangKas() {
    const { user } = useAuth();
    return (
        <div className="space-y-6">
            {canManageFinance(user?.user_role) ? (
                <TransactionForm
                    tipe="pemasukkan"
                    kategori="kas"
                    title="Tambah Uang Kas"
                    submitLabel="Simpan Kas"
                />
            ) : null}
            <TransactionTable tipe="pemasukkan" kategori="kas" title="Data Uang Kas" showTarget />
        </div>
    );
}

export default function Page() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-sm text-gray-400">Memuat...</div>}>
            <DataPemasukkan />
        </Suspense>
    );
}
