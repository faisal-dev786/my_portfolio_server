import mongoose from "mongoose";
import UiuxEmailContact from "../models/uiuxEmailContact.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const submitUiuxEmailContact = async (req, res) => {
    try {
        const email = typeof req.body?.email === "string"
            ? req.body.email.trim().toLowerCase()
            : "";

        if (!email || email.length > 254 || !emailPattern.test(email)) {
            return res.status(400).json({
                message: "A valid email is required"
            });
        }

        const contact = await UiuxEmailContact.create({ email });

        return res.status(201).json({
            message: "UI/UX contact email submitted successfully",
            contact: {
                id: contact._id,
                email: contact.email,
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

export const getUiuxEmailContacts = async (req, res) => {
    try {
        const contacts = await UiuxEmailContact.find()
            .sort({ createdAt: -1 })
            .select("email createdAt")
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

export const deleteUiuxEmailContact = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid contact ID" });
        }

        const contact = await UiuxEmailContact.findByIdAndDelete(req.params.id);
        if (!contact) {
            return res.status(404).json({ message: "UI/UX email contact not found" });
        }

        return res.status(200).json({
            message: "UI/UX email contact deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};
