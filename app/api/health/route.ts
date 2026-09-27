import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/db";
import { User } from "@/lib/models";

export async function GET() {
  await connectDB();
  const count = await User.countDocuments();
  return NextResponse.json({ ok: true, userCount: count });
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  const user = await User.create(body);
  return NextResponse.json(user, { status: 201 });
}