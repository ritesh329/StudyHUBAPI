import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import { sanitizeBody } from "./middlewares/sanitize";
import cookieParser from "cookie-parser";

import connectDB from "./config/db";
import authRoutes from "./routes/route";
import uploadrouter from "./routes/uploadroute";

import blogrouter from "./routes/News.routes";
import Educationrouter from "./routes/education.route";
import UniversityRouter from "./routes/university.routes";
import schoolNoteRouter from "./routes/schoolNote.routes";
import universityNoteRouter from "./routes/universityNote.routes";
import topicRouter from "./routes/topic.routes";
import Categoryrouter from "./routes/category.routes";
import deletedrouter from "./routes/delete.route";
import Userrouter from "./routes/user.routes";
import newsRouter from "./routes/News.routes";
import { getDashboardCounts } from "./controllers/CountingApi.controller";

import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";

dotenv.config();

const app: Application = express();

/* ================= DATABASE ================= */
connectDB();

/* ================= SECURITY ================= */
app.use(helmet());
app.use(compression());

/* ================= RATE LIMIT ================= */
app.use(
  rateLimit({
    windowMs: 2 * 60 * 1000,
    max: 1000,
  })
);

/* ================= BODY PARSER ================= */
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

/* ================= SANITIZE ================= */
app.use(mongoSanitize());

app.use(sanitizeBody);

/* ================= CORS ================= */
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());

/* ================= HEALTH CHECK ================= */
app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Server is running successfully 🚀" });
});

/* ================= ROUTES ================= */
// app.use("/api/auth", authRoutes);
// app.use("/api/upload", uploadrouter);
// app.use("/api/blogData", blogrouter);
// app.use("/api/boards", Educationrouter);
// app.use("/api/universities", UniversityRouter);
// app.use("/api/school-notes", schoolNoteRouter);
// app.use("/api/university-notes", universityNoteRouter);
// app.use("/api/topics", topicRouter);
// app.use("/api/category", Categoryrouter);
// app.use("/api/delete", deletedrouter);
// app.use("/api/users", Userrouter);
// app.use("/api/countAll", getDashboardCounts);
// app.use("/api/news", newsRouter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadrouter);
app.use("/api/blogData", blogrouter);
app.use("/api/boards", Educationrouter);
app.use("/api/universities", UniversityRouter);
// app.use("/api/IT", ITrouter);
app.use("/it-category",Categoryrouter)

 app.use("/api/blogs", blogrouter);
app.use("/api/school-notes", schoolNoteRouter);
app.use("/api/university-notes", universityNoteRouter);
app.use("/api/topics", topicRouter);
app.use("/api/delete", deletedrouter)
app.use("/api/allUsers",Userrouter)
app.use("/api/countAll",getDashboardCounts)
app.use("/api/news",newsRouter)

/* ================= 404 HANDLER ================= */
app.use("*", notFoundHandler);

/* ================= GLOBAL ERROR HANDLER ================= */
app.use(errorHandler);

/* ================= SERVER START ================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});