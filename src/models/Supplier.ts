import { Schema, model } from "mongoose";

const SupplierSchema = new Schema({ name: String }, { timestamps: true });

export default model("Supplier", SupplierSchema);
