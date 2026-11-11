import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
    deleteFullstackContactForm,
    getFullstackContactForms,
    submitFullstackContactForm
} from "../controller/fullstackContactController.js";
import {
    deleteFullstackMeeting,
    getFullstackMeetings,
    submitFullstackMeeting
} from "../controller/fullstackMeetingController.js";

const fullstackContactRouter = express.Router();

fullstackContactRouter.post("/contact", submitFullstackContactForm);
fullstackContactRouter.get("/contact", authMiddleware, getFullstackContactForms);
fullstackContactRouter.delete(
    "/contact/:id",
    authMiddleware,
    deleteFullstackContactForm
);

fullstackContactRouter.post("/meeting", submitFullstackMeeting);
fullstackContactRouter.get("/meeting", authMiddleware, getFullstackMeetings);
fullstackContactRouter.delete(
    "/meeting/:id",
    authMiddleware,
    deleteFullstackMeeting
);

export default fullstackContactRouter;
