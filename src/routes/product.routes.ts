import { Router } from "express";
import {getProducts  } from "../controllers/product.controllers";

const router = Router();

router.get("/", getProducts);

export default router;

