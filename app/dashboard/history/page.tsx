"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Filter,
  Download,
  Printer,
  TrendingUp,
  TrendingDown,
  Calendar,
  FileText,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import ExpenseTable, { Expense } from "@/components/ExpenseTable";

/* ---------- Sample data (replace with real data later) ---------- */

type HistoryItem = Expense & {
  type: "income" | "expense";
  category: string;
};

const history: HistoryItem[] = [
  { company: "Salary", category: "Salary", budget: "—", date: "01/03/24", amount: "2450,00€", status: "Approved", icon: "💼", type: "income" },
  { company: "Ryanair", category: "Transport", budget: "Berlin Congress", date: "01/02/24", amount: "126,30€", status: "Approved", icon: "✈️", type: "expense" },
  { company: "NH Hotels", category: "Travel", budget: "Berlin Congress", date: "01/02/24", amount: "210,00€", status: "Approved", icon: "🛏️", type: "expense" },
  { company: "Equinox Rest.", category: "Dining", budget: "Berlin Congress", date: "03/02/24", amount: "32,54€", status: "Approved", icon: "🍽️", type: "expense" },
  { company: "Grandma's Kitchen", category: "Dining", budget: "Berlin Congress", date: "03/02/24", amount: "14,20€", status: "Approved", icon: "🍽️", type: "expense" },
  { company: "Presents Store", category: "Shopping", budget: "Berlin Congress", date: "03/02/24", amount: "22,40€", status: "Approved", icon: "🎁", type: "expense" },
  { company: "Car Stars", category: "Transport", budget: "Berlin Congress", date: "03/02/24", amount: "5,10€", status: "Pending", icon: "🅿️", type: "expense" },
  { company: "Paper Supplies", category: "Office", budget: "February Expenses", date: "04/02/24", amount: "6,12€", status: "Pending", icon: "📎", type: "expense" },
  { company: "Galleta Rest.", category: "Dining", budget: "February Expenses", date: "04/02/24", amount: "42,60€", status: "Pending", icon: "🍽️", type: "expense" },
  { company: "Pakstore", category: "Groceries", budget: "February Expenses", date: "04/02/24", amount: "15,00€", status: "Pending", icon: "🛒", type: "expense" },
  { company: "Freelance Project", category: "Freelance", budget: "—", date: "15/02/24", amount: "450,00€", status: "Approved", icon: "💻", type: "income" },
];

type FilterType = "all" | "income" | "expense";

/* ---------- Page ---------- */

export default function HistoryPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  const filtered = useMemo(() => {
    return history.filter((h) => {
      const matchesQuery =
        query.trim() === "" ||
        h.company.toLowerCase().includes(query.toLowerCase()) ||
        h.category.toLowerCase().includes(query.toLowerCase()) ||
        h.budget.toLowerCase().includes(query.toLowerCase());

      const matchesType = filter === "all" || h.type === filter;

      return matchesQuery && matchesType;
    });
  }, [query, filter]);

  const totals = useMemo(() => {
    const parse = (s: string) =>
      parseFloat(s.replace("€", "").replace(/\./g, "").replace(",", ".")) || 0;

    let income = 0;
    let expense = 0;
    for (const item of filtered) {
      const amount = parse(item.amount);
      if (item.type === "income") income += amount;
      else expense += amount;
    }
    return { income, expense, net: income - expense };
  }, [filtered]);

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
            <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-lavender-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-700 transition-colors hover:bg-lavender-50 sm:w-auto">
              <Download className="h-4 w-4" />
              Export CSV
            </button>
            <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-lavender-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-700 transition-colors hover:bg-lavender-50 sm:w-auto">
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
            value={`${totals.income.toFixed(2)}€`}
            tone="green"
          />
          <SummaryCard
            icon={TrendingDown}
            label="Expenses"
            value={`${totals.expense.toFixed(2)}€`}
            tone="red"
          />
          <SummaryCard
            icon={Calendar}
            label="Net"
            value={`${totals.net.toFixed(2)}€`}
            tone={totals.net >= 0 ? "primary" : "red"}
          />
        </div>

        {/* Filters + Table */}
        <section className="rounded-3xl bg-white p-5 shadow-card sm:p-6">
          {/* Filter bar */}
          <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Search */}
            <div className="flex w-full items-center gap-3 rounded-2xl border border-lavender-200 bg-white px-4 py-2.5 lg:max-w-sm">
              <Search className="h-4 w-4 shrink-0 text-ink-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by merchant, category, or budget…"
                className="w-full bg-transparent text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none"
              />
            </div>

            {/* Type filter chips */}
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

          {/* Table or empty state */}
          {filtered.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="-mx-2 overflow-x-auto sm:mx-0">
              <div className="min-w-[640px] px-2 sm:min-w-0 sm:px-0">
                <ExpenseTable rows={filtered} />
              </div>
            </div>
          )}

          {/* Footer count */}
          {filtered.length > 0 && (
            <p className="mt-4 text-xs text-ink-400">
              Showing {filtered.length} of {history.length} transactions
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

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-lavender-200 bg-lavender-50/40 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-ink-400 shadow-card">
        <FileText className="h-5 w-5" />
      </span>
      <p className="text-sm font-semibold text-ink-900">
        No transactions found
      </p>
      <p className="max-w-xs text-xs text-ink-500">
        Try adjusting your search or filter to find what you&apos;re looking for.
      </p>
    </div>
  );
}