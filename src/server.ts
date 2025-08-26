import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import config from "./config";
import uploadRoutes from "./routes/upload.routes";
import supplierRoutes from "./routes/supplier.routes";
import productRoutes from "./routes/product.routes";
import productHistoryRoutes from "./routes/productHistory.routes";

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.urlencoded({ extended: true }));

app.use("/upload", uploadRoutes);
app.use("/supplier", supplierRoutes);
app.use("/product", productRoutes);
app.use("/productHistory", productHistoryRoutes);

mongoose
    .connect(String(config.MONGO_URI))
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB error:", err));

const PORT = parseInt(config.PORT || "4001", 10);
app.listen(PORT, "0.0.0.0", () => console.log("Listening on all interfaces"));
