import mongoose from "mongoose";
import FullstackMeeting from "../models/fullstackMeeting.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const submitFullstackMeeting = async (req, res) => {
    try {
        const body = req.body ?? {};
        const { email, profession } = body;

        if (typeof email !== "string" || typeof profession !== "string") {
            return res.status(400).json({
                message: "Email and profession are required"
            });
        }

        const cleanEmail = email.trim().toLowerCase();
        const cleanProfession = profession.trim();

        if (
            !emailPattern.test(cleanEmail) ||
            cleanEmail.length > 254 ||
            !cleanProfession ||
            cleanProfession.length > 100
        ) {
            return res.status(400).json({
                message: "Please provide a valid email and profession"
            });
        }

        const meeting = await FullstackMeeting.create({
            email: cleanEmail,
            profession: cleanProfession
        });

        return res.status(201).json({
            message: "Fullstack meeting request submitted successfully",
            meeting: {
                id: meeting._id,
                email: meeting.email,
                profession: meeting.profession,
                createdAt: meeting.createdAt
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

export const getFullstackMeetings = async (req, res) => {
    try {
        const meetings = await FullstackMeeting.find()
            .sort({ createdAt: -1 })
            .select("-__v")
            .lean();

        return res.status(200).json({
            count: meetings.length,
            meetings
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

export const deleteFullstackMeeting = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid meeting ID" });
        }

        const meeting = await FullstackMeeting.findByIdAndDelete(req.params.id);

        if (!meeting) {
            return res.status(404).json({ message: "Fullstack meeting not found" });
        }

        return res.status(200).json({
            message: "Fullstack meeting deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};
