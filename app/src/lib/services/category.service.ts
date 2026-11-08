import { categoryRepository } from "@/lib/repositories/category.repository";

export const categoryService = {
  async createCategory(userId: string, name: string, type: "income" | "expense") {
    if (!name || name.trim().length < 2) throw new Error("Name too short");
    
    // Check for duplicates (business logic)
    const existing = await categoryRepository.findByUserId(userId);
    if (existing.some(c => c.name.toLowerCase() === name.toLowerCase() && c.type === type)) {
      throw new Error("Category already exists");
    }

    return await categoryRepository.create({ name, type, userId });
  },

  async listCategories(userId: string) {
    return await categoryRepository.findByUserId(userId);
  }
};