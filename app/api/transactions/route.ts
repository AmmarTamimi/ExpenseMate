import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/config/db";
import { Transaction, Category } from "@/lib/models";
import { getAuthUser } from "@/lib/auth";

/* ---------- GET: list all transactions for the logged-in user ---------- */
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const transactions = await Transaction.find({ userId: user._id })
      .populate("catId", "name type")
      .sort({ date: -1 });

    return NextResponse.json(transactions);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

/* ---------- POST: create a new transaction ---------- */
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { type, catId, amount, date, note } = body;

    /* --- Validation --- */
    if (!type || !catId || amount === undefined) {
      return NextResponse.json(
        { error: "type, catId, and amount are required" },
        { status: 400 }
      );
    }

    if (type !== "income" && type !== "expense") {
      return NextResponse.json(
        { error: "Type must be 'income' or 'expense'" },
        { status: 400 }
      );
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return NextResponse.json(
        { error: "Amount must be a positive number" },
        { status: 400 }
      );
    }

    /* --- Category checks --- */
    const category = await Category.findById(catId);
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    if (category.userId.toString() !== user._id.toString()) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (category.type !== type) {
      return NextResponse.json(
        {
          error: `Category type (${category.type}) does not match transaction type (${type})`,
        },
        { status: 400 }
      );
    }

    /* --- Create --- */
    const transaction = await Transaction.create({
      type,
      catId: category._id,
      userId: user._id,
      amount: numericAmount,
      date: date ? new Date(date) : new Date(),
      note: (note ?? "").trim(),
    });

    const populated = await transaction.populate("catId", "name type");

    return NextResponse.json(populated, { status: 201 });
  } catch (err: any) {
    if (err?.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e: any) => e.message);
      return NextResponse.json({ error: messages.join(", ") }, { status: 400 });
    }
    return NextResponse.json(
      { error: err.message || "Failed to create transaction" },
      { status: 500 }
    );
  }
}