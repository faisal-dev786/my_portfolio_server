import mongoose from "mongoose";
import UiuxContact from "../models/uiuxContact.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const submitUiuxContactForm = async (req, res) => {
    try {
        const body = req.body ?? {};
        const { name, email, message } = body;

        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof message !== "string"
        ) {
            return res.status(400).json({
                message: "Name, email, and message are required"
            });
        }

        const cleanName = name.trim();
        const cleanEmail = email.trim().toLowerCase();
        const cleanMessage = message.trim();

        if (
            !cleanName ||
            !emailPattern.test(cleanEmail) ||
            !cleanMessage ||
            cleanName.length > 200 ||
            cleanEmail.length > 254 ||
            cleanMessage.length > 5000
        ) {
            return res.status(400).json({
                message: "Please provide valid contact form details"
            });
        }

        const contact = await UiuxContact.create({
            name: cleanName,
            email: cleanEmail,
            message: cleanMessage
        });

        return res.status(201).json({
            message: "UI/UX contact form submitted successfully",
            contact: {
                id: contact._id,
                name: contact.name,
                email: contact.email,
                message: contact.message,
                createdAt: contact.createdAt
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

export const getUiuxContactForms = async (req, res) => {
    try {
        const contacts = await UiuxContact.find()
            .sort({ createdAt: -1 })
            .select("-__v")
            .lean();

        return res.status(200).json({
            count: contacts.length,
            contacts
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

export const deleteUiuxContactForm = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid contact ID" });
        }

        const contact = await UiuxContact.findByIdAndDelete(req.params.id);
        if (!contact) {
            return res.status(404).json({ message: "UI/UX contact form not found" });
        }

        return res.status(200).json({
            message: "UI/UX contact form deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};
