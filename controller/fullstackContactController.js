import mongoose from "mongoose";
import FullstackContact from "../models/fullstackContact.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const submitFullstackContactForm = async (req, res) => {
    try {
        const body = req.body ?? {};
        const firstName = body.firstName ?? body.firstname;
        const lastName = body.lastName ?? body.lastname;
        const { email, message } = body;

        if (
            typeof firstName !== "string" ||
            typeof lastName !== "string" ||
            typeof email !== "string" ||
            typeof message !== "string"
        ) {
            return res.status(400).json({
                message: "First name, last name, email, and message are required"
            });
        }

        const cleanFirstName = firstName.trim();
        const cleanLastName = lastName.trim();
        const cleanEmail = email.trim().toLowerCase();
        const cleanMessage = message.trim();

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

        const contact = await FullstackContact.create({
            firstName: cleanFirstName,
            lastName: cleanLastName,
            email: cleanEmail,
            message: cleanMessage
        });

        return res.status(201).json({
            message: "Fullstack contact form submitted successfully",
            contact: {
                id: contact._id,
                firstName: contact.firstName,
                lastName: contact.lastName,
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

export const getFullstackContactForms = async (req, res) => {
    try {
        const contacts = await FullstackContact.find()
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

export const deleteFullstackContactForm = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid contact ID" });
        }

        const contact = await FullstackContact.findByIdAndDelete(req.params.id);

        if (!contact) {
            return res.status(404).json({ message: "Fullstack contact form not found" });
        }

        return res.status(200).json({ message: "Fullstack contact form deleted successfully" });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};
