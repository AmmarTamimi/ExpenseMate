// import { createSession, setSessionCookie } from "@/lib/auth/session";
// import { connectDB } from "@/lib/config/db";
// import { User } from "@/lib/models";
// import bcrypt from "bcryptjs";
// import { error } from "console";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const {email, password } = body;

//     if (!email || !password) {
//       return NextResponse.json(
//         { error: "All fields are required." },
//         { status: 400 },
//       );
//     }
//     await connectDB();
//     const user = await User.findOne({ email }).select("+password");
//     if (!user) {
//         return NextResponse.json(
//             { error: "user does not exists" },
//             { status: 400 },
//         );
//     }
//     const validPass = await bcrypt.compare(password,user.password)
//     if(!validPass){
//          return NextResponse.json(
//             { error: "Incorrect Password" },
//             { status: 400 },
//         );
//     }
   

//     const token = await createSession({
//       userId: user._id.toString(),
//       email: user.email,
//       firstName: user.firstName,
//       lastName: user.lastName,
//     });

//     await setSessionCookie(token);
//     return NextResponse.json(
//       { user, success: true, message: "new user created" },
//       { status: 200 },
//     );
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to register user: " + error },
//       { status: 500 },
//     );
//   }
// }







































import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/config/db";
import { User } from "@/lib/models";
import { createSession, attachSessionCookie } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );
    if (!user) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 400 }
      );
    }

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      return NextResponse.json(
        { error: "Incorrect password" },
        { status: 400 }
      );
    }

    /* --- create session JWT --- */
    const token = await createSession({
      userId: user._id.toString(),
      email: user.email,
      firstName: (user as any).firstName ?? user.firstName ?? "",
      lastName: (user as any).lastName ?? user.lastName ?? "",
    });

    /* --- build response and set cookie ON the response --- */
    const res = NextResponse.json(
      {
        success: true,
        message: "Logged in successfully",
        user: {
          userId: user._id.toString(),
          email: user.email,
          firstName: (user as any).firstName ?? user.firstName ?? "",
          lastName: (user as any).lastName ?? user.lastName ?? "",
        },
      },
      { status: 200 }
    );

    return attachSessionCookie(res, token);
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Login failed: " + (error as Error).message },
      { status: 500 }
    );
  }
}