import { Schema, model, Document, Types } from "mongoose";

export interface ITopic extends Document {
  category: Types.ObjectId;
  title: string;
  content: string;
  order?: number;

  isPublished: boolean;

  createdBy: Types.ObjectId;

  isDeleted: boolean;
  deletedAt?: Date;
  deletedBy?: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const topicSchema = new Schema<ITopic>(
  {
    /* ==========================
       CATEGORY LINK
    ========================== */
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    /* ==========================
       CONTENT
    ========================== */
    title: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

    order: {
      type: Number,
      default: 0,
    },

    /* ==========================
       STATUS
    ========================== */
    isPublished: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: Date,
    deletedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default model<ITopic>("Topic", topicSchema);
