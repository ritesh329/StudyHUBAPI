import { Router } from "express";
import {
  createUniversity,
  getUniversities,
  getCourseTypes,
  getDepartments,
  getSemesters,
} from "../controllers/university.controller";

import { authenticateAdmin } from "../middlewares/authMiddleware";
const UniversityRouter = Router();

UniversityRouter.post("/universities",authenticateAdmin, createUniversity);

UniversityRouter.get("/universities", getUniversities);
UniversityRouter.get(
  "/universities/:universityId/course-types",
  getCourseTypes
);

UniversityRouter.get(
  "/universities/:universityId/course-types/:courseType/departments",
  getDepartments
);

UniversityRouter.get(
  "/universities/:universityId/course-types/:courseType/departments/:departmentName/semesters",
  getSemesters
);

export default UniversityRouter;
