import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/config/db";
import { Budget, Transaction, Category } from "@/lib/models";
import { getAuthUser } from "@/lib/auth";

function monthRange(d = new Date()) {
  const y = d.getFullYear();
  const m = d.getMonth();
  return {
    monthKey: `${y}-${String(m + 1).padStart(2, "0")}`,
    from: new Date(y, m, 1),
    to: new Date(y, m + 1, 0, 23, 59, 59),
  };
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { monthKey, from, to } = monthRange();

    /* Fetch budgets + category names */
    const budgets = await Budget.find({ userId: user._id, month: monthKey }).populate(
      "catId",
      "name"
    );

    /* Sum expenses by category for this month */
    const agg = await Transaction.aggregate([
      {
        $match: {
          userId: user._id,
          type: "expense",
          date: { $gte: from, $lte: to },
        },
      },
      { $group: { _id: "$catId", total: { $sum: "$amount" } } },
    ]);

    const spentMap = new Map<string, number>();
    for (const row of agg) spentMap.set(row._id.toString(), row.total);

    const notifications: {
      id: string;
      level: "info" | "warning" | "danger";
      title: string;
      message: string;
      createdAt: string;
    }[] = [];

    for (const b of budgets) {
      const cat = b.catId as any;
      const spent = spentMap.get(cat._id.toString()) ?? 0;
      const pct = (spent / b.monthlyLimit) * 100;

      if (pct >= 100) {
        notifications.push({
          id: `over-${b._id}`,
          level: "danger",
          title: `Over budget: ${cat.name}`,
          message: `You've spent ${spent.toFixed(2)}€ of ${b.monthlyLimit.toFixed(2)}€ (${pct.toFixed(0)}%).`,
          createdAt: new Date().toISOString(),
        });
      } else if (pct >= 80) {
        notifications.push({
          id: `warn-${b._id}`,
          level: "warning",
          title: `Almost at limit: ${cat.name}`,
          message: `You've spent ${spent.toFixed(2)}€ of ${b.monthlyLimit.toFixed(2)}€ (${pct.toFixed(0)}%).`,
          createdAt: new Date().toISOString(),
        });
      }
    }

    if (notifications.length === 0) {
      notifications.push({
        id: "all-clear",
        level: "info",
        title: "All clear",
        message: "You're within all your budgets this month.",
        createdAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({ notifications, unread: notifications.filter(n => n.level !== "info").length });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}