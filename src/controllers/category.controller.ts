import { Request, Response } from "express";
import { Types } from "mongoose";
import Category from "../model/category.model";

/* ================= CREATE ================= */
export const createCategory = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const trimmedName = name.trim();

    // ✅ Case-insensitive duplicate check
    const existing = await Category.findOne({
      name: { $regex: `^${trimmedName}$`, $options: "i" },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = await Category.create({ name: trimmedName });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });

  } catch (error: any) {
    console.error("Create category error:", error);

    return res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message,
    });
  }
};

/* ================= GET ALL ================= */
export const getCategories = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const categories = await Category.find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: categories,
    });

  } catch (error: any) {
    console.error("Get categories error:", error);

    return res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message,
    });
  }
};

/* ================= GET SINGLE ================= */
export const getSingleCategory = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID",
      });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: category,
    });

  } catch (error: any) {
    console.error("Get single category error:", error);

    return res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message,
    });
  }
};

/* ================= UPDATE ================= */
export const updateCategory = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const { name, isActive } = req.body;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID",
      });
    }

    const updateData: any = {};

    if (name && name.trim()) {
      updateData.name = name.trim();
    }

    if (typeof isActive !== "undefined") {
      updateData.isActive = isActive;
    }

    const updated = await Category.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updated,
    });

  } catch (error: any) {
    console.error("Update category error:", error);

    return res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message,
    });
  }
};

/* ================= DELETE (HARD DELETE) ================= */
export const deleteCategory = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID",
      });
    }

    const deleted = await Category.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });

  } catch (error: any) {
    console.error("Delete category error:", error);

    return res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message,
    });
  }
};