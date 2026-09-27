"use client";

import { getUser } from "@/lib/auth/getUser";
import { getSession } from "@/lib/auth/session";
import { useState } from "react";

export type CategoryType = "income" | "expense";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CategoryModal({
  isOpen,
  onClose,
  onSuccess,
}: CategoryModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<CategoryType>("expense");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setName("");
    setType("expense");
    setError("");
    setLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = async () => {
    setError("");

    if (!name.trim()) {
      setError("Category name is required");
      return;
    }
    if (name.trim().length > 40) {
      setError("Name must be 40 characters or less");
      return;
    }

    setLoading(true);
    const {user} = getUser();
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user?.userId || "",
        },
        body: JSON.stringify({ name: name.trim(), type }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to save category");
        setLoading(false);
        return;
      }

      resetForm();
      onSuccess?.();
      onClose();
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-ink-900">Add Category</h2>
          <button
            onClick={handleClose}
            className="rounded-full p-1 text-ink-400 hover:bg-lavender-50 hover:text-ink-700"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label
            htmlFor="cat-name"
            className="mb-1 block text-sm font-medium text-ink-700"
          >
            Category Name
          </label>
          <input
            id="cat-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Food, Salary, Transport"
            maxLength={40}
            autoFocus
            className="w-full rounded-lg border border-lavender-200 px-3 py-2 text-ink-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          />
        </div>

        <div className="mb-6">
          <span className="mb-2 block text-sm font-medium text-ink-700">
            Type
          </span>
          <div className="flex gap-6">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="category-type"
                value="expense"
                checked={type === "expense"}
                onChange={() => setType("expense")}
                className="h-4 w-4 accent-red-500"
              />
              <span className="text-sm text-ink-800">Expense</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="category-type"
                value="income"
                checked={type === "income"}
                onChange={() => setType("income")}
                className="h-4 w-4 accent-green-500"
              />
              <span className="text-sm text-ink-800">Income</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={handleClose}
            disabled={loading}
            className="rounded-lg border border-lavender-200 px-4 py-2 text-sm font-medium text-ink-700 hover:bg-lavender-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ⚠️ DEV ONLY — replace with the real logged-in user's _id
// (paste the `_id` from MongoDB Compass → expensemate → users)
// const DEV_USER_ID = "PASTE-REAL-USER-_id-HERE";