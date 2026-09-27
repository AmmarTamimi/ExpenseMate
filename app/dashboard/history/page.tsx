"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Filter,
  Download,
  Printer,
  TrendingUp,
  TrendingDown,
  Calendar,
  FileText,
  Loader2,
} from "lucide-react";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";
import ExpenseTable, { Expense } from "../../components/ExpenseTable";

/* ---------- Types ---------- */

type HistoryItem = Expense & {
  _id: string;
  type: "income" | "expense";
  category: string;
  // raw fields for CSV export
  rawAmount: number;
  rawDate: string;
};

type ApiTransaction = {
  _id: string;
  amount: number;
  category: string;
  type: "income" | "expense";
  date: string; // ISO
  note?: string;
};

type FilterType = "all" | "income" | "expense";

/* ---------- Helpers ---------- */

function formatAmount(n: number) {
  return `${n.toFixed(2).replace(".", ",")}€`;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  return `${dd}/${mm}/${yy}`;
}

function toCsv(rows: HistoryItem[]): string {
  const header = ["Date", "Category", "Type", "Amount", "Note"].join(",");

  const body = rows
    .map((r) => {
      const date = r.rawDate ? String(r.rawDate).slice(0, 10) : "";
      const category = r.category ?? "";
      const type = r.type ?? "";
      const amount = typeof r.rawAmount === "number" ? r.rawAmount.toFixed(2) : "";
      const note = r.company ?? ""; // company === note in your mapping

      return [
        escapeCsv(date),
        escapeCsv(category),
        escapeCsv(type),
        escapeCsv(amount),
        escapeCsv(note),
      ].join(",");
    })
    .join("\n");

  return `${header}\n${body}`;
}

function escapeCsv(value: unknown): string {
  const s = value == null ? "" : String(value);
  if (s.includes(",") || s.includes('"') || s.includes("\n") || s.includes("\r")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function triggerDownload(csv: string, filename: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/* ---------- Page ---------- */

export default function HistoryPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [rows, setRows] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ---------- Fetch transactions ---------- */

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/transactions", { cache: "no-store" });

        if (res.status === 401) {
          window.location.href = "/login";
          return;
        }

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Failed to load transactions");
        }

        const data: ApiTransaction[] = await res.json();
        if (!Array.isArray(data)) {
          throw new Error("Unexpected response from server");
        }

        // Map API response → table row shape
        const mapped: HistoryItem[] = data.map((t) => ({
          _id: t._id,
          company: t.note || t.category || "—", // display merchant as the note
          category: t.category,
          budget: "—", // budgets not wired yet
          date: formatDate(t.date),
          amount: formatAmount(t.amount),
          status: "Approved", // placeholder; wire real status if needed
          icon: t.type === "income" ? "💰" : "💸",
          type: t.type,
          rawAmount: t.amount,
          rawDate: t.date,
        }));

        if (!cancelled) setRows(mapped);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError((err as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  /* ---------- Filtering + totals ---------- */

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((h) => {
      const matchesQuery =
        q === "" ||
        h.company.toLowerCase().includes(q) ||
        h.category.toLowerCase().includes(q) ||
        h.budget.toLowerCase().includes(q);

      const matchesType = filter === "all" || h.type === filter;

      return matchesQuery && matchesType;
    });
  }, [rows, query, filter]);

  const totals = useMemo(() => {
    let income = 0;
    let expense = 0;
    for (const r of filtered) {
      if (r.type === "income") income += r.rawAmount;
      else expense += r.rawAmount;
    }
    return { income, expense, net: income - expense };
  }, [filtered]);

  /* ---------- Handlers ---------- */

  const handleExport = () => {
    if (filtered.length === 0) return;
    const csv = toCsv(filtered);
    const today = new Date().toISOString().slice(0, 10);
    triggerDownload(csv, `expensemate-history-${today}.csv`);
  };

  const handlePrint = () => {
    window.print();
  };

  /* ---------- Render ---------- */

  return (
    <div className="flex min-h-screen bg-[#F8F7FC]">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
        <TopBar onMenu={() => setMenuOpen(true)} />

        {/* Page header */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-ink-900 sm:text-[28px]">
              History
            </h1>
            <p className="mt-1 text-sm text-ink-500">
              All your past transactions in one place.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <button
              onClick={handleExport}
              disabled={filtered.length === 0}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-lavender-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-700 transition-colors hover:bg-lavender-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
            <button
              onClick={handlePrint}
              disabled={filtered.length === 0}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-lavender-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-700 transition-colors hover:bg-lavender-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              <Printer className="h-4 w-4" />
              Print
            </button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SummaryCard
            icon={TrendingUp}
            label="Income"
            value={formatAmount(totals.income)}
            tone="green"
          />
          <SummaryCard
            icon={TrendingDown}
            label="Expenses"
            value={formatAmount(totals.expense)}
            tone="red"
          />
          <SummaryCard
            icon={Calendar}
            label="Net"
            value={formatAmount(totals.net)}
            tone={totals.net >= 0 ? "primary" : "red"}
          />
        </div>

        {/* Table card */}
        <section className="rounded-3xl bg-white p-5 shadow-card sm:p-6">
          {/* Filter bar */}
          <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex w-full items-center gap-3 rounded-2xl border border-lavender-200 bg-white px-4 py-2.5 lg:max-w-sm">
              <Search className="h-4 w-4 shrink-0 text-ink-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by merchant, category, or budget…"
                className="w-full bg-transparent text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="hidden h-4 w-4 text-ink-400 sm:block" />
              {(["all", "income", "expense"] as FilterType[]).map((t) => {
                const active = filter === t;
                return (
                  <button
                    key={t}
                    onClick={() => setFilter(t)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                      active
                        ? "bg-primary-500 text-white shadow-soft"
                        : "border border-lavender-200 bg-white text-ink-500 hover:bg-lavender-50"
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Body */}
          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState message={error} />
          ) : filtered.length === 0 ? (
            <EmptyState hasRows={rows.length > 0} />
          ) : (
            <div className="-mx-2 overflow-x-auto sm:mx-0">
              <div className="min-w-[640px] px-2 sm:min-w-0 sm:px-0">
                <ExpenseTable rows={filtered} />
              </div>
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <p className="mt-4 text-xs text-ink-400">
              Showing {filtered.length} of {rows.length} transactions
            </p>
          )}
        </section>
      </main>
    </div>
  );
}

/* ---------- Sub-components ---------- */

function SummaryCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone: "primary" | "green" | "red";
}) {
  const tones = {
    primary: "bg-primary-50 text-primary-500",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-500",
  };

  return (
    <div className="min-w-0 rounded-3xl bg-white p-5 shadow-card">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-2xl ${tones[tone]}`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-4 truncate text-[11px] font-medium uppercase tracking-wide text-ink-400">
        {label}
      </p>
      <p className="mt-1 truncate text-xl font-bold text-ink-900">{value}</p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
      <Loader2 className="h-6 w-6 animate-spin text-primary-500" />
      <p className="text-xs text-ink-500">Loading transactions…</p>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-100 bg-red-50/50 py-14 text-center">
      <p className="text-sm font-semibold text-red-700">
        Couldn&apos;t load transactions
      </p>
      <p className="max-w-xs text-xs text-red-600">{message}</p>
    </div>
  );
}

function EmptyState({ hasRows }: { hasRows: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-lavender-200 bg-lavender-50/40 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-ink-400 shadow-card">
        <FileText className="h-5 w-5" />
      </span>
      <p className="text-sm font-semibold text-ink-900">
        {hasRows ? "No matching transactions" : "No transactions yet"}
      </p>
      <p className="max-w-xs text-xs text-ink-500">
        {hasRows
          ? "Try adjusting your search or filter."
          : "Add your first transaction to see it here."}
      </p>
    </div>
  );
}
