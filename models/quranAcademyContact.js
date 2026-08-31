import mongoose from "mongoose";

const quranAcademyContactSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
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

const QuranAcademyContact = mongoose.model(
    "QuranAcademyContact",
    quranAcademyContactSchema
);

export default QuranAcademyContact;