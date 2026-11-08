import { connectDB } from "@/lib/config/db";
import { Category } from "@/lib/models";
import { supabase } from "@/lib/supabase/client";
import mongoose from "mongoose";

export const categoryRepository = {
  async create(data: { name: string; type: "income" | "expense"; userId: string }) {
    await connectDB();

    // 1. Create in MongoDB
    const newCategory = await Category.create({
      name: data.name,
      type: data.type,
      userId: new mongoose.Types.ObjectId(data.userId)
    });

    // 2. 🟢 CRITICAL: Sync to Supabase immediately
    const { error } = await supabase.from("categories").insert({
      id: newCategory._id.toString(),
      user_id: data.userId,
      name: newCategory.name,
      type: newCategory.type,
    });

    if (error) {
      console.error("Failed to sync category to Supabase:", error.message);
    }

    // 3. Return the MongoDB document to the controller
    return newCategory;
  },

  async findByUserId(userId: string) {
    await connectDB();
    return await Category.find({ userId }).sort({ name: 1 });
  }
};