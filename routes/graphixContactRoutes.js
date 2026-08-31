import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
    deleteGraphixContactForm,
    getGraphixContactForms,
    submitGraphixContactForm
} from "../controller/graphixContactController.js";

const graphixContactRouter = express.Router();

graphixContactRouter.post("/contact", submitGraphixContactForm);
graphixContactRouter.get("/contact", authMiddleware, getGraphixContactForms);
graphixContactRouter.delete("/contact/:id", authMiddleware, deleteGraphixContactForm);

export default graphixContactRouter;