import mongoose from "mongoose";
import VisualsEmailContact from "../models/visualsEmailContact.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const getVisualsEmailContacts = async (req, res) => {
    try {
        const contacts = await VisualsEmailContact.find()
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

export const deleteVisualsEmailContact = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid contact ID" });
        }

        const contact = await VisualsEmailContact.findByIdAndDelete(req.params.id);

        if (!contact) {
            return res.status(404).json({ message: "Visuals email contact not found" });
        }

        return res.status(200).json({ message: "Visuals email contact deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const submitVisualsEmailContact = async (req, res) => {
    try {
        const email = typeof req.body.email === "string"
            ? req.body.email.trim().toLowerCase()
            : "";

        if (!email || !emailPattern.test(email)) {
            return res.status(400).json({
                message: "A valid email is required"
            });
        }

        const contact = await VisualsEmailContact.create({ email });

        return res.status(201).json({
            message: "Visuals contact email submitted successfully",
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