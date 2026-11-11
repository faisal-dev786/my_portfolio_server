import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
    deleteUiuxContactForm,
    getUiuxContactForms,
    submitUiuxContactForm
} from "../controller/uiuxContactController.js";
import {
    deleteUiuxEmailContact,
    getUiuxEmailContacts,
    submitUiuxEmailContact
} from "../controller/uiuxEmailContactController.js";

const uiuxContactRouter = express.Router();

uiuxContactRouter.post("/contact", submitUiuxContactForm);
uiuxContactRouter.get("/contact", authMiddleware, getUiuxContactForms);
uiuxContactRouter.delete("/contact/:id", authMiddleware, deleteUiuxContactForm);
uiuxContactRouter.post("/email-contact", submitUiuxEmailContact);
uiuxContactRouter.get("/email-contact", authMiddleware, getUiuxEmailContacts);
uiuxContactRouter.delete(
    "/email-contact/:id",
    authMiddleware,
    deleteUiuxEmailContact
);

export default uiuxContactRouter;
