import { NextRequest } from "next/server";
import { connectDB } from "./config/db";
import { User } from "./models";

/**
 * ⚠️ DEV ONLY — reads a user id from the `x-user-id` header.
 * Replace with JWT verification when you build the auth flow.
 */
export async function getAuthUser(req: NextRequest) {
  await connectDB();
  const userId = req.headers.get("x-user-id");
  if (!userId) return null;
  return User.findById(userId);
}