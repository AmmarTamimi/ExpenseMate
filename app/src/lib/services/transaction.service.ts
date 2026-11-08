import { transactionRepository } from "@/lib/repositories/transaction.repository";
import { categoryRepository } from "@/lib/repositories/category.repository";

export const transactionService = {
  async addExpense(userId: string, payload: any) {
    // 1. Accept both catId (from UI) and category_id (from DB naming conventions)
    const categoryId = payload.catId || payload.category_id;

    // 2. Business Logic: Validate basic inputs
    if (!payload.type || !categoryId || payload.amount === undefined) {
      throw new Error("Missing required fields: type, category, and amount");
    }
    
    const amount = Number(payload.amount);
    if (isNaN(amount) || amount <= 0) {
      throw new Error("Amount must be a positive number");
    }

    // 3. Business Logic: Verify category exists and belongs to the user
    const userCategories = await categoryRepository.findByUserId(userId);
    const category = userCategories.find(c => c._id.toString() === categoryId.toString());
    
    if (!category) {
      throw new Error("Category not found or unauthorized");
    }
    
    if (category.type !== payload.type) {
      throw new Error(`Category is for ${category.type}, not ${payload.type}`);
    }

    // 4. Call Repository to save to Supabase
    // (Note: We map it back to category_id for the Supabase database)
    return await transactionRepository.create({
      user_id: userId,
      category_id: categoryId,
      type: payload.type,
      amount: amount,
      date: payload.date || new Date().toISOString(),
      note: payload.note || ""
    });
  },

  async getUserTransactions(userId: string) {
    // Call Repository to fetch from Supabase
    return await transactionRepository.findByUserId(userId);
  }
};