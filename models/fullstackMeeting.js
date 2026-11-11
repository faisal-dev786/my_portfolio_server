import mongoose from "mongoose";

const fullstackMeetingSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            maxlength: 254
        },
        profession: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        }
    },
    { timestamps: true }
);

const FullstackMeeting = mongoose.model(
    "FullstackMeeting",
    fullstackMeetingSchema
);

export default FullstackMeeting;
