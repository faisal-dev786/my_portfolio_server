import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
	deleteVisualsEmailContact,
    getVisualsEmailContacts,
    submitVisualsEmailContact
} from "../controller/visualsEmailContactController.js";
import {
	deleteVisualsContactForm,
    getVisualsContactForms,
    submitVisualsContactForm
} from "../controller/visualsContactController.js";

const visualsContactRouter = express.Router();

visualsContactRouter.post("/contact", submitVisualsContactForm);
visualsContactRouter.post("/email-contact", submitVisualsEmailContact);
visualsContactRouter.get("/email-contact", authMiddleware, getVisualsEmailContacts);
visualsContactRouter.delete("/email-contact/:id", authMiddleware, deleteVisualsEmailContact);
visualsContactRouter.get("/contact", authMiddleware, getVisualsContactForms);
visualsContactRouter.delete("/contact/:id", authMiddleware, deleteVisualsContactForm);

export default visualsContactRouter;