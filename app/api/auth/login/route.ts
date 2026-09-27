import { createSession, setSessionCookie } from "@/lib/auth/session";
import { connectDB } from "@/lib/config/db";
import { User } from "@/lib/models";
import bcrypt from "bcryptjs";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 },
      );
    }
    await connectDB();
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return NextResponse.json(
            { error: "user does not exists" },
            { status: 400 },
        );
    }
    const validPass = await bcrypt.compare(password,user.password)
    if(!validPass){
         return NextResponse.json(
            { error: "Incorrect Password" },
            { status: 400 },
        );
    }
   

    const token = await createSession({
      userId: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    await setSessionCookie(token);
    return NextResponse.json(
      { user, success: true, message: "new user created" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to register user: " + error },
      { status: 500 },
    );
  }
}
