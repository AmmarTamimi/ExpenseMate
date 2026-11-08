import { describe, expect, it } from "@jest/globals";
import { BudgetPolicy } from "@/lib/services/budget.policy";

describe("BudgetPolicy", () => {
  const policy = new BudgetPolicy();

  it("returns 'ok' when spending is under 80%", () => {
    const result = policy.evaluate(1000, 500);
    expect(result.status).toBe("ok");
    expect(result.percentUsed).toBe(50);
  });

  it("returns 'warning' when spending is between 80% and 99%", () => {
    const result = policy.evaluate(1000, 850);
    expect(result.status).toBe("warning");
  });

  it("returns 'exceeded' when spending is 100% or more", () => {
    const result = policy.evaluate(1000, 1050);
    expect(result.status).toBe("exceeded");
  });

  it("throws an error for negative limits or spending", () => {
    expect(() => policy.evaluate(-100, 50)).toThrow();
    expect(() => policy.evaluate(100, -50)).toThrow();
  });
});