import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("❌ Please define MONGODB_URI in .env.local");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache =
  global._mongooseCache ??
  (global._mongooseCache = { conn: null, promise: null });

export const connectDB = async (): Promise<typeof mongoose> => {
  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  try {
    cache.conn = await cache.promise;
    console.log("✅ MongoDB connected");
    return cache.conn;
  } catch (err) {
    cache.promise = null;
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }
};