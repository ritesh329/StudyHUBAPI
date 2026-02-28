import mongoose, { Schema, Document } from "mongoose";

/* =========================
   INTERFACES
========================= */

export interface ISemester {
  name: string; // Semester 1, 2, 3...
}

export interface IDepartment {
  name: string; // BSc, BCom, BA
  semesters: ISemester[];
}

export interface ICourseType {
  type: "UG" | "PG";
  departments: IDepartment[];
}

export interface IUniversity extends Document {
  name: string;
  courses: ICourseType[];
  status: boolean;
}

/* =========================
   SCHEMA
========================= */

const SemesterSchema = new Schema<ISemester>({
  name: { type: String, required: true },
});

const DepartmentSchema = new Schema<IDepartment>({
  name: { type: String, required: true },
  semesters: [SemesterSchema],
});

const CourseTypeSchema = new Schema<ICourseType>({
  type: {
    type: String,
    enum: ["UG", "PG"],
    required: true,
  },
  departments: [DepartmentSchema],
});

const UniversitySchema = new Schema<IUniversity>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    courses: [CourseTypeSchema],

    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

/* =========================
   MODEL
========================= */

export const UniversityModel = mongoose.model<IUniversity>(
  "University",
  UniversitySchema
);
