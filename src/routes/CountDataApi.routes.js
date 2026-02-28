import express from "express";
import { getDashboardCounts } from "../controllers/dashboard.controller";
import { asyncHandler } from "../middlewares/errorHandler";

const dashboardRouter = express.Router();

dashboardRouter.get(
  "/counts",
  asyncHandler(getDashboardCounts)
);

export default dashboardRouter;