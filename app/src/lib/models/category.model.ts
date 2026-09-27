import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { randomUUID } from "crypto";

export type CategoryType = "income" | "expense";

export interface ICategory extends Document {
  catId: string;
  type: CategoryType;
  name: string;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    catId: {
      type: String,
      required: true,
      unique: true,
      default: () => randomUUID(),
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: [true, "Category type is required"],
    },
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      minlength: 1,
      maxlength: 40,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

categorySchema.index({ userId: 1, name: 1, type: 1 }, { unique: true });

export const Category: Model<ICategory> =
  mongoose.models.Category ||
  mongoose.model<ICategory>("Category", categorySchema);