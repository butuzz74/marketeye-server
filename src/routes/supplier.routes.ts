import { Router } from "express";
import { getSuppliers } from "../controllers/supplier.controllers";

const router = Router();

router.get("/", getSuppliers);

export default router;
