import { Request, Response } from "express";
import { Types } from "mongoose";
import News from "../model/blogModel/News";

/* ================= CREATE NEWS ================= */

export const createNews = async (req: Request, res: Response) => {
  try {
    const {
      title,
      content,
      author,
      tags,
      category,
      isPublished,
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    // if (category) {
    //   return res.status(400).json({
    //     message: "Invalid category ID",
    //   });
    // }

    const news = await News.create({
      title: title.trim(),
      content: content.trim(),
      author: author?.trim(),
      tags,
      category,
      isPublished,
      createdBy: (req as any).user?.id,
    });

    return res.status(201).json({
      message: "News created successfully",
      data: news,
    });

  } catch (error: any) {
    console.error("Create News Error:", error);

    return res.status(500).json({
      message:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : "Server error while creating news",
    });
  }
};

/* ================= GET ALL NEWS ================= */

export const getAllNews = async (req: Request, res: Response) => {
  try {
    const news = await News.find({ isDeleted: false })
      .populate("category", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      total: news.length,
      data: news,
    });

  } catch (error: any) {
    console.error("Get News Error:", error);

    return res.status(500).json({
      message:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : "Server error while fetching news",
    });
  }
};

/* ================= GET SINGLE NEWS ================= */

export const getSingleNews = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid ID",
      });
    }

    // ✅ Atomic increment (better than manual ++)
    const news = await News.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $inc: { views: 1 } },
      { new: true }
    ).populate("category", "name");

    if (!news) {
      return res.status(404).json({
        message: "News not found",
      });
    }

    return res.status(200).json({
      data: news,
    });

  } catch (error: any) {
    console.error("Get Single News Error:", error);

    return res.status(500).json({
      message:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : "Server error while fetching news",
    });
  }
};

/* ================= UPDATE NEWS ================= */

export const updateNews = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid ID",
      });
    }

    const news = await News.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!news) {
      return res.status(404).json({
        message: "News not found",
      });
    }

    Object.assign(news, req.body);
    await news.save();

    return res.status(200).json({
      message: "News updated successfully",
      data: news,
    });

  } catch (error: any) {
    console.error("Update News Error:", error);

    return res.status(500).json({
      message:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : "Server error while updating news",
    });
  }
};

/* ================= SOFT DELETE NEWS ================= */

export const deleteNews = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid ID",
      });
    }

    const news = await News.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!news) {
      return res.status(404).json({
        message: "News not found",
      });
    }

    news.isDeleted = true;
    news.deletedAt = new Date();
    news.deletedBy = (req as any).user?.id;

    await news.save();

    return res.status(200).json({
      message: "News deleted successfully",
    });

  } catch (error: any) {
    console.error("Delete News Error:", error);

    return res.status(500).json({
      message:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : "Server error while deleting news",
    });
  }
};