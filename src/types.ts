export type NormalizedData = {
    sku: string;
    name?: string;
    brand?: string;
    price?: string;
};

export type SkuToProductId = Map<string, string>;
