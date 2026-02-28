import express from "express";
import {
  createCategory,
  getCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller";
import { authenticateAdmin } from "../middlewares/authMiddleware";
const Categoryrouter = express.Router();



Categoryrouter.get("/", getCategories);
Categoryrouter.get("/:id", getSingleCategory);


Categoryrouter.use(authenticateAdmin);



Categoryrouter.post("/", createCategory);

Categoryrouter.put("/:id", updateCategory);
Categoryrouter.delete("/:id", deleteCategory);

export default Categoryrouter;
