import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary";
import path from "path";

/* ================= COMMON SECURITY CONFIG ================= */

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit

const sanitizeFileName = (name: string) => {
  return name.replace(/[^a-zA-Z0-9.-]/g, "_");
};

/* ================= PDF FILTER ================= */

const pdfFileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
  if (file.mimetype !== "application/pdf") {
    return cb(new Error("Only PDF files are allowed"));
  }
  cb(null, true);
};

/* ================= IMAGE FILTER ================= */

const imageFileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error("Only JPG, PNG, WEBP images are allowed"));
  }

  cb(null, true);
};

/* ---------- PDF UPLOAD ---------- */
export const pdfUpload = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
      folder: "pdfs",
      resource_type: "raw",
      public_id: `${Date.now()}-${sanitizeFileName(
        path.parse(file.originalname).name
      )}`,
    }),
  }),
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: pdfFileFilter,
});

/* ---------- IMAGE UPLOAD ---------- */
export const imageUpload = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
      folder: "images",
      resource_type: "image",
      public_id: `${Date.now()}-${sanitizeFileName(
        path.parse(file.originalname).name
      )}`,
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
    }),
  }),
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: imageFileFilter,
});