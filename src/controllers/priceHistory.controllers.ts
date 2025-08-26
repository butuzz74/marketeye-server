import { Request, Response } from "express";
import { PriceHistory } from "../models/index";
import mongoose from "mongoose";

type Query = {
    productId?: mongoose.Types.ObjectId;
    supplierId?: string;
};

export const getProductHistory = async (req: Request, res: Response) => {
    const query: Query = {};
    const { productId, supplierId } = req.query;
    if (productId && typeof productId === "string")
        query.productId = new mongoose.Types.ObjectId(productId);
    if (supplierId && typeof supplierId === "string")
        query.supplierId = supplierId;
    try {
        if (productId && supplierId) {
            const productHistory = await PriceHistory.find(query).select(
                "-__v -createdAt -updatedAt"
            );

            if (productHistory) {
                res.status(200).send(productHistory);
            } else {
                res.status(400).json({
                    error: "О данном товаре данных нет",
                });
            }
        } else {
            res.status(400).json({
                error: "Данные о выбранном товаре и поставщике не переданы",
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Ошибка при обработке данных" });
    }
};
