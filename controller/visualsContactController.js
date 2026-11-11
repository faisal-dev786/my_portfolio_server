import mongoose from "mongoose";
import VisualsContact from "../models/visualsContact.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const submitVisualsContactForm = async (req, res) => {
    try {
        const body = req.body ?? {};
        const firstName = body.firstName ?? body.firstname;
        const lastName = body.lastName ?? body.lastname;
        const { email, message, messafe } = body;
        const contactMessage = message || messafe;

        if (
            typeof firstName !== "string" ||
            typeof lastName !== "string" ||
            typeof email !== "string" ||
            typeof contactMessage !== "string"
        ) {
            return res.status(400).json({
                message: "First name, last name, email, and message are required"
            });
        }

        const cleanFirstName = firstName.trim();
        const cleanLastName = lastName.trim();
        const cleanEmail = email.trim().toLowerCase();
        const cleanMessage = contactMessage.trim();

        if (
            !cleanFirstName ||
            !cleanLastName ||
            !cleanMessage ||
            !emailPattern.test(cleanEmail) ||
            cleanFirstName.length > 100 ||
            cleanLastName.length > 100 ||
            cleanEmail.length > 254 ||
            cleanMessage.length > 5000
        ) {
            return res.status(400).json({
                message: "Please provide valid contact form details"
            });
        }
        const contact = await VisualsContact.create({
            firstName: cleanFirstName,
            lastName: cleanLastName,
            email: cleanEmail,
            message: cleanMessage
        });

        return res.status(201).json({
            message: "Visuals contact form submitted successfully",
            contact: {
                id: contact._id,
                firstName: contact.firstName,
                lastName: contact.lastName,
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