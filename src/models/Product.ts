import { Schema, model } from "mongoose";

const ProductSchema = new Schema(
    {
        sku: { type: String, required: true, index: true },
        name: { type: String },
        brand: { type: String },
        currentPrice: { type: String },
        supplierId: { type: String },
    },
    { timestamps: true }
);

ProductSchema.index({ sku: 1 }, { unique: false });

export default model("Product", ProductSchema);
