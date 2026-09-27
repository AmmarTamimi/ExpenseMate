"use client";

import { getSession } from "@/lib/auth/session";
import { useEffect, useState } from "react";
// import { DEV_USER_ID } from "@/lib/devUser";

export type TransactionType = "income" | "expense";

interface CategoryOption {
  _id: string;
  catId: string;
  name: string;
  type: "income" | "expense";
}

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  /** Optional: pre-select a type when opening (default: expense) */
  defaultType?: TransactionType;
}

export default function TransactionModal({
  isOpen,
  onClose,
  onSuccess,
  defaultType = "expense",
}: TransactionModalProps) {
  const [type, setType] = useState<TransactionType>(defaultType);
  const [catId, setCatId] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState("");

  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---- Fetch categories once when the modal opens ---- */
  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;

    (async () => {
      try {
        setLoadingCategories(true);
        const user = await getSession();
        const res = await fetch("/api/categories", {
          headers: { "x-user-id": user?.userId || "" },
        });
        const data = await res.json();
        if (!cancelled && res.ok) {
          setCategories(data);
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      } finally {
        if (!cancelled) setLoadingCategories(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  /* ---- Reset category selection when the type switches ---- */
  useEffect(() => {
    setCatId("");
  }, [type]);

  if (!isOpen) return null;

  const filteredCategories = categories.filter((c) => c.type === type);

  const resetForm = () => {
    setType(defaultType);
    setCatId("");
    setAmount("");
    setDate(new Date().toISOString().slice(0, 10));
    setNote("");
    setError("");
    setLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = async () => {
    setError("");

    if (!catId) {
      setError("Please select a category");
      return;
    }

    const numericAmount = Number(amount);
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      setError("Amount must be a positive number");
      return;
    }

    setLoading(true);
    const user = await getSession();
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user?.userId || "",
        },
        body: JSON.stringify({
          type,
          catId,
          amount: numericAmount,
          date,
          note: note.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to save transaction");
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
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-ink-900">
            Add Transaction
          </h2>
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

        {/* Error banner */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Type (radio) */}
        <div className="mb-4">
          <span className="mb-2 block text-sm font-medium text-ink-700">
            Type
          </span>
          <div className="flex gap-6">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="tx-type"
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
                name="tx-type"
                value="income"
                checked={type === "income"}
                onChange={() => setType("income")}
                className="h-4 w-4 accent-green-500"
              />
              <span className="text-sm text-ink-800">Income</span>
            </label>
          </div>
        </div>

        {/* Category (dropdown filtered by type) */}
        <div className="mb-4">
          <label
            htmlFor="tx-category"
            className="mb-1 block text-sm font-medium text-ink-700"
          >
            Category
          </label>
          {loadingCategories ? (
            <p className="text-xs text-ink-400">Loading categories...</p>
          ) : filteredCategories.length === 0 ? (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
              No {type} categories yet. Create one first using &quot;Add Category&quot;.
            </p>
          ) : (
            <select
              id="tx-category"
              value={catId}
              onChange={(e) => setCatId(e.target.value)}
              className="w-full rounded-lg border border-lavender-200 bg-white px-3 py-2 text-ink-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            >
              <option value="">— Select a category —</option>
              {filteredCategories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Amount + Date row */}
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="tx-amount"
              className="mb-1 block text-sm font-medium text-ink-700"
            >
              Amount
            </label>
            <input
              id="tx-amount"
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full rounded-lg border border-lavender-200 px-3 py-2 text-ink-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </div>
          <div>
            <label
              htmlFor="tx-date"
              className="mb-1 block text-sm font-medium text-ink-700"
            >
              Date
            </label>
            <input
              id="tx-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-lavender-200 px-3 py-2 text-ink-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </div>
        </div>

        {/* Note */}
        <div className="mb-6">
          <label
            htmlFor="tx-note"
            className="mb-1 block text-sm font-medium text-ink-700"
          >
            Note <span className="text-ink-400">(optional)</span>
          </label>
          <input
            id="tx-note"
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Lunch with team"
            maxLength={200}
            className="w-full rounded-lg border border-lavender-200 px-3 py-2 text-ink-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          />
        </div>

        {/* Actions */}
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
            disabled={loading || loadingCategories || filteredCategories.length === 0}
            className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}