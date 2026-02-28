import { Request, Response } from "express";
import SchoolNote from "../model/blogModel/schoolNote.model";
import Topic from "../model/blogModel/topic.model";
import UniversityNote from "../model/blogModel/universityNote.model";

/* ================= COMBINED DASHBOARD COUNT ================= */

export const getDashboardCounts = async (
  req: Request,
  res: Response
) => {
  try {
    /* ---------- RUN ALL COUNTS IN PARALLEL (FAST) ---------- */
    const [
      schoolTotal,
      schoolPublished,
      schoolUnpublished,
      schoolDeleted,

      topicTotal,
      topicPublished,
      topicUnpublished,
      topicDeleted,

      universityTotal,
      universityPublished,
      universityUnpublished,
      universityDeleted,
    ] = await Promise.all([
      /* SCHOOL */
      SchoolNote.countDocuments({ isDeleted: false }),
      SchoolNote.countDocuments({ isPublic: true, isDeleted: false }),
      SchoolNote.countDocuments({ isPublic: false, isDeleted: false }),
      SchoolNote.countDocuments({ isDeleted: true }),

      /* TOPIC */
      Topic.countDocuments({ isDeleted: false }),
      Topic.countDocuments({ isPublished: true, isDeleted: false }),
      Topic.countDocuments({ isPublished: false, isDeleted: false }),
      Topic.countDocuments({ isDeleted: true }),

      /* UNIVERSITY */
      UniversityNote.countDocuments({ isDeleted: false }),
      UniversityNote.countDocuments({ isPublic: true, isDeleted: false }),
      UniversityNote.countDocuments({ isPublic: false, isDeleted: false }),
      UniversityNote.countDocuments({ isDeleted: true }),
    ]);

    /* ---------- GRAND TOTAL ---------- */
    const grandTotal =
      schoolTotal + topicTotal + universityTotal;

    return res.status(200).json({
      schoolNotes: {
        total: schoolTotal,
        published: schoolPublished,
        unpublished: schoolUnpublished,
        deleted: schoolDeleted,
      },
      topics: {
        total: topicTotal,
        published: topicPublished,
        unpublished: topicUnpublished,
        deleted: topicDeleted,
      },
      universityNotes: {
        total: universityTotal,
        published: universityPublished,
        unpublished: universityUnpublished,
        deleted: universityDeleted,
      },
      grandTotal,
    });

  } catch (error: any) {
    console.error("Dashboard Count Error:", error);

    return res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : "Server error while fetching dashboard counts",
    });
  }
};