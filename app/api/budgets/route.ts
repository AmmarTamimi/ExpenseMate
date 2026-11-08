import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifySession } from "@/lib/auth/session";
import { supabase } from "@/lib/supabase/client";
import { Category } from "@/lib/models";
import { connectDB } from "@/lib/config/db";

/* ---------- Auth helper ---------- */
async function getAuthedUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const session = await verifySession(token);
  return session?.userId ?? null;
}

/* ---------- GET: list all budgets ---------- */
export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthedUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 1. Fetch raw budgets from Supabase
    const { data, error } = await supabase
      .from("budgets")
      .select("*")
      .eq("user_id", userId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!data) return NextResponse.json([]);

    // 2. Get category details from MongoDB to populate the UI
    await connectDB();
    const catIds = data.map(b => b.category_id);
    const categories = await Category.find({ _id: { $in: catIds } });

    // 3. Format to match the React frontend expectations
    const formatted = data.map((row) => {
      const cat = categories.find(c => c._id.toString() === row.category_id);
      return {
        _id: row.id, // The budget ID
        catId: { 
          _id: row.category_id, 
          name: cat ? cat.name : "Unknown", 
          type: cat ? cat.type : "expense"
        },
        monthlyLimit: row.limit_amount, // Map limit_amount to monthlyLimit
        month: row.month,
        status: "ok",
      };
    });

    return NextResponse.json(formatted);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/* ---------- POST: create a new budget ---------- */
export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthedUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { catId, monthlyLimit, month } = body;

    if (!catId || !monthlyLimit) {
      return NextResponse.json({ error: "catId and monthlyLimit are required" }, { status: 400 });
    }

    const limit = Number(monthlyLimit);
    if (isNaN(limit) || limit <= 0) {
      return NextResponse.json({ error: "Monthly limit must be a positive number" }, { status: 400 });
    }

    // Check if a budget already exists for this category/month to avoid duplicates
    const { data: existing } = await supabase
      .from("budgets")
      .select("id")
      .eq("user_id", userId)
      .eq("category_id", catId)
      .eq("month", month || new Date().toISOString().slice(0, 7))
      .single();

    if (existing) {
      // If it exists, update it instead of creating a new one
      const { data, error } = await supabase
        .from("budgets")
        .update({ limit_amount: limit })
        .eq("id", existing.id)
        .select()
        .single();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json(data, { status: 200 });
    }

    // Otherwise, insert new
    const { data, error } = await supabase
      .from("budgets")
      .insert({
        id: crypto.randomUUID(), 
        user_id: userId,
        category_id: catId,
        limit_amount: limit,
        month: month || new Date().toISOString().slice(0, 7),
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase POST budget error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}