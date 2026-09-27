import { createSession, setSessionCookie } from "@/lib/auth/session";
import { connectDB } from "@/lib/config/db";
import { User } from "@/lib/models";
import bcrypt from "bcryptjs";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, password } = body;

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 },
      );
    }
    await connectDB();
    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        { error: "user already exists" },
        { status: 400 },
      );
    }

   const newUser = await User.create({
  firstName,
  lastName,
  email,
  password: password,
});

    const token = await createSession({
      userId: newUser._id.toString(),
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
    });

    await setSessionCookie(token);
    return NextResponse.json(
      { newUser, success: true, message: "new user created" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to register user: " + error },
      { status: 500 },
    );
  }
}
