// import { NextRequest, NextResponse } from "next/server";
// import { connectDB } from "@/lib/config/db";
// import { Transaction, Category } from "@/lib/models";
// import { getAuthUser } from "@/lib/auth";
// import { getSession } from "@/lib/auth/session";

// /* ---------- GET: list all transactions for the logged-in user ---------- */
// export async function GET(req: NextRequest) {
//   try {
//     await connectDB();
//     const user = await getSession();
//     if (!user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const transactions = await Transaction.find({ userId: user.userId })
//       .populate("catId", "name type")
//       .sort({ date: -1 });

//     return NextResponse.json(transactions);
//   } catch (err: any) {
//     return NextResponse.json(
//       { error: err.message || "Failed to fetch transactions" },
//       { status: 500 }
//     );
//   }
// }

// /* ---------- POST: create a new transaction ---------- */
// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();
//     const user = await getSession();
//     if (!user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const body = await req.json();
//     const { type, catId, amount, date, note } = body;

//     /* --- Validation --- */
//     if (!type || !catId || amount === undefined) {
//       return NextResponse.json(
//         { error: "type, catId, and amount are required" },
//         { status: 400 }
//       );
//     }

//     if (type !== "income" && type !== "expense") {
//       return NextResponse.json(
//         { error: "Type must be 'income' or 'expense'" },
//         { status: 400 }
//       );
//     }

//     const numericAmount = Number(amount);
//     if (isNaN(numericAmount) || numericAmount <= 0) {
//       return NextResponse.json(
//         { error: "Amount must be a positive number" },
//         { status: 400 }
//       );
//     }

//     /* --- Category checks --- */
//     const category = await Category.findById(catId);
//     if (!category) {
//       return NextResponse.json(
//         { error: "Category not found" },
//         { status: 404 }
//       );
//     }

//     if (category.userId.toString() !== user.userId.toString()) {
//       return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//     }

//     if (category.type !== type) {
//       return NextResponse.json(
//         {
//           error: `Category type (${category.type}) does not match transaction type (${type})`,
//         },
//         { status: 400 }
//       );
//     }

//     /* --- Create --- */
//     const transaction = await Transaction.create({
//       type,
//       catId: category._id,
//       userId: user.userId,
//       amount: numericAmount,
//       date: date ? new Date(date) : new Date(),
//       note: (note ?? "").trim(),
//     });

//     const populated = await transaction.populate("catId", "name type");

//     return NextResponse.json(populated, { status: 201 });
//   } catch (err: any) {
//     if (err?.name === "ValidationError") {
//       const messages = Object.values(err.errors).map((e: any) => e.message);
//       return NextResponse.json({ error: messages.join(", ") }, { status: 400 });
//     }
//     return NextResponse.json(
//       { error: err.message || "Failed to create transaction" },
//       { status: 500 }
//     );
//   }
// }























































// import { NextRequest, NextResponse } from "next/server";
// import { getSession } from "@/lib/auth/session";
// import { transactionService } from "@/lib/services/transaction.service";

// export async function GET(req: NextRequest) {
//   try {
//     const session = await getSession();
//     if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     // CONTROLLER: Calls Service
//     const data = await transactionService.getUserTransactions(session.userId);
    
//     return NextResponse.json(data);
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     const session = await getSession();
//     if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const body = await req.json();

//     // CONTROLLER: Calls Service
//     const data = await transactionService.addExpense(session.userId, body);
    
//     return NextResponse.json(data, { status: 201 });
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 400 });
//   }
// }











































import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { transactionService } from "@/lib/services/transaction.service";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 1. CONTROLLER: Calls Service to get raw data
    const data = await transactionService.getUserTransactions(session.userId);
    
    // 2. CONTROLLER: Formats data for the React Frontend
    // The UI expects catId to be an object with a 'name' property to render the budget bars.
    const formatted = data.map((row: any) => ({
      _id: row.id,
      trId: row.id,
      type: row.type,
      catId: { 
        _id: row.category_id, 
        name: row.category_name || "Category", 
        type: row.type 
      },
      userId: row.user_id,
      amount: row.amount,
      date: row.date,
      note: row.note || "",
    }));

    return NextResponse.json(formatted);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();

    // CONTROLLER: Calls Service
    const data = await transactionService.addExpense(session.userId, body);
    
    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

























































// import { NextRequest, NextResponse } from "next/server";
// import { connectDB } from "@/lib/config/db";
// import { Category } from "@/lib/models";
// import { getSession } from "@/lib/auth/session";
// import { supabase } from "@/lib/supabase/client";

// export async function GET(req: NextRequest) {
//   try {
//     const session = await getSession();
//     if (!session) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     // ✅ Read from Supabase
//     const { data, error } = await supabase
//       .from("transactions")
//       .select("*")
//       .eq("user_id", session.userId)
//       .order("date", { ascending: false });

//     if (error) {
//       console.error("Supabase GET error:", error);
//       return NextResponse.json({ error: error.message }, { status: 500 });
//     }

//     // Format the data so your frontend works exactly as before
//     const formatted = data.map((row) => ({
//       _id: row.id,
//       trId: row.id,
//       type: row.type,
//       catId: { _id: row.category_id, name: "Category", type: row.type },
//       userId: row.user_id,
//       amount: row.amount,
//       date: row.date,
//       note: row.note,
//     }));

//     return NextResponse.json(formatted);
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     const session = await getSession();
//     if (!session) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const body = await req.json();
//     const { type, catId, amount, date, note } = body;

//     // 1. Verify category in MongoDB (categories haven't moved yet)
//     await connectDB();
//     const category = await Category.findById(catId);
//     if (!category) {
//       return NextResponse.json({ error: "Category not found" }, { status: 404 });
//     }

//     // 2. ✅ Write to Supabase
//     const { data, error } = await supabase
//       .from("transactions")
//       .insert({
//         user_id: session.userId,
//         category_id: category._id.toString(),
//         type,
//         amount: Number(amount),
//         date: date ? new Date(date).toISOString() : new Date().toISOString(),
//         note: (note ?? "").trim(),
//       })
//       .select()
//       .single();

//     if (error) {
//       console.error("Supabase POST error:", error);
//       return NextResponse.json({ error: error.message }, { status: 500 });
//     }

//     return NextResponse.json(
//       {
//         _id: data.id,
//         trId: data.id,
//         type: data.type,
//         catId: { _id: data.category_id, name: category.name, type: category.type },
//         userId: data.user_id,
//         amount: data.amount,
//         date: data.date,
//         note: data.note,
//       },
//       { status: 201 }
//     );
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }