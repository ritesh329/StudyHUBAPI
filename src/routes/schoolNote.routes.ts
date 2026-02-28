import express from "express";
import {
  createSchoolNote,
  updateSchoolNote,
  getSchoolNotes,
  getSingleSchoolNote,
  deleteSchoolNote
} from "../controllers/NotesBlog/schoolNote.controller";

import { validate } from "../middlewares/validate";
import { authenticateAdmin } from "../middlewares/authMiddleware";
import { asyncHandler } from "../middlewares/errorHandler";

const schoolNoteRouter = express.Router();

/* ---------- Public ---------- */

 schoolNoteRouter.post(
  "/front-data",
  asyncHandler(getSchoolNotes)
);


schoolNoteRouter.get(
  "/",
  asyncHandler(getSchoolNotes)
);

schoolNoteRouter.get(
  "/:id",
  asyncHandler(getSingleSchoolNote)
);

/* ---------- Protected ---------- */

schoolNoteRouter.use(authenticateAdmin);

schoolNoteRouter.post(
  "/",
  asyncHandler(createSchoolNote)
);

schoolNoteRouter.put(
  "/:id",
  asyncHandler(updateSchoolNote)
);

schoolNoteRouter.delete(
  "/:id",
  asyncHandler(deleteSchoolNote)
);

export default schoolNoteRouter;
