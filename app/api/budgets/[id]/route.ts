import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/config/db";
import { Budget } from "@/lib/models";
import { getAuthUser } from "@/lib/auth";

/* ---------- PATCH: update monthlyLimit ---------- */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const budget = await Budget.findById(params.id);
    if (!budget) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (budget.userId.toString() !== user._id.toString())
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    if (body.monthlyLimit !== undefined) {
      const limit = Number(body.monthlyLimit);
      if (isNaN(limit) || limit <= 0)
        return NextResponse.json(
          { error: "Monthly limit must be positive" },
          { status: 400 }
        );
      budget.monthlyLimit = limit;
    }

    await budget.save();
    const populated = await budget.populate("catId", "name type");
    return NextResponse.json(populated);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to update" },
      { status: 500 }
    );
  }
}

/* ---------- DELETE ---------- */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const budget = await Budget.findById(params.id);
    if (!budget) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (budget.userId.toString() !== user._id.toString())
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await budget.deleteOne();
    return new NextResponse(null, { status: 204 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to delete" },
      { status: 500 }
    );
  }
}