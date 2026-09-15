'use client';

import { useExportxlsx } from "@/hooks/useExportxlsx";

export default function ExportTableButton({ tableId = "table-data", filename = "Data" }) {
    const { exportTableToExcel } = useExportxlsx();

    return (
        <button
            type="button"
            onClick={() => exportTableToExcel(tableId, filename)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white rounded-lg text-sm font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 cursor-pointer"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
            >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <path d="M8 13h8" />
                <path d="M8 17h5" />
            </svg>
            <span>Export Excel</span>
        </button>
    );
}