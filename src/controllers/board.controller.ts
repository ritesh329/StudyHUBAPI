import { Request, Response } from "express";
import { Types } from "mongoose";
import { BoardModel, ClassModel } from "../model/educational.model";

/* ======================
   BOARD CONTROLLERS
====================== */

// ✅ Create Board
export const createBoard = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Board name is required",
      });
    }

    const trimmedName = name.trim();

    // Case-insensitive duplicate check
    const exists = await BoardModel.findOne({
      name: { $regex: `^${trimmedName}$`, $options: "i" },
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Board already exists",
      });
    }

    const board = await BoardModel.create({
      name: trimmedName,
    });

    return res.status(201).json({
      success: true,
      message: "Board created successfully",
      data: board,
    });

  } catch (error: any) {
    console.error("Create board error:", error);

    return res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message,
    });
  }
};

// ✅ Get Boards (Dropdown)
export const getBoards = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const boards = await BoardModel.find({ status: true })
      .select("name")
      .sort({ name: 1 });

    return res.json({
      success: true,
      data: boards,
    });

  } catch (error: any) {
    console.error("Get boards error:", error);

    return res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message,
    });
  }
};

/* ======================
   CLASS CONTROLLERS
====================== */

// ✅ Create Class (Board-wise)
export const createClass = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { boardId } = req.params;
    const { className } = req.body;

    if (!Types.ObjectId.isValid(boardId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Board ID",
      });
    }

    if (!className || !className.trim()) {
      return res.status(400).json({
        success: false,
        message: "Class name is required",
      });
    }

    const trimmedClassName = className.trim();

    const board = await BoardModel.findById(boardId);
    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found",
      });
    }

    // Case-insensitive duplicate check
    const exists = await ClassModel.findOne({
      boardId,
      className: { $regex: `^${trimmedClassName}$`, $options: "i" },
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Class already exists for this board",
      });
    }

    const classData = await ClassModel.create({
      boardId,
      className: trimmedClassName,
    });

    return res.status(201).json({
      success: true,
      message: "Class created successfully",
      data: classData,
    });

  } catch (error: any) {
    console.error("Create class error:", error);

    return res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message,
    });
  }
};

// ✅ Get Classes by Board (Dropdown)
export const getClassesByBoard = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { boardId } = req.params;

    if (!Types.ObjectId.isValid(boardId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Board ID",
      });
    }

    const classes = await ClassModel.find({
      boardId,
      status: true,
    })
      .select("className")
      .sort({ className: 1 });

    return res.json({
      success: true,
      data: classes,
    });

  } catch (error: any) {
    console.error("Get classes error:", error);

    return res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message,
    });
  }
};