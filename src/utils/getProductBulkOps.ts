import { NormalizedData, SkuToProductId } from "../types";

export function getProductBulkOps(
    normalized: NormalizedData[],
    skuToProductId: SkuToProductId,
    supplierId: string
) {
    const productBulkOps: Array<any> = [];
    for (const item of normalized) {
        const existingId = skuToProductId.get(item.sku);
        if (existingId) {
            productBulkOps.push({
                updateOne: {
                    filter: { _id: existingId },
                    update: {
                        $set: {
                            currentPrice: item.price,
                            name: item.name,
                            brand: item.brand,
                            supplierId,
                        },
                    },
                },
            });
        } else {
            const newProductDoc: any = {
                sku: item.sku,
                name: item.name,
                brand: item.brand,
                currentPrice: item.price,
                supplierId,
            };

            productBulkOps.push({
                updateOne: {
                    filter: { sku: item.sku },
                    update: {
                        $setOnInsert: newProductDoc,
                    },
                    upsert: true,
                },
            });
        }
    }
    return productBulkOps;
}
