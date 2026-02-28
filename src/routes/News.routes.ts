import express from "express";
import {
  createNews,
  getAllNews,
  getSingleNews,
  updateNews,
  deleteNews,
} from "../controllers/news.controller";
import { authenticateAdmin } from "../middlewares/authMiddleware";
import { asyncHandler } from "../middlewares/errorHandler";

const newsRouter = express.Router();

/* ---------- PUBLIC ---------- */

newsRouter.get("/", asyncHandler(getAllNews));
newsRouter.get("/:id", asyncHandler(getSingleNews));

/* ---------- PROTECTED ---------- */

newsRouter.use(authenticateAdmin);

newsRouter.post("/", asyncHandler(createNews));
newsRouter.put("/:id", asyncHandler(updateNews));
newsRouter.delete("/:id", asyncHandler(deleteNews));

export default newsRouter;