import express from "express";
import {
  createUniversityNote,
  updateUniversityNote,
  getUniversityNotes,
  getSingleUniversityNote,
  deleteUniversityNote
} from "../controllers/NotesBlog/universityNote.controller";

import { authenticateAdmin } from "../middlewares/authMiddleware";
import { asyncHandler } from "../middlewares/errorHandler";

const universityNoteRouter = express.Router();

/* ---------- Public ---------- */

universityNoteRouter.get(
  "/",
  asyncHandler(getUniversityNotes)
);

universityNoteRouter.get(
  "/:id",
  asyncHandler(getSingleUniversityNote)
);

/* ---------- Protected ---------- */

universityNoteRouter.use(authenticateAdmin);

universityNoteRouter.post(
  "/",
  asyncHandler(createUniversityNote)
);

universityNoteRouter.put(
  "/:id",
  asyncHandler(updateUniversityNote)
);

universityNoteRouter.delete(
  "/:id",
  asyncHandler(deleteUniversityNote)
);

export default universityNoteRouter;
