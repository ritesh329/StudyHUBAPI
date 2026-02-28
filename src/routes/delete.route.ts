import express from "express";
import {
  deleteUniversity,
  deleteBoard,
  deleteClass,
} from "../controllers/deleteAPI.controller";

import { deleteCategory } from "../controllers/category.controller";
import { authenticateAdmin } from "../middlewares/authMiddleware";

const deletedrouter = express.Router();

/* ================= DELETE ROUTES ================= */

deletedrouter.use(authenticateAdmin);


deletedrouter.delete("/university/:id", deleteUniversity);
deletedrouter.delete("/boards/:id", deleteBoard);
deletedrouter.delete("/classes/:id", deleteClass);
deletedrouter.delete("/category/:id", deleteCategory);

export default deletedrouter;