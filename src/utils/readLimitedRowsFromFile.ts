import * as XLSX from "xlsx";

export function readLimitedRowsFromFile(
    path: string,
    startRow: number,
    limit: number
) {
    const workbook = XLSX.readFile(path);

    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const allData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    return allData.slice(startRow, startRow + limit);
}
