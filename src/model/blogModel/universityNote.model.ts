import { Schema, model, Document, Types } from "mongoose";

export interface IUniversityNote extends Document {
  university: Types.ObjectId;
  courseType: string;
  department: Types.ObjectId;
  semester: Types.ObjectId;
  subject: string;
  title: string;
  content: string;
  author: string;
  tags: string[];
  isPublic: boolean;
  isDeleted: boolean;
  createdBy: Types.ObjectId;
}

const universityNoteSchema = new Schema<IUniversityNote>(
  {
    university: {
      type: Schema.Types.ObjectId,
      ref: "University",
      required: true,
    },

    courseType: {
      type: String,
      required: true,
    },

    department: {
      type: Schema.Types.ObjectId,
      required: true,
    },

    semester: {
      type: Schema.Types.ObjectId,
      required: true,
    },

    subject: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    author: {
      type: String,
      default: "Admin",
    },

    tags: {
      type: [String],
      default: [],
    },

    isPublic: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default model<IUniversityNote>(
  "UniversityNote",
  universityNoteSchema
);
