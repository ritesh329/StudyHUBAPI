import { Request, Response } from "express";
import mongoose from "mongoose";
import { UniversityModel } from "../model/university.model";

/* =========================
   CREATE UNIVERSITY (ADMIN)
========================= */
export const createUniversity = async (req: Request, res: Response) => {
  try {
    const { name, courses } = req.body;

    /* =========================
       BASIC VALIDATION
    ========================= */
    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "University name is required",
      });
    }

    if (!Array.isArray(courses) || courses.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one course is required",
      });
    }

    /* =========================
       DUPLICATE CHECK
    ========================= */
    const existingUniversity = await UniversityModel.findOne({
      name: { $regex: `^${name.trim()}$`, $options: "i" },
    });

    if (existingUniversity) {
      return res.status(409).json({
        success: false,
        message: "University already exists",
      });
    }

    /* =========================
       TRANSFORM UI → SCHEMA
    ========================= */
    const formattedCourses = courses.map((course: any) => {
      if (!course.type || !course.type.trim()) {
        throw new Error("Course type is required");
      }

      if (
        !Array.isArray(course.departments) ||
        course.departments.length === 0
      ) {
        throw new Error(`Departments required for ${course.type}`);
      }

      return {
        type: course.type.trim(),
        departments: course.departments.map((dept: any) => {
          if (!dept.name || !dept.name.trim()) {
            throw new Error("Department name is required");
          }

          if (
            !Array.isArray(dept.semesters) ||
            dept.semesters.length === 0
          ) {
            throw new Error(
              `At least one semester required for ${dept.name}`
            );
          }

          return {
            name: dept.name.trim(),
            semesters: dept.semesters.map((sem: string) => {
              if (!sem || !sem.trim()) {
                throw new Error("Semester name is required");
              }
              return { name: sem.trim() };
            }),
          };
        }),
      };
    });

    /* =========================
       CREATE UNIVERSITY
    ========================= */
    const university = await UniversityModel.create({
      name: name.trim(),
      courses: formattedCourses,
    });

    return res.status(201).json({
      success: true,
      message: "University created successfully",
      data: university,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === "production"
          ? "Internal Server Error"
          : error.message,
    });
  }
};

/* =========================
   GET UNIVERSITIES
========================= */
export const getUniversities = async (req: Request, res: Response) => {
  try {
    const universities = await UniversityModel.find({ status: true })
      .select("name")
      .lean();

    return res.json({
      success: true,
      data: universities,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/* =========================
   GET COURSE TYPES
========================= */
export const getCourseTypes = async (req: Request, res: Response) => {
  try {
    const { universityId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(universityId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid university id",
      });
    }

    const uni = await UniversityModel.findById(universityId)
      .select("courses")
      .lean();

    if (!uni) {
      return res.status(404).json({
        success: false,
        message: "University not found",
      });
    }

    return res.json({
      success: true,
      data: uni.courses.map((c: any) => c.type),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/* =========================
   GET DEPARTMENTS
========================= */
export const getDepartments = async (req: Request, res: Response) => {
  try {
    const { universityId, courseType } = req.params;

    if (!mongoose.Types.ObjectId.isValid(universityId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid university id",
      });
    }

    const uni = await UniversityModel.findById(universityId).lean();

    if (!uni) {
      return res.status(404).json({
        success: false,
        message: "University not found",
      });
    }

    const course = uni.courses.find(
      (c: any) => c.type.toLowerCase() === courseType.toLowerCase()
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course type not found",
      });
    }

    return res.json({
      success: true,
      data: course.departments || [],
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/* =========================
   GET SEMESTERS
========================= */
export const getSemesters = async (req: Request, res: Response) => {
  try {
    const { universityId, courseType, departmentName } = req.params;

    if (!mongoose.Types.ObjectId.isValid(universityId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid university id",
      });
    }

    const uni = await UniversityModel.findById(universityId).lean();

    if (!uni) {
      return res.status(404).json({
        success: false,
        message: "University not found",
      });
    }

    const course = uni.courses.find(
      (c: any) => c.type.toLowerCase() === courseType.toLowerCase()
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course type not found",
      });
    }

    const dept = course.departments.find(
      (d: any) =>
        d.name.toLowerCase() === departmentName.toLowerCase()
    );

    if (!dept) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    return res.json({
      success: true,
      data: dept.semesters || [],
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};