import { Request, Response } from "express";

const uploadPDF = async (req: Request, res: Response): Promise<void> => {

    console.log("jjkkkdkdkkd");
  if (!req.file) {
    res.status(400).json({ message: "No PDF uploaded" });
    return;
  }

  res.status(200).json({
    message: "PDF uploaded successfully",
    url: (req.file as any).path,
    public_id: (req.file as any).filename,
  });
};

export default uploadPDF;
