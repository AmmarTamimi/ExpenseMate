import { BudgetPolicy } from "./budget.policy";
import { supabase } from "@/lib/supabase/client";

export const budgetService = {
  /**
   * Evaluates a budget's status based on a limit and the amount spent.
   */
  getBudgetStatus(limit: number, spent: number) {
    const policy = new BudgetPolicy();
    return policy.evaluate(limit, spent);
  },

  /**
   * Fetches a budget from Supabase and evaluates it.
   */
  async getBudgetById(budgetId: string) {
    const { data, error } = await supabase
      .from("budgets")
      .select("*")
      .eq("id", budgetId)
      .single();

    if (error || !data) throw new Error("Budget not found");

    return this.getBudgetStatus(data.limit_amount, 0);
  }
};