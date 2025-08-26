import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import { UploadedFile } from "../models/index";

const checkDuplicateFileName = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Файл не был загружен" });
        }

        const existing = await UploadedFile.findOne({
            fileName: req.file.originalname,
        });

        if (existing) {
            const filePath = path.join(req.file.destination, req.file.filename);
            fs.unlink(filePath, (err) => {
                if (err) console.error("Ошибка при удалении дубликата:", err);
            });

            return res.status(409).json({
                message: `Файл "${req.file.originalname}" уже загружался ранее`,
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Ошибка проверки имени файла" });
    }
};

export default checkDuplicateFileName;
