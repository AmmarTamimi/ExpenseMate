const RAW = "68d4f1a2c9b3e5f7a8d1c2b4"; // ← replace with your real 24-char _id

if (RAW === "PASTE-REAL-USER-_id-HERE" || RAW.length !== 24) {
  throw new Error(
    "DEV_USER_ID is not set. Paste a real 24-char MongoDB _id in app/src/lib/devUser.ts"
  );
}

export const DEV_USER_ID = RAW;