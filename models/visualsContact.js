import mongoose from "mongoose";

const visualsContactSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },
        name: {
            type: String,
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

const VisualsContact = mongoose.model("VisualsContact", visualsContactSchema);
export default VisualsContact;