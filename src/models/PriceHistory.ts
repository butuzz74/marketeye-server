import { Schema, model } from "mongoose";

const priceHistorySchema = new Schema(
    {
        productId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Product",
            index: true,
        },
        supplierId: { type: String, required: true, index: true },
        date: { type: Date, required: true, index: true },
        price: { type: String, required: true },
    },
    { timestamps: true }
);

priceHistorySchema.index({ productId: 1, date: 1 });

export default model("PriceHistory", priceHistorySchema);
