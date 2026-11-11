import mongoose from "mongoose";

const uiuxEmailContactSchema = new mongoose.Schema(
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

const UiuxEmailContact = mongoose.model(
    "UiuxEmailContact",
    uiuxEmailContactSchema
);

export default UiuxEmailContact;
