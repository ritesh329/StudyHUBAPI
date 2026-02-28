// import { Request, Response } from "express";
// import Topic from "../model/topic.model";

// import Category from "../model/category.model";

// export const createCategory = async (req: Request, res: Response) => {
//   try {
//     const { name } = req.body;

//     /* =====================
//        VALIDATION
//     ===================== */
//     if (!name || !name.trim()) {
//       return res.status(400).json({
//         success: false,
//         message: "Category name is required",
//       });
//     }

//     /* =====================
//        CHECK DUPLICATE
//     ===================== */
//     const exists = await Category.findOne({
//       name: name.trim(),
//     });

//     if (exists) {
//       return res.status(409).json({
//         success: false,
//         message: "Category already exists",
//       });
//     }

//     /* =====================
//        CREATE CATEGORY
//     ===================== */
//     const category = await Category.create({
//       name: name.trim(),
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Category created successfully",
//       data: category,
//     });
//   } catch (error: any) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };



// export const createTopic = async (req: Request, res: Response) => {
//   try {
//     const { categoryId, title, content, order } = req.body;

//     if (!categoryId || !title || !content) {
//       return res.status(400).json({
//         success: false,
//         message: "categoryId, title and content are required",
//       });
//     }

//     const topic = await Topic.create({
//       category: categoryId,
//       title,
//       content,
//       order,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Topic created successfully",
//       data: topic,
//     });
//   } catch (error: any) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };


// export const getTopicsByCategory = async (req: Request, res: Response) => {
//   try {
//     const { category } = req.query;

//     const topics = await Topic.find({
//       category,
//       isPublished: true,
//     })
//       .select("title order")
//       .sort({ order: 1 });

//     res.json({
//       success: true,
//       data: topics,
//     });
//   } catch (error: any) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// export const getTopicById = async (req: Request, res: Response) => {
//   try {
//     const topic = await Topic.findById(req.params.id);

//     if (!topic) {
//       return res.status(404).json({
//         success: false,
//         message: "Topic not found",
//       });
//     }

//     res.json({
//       success: true,
//       data: topic,
//     });
//   } catch (error: any) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };


// /* =========================
//    GET ALL CATEGORIES
// ========================= */
// /* =========================
//    GET ALL CATEGORIES
// ========================= */
// export const getAllCategories = async (req: Request, res: Response) => {
//   try {
//     const categories = await Category.find({})
//       .select("name")
//       .sort({ name: 1 });

//     return res.json({
//       success: true,
//       data: categories,
//     });
//   } catch (error: any) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // DELETE TOPIC
// export const deleteTopic = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;

//     const topic = await Topic.findById(id);
//     if (!topic) {
//       return res.status(404).json({
//         success: false,
//         message: "Topic not found",
//       });
//     }

//     await Topic.findByIdAndDelete(id);

//     return res.json({
//       success: true,
//       message: "Topic deleted successfully",
//     });
//   } catch (error: any) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
