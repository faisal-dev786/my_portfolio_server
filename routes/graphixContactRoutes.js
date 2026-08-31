import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";

import {
    submitGraphixContactForm
} from "../controller/graphixContactController.js";

const graphixContactRouter = express.Router();
graphixContactRouter.post("/contact", submitGraphixContactForm);

export default graphixContactRouter;