import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type BudgetStatus = "ok" | "warning" | "exceeded";

export interface IBudget extends Document {
  catId: Types.ObjectId;
  userId: Types.ObjectId;
  monthlyLimit: number;
  month: string;
  status: BudgetStatus;
  createdAt: Date;
  updatedAt: Date;
}

const budgetSchema = new Schema<IBudget>(
  {
    catId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    monthlyLimit: {
      type: Number,
      required: [true, "Monthly limit is required"],
      min: [1, "Monthly limit must be positive"],
    },
    month: {
      type: String,
      required: true,
      match: [/^\d{4}-\d{2}$/, "Month must be in YYYY-MM format"],
    },
    status: {
      type: String,
      enum: ["ok", "warning", "exceeded"],
      default: "ok",
    },
  },
  { timestamps: true }
);

budgetSchema.index({ userId: 1, catId: 1, month: 1 }, { unique: true });

export const Budget: Model<IBudget> =
  mongoose.models.Budget || mongoose.model<IBudget>("Budget", budgetSchema);