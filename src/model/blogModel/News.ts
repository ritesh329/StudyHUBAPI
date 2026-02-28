import { Schema, model, Document, Types } from "mongoose";

export interface INews extends Document {
  title: string;
  content: string;
  author: string;
  tags: string[];

  category: string;

  isPublished: boolean;

  views: number;

  isDeleted: boolean;
  deletedAt?: Date;
  deletedBy?: Types.ObjectId;

  createdBy?: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const newsSchema = new Schema<INews>(
  {
    /* =====================
       NEWS CONTENT
    ===================== */

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

    category: {
      type: String,
      required: true,
      trim: true,
    },

    /* =====================
       STATUS
    ===================== */

    isPublished: {
      type: Boolean,
      default: false,
      index: true, // ✅ filter optimization
    },

    views: {
      type: Number,
      default: 0,
      min: 0,
    },

    /* =====================
       SOFT DELETE
    ===================== */

    isDeleted: {
      type: Boolean,
      default: false,
      index: true, // ✅ important for filtering
    },

    deletedAt: {
      type: Date,
    },

    deletedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

/* =====================
   INDEXES (PRODUCTION)
===================== */

// Faster sorting + filtering
newsSchema.index({ createdAt: -1 });
newsSchema.index({ category: 1 });
newsSchema.index({ isDeleted: 1, isPublished: 1 });

export default model<INews>("News", newsSchema);