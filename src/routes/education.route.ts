import { Router } from "express";
import {
  createBoard,
  getBoards,
  createClass,
  getClassesByBoard,
} from "../controllers/board.controller";

import { authenticateAdmin } from "../middlewares/authMiddleware";
const Educationrouter= Router();

/* ======================
   BOARD ROUTES
====================== */

Educationrouter.get("/boards", getBoards);

Educationrouter.get("/boards/:boardId/classes", getClassesByBoard);

// Create Board

Educationrouter.use(authenticateAdmin);

Educationrouter.post("/boards", createBoard);

// Get Boards (Dropdown)


/* ======================
   CLASS ROUTES
====================== */

// Create Class inside Board
Educationrouter.post("/boards/:boardId/classes", createClass);

// Get Classes by Board


export default Educationrouter;
