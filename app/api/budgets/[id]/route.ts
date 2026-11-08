import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/config/db";
import { Budget } from "@/lib/models";
import { COOKIE_NAME, verifySession } from "@/lib/auth/session";

/* ---------- Auth helper: reads the session cookie ---------- */
async function getAuthedUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const session = await verifySession(token);
  return session?.userId ?? null;
}

/* ---------- PATCH: update monthlyLimit ---------- */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const userId = await getAuthedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!params.id || params.id.length !== 24) {
      return NextResponse.json({ error: "Invalid budget id" }, { status: 400 });
    }

    const budget = await Budget.findById(params.id);
    if (!budget) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (budget.userId.toString() !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    if (body.monthlyLimit !== undefined) {
      const limit = Number(body.monthlyLimit);
      if (isNaN(limit) || limit <= 0) {
        return NextResponse.json(
          { error: "Monthly limit must be positive" },
          { status: 400 }
        );
      }
      budget.monthlyLimit = limit;
    }

    await budget.save();
    const populated = await budget.populate("catId", "name type");
    return NextResponse.json(populated);
  } catch (err: any) {
    console.error("PATCH /api/budgets/[id] error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to update" },
      { status: 500 }
    );
  }
}

/* ---------- DELETE: remove budget ---------- */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const userId = await getAuthedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!params.id || params.id.length !== 24) {
      return NextResponse.json({ error: "Invalid budget id" }, { status: 400 });
    }

    const budget = await Budget.findById(params.id);
    if (!budget) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (budget.userId.toString() !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await budget.deleteOne();
    return new NextResponse(null, { status: 204 });
  } catch (err: any) {
    console.error("DELETE /api/budgets/[id] error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to delete" },
      { status: 500 }
    );
  }
}