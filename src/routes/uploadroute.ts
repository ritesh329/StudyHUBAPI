import { Router } from "express";
import { pdfUpload, imageUpload } from "../config/upload";
import uploadPDF from "../controllers/upload/pdf.controller";
import uploadImage from "../controllers/upload/image.controller";
import { authenticateAdmin } from "../middlewares/authMiddleware";
const uploadrouter = Router();

uploadrouter.use(authenticateAdmin);

console.log("upload");
uploadrouter.post("/pdf", pdfUpload.single("pdf"), uploadPDF);
uploadrouter.post("/image", imageUpload.single("image"), uploadImage);
import getAllPdfs from "../controllers/pdf/getAllPdfs.controller";

uploadrouter.get("/pdfs", getAllPdfs);
export default uploadrouter;
