import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/config/db";
import { Budget, Category } from "@/lib/models";
import { getAuthUser } from "@/lib/auth";

/* ---------- Helper ---------- */
function monthKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/* ---------- GET: list budgets for user (optionally by month) ---------- */
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const month = req.nextUrl.searchParams.get("month") ?? undefined;

    const filter: any = { userId: user._id };
    if (month) filter.month = month;

    const budgets = await Budget.find(filter)
      .populate("catId", "name type")
      .sort({ month: -1 });

    return NextResponse.json(budgets);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch budgets" },
      { status: 500 }
    );
  }
}

/* ---------- POST: create a budget for a category + month ---------- */
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { catId, monthlyLimit, month } = body;

    if (!catId || monthlyLimit === undefined) {
      return NextResponse.json(
        { error: "catId and monthlyLimit are required" },
        { status: 400 }
      );
    }

    const limit = Number(monthlyLimit);
    if (isNaN(limit) || limit <= 0) {
      return NextResponse.json(
        { error: "Monthly limit must be a positive number" },
        { status: 400 }
      );
    }

    const category = await Category.findById(catId);
    if (!category)
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    if (category.userId.toString() !== user._id.toString())
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    if (category.type !== "expense")
      return NextResponse.json(
        { error: "Budgets are only allowed on expense categories" },
        { status: 400 }
      );

    const targetMonth = month ?? monthKey();

    const existing = await Budget.findOne({
      userId: user._id,
      catId: category._id,
      month: targetMonth,
    });
    if (existing)
      return NextResponse.json(
        { error: "Budget already exists for this category and month" },
        { status: 409 }
      );

    const budget = await Budget.create({
      userId: user._id,
      catId: category._id,
      monthlyLimit: limit,
      month: targetMonth,
      status: "ok",
    });

    const populated = await budget.populate("catId", "name type");
    return NextResponse.json(populated, { status: 201 });
  } catch (err: any) {
    if (err?.code === 11000)
      return NextResponse.json(
        { error: "Budget already exists for this category and month" },
        { status: 409 }
      );
    if (err?.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e: any) => e.message);
      return NextResponse.json({ error: messages.join(", ") }, { status: 400 });
    }
    return NextResponse.json(
      { error: err.message || "Failed to create budget" },
      { status: 500 }
    );
  }
}