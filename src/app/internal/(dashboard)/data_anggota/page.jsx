"use client";

import PageContainer from "@/component/internal/PageContainer";
import DataTable from "@/component/internal/DataTable";
import Pagination from "@/component/internal/Pagination";
import FilterBar from "@/component/internal/FilterBar";
import FilterDropdown from "@/component/internal/FilterDropdown";
import ExportTableButton from "@/component/internal/ExportTableButton";
import { StatusBadge } from "@/component/internal/Badge";
import useUserFilter from "@/hooks/useUserFilter";
import { POSISI_OPTIONS, STATUS_ANGGOTA_OPTIONS, MINAT_OPTIONS } from "@/lib/constants";

export function DataAnggota() {
    const {
        name,
        setName,
        dataAnggota,
        page,
        setPage,
        totalPages,
        totalUsers,
        toggleStatus,
        setToggleStatus,
        togglePosisi,
        setTogglePosisi,
        toggleMinat,
        setToggleMinat,
        handleSearch,
    } = useUserFilter();

    const hasFilter =
        name !== "" ||
        toggleStatus !== "Filter by status" ||
        togglePosisi !== "Filter by posisi" ||
        toggleMinat !== "Filter by minat";

    function resetFilters() {
        setName("");
        setToggleStatus("Filter by status");
        setTogglePosisi("Filter by posisi");
        setToggleMinat("Filter by minat");
    }

    const columns = [
        { key: "no", header: "No", sortable: false, render: (_row, idx) => (page - 1) * 10 + idx + 1 },
        { key: "nama", header: "Nama Lengkap" },
        { key: "user_npm", header: "NPM" },
        { key: "jurusan", header: "Jurusan" },
        { key: "minat", header: "Minat" },
        {
            key: "status",
            header: "Status",
            render: (row) => <StatusBadge status={row.status} />,
        },
        { key: "posisi", header: "Posisi" },
    ];

    return (
        <PageContainer
            title="Data Anggota"
            subtitle="Daftar seluruh anggota organisasi COMIT"
            actions={<ExportTableButton tableId="table-data" filename="Data_Anggota_COMIT" />}
        >
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
                    value={togglePosisi === "Filter by posisi" ? "" : togglePosisi}
                    onChange={(v) => {
                        setTogglePosisi(v || "Filter by posisi");
                        setPage(1);
                    }}
                    placeholder="Semua posisi"
                />
                <FilterDropdown
                    label="Status"
                    options={STATUS_ANGGOTA_OPTIONS}
                    value={toggleStatus === "Filter by status" ? "" : toggleStatus}
                    onChange={(v) => {
                        setToggleStatus(v || "Filter by status");
                        setPage(1);
                    }}
                    placeholder="Semua status"
                />
                <FilterDropdown
                    label="Minat"
                    options={MINAT_OPTIONS}
                    value={toggleMinat === "Filter by minat" ? "" : toggleMinat}
                    onChange={(v) => {
                        setToggleMinat(v || "Filter by minat");
                        setPage(1);
                    }}
                    placeholder="Semua minat"
                />
            </FilterBar>

            <div className="hidden">
                {/* Tabel tersembunyi yang dibaca oleh ExportTableButton (xlsx
                    memerlukan node <table> di DOM). Tampilan utama memakai
                    DataTable yang responsif. */}
                <table id="table-data">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Nama</th>
                            <th>NPM</th>
                            <th>Jurusan</th>
                            <th>Minat</th>
                            <th>Status</th>
                            <th>Posisi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataAnggota.map((d, i) => (
                            <tr key={d.user_npm ?? i}>
                                <td>{(page - 1) * 10 + i + 1}</td>
                                <td>{d.nama}</td>
                                <td>{d.user_npm}</td>
                                <td>{d.jurusan}</td>
                                <td>{d.minat}</td>
                                <td>{d.status}</td>
                                <td>{d.posisi}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <DataTable
                columns={columns}
                data={dataAnggota}
                loading={dataAnggota.length === 0}
                emptyMessage="Tidak ada anggota yang cocok dengan filter."
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
    return <DataAnggota />;
}
