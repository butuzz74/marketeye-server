import { Request, Response } from "express";
import { Supplier } from "../models/index";

export const getSuppliers = async (req: Request, res: Response) => {
    try {
        const suppliers = await Supplier.find();

        if (suppliers && suppliers.length !== 0) {
            res.status(200).send(suppliers);
        } else {
            res.status(400).json({ error: "Данные о поставщиках отсутствуют" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Ошибка при обработке данных" });
    }
};
