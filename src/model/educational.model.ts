import mongoose, { Schema, Document } from "mongoose";

/* =========================
   BOARD MODEL
========================= */

export interface IBoard extends Document {
  name: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BoardSchema: Schema<IBoard> = new Schema(
  {
    name: {
      type: String,
      required: true,          // ✅ Required
      unique: true,            // ✅ Prevent duplicate board
      trim: true,
      minlength: 2,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

/* Index for faster search */
BoardSchema.index({ name: 1 });

export const BoardModel = mongoose.model<IBoard>(
  "Board",
  BoardSchema
);


/* =========================
   CLASS MODEL
========================= */

export interface IClass extends Document {
  boardId: mongoose.Types.ObjectId;
  className: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ClassSchema: Schema<IClass> = new Schema(
  {
    boardId: {
      type: Schema.Types.ObjectId,
      ref: "Board",
      required: true,       // ✅ Board mandatory
    },
    className: {
      type: String,
      required: true,       // ✅ Required
      trim: true,
      minlength: 1,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

/* ✅ Prevent duplicate class inside same board */
ClassSchema.index({ boardId: 1, className: 1 }, { unique: true });

export const ClassModel = mongoose.model<IClass>(
  "Class",
  ClassSchema
);
