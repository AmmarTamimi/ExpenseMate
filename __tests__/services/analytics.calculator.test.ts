/// <reference types="jest" />

import { AnalyticsCalculator } from "@/lib/services/analytics.calculator";

describe("AnalyticsCalculator", () => {
  const calculator = new AnalyticsCalculator();

  it("calculates the correct income, expense, and balance", () => {
    const rows = [
      { type: "income", amount: 5000 },
      { type: "expense", amount: 1500 },
      { type: "expense", amount: 500 },
    ];
    const result = calculator.summarize(rows);
    
    expect(result.income).toBe(5000);
    expect(result.expense).toBe(2000);
    expect(result.balance).toBe(3000);
  });

  it("groups expenses by category correctly", () => {
    const rows = [
      { category: "Food", type: "expense", amount: 100 },
      { category: "Food", type: "expense", amount: 50 },
      { category: "Transport", type: "expense", amount: 200 },
      { category: "Salary", type: "income", amount: 5000 },
    ];
    
    const result = calculator.categoryBreakdown(rows);
    
    // Transport should be first because it is sorted by highest total
    expect(result[0].category).toBe("Transport");
    expect(result[0].total).toBe(200);
    
    expect(result[1].category).toBe("Food");
    expect(result[1].total).toBe(150);
  });
});