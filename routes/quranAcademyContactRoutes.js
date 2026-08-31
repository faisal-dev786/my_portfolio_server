import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
	deleteQuranAcademyContactForm,
    getQuranAcademyContactForms,
    submitQuranAcademyContactForm
} from "../controller/quranAcademyContactController.js";

const quranAcademyContactRouter = express.Router();

quranAcademyContactRouter.post("/contact", submitQuranAcademyContactForm);
quranAcademyContactRouter.get(
    "/contact",
    authMiddleware,
    getQuranAcademyContactForms
);
quranAcademyContactRouter.delete(
    "/contact/:id",
    authMiddleware,
    deleteQuranAcademyContactForm
);

export default quranAcademyContactRouter;