import { Schema, model } from "mongoose";

const UploadedFileSchema = new Schema(
    {
        fileName: { type: String, required: true, unique: true },
        uploadedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export default model("UploadedFile", UploadedFileSchema);
