import { Request, Response } from "express";
import { Product } from "../models/index";

type Query = {
    product: string;
    supplierId: string;
};

export const getProducts = async (req: Request, res: Response) => {
    const { product, supplierId } = req.query as Query;

    try {
        if (product) {
            const selectedProducts = await Product.find({
                name: { $regex: product, $options: "i" },
                supplierId,
            })
                .select("-__v -createdAt -updatedAt")
                .limit(20);

            if (selectedProducts && selectedProducts.length !== 0) {
                res.status(200).send(selectedProducts);
            } else {
                res.status(404).json({
                    error: "Такого товара у данного поставщика нет",
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
