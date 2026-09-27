// import { NextResponse } from "next/server";
// import { clearSessionCookie } from "@/lib/auth/session";

// export async function POST() {
//   await clearSessionCookie();
//   return NextResponse.json({ message: "Logged out." });
// }












import { NextRequest, NextResponse } from "next/server";
import { clearSessionCookieOnResponse } from "@/lib/auth/session";

export async function POST(_req: NextRequest) {
  const res = NextResponse.json({ success: true, message: "Logged out" });
  return clearSessionCookieOnResponse(res);
}