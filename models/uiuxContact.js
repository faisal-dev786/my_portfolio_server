import mongoose from "mongoose";

const uiuxContactSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            maxlength: 254
        },
        message: {
            type: String,
            required: true,
            trim: true,
            maxlength: 5000
        }
    },
    { timestamps: true }
);

const UiuxContact = mongoose.model("UiuxContact", uiuxContactSchema);

export default UiuxContact;
