export class BudgetPolicy {
  private thresholds = { warning: 80, exceeded: 100 };

  evaluate(limit: number, spent: number) {
    if (limit <= 0) {
      throw new Error("Budget limit must be greater than 0");
    }
    if (spent < 0) {
      throw new Error("Spent amount cannot be negative");
    }

    const pct = (spent / limit) * 100;
    
    let status: "ok" | "warning" | "exceeded" = "ok";
    if (pct >= this.thresholds.exceeded) {
      status = "exceeded";
    } else if (pct >= this.thresholds.warning) {
      status = "warning";
    }

    return {
      percentUsed: Number(pct.toFixed(2)),
      remaining: Number((limit - spent).toFixed(2)),
      status,
    };
  }
}