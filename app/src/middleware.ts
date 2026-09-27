// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { verifySession, COOKIE_NAME } from "@/lib/auth/session";

// const PROTECTED_PREFIXES = ["/dashboard"];
// const AUTH_ROUTES = ["/login", "/signup"];

// export async function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;
//   const token = req.cookies.get(COOKIE_NAME)?.value;
//   const session = token ? await verifySession(token) : null;

//   // Redirect unauthenticated users away from protected routes
//   if (PROTECTED_PREFIXES.some((p) => pathname.startsWith(p)) && !session) {
//     const url = req.nextUrl.clone();
//     url.pathname = "/login";
//     return NextResponse.redirect(url);
//   }

//   // Redirect logged-in users away from login/signup
//   if (AUTH_ROUTES.includes(pathname) && session) {
//     const url = req.nextUrl.clone();
//     url.pathname = "/dashboard";
//     return NextResponse.redirect(url);
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/dashboard/:path*", "/login", "/signup"],
// };

























































import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession, COOKIE_NAME } from "@/lib/auth/session";

const PROTECTED_PREFIXES = ["/dashboard"];
const AUTH_ROUTES = ["/login", "/signup"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const session = token ? await verifySession(token) : null;

  /* Unauthenticated users can't reach protected routes */
  if (PROTECTED_PREFIXES.some((p) => pathname.startsWith(p)) && !session) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  /* Logged-in users are pushed away from login/signup */
  if (AUTH_ROUTES.includes(pathname) && session) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};