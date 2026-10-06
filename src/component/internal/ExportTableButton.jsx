"use client";

import { useExportxlsx } from "@/hooks/useExportxlsx";
import Icon from "@/component/internal/Icon";

export default function ExportTableButton({ tableId = "table-data", filename = "Data" }) {
    const { exportTableToExcel } = useExportxlsx();

    return (
        <button
            type="button"
            onClick={() => exportTableToExcel(tableId, filename)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 active:bg-gray-100 rounded-lg text-sm font-medium transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 cursor-pointer"
        >
            <Icon name="download" size={16} />
            <span>Export Excel</span>
        </button>
    );
}
