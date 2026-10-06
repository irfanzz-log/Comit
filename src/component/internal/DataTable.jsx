"use client";

import { useMemo, useState } from "react";
import Icon from "@/component/internal/Icon";

const TEXT_ALIGN = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
};

/**
 * Tabel internal modern: desktop table + mobile card list, sorting,
 * empty/loading state. Pagination diserahkan ke parent (server-side)
 * lewat prop `pagination`.
 */
export default function DataTable({
    columns = [],
    data = [],
    loading = false,
    emptyMessage = "Tidak ada data ditemukan.",
    pagination = null,
    onRowClick,
    mobileCard,
}) {
    const [sort, setSort] = useState({ key: null, direction: "asc" });

    const sortedData = useMemo(() => {
        if (!sort.key) return data;
        const dir = sort.direction === "asc" ? 1 : -1;
        return [...data].sort((a, b) => {
            const av = a[sort.key];
            const bv = b[sort.key];
            if (av == null && bv == null) return 0;
            if (av == null) return 1;
            if (bv == null) return -1;
            if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
            return String(av).localeCompare(String(bv), "id") * dir;
        });
    }, [data, sort]);

    function handleSort(key) {
        setSort((prev) => {
            if (prev.key !== key) return { key, direction: "asc" };
            return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
        });
    }

    const rows = sortedData;

    return (
        <div className="space-y-4">
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-200 bg-white">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50/80">
                        <tr>
                            {columns.map((col) => {
                                const sortable = col.sortable !== false && col.key;
                                const isActive = sort.key === col.key;

                                return (
                                    <th
                                        key={col.key}
                                        scope="col"
                                        className={`px-4 py-3 ${TEXT_ALIGN[col.align || "left"]} text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap ${sortable ? "cursor-pointer select-none hover:text-gray-900" : ""}`}
                                        onClick={sortable ? () => handleSort(col.key) : undefined}
                                    >
                                        <span className="inline-flex items-center gap-1">
                                            {col.header}
                                            {sortable ? (
                                                <Icon
                                                    name="chevron"
                                                    size={12}
                                                    className={`transition-transform ${isActive ? "text-blue-600" : "text-gray-300"} ${isActive && sort.direction === "asc" ? "rotate-180" : ""}`}
                                                    strokeWidth={2.5}
                                                />
                                            ) : null}
                                        </span>
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr>
                                <td colSpan={columns.length} className="px-4 py-12 text-center text-sm text-gray-400">
                                    <div className="inline-flex items-center gap-2">
                                        <svg
                                            className="animate-spin h-4 w-4 text-blue-500"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            aria-hidden="true"
                                        >
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                            />
                                        </svg>
                                        Memuat data...
                                    </div>
                                </td>
                            </tr>
                        ) : rows.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="px-4 py-12 text-center text-sm text-gray-400">
                                    <div className="flex flex-col items-center gap-2">
                                        <Icon name="inbox" size={28} className="text-gray-300" />
                                        {emptyMessage}
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            rows.map((row, idx) => (
                                <tr
                                    key={row.id ?? idx}
                                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                                    className={`hover:bg-gray-50/70 transition-colors ${onRowClick ? "cursor-pointer" : ""}`}
                                >
                                    {columns.map((col) => (
                                        <td
                                            key={col.key}
                                            className={`px-4 py-3 text-sm text-gray-700 ${TEXT_ALIGN[col.align || "left"]} ${col.cellClassName || ""}`}
                                        >
                                            {col.render ? col.render(row, idx) : (row[col.key] ?? "-")}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile card view */}
            <div className="md:hidden space-y-3">
                {loading ? (
                    <div className="p-8 text-center text-sm text-gray-400 border border-gray-200 rounded-xl bg-white">
                        Memuat data...
                    </div>
                ) : rows.length === 0 ? (
                    <div className="p-8 text-center text-sm text-gray-400 border border-gray-200 rounded-xl bg-white">
                        {emptyMessage}
                    </div>
                ) : mobileCard ? (
                    rows.map((row, idx) => <div key={row.id ?? idx}>{mobileCard(row, idx)}</div>)
                ) : (
                    rows.map((row, idx) => (
                        <div
                            key={row.id ?? idx}
                            className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm"
                        >
                            {columns
                                .filter((c) => c.mobile !== false)
                                .map((col) => (
                                    <div key={col.key} className="flex justify-between items-center gap-3 py-1.5 text-sm">
                                        <span className="text-gray-500 shrink-0">{col.header}</span>
                                        <span className="text-right font-medium text-gray-900 min-w-0">
                                            {col.render ? col.render(row, idx) : (row[col.key] ?? "-")}
                                        </span>
                                    </div>
                                ))}
                        </div>
                    ))
                )}
            </div>

            {pagination}
        </div>
    );
}
