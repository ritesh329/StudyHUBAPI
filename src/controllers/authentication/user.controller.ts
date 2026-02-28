import { Request, Response } from "express";
import User from "../../model/authmodel/login.model";
import mongoose from "mongoose";

/* ================= GET ALL USERS ================= */

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 }); // latest first

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });

  } catch (error) {
    console.error("Get users error:", error);

    return res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : "Failed to fetch users",
    });
  }
};


/* ================= DELETE USER ================= */

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // ✅ Validate Mongo ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });

  } catch (error) {
    console.error("Delete user error:", error);

    return res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : "Delete failed",
    });
  }
};