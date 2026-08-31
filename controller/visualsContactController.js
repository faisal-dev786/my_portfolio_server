import mongoose from "mongoose";
import VisualsContact from "../models/visualsContact.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const submitVisualsContactForm = async (req, res) => {
    try {
        const { name, email, message, messafe } = req.body;
        const contactMessage = message || messafe;

        if (!name || !email || !contactMessage) {
            return res.status(400).json({
                message: "Name, email, and message are required"
            });
        }

        const cleanName = name.trim();
        const cleanEmail = email.trim().toLowerCase();
        const cleanMessage = contactMessage.trim();

        if (!cleanName || !cleanMessage || !emailPattern.test(cleanEmail)) {
            return res.status(400).json({
                message: "Please provide a valid name, email, and message"
            });
        }

        const contact = await VisualsContact.create({
            name: cleanName,
            email: cleanEmail,
            message: cleanMessage
        });

        return res.status(201).json({
            message: "Visuals contact form submitted successfully",
            contact: {
                id: contact._id,
                name: contact.name,
                email: contact.email,
                message: contact.message
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

export const getVisualsContactForms = async (req, res) => {
    try {
        const contacts = await VisualsContact.find()
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

export const deleteVisualsContactForm = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid contact ID" });
        }

        const contact = await VisualsContact.findByIdAndDelete(req.params.id);

        if (!contact) {
            return res.status(404).json({ message: "Visuals contact form not found" });
        }

        return res.status(200).json({ message: "Visuals contact form deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};