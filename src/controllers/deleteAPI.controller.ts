import { Request, Response } from "express";
import { Types } from "mongoose";
import { UniversityModel } from "../model/university.model";
import { BoardModel, ClassModel } from "../model/educational.model";
import Category from "../model/category.model";
import Topic from "../model/blogModel/topic.model";

/* ================= DELETE UNIVERSITY ================= */
export const deleteUniversity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid University ID",
      });
    }

    const university = await UniversityModel.findById(id);

    if (!university) {
      return res.status(404).json({
        success: false,
        message: "University not found",
      });
    }

    await UniversityModel.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "University deleted successfully",
    });

  } catch (error: any) {
    console.error("Delete university error:", error);

    return res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : "Delete failed",
    });
  }
};

/* ================= DELETE BOARD ================= */
export const deleteBoard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Board ID",
      });
    }

    const board = await BoardModel.findById(id);

    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found",
      });
    }

    // ✅ Delete related classes
    await ClassModel.deleteMany({ boardId: id });

    // ✅ Delete board
    await BoardModel.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Board and its classes deleted successfully",
    });

  } catch (error: any) {
    console.error("Delete board error:", error);

    return res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : "Delete failed",
    });
  }
};

/* ================= DELETE CLASS ================= */
export const deleteClass = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Class ID",
      });
    }

    const deletedClass = await ClassModel.findByIdAndDelete(id);

    if (!deletedClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Class deleted successfully",
    });

  } catch (error: any) {
    console.error("Delete class error:", error);

    return res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : "Delete failed",
    });
  }
};

/* ================= DELETE CATEGORY ================= */
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Category ID",
      });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // ✅ Delete related topics
    await Topic.deleteMany({ category: id });

    // ✅ Delete category
    await Category.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Category and related content deleted successfully",
    });

  } catch (error: any) {
    console.error("Delete category error:", error);

    return res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : "Delete failed",
    });
  }
};