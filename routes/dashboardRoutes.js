import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { getFullstackDashboard } from "../controller/fullstackDashboardController.js";

const dashboardRouter = express.Router();

dashboardRouter.get("/", authMiddleware, getFullstackDashboard);

export default dashboardRouter;
