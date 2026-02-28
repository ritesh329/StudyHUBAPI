import { Request, Response } from "express";

const uploadImage = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
      return;
    }

    // ✅ Allow only image types
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedMimeTypes.includes(req.file.mimetype)) {
      res.status(400).json({
        success: false,
        message: "Only JPEG, PNG and WEBP images are allowed",
      });
      return;
    }

    // ✅ Optional: File size validation (5MB example)
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (req.file.size > maxSize) {
      res.status(400).json({
        success: false,
        message: "File size must be less than 5MB",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      url: (req.file as any).path,
      public_id: (req.file as any).filename,
    });

  } catch (error: any) {
    console.error("Upload error:", error);

    res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message,
    });
  }
};

export default uploadImage;