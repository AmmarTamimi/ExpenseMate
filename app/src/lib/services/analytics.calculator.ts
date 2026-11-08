export class AnalyticsCalculator {
  summarize(rows: { type: string; amount: number }[]) {
    let income = 0;
    let expense = 0;

    for (const row of rows) {
      if (row.type === "income") income += row.amount;
      else expense += row.amount;
    }

    return {
      income: Number(income.toFixed(2)),
      expense: Number(expense.toFixed(2)),
      balance: Number((income - expense).toFixed(2)),
    };
  }

  categoryBreakdown(rows: { category: string; type: string; amount: number }[]) {
    const map = new Map<string, number>();
    
    for (const row of rows) {
      if (row.type === "expense") {
        map.set(row.category, (map.get(row.category) || 0) + row.amount);
      }
    }

    return Array.from(map.entries()).map(([category, total]) => ({
      category,
      total: Number(total.toFixed(2)),
    })).sort((a, b) => b.total - a.total);
  }
}