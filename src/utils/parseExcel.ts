import * as xlsx from "xlsx";
import { readLimitedRowsFromFile } from "../utils/readLimitedRowsFromFile";
import { detectHeaderRow } from "../utils/detectHeaderRow";
import { normalizeHeader } from "../utils/normalizeHeader";

export function parseExcel(filePath: string) {
    const rowsForSearchHeaders = readLimitedRowsFromFile(filePath, 0, 5);

    const indexHeadersRow = detectHeaderRow(rowsForSearchHeaders as any[][], [
        "Артикул",
        "Артикул товара",
        "Наименование товара",
        "Производитель",
        "Наименование",
        "Брэнд",
        "Вес",
    ]);

    const headers = (rowsForSearchHeaders as any[])[indexHeadersRow - 1].map(
        (h: string) => normalizeHeader(h)
    );

    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    return xlsx.utils.sheet_to_json<any>(sheet, {
        defval: null,
        header: headers,
        range: indexHeadersRow + 1,
    });
}
