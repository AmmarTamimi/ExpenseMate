import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/config/db";
import { Category } from "@/lib/models";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const categories = await Category.find({ userId: user._id }).sort({
      createdAt: -1,
    });
    return NextResponse.json(categories);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, type } = body;

    if (!name || !type) {
      return NextResponse.json(
        { error: "Name and type are required" },
        { status: 400 }
      );
    }

    if (type !== "income" && type !== "expense") {
      return NextResponse.json(
        { error: "Type must be 'income' or 'expense'" },
        { status: 400 }
      );
    }

    const existing = await Category.findOne({
      userId: user._id,
      name: name.trim(),
      type,
    });
    if (existing) {
      return NextResponse.json(
        { error: "Category with this name and type already exists" },
        { status: 409 }
      );
    }

    const category = await Category.create({
      name: name.trim(),
      type,
      userId: user._id,
    });

    return NextResponse.json(category, { status: 201 });
  } catch (err: any) {
    if (err?.code === 11000) {
      return NextResponse.json(
        { error: "Category already exists" },
        { status: 409 }
      );
    }
    if (err?.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e: any) => e.message);
      return NextResponse.json({ error: messages.join(", ") }, { status: 400 });
    }
    return NextResponse.json(
      { error: err.message || "Failed to create category" },
      { status: 500 }
    );
  }
}