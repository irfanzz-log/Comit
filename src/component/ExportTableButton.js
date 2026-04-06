import { useExportxlsx } from "@/hooks/useExportxlsx";

export default function ExportTableButton() {
    const { exportTableToExcel } = useExportxlsx();

    return (
        <div onClick={() => exportTableToExcel('table-data', 'Data')} className="p-3 w-full text-center bg-blue-600/80 rounded-md mx-2 cursor-pointer text-white hover:text-blue-700">
            Export to Excel
        </div>
    );
}