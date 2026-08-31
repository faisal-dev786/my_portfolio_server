import mongoose from "mongoose";
import GraphixContact from "../models/graphixContact.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const submitGraphixContactForm = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const contactMessage = message;

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

        const contact = await GraphixContact.create({
            name: cleanName,
            email: cleanEmail,
            message: cleanMessage
        });

        return res.status(201).json({
            message: "Contact form submitted successfully",
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