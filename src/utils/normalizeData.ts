import { checkEmptyRow } from "../utils/checkEmptyRow";

export function normalizeData(rows: any[]) {
    const normalized: Array<{
        sku: string;
        name?: string;
        brand?: string;
        price?: string;
    }> = [];
    for (const r of rows) {
        if (checkEmptyRow(r)) continue;
        const sku = r["артикул"] ?? r["артикул товара"];
        const price = String(
            r["цпп"] ??
                r["рдп без ндс"] ??
                r["цена, рубль"] ??
                r["персональная цена, руб."] ??
                "0"
        );

        if (!sku) continue;
        normalized.push({
            sku: String(sku).trim(),
            name: (
                r["наименование"] ??
                r["наименование товара"] ??
                "Неизвестный товар"
            )
                ?.toString()
                .trim(),
            brand: r["брэнд"] ?? r["производитель"] ?? "Не указан",
            price,
        });
    }
    return normalized;
}
