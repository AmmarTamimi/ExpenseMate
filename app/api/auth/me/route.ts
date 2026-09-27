// import { NextResponse } from "next/server";
// import { getSession } from "@/lib/auth/session";

// export async function GET() {
//   const session = await getSession();
//   if (!session) {
//     return NextResponse.json({ user: null }, { status: 401 });
//   }
//   return NextResponse.json({ user: session });
// }



















import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifySession } from "@/lib/auth/session";
import { connectDB } from "@/lib/config/db";
import { User } from "@/lib/models";

export async function GET(_req: NextRequest) {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const session = await verifySession(token);
    if (!session?.userId) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const user = await User.findById(session.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        userId: user._id.toString(),
        email: user.email,
        firstName: (user as any).firstName ?? user.firstName ?? "",
        lastName: (user as any).lastName ?? user.lastName ?? "",
      },
    });
  } catch (err) {
    console.error("/api/auth/me error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}