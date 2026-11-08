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