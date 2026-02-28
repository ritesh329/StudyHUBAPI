import express from "express";
import {
  createTopic,
  updateTopic,
  getTopics,
  getSingleTopic,
  deleteTopic
} from "../controllers/NotesBlog/topic.controller";

import { authenticateAdmin } from "../middlewares/authMiddleware";
import { asyncHandler } from "../middlewares/errorHandler";

const topicRouter = express.Router();

/* ---------- Public ---------- */

topicRouter.get(
  "/",
  asyncHandler(getTopics)
);

topicRouter.get(
  "/:id",
  asyncHandler(getSingleTopic)
);

/* ---------- Protected ---------- */

topicRouter.use(authenticateAdmin);

topicRouter.post(
  "/",
  asyncHandler(createTopic)
);

topicRouter.put(
  "/:id",
  asyncHandler(updateTopic)
);

topicRouter.delete(
  "/:id",
  asyncHandler(deleteTopic)
);

export default topicRouter;
