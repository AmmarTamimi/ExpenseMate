// import { SignJWT, jwtVerify } from "jose";
// import { cookies } from "next/headers";

// const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
// const COOKIE_NAME = "session";
// const MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

// export type SessionPayload = {
//   userId: string;
//   email: string;
//   firstName: string;
//   lastName: string;
// };

// /** Create a signed JWT from the payload */
// export async function createSession(payload: SessionPayload) {
//   return await new SignJWT(payload)
//     .setProtectedHeader({ alg: "HS256" })
//     .setIssuedAt()
//     .setExpirationTime(`${MAX_AGE}s`)
//     .sign(SECRET);
// }

// /** Verify a JWT and return the payload, or null if invalid */
// export async function verifySession(token: string): Promise<SessionPayload | null> {
//   try {
//     const { payload } = await jwtVerify(token, SECRET);
//     return payload as unknown as SessionPayload;
//   } catch {
//     return null;
//   }
// }

// /** Set the session cookie on the response */
// export async function setSessionCookie(token: string) {
//   const cookieStore = await cookies();
//   cookieStore.set(COOKIE_NAME, token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "lax",
//     path: "/",
//     maxAge: MAX_AGE,
//   });
// }

// /** Clear the session cookie (logout) */
// export async function clearSessionCookie() {
//   const cookieStore = await cookies();
//   cookieStore.delete(COOKIE_NAME);
// }

// /** Read the current session from cookies (server-side only) */
// export async function getSession(): Promise<SessionPayload | null> {
//   const cookieStore = await cookies();
//   const token = cookieStore.get(COOKIE_NAME)?.value;
//   if (!token) return null;
//   return await verifySession(token);
// }

// export { COOKIE_NAME };
































import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
const COOKIE_NAME = "session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

export type SessionPayload = {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
};

/** Create a signed JWT from the payload */
export async function createSession(payload: SessionPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(SECRET);
}

/** Verify a JWT and return the payload, or null if invalid */
export async function verifySession(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

/* ---------- Server-Action / Server-Component cookie helpers ---------- */

/** Set the session cookie — use inside Server Actions / Server Components */
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

/** Clear the session cookie — use inside Server Actions / Server Components */
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/* ---------- Route-Handler cookie helpers (Next.js 15) ---------- */

/**
 * Attach the session cookie to a NextResponse.
 * Route handlers must set cookies on the response object — `cookies().set()`
 * does not attach Set-Cookie to responses returned from route handlers.
 */
export function attachSessionCookie(
  res: NextResponse,
  token: string
): NextResponse {
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
  return res;
}

/** Clear the session cookie on a NextResponse (logout route handler) */
export function clearSessionCookieOnResponse(res: NextResponse): NextResponse {
  res.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}

/** Read the current session from cookies (server-side only) */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifySession(token);
}

export { COOKIE_NAME };