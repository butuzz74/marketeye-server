import { NormalizedData, SkuToProductId } from "../types";

export function getPriceHistoryBulkOps(
    normalized: NormalizedData[],
    skuToProductId: SkuToProductId,
    supplierId: string,
    priceDate: Date
) {
    const priceHistoryBulkOps: Array<any> = [];
    for (const item of normalized) {
        const pid = skuToProductId.get(item.sku);
        if (!pid) continue;
        priceHistoryBulkOps.push({
            insertOne: {
                document: {
                    productId: pid,
                    supplierId,
                    date: priceDate,
                    price: item.price,
                },
            },
        });
    }
    return priceHistoryBulkOps;
}
