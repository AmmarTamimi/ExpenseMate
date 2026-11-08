// import { NextRequest, NextResponse } from "next/server";
// import { connectDB } from "@/lib/config/db";
// import { Budget, Category } from "@/lib/models";
// import { getAuthUser } from "@/lib/auth";

// /* ---------- Helper ---------- */
// function monthKey(d = new Date()) {
//   return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
// }

// /* ---------- GET: list budgets for user (optionally by month) ---------- */
// export async function GET(req: NextRequest) {
//   try {
//     await connectDB();
//     const user = await getAuthUser(req);
//     if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const month = req.nextUrl.searchParams.get("month") ?? undefined;

//     const filter: any = { userId: user._id };
//     if (month) filter.month = month;

//     const budgets = await Budget.find(filter)
//       .populate("catId", "name type")
//       .sort({ month: -1 });

//     return NextResponse.json(budgets);
//   } catch (err: any) {
//     return NextResponse.json(
//       { error: err.message || "Failed to fetch budgets" },
//       { status: 500 }
//     );
//   }
// }

// /* ---------- POST: create a budget for a category + month ---------- */
// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();
//     const user = await getAuthUser(req);
//     if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const body = await req.json();
//     const { catId, monthlyLimit, month } = body;

//     if (!catId || monthlyLimit === undefined) {
//       return NextResponse.json(
//         { error: "catId and monthlyLimit are required" },
//         { status: 400 }
//       );
//     }

//     const limit = Number(monthlyLimit);
//     if (isNaN(limit) || limit <= 0) {
//       return NextResponse.json(
//         { error: "Monthly limit must be a positive number" },
//         { status: 400 }
//       );
//     }

//     const category = await Category.findById(catId);
//     if (!category)
//       return NextResponse.json({ error: "Category not found" }, { status: 404 });
//     if (category.userId.toString() !== user._id.toString())
//       return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//     if (category.type !== "expense")
//       return NextResponse.json(
//         { error: "Budgets are only allowed on expense categories" },
//         { status: 400 }
//       );

//     const targetMonth = month ?? monthKey();

//     const existing = await Budget.findOne({
//       userId: user._id,
//       catId: category._id,
//       month: targetMonth,
//     });
//     if (existing)
//       return NextResponse.json(
//         { error: "Budget already exists for this category and month" },
//         { status: 409 }
//       );

//     const budget = await Budget.create({
//       userId: user._id,
//       catId: category._id,
//       monthlyLimit: limit,
//       month: targetMonth,
//       status: "ok",
//     });

//     const populated = await budget.populate("catId", "name type");
//     return NextResponse.json(populated, { status: 201 });
//   } catch (err: any) {
//     if (err?.code === 11000)
//       return NextResponse.json(
//         { error: "Budget already exists for this category and month" },
//         { status: 409 }
//       );
//     if (err?.name === "ValidationError") {
//       const messages = Object.values(err.errors).map((e: any) => e.message);
//       return NextResponse.json({ error: messages.join(", ") }, { status: 400 });
//     }
//     return NextResponse.json(
//       { error: err.message || "Failed to create budget" },
//       { status: 500 }
//     );
//   }
// }







































// import { NextRequest, NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import { COOKIE_NAME, verifySession } from "@/lib/auth/session";
// import { supabase } from "@/lib/supabase/client";
// import { Category } from "@/lib/models";
// import { connectDB } from "@/lib/config/db";

// async function getAuthedUserId(): Promise<string | null> {
//   const cookieStore = await cookies();
//   const token = cookieStore.get(COOKIE_NAME)?.value;
//   if (!token) return null;
//   const session = await verifySession(token);
//   return session?.userId ?? null;
// }

// /* ---------- GET: list all budgets ---------- */
// export async function GET(req: NextRequest) {
//   try {
//     const userId = await getAuthedUserId();
//     if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     // 1. Fetch raw budgets from Supabase
//     const { data, error } = await supabase
//       .from("budgets")
//       .select("*")
//       .eq("user_id", userId);

//     if (error) return NextResponse.json({ error: error.message }, { status: 500 });
//     if (!data) return NextResponse.json([]);

//     // 2. Get category details from MongoDB to populate the UI
//     await connectDB();
//     const catIds = data.map(b => b.category_id);
//     const categories = await Category.find({ _id: { $in: catIds } });

//     // 3. Format to match the React frontend expectations
//     const formatted = data.map((row) => {
//       const cat = categories.find(c => c._id.toString() === row.category_id);
//       return {
//         _id: row.id,
//         catId: { 
//           _id: row.category_id, 
//           name: cat ? cat.name : "Unknown", 
//           type: cat ? cat.type : "expense"
//         },
//         monthlyLimit: row.limit_amount, // Map limit_amount to monthlyLimit
//         month: row.month,
//         status: "ok",
//       };
//     });

//     return NextResponse.json(formatted);
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }

// /* ---------- POST: create a new budget ---------- */
// export async function POST(req: NextRequest) {
//   try {
//     const userId = await getAuthedUserId();
//     if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const body = await req.json();
//     const { catId, monthlyLimit, month } = body;

//     if (!catId || !monthlyLimit) {
//       return NextResponse.json({ error: "catId and monthlyLimit are required" }, { status: 400 });
//     }

//     // Insert into Supabase (Note: column name is limit_amount)
//     const { data, error } = await supabase
//       .from("budgets")
//       .insert({
//         id: crypto.randomUUID(), 
//         user_id: userId,
//         category_id: catId,
//         limit_amount: Number(monthlyLimit),
//         month: month || new Date().toISOString().slice(0, 7),
//       })
//       .select()
//       .single();

//     if (error) {
//       console.error("Supabase POST budget error:", error);
//       return NextResponse.json({ error: error.message }, { status: 500 });
//     }
    
//     return NextResponse.json(data, { status: 201 });
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }

















































































// import { NextRequest, NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import { COOKIE_NAME, verifySession } from "@/lib/auth/session";
// import { supabase } from "@/lib/supabase/client";
// import { Category } from "@/lib/models";
// import { connectDB } from "@/lib/config/db";

// async function getAuthedUserId(): Promise<string | null> {
//   const cookieStore = await cookies();
//   const token = cookieStore.get(COOKIE_NAME)?.value;
//   if (!token) return null;
//   const session = await verifySession(token);
//   return session?.userId ?? null;
// }

// /* ---------- GET: list all budgets ---------- */
// export async function GET(req: NextRequest) {
//   try {
//     const userId = await getAuthedUserId();
//     if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const { data, error } = await supabase
//       .from("budgets")
//       .select("*")
//       .eq("user_id", userId);

//     if (error) return NextResponse.json({ error: error.message }, { status: 500 });
//     if (!data) return NextResponse.json([]);

//     await connectDB();
//     const catIds = data.map(b => b.category_id);
//     const categories = await Category.find({ _id: { $in: catIds } });

//     const formatted = data.map((row) => {
//       const cat = categories.find(c => c._id.toString() === row.category_id);
//       return {
//         _id: row.id, // This is the crucial Budget ID for editing/deleting
//         catId: { 
//           _id: row.category_id, 
//           name: cat ? cat.name : "Unknown", 
//           type: cat ? cat.type : "expense"
//         },
//         monthlyLimit: row.limit_amount, 
//         month: row.month,
//         status: "ok",
//       };
//     });

//     return NextResponse.json(formatted);
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }

// /* ---------- POST: create a new budget ---------- */
// export async function POST(req: NextRequest) {
//   try {
//     const userId = await getAuthedUserId();
//     if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const body = await req.json();
//     const { catId, monthlyLimit, month } = body;

//     if (!catId || !monthlyLimit) {
//       return NextResponse.json({ error: "catId and monthlyLimit are required" }, { status: 400 });
//     }

//     // Check if a budget already exists for this category/month to avoid duplicates
//     const { data: existing } = await supabase
//       .from("budgets")
//       .select("id")
//       .eq("user_id", userId)
//       .eq("category_id", catId)
//       .eq("month", month || new Date().toISOString().slice(0, 7))
//       .single();

//     if (existing) {
//       // If it exists, update it instead of creating a new one
//       const { data, error } = await supabase
//         .from("budgets")
//         .update({ limit_amount: Number(monthlyLimit) })
//         .eq("id", existing.id)
//         .select()
//         .single();
//       if (error) return NextResponse.json({ error: error.message }, { status: 500 });
//       return NextResponse.json(data, { status: 200 });
//     }

//     // Otherwise, insert new
//     const { data, error } = await supabase
//       .from("budgets")
//       .insert({
//         id: crypto.randomUUID(), 
//         user_id: userId,
//         category_id: catId,
//         limit_amount: Number(monthlyLimit),
//         month: month || new Date().toISOString().slice(0, 7),
//       })
//       .select()
//       .single();

//     if (error) {
//       console.error("Supabase POST budget error:", error);
//       return NextResponse.json({ error: error.message }, { status: 500 });
//     }
    
//     return NextResponse.json(data, { status: 201 });
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }






























































import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifySession } from "@/lib/auth/session";
import { supabase } from "@/lib/supabase/client";
import { budgetService } from "@/lib/services/budget.service"; // <-- IMPORT SERVICE

async function getAuthedUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const session = await verifySession(token);
  return session?.userId ?? null;
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

    // 🟢 USE THE NEW SERVICE TO VALIDATE (Proving we moved logic out of the route)
    // This will throw an error if the limit is negative or 0
    budgetService.getBudgetStatus(Number(monthlyLimit), 0); 

    // Insert into Supabase
    const { data, error } = await supabase
      .from("budgets")
      .insert({
        id: crypto.randomUUID(), 
        user_id: userId,
        category_id: catId,
        limit_amount: Number(monthlyLimit),
        month: month || new Date().toISOString().slice(0, 7),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    // If the BudgetPolicy throws (e.g., limit <= 0), we catch it here
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}