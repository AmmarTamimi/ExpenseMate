"use client";

import { useEffect, useState } from "react";

interface CategoryOption {
  _id: string;
  name: string;
  type: "income" | "expense";
}

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  /** Optional initial value for edit mode */
  initial?: { id: string; catId: string; monthlyLimit: number; month: string };
  /** Provide the user id used for auth header */
  userId: string;
}

function currentMonthKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default function BudgetModal({
  isOpen,
  onClose,
  onSuccess,
  initial,
  userId,
}: BudgetModalProps) {
  const isEdit = !!initial;

  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [catId, setCatId] = useState(initial?.catId ?? "");
  const [monthlyLimit, setMonthlyLimit] = useState(
    initial?.monthlyLimit?.toString() ?? ""
  );
  const [month, setMonth] = useState(initial?.month ?? currentMonthKey());
  const [loadingCats, setLoadingCats] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* Fetch expense categories once */
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    (async () => {
      try {
        setLoadingCats(true);
        const res = await fetch("/api/categories", {
          headers: { "x-user-id": userId },
        });
        const data = await res.json();
        if (!cancelled && res.ok) {
          setCategories(data.filter((c: CategoryOption) => c.type === "expense"));
        }
      } finally {
        if (!cancelled) setLoadingCats(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isOpen, userId]);

  /* Sync internal state with `initial` when opening in edit mode */
  useEffect(() => {
    if (isOpen) {
      setCatId(initial?.catId ?? "");
      setMonthlyLimit(initial?.monthlyLimit?.toString() ?? "");
      setMonth(initial?.month ?? currentMonthKey());
      setError("");
    }
  }, [isOpen, initial]);

  if (!isOpen) return null;

  const reset = () => {
    setCatId("");
    setMonthlyLimit("");
    setMonth(currentMonthKey());
    setError("");
    setLoading(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSave = async () => {
    setError("");
    if (!isEdit && !catId) {
      setError("Please select an expense category");
      return;
    }
    const limit = Number(monthlyLimit);
    if (!monthlyLimit || isNaN(limit) || limit <= 0) {
      setError("Monthly limit must be a positive number");
      return;
    }

    setLoading(true);
    try {
      const url = isEdit ? `/api/budgets/${initial!.id}` : "/api/budgets";
      const method = isEdit ? "PATCH" : "POST";
      const payload = isEdit
        ? { monthlyLimit: limit }
        : { catId, monthlyLimit: limit, month };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to save budget");
        setLoading(false);
        return;
      }

      reset();
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
          <h2 className="text-xl font-semibold text-ink-900">
            {isEdit ? "Edit Budget" : "Set Monthly Budget"}
          </h2>
          <button
            onClick={handleClose}
            className="rounded-full p-1 text-ink-400 hover:bg-lavender-50"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Category (disabled in edit mode) */}
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-ink-700">
            Expense Category
          </label>
          {loadingCats ? (
            <p className="text-xs text-ink-400">Loading categories...</p>
          ) : categories.length === 0 && !isEdit ? (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
              No expense categories yet. Create one from &quot;Add Category&quot; first.
            </p>
          ) : (
            <select
              value={catId}
              onChange={(e) => setCatId(e.target.value)}
              disabled={isEdit}
              className="w-full rounded-lg border border-lavender-200 bg-white px-3 py-2 text-ink-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 disabled:bg-lavender-50"
            >
              <option value="">— Select a category —</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Limit */}
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-ink-700">
            Monthly Limit (€)
          </label>
          <input
            type="number"
            step="0.01"
            min="1"
            value={monthlyLimit}
            onChange={(e) => setMonthlyLimit(e.target.value)}
            placeholder="e.g. 500"
            className="w-full rounded-lg border border-lavender-200 px-3 py-2 text-ink-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          />
        </div>

        {/* Month (disabled in edit mode) */}
        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium text-ink-700">
            Month
          </label>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            disabled={isEdit}
            className="w-full rounded-lg border border-lavender-200 px-3 py-2 text-ink-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 disabled:bg-lavender-50"
          />
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
            disabled={loading || (categories.length === 0 && !isEdit)}
            className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 disabled:opacity-50"
          >
            {loading ? "Saving..." : isEdit ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}