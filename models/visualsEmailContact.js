import mongoose from "mongoose";

const visualsEmailContactSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            maxlength: 254
        }
    },
    { timestamps: true }
);

const VisualsEmailContact = mongoose.model(
    "VisualsEmailContact",
    visualsEmailContactSchema
);

export default VisualsEmailContact;