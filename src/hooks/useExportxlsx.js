import * as XLSX from 'xlsx';

export const useExportxlsx = () => {
        const exportTableToExcel = (tableName, fileName) => {
            const table = document.getElementById(tableName);
            const workbook = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });
            XLSX.writeFile(workbook, `${fileName}.xlsx`);
        };

        return { exportTableToExcel };
}