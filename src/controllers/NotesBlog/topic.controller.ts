import { Request, Response } from "express";
import { Types } from "mongoose";
import Topic from "../../model/blogModel/topic.model";
import { AuthRequest } from "../../types/authRequest";
/* ================= CREATE ================= */
export const createTopic = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { category, title, content, order, isPublished } = req.body;

    if (!category || !title || !content) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const topic = await Topic.create({
      category,
      title,
      content,
      order,
      isPublished,
  createdBy: new Types.ObjectId(req.user!.id), 
    })

    return res.status(201).json({
      success: true,
      message: "Topic created successfully",
      data: topic,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET ALL ================= */
export const getTopics = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { category } = req.query;

    const filter: any = { isDeleted: false };

    if (category) filter.category = category;

    const topics = await Topic.find(filter)
      .populate("category")
      .sort({ order: 1 });

    return res.status(200).json({
      success: true,
      data: topics,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET SINGLE ================= */
export const getSingleTopic = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const topic = await Topic.findById(id).populate("category");

    if (!topic || topic.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Topic not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: topic,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= UPDATE ================= */
export const updateTopic = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;

    const updated = await Topic.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Topic not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Topic updated successfully",
      data: updated,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= DELETE (SOFT) ================= */
export const deleteTopic = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;

    await Topic.findByIdAndUpdate(id, {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: (req as any).user?._id,
    });

    return res.status(200).json({
      success: true,
      message: "Topic deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
