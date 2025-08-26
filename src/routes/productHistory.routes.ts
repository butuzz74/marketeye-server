import { Router } from "express";
import { getProductHistory } from "../controllers/priceHistory.controllers";

const router = Router();

router.get("/", getProductHistory);

export default router;
