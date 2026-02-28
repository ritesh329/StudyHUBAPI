import { Schema, model, Document, Types } from "mongoose";

export interface ISchoolNote extends Document {
  board: Types.ObjectId;
  class: Types.ObjectId;
  subject: string;

  title: string;
  content: string;
  author: string;
  tags: string[];

  isPublic: boolean;
  createdBy: Types.ObjectId;

  isDeleted: boolean;
  deletedAt?: Date;
  deletedBy?: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const schoolNoteSchema = new Schema<ISchoolNote>(
  {
    /* ========================
       EDUCATION DETAILS
    ======================== */
    board: {
      type: Schema.Types.ObjectId,
      ref: "Board",
      required: true,
      index: true, // ✅ filter optimization
    },

    class: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
      index: true, // ✅ filter optimization
    },

    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    /* ========================
       CONTENT
    ======================== */
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    content: {
      type: String,
      required: true,
    },

    author: {
      type: String,
      default: "Admin",
      trim: true,
      maxlength: 100,
    },

    tags: {
      type: [String],
      default: [],
    },

    /* ========================
       STATUS
    ======================== */
    isPublic: {
      type: Boolean,
      default: false,
      index: true, // ✅ important for dashboard
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true, // ✅ critical for filtering
    },

    deletedAt: {
      type: Date,
    },

    deletedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

/* ========================
   COMPOUND INDEXES (PRODUCTION)
======================== */
schoolNoteSchema.index({ board: 1, class: 1 });
schoolNoteSchema.index({ isDeleted: 1, isPublic: 1 });
schoolNoteSchema.index({ createdAt: -1 });

export default model<ISchoolNote>("SchoolNote", schoolNoteSchema);