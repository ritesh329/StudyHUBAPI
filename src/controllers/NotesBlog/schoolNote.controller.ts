import { Request, Response } from "express";
import { Types } from "mongoose";
import SchoolNote, { ISchoolNote } from "../../model/blogModel/schoolNote.model";
import { AuthRequest } from "../../types/authRequest";

/* =========================================
   CREATE SCHOOL NOTE (ADMIN)
========================================= */
export const createSchoolNote = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const {
      board,
      class: classId,
      subject,
      title,
      content,
      author,
      tags,
      isPublic,
    } = req.body;

    if (!board || !classId || !subject || !title || !content) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    // ✅ ObjectId validation
    if (
      !Types.ObjectId.isValid(board) ||
      !Types.ObjectId.isValid(classId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid board or class ID",
      });
    }

    const note: ISchoolNote = await SchoolNote.create({
      board: new Types.ObjectId(board),
      class: new Types.ObjectId(classId),
      subject: subject.trim(),
      title: title.trim(),
      content: content.trim(),
      author: author?.trim(),
      tags,
      isPublic,
      createdBy: new Types.ObjectId(req.user!.id),
    });

    return res.status(201).json({
      success: true,
      message: "School Note created successfully",
      data: note,
    });
  } catch (error: any) {
    console.error("Create note error:", error);

    return res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message,
    });
  }
};

/* =========================================
   GET ALL SCHOOL NOTES (FILTER + PAGINATION)
========================================= */
export const getSchoolNotes = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { board, class: classId } = req.query;

    // ✅ Ensure both are selected
    if (!board || !classId) {
      return res.status(400).json({
        success: false,
        message: "Please select both board and class",
      });
    }

    if (
      !Types.ObjectId.isValid(board as string) ||
      !Types.ObjectId.isValid(classId as string)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid board or class ID",
      });
    }

    // ✅ STRICT FILTER (Only selected board + class)
    const notes = await SchoolNote.find({
      board: board,
      class: classId,
      isDeleted: false,
    })
      .populate("board")
      .populate("class")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: notes,
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message,
    });
  }
};

/* =========================================
   GET SINGLE NOTE
========================================= */
export const getSingleSchoolNote = async (
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

    const note = await SchoolNote.findOne({
      _id: id,
      isDeleted: false,
    })
      .populate("board")
      .populate("class");

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: note,
    });
  } catch (error: any) {
    console.error("Get single note error:", error);

    return res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message,
    });
  }
};

/* =========================================
   UPDATE SCHOOL NOTE
========================================= */
export const updateSchoolNote = async (
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

    const updated = await SchoolNote.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "School Note updated successfully",
      data: updated,
    });
  } catch (error: any) {
    console.error("Update note error:", error);

    return res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message,
    });
  }
};

/* =========================================
   SOFT DELETE SCHOOL NOTE
========================================= */
export const deleteSchoolNote = async (
  req: AuthRequest,
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

    const deleted = await SchoolNote.findOneAndUpdate(
      { _id: id, isDeleted: false },
      {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: req.user?.id,
      },
      { new: true }
    );

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "School Note deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete note error:", error);

    return res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message,
    });
  }
};