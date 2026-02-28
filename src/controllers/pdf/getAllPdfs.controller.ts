import { Request, Response } from "express";
import cloudinary from "../../config/cloudinary";

/**
 * @desc    Get all PDFs from Cloudinary
 * @route   GET /api/pdfs
 * @access  Public (make protected if needed)
 */
const getAllPdfs = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await cloudinary.api.resources({
      type: "upload",
      resource_type: "raw", // 🔴 PDFs are RAW
      prefix: "pdfs/",      // 📂 Folder name
      max_results: 100,     // adjust if needed
    });

    const pdfs = result.resources.map((file: any) => ({
      public_id: file.public_id,
      url: file.secure_url,
      created_at: file.created_at,
      size: file.bytes,
    }));

    res.status(200).json({
      total: pdfs.length,
      pdfs,
    });
  } catch (error: any) {
    console.error("Fetch PDFs error:", error);
    res.status(500).json({
      message: "Failed to retrieve PDFs",
    });
  }
};

export default getAllPdfs;
