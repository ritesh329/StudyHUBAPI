import { body, param, query } from "express-validator";

export const createBlogValidator = [
  body("title")
    .notEmpty().withMessage("Title is required")
    .isLength({ max: 200 }).withMessage("Title must be under 200 characters"),

  body("content")
    .notEmpty().withMessage("Content is required"),

  body("tags")
    .optional()
    .isArray().withMessage("Tags must be an array"),

  body("isPublished")
    .optional()
    .isBoolean().withMessage("isPublished must be boolean")
];

export const updateBlogValidator = [
  param("id")
    .isMongoId().withMessage("Invalid blog ID"),

  body("title")
    .optional()
    .isLength({ max: 200 }).withMessage("Title too long"),

  body("content")
    .optional()
    .notEmpty().withMessage("Content cannot be empty")
];

export const getBlogsValidator = [
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1 })
];
