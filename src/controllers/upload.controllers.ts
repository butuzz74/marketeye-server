import { Request, Response } from "express";
import fs from "fs/promises";
import path from "path";
import {
    extractDateFromFilename,
    parseExcel,
    normalizeData,
    getProductBulkOps,
    getPriceHistoryBulkOps,
} from "../utils/index";
import { Product, PriceHistory, Supplier, UploadedFile } from "../models/index";

export const uploadFile = async (req: Request, res: Response) => {
    let supplierId = "";
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Файл не загружен" });
        }
        const filePath = path.resolve(req.file.path);
        const originalName = req.file.originalname;

        const existingFile = await UploadedFile.findOne({
            fileName: originalName,
        });

        if (existingFile) {
            fs.unlink(filePath);

            return res.status(409).json({
                error: "Этот файл ранее уже был загружен. Попробуйте загрузить другой.",
            });
        } else {
            await UploadedFile.create({ fileName: req.file.originalname });
        }

        const regexForsupplierName = /^(?:[^0-9]*[0-9]){0,4}[^0-9]*$/;
        const supplierName = req.body.supplier;
        if (regexForsupplierName.test(supplierName)) {
            const newSupplier = await Supplier.create({ name: supplierName });
            supplierId = String(newSupplier._id);
        } else {
            supplierId = (req.body.supplier as string) || "unknown-supplier";
        }
        let priceDate =
            extractDateFromFilename(originalName) ||
            (req.body.priceDate ? new Date(req.body.priceDate) : null) ||
            new Date();

        const rows = parseExcel(filePath);

        if (!rows || rows.length === 0) {
            await fs.unlink(filePath);
            return res
                .status(400)
                .json({ error: "Файл пустой или не удалось распарсить" });
        }
        const normalized = normalizeData(rows);
        if (normalized.length === 0) {
            await fs.unlink(filePath);
            return res
                .status(400)
                .json({ error: "Нет валидных строк (sku+price) в прайсе" });
        }
        const skus = [...new Set(normalized.map((p) => p.sku))];
        const existing = await Product.find({ sku: { $in: skus } }).lean();
        const skuToProductId = new Map<string, string>();
        for (const p of existing) {
            if (p.sku) skuToProductId.set(p.sku, String(p._id));
        }
        const productBulkOps = getProductBulkOps(
            normalized,
            skuToProductId,
            supplierId
        );

        if (productBulkOps.length > 0) {
            await Product.bulkWrite(productBulkOps, {
                ordered: false,
            });
            productBulkOps.length = 0;
        }
        const refreshedProducts = await Product.find(
            { sku: { $in: skus } },
            { _id: 1, sku: 1 }
        ).lean();
        skuToProductId.clear();
        for (const p of refreshedProducts) {
            if (p.sku) skuToProductId.set(p.sku, String(p._id));
        }
        const priceHistoryBulkOps = getPriceHistoryBulkOps(
            normalized,
            skuToProductId,
            supplierId,
            priceDate
        );
        if (priceHistoryBulkOps.length > 0) {
            await PriceHistory.bulkWrite(priceHistoryBulkOps, {
                ordered: false,
            });
            priceHistoryBulkOps.length = 0;
        }
        return res.json({
            message: "Прайс обработан",
            rows: normalized.length,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Ошибка при обработке файла" });
    }
};
