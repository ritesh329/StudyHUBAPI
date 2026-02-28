import { Response } from "express";
import { Types } from "mongoose";
import UniversityNote from "../../model/blogModel/universityNote.model";
import { AuthRequest } from "../../types/authRequest";

/* ================= CREATE ================= */
export const createUniversityNote = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const {
      university,
      courseType,
      department,
      semester,
      subject,
      title,
      content,
      author,
      tags,
      isPublic,
    } = req.body;

    if (
      !university ||
      !courseType ||
      !department ||
      !semester ||
      !subject ||
      !title ||
      !content
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const note = await UniversityNote.create({
      university,
      courseType,
      department,
      semester,
      subject,
      title,
      content,
      author,
      tags,
      isPublic,
      createdBy: new Types.ObjectId(req.user!.id),
    });

    return res.status(201).json({
      success: true,
      message: "University Note created successfully",
      data: note,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET ALL ================= */
export const getUniversityNotes = async (
  req: any,
  res: Response
): Promise<Response> => {
  try {
    const { university, courseType, department, semester } = req.query;

    if (!university || !courseType || !department || !semester) {
      return res.status(400).json({
        success: false,
        message: "All filters are required",
      });
    }

    const filter: any = {
      university: new Types.ObjectId(university),
      courseType,
      department: new Types.ObjectId(department),
      semester: new Types.ObjectId(semester),
      isDeleted: false,
    };

    const notes = await UniversityNote.find(filter)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: notes,
    });

  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* ================= GET SINGLE ================= */
export const getSingleUniversityNote = async (
  req: any,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const note = await UniversityNote.findById(id).populate("university");

    if (!note || note.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: note,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= UPDATE ================= */
export const updateUniversityNote = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;

    const updated = await UniversityNote.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Updated successfully",
      data: updated,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= DELETE ================= */
export const deleteUniversityNote = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;

    await UniversityNote.findByIdAndUpdate(id, {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: new Types.ObjectId(req.user!.id),
    });

    return res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// export const getUniversityNotes = async (
//   req: any,
//   res: Response
// ): Promise<Response> => {
//   try {
//     const { university, courseType, department, semester } = req.query;

//     const filter: any = { isDeleted: false };

//     // ✅ Convert only university (ObjectId)
//     if (university && Types.ObjectId.isValid(university)) {
//       filter.university = new Types.ObjectId(university);
//     }

//     if (courseType) filter.courseType = courseType;
//     if (department) filter.department = department;

//     // ❗ DO NOT convert semester to ObjectId
//     if (semester) filter.semester = semester;

//     const notes = await UniversityNote.find(filter)
//       .populate("university")
//       .sort({ createdAt: -1 });

//     return res.status(200).json({
//       success: true,
//       data: notes,
//     });
//   } catch (error: any) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
