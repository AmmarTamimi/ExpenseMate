"use client";

import { useMemo, useRef, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";
import {
  Download,
  Upload,
  TrendingUp,
  TrendingDown,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  BarChart3,
  PieChart as PieIcon,
} from "lucide-react";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";

/* ---------- Sample data (replace with real data later) ---------- */

type ReportItem = {
  id: string;
  date: string; // YYYY-MM-DD
  category: string;
  amount: number;
  type: "income" | "expense";
};

const SAMPLE: ReportItem[] = [
  {
    id: "1",
    date: "2024-02-01",
    category: "Transport",
    amount: 126.3,
    type: "expense",
  },
  {
    id: "2",
    date: "2024-02-01",
    category: "Travel",
    amount: 210.0,
    type: "expense",
  },
  {
    id: "3",
    date: "2024-02-03",
    category: "Dining",
    amount: 32.54,
    type: "expense",
  },
  {
    id: "4",
    date: "2024-02-03",
    category: "Dining",
    amount: 14.2,
    type: "expense",
  },
  {
    id: "5",
    date: "2024-02-03",
    category: "Shopping",
    amount: 22.4,
    type: "expense",
  },
  {
    id: "6",
    date: "2024-02-04",
    category: "Transport",
    amount: 5.1,
    type: "expense",
  },
  {
    id: "7",
    date: "2024-02-04",
    category: "Office",
    amount: 6.12,
    type: "expense",
  },
  {
    id: "8",
    date: "2024-02-04",
    category: "Dining",
    amount: 42.6,
    type: "expense",
  },
  {
    id: "9",
    date: "2024-02-04",
    category: "Groceries",
    amount: 15.0,
    type: "expense",
  },
  {
    id: "10",
    date: "2024-02-05",
    category: "Salary",
    amount: 2450.0,
    type: "income",
  },
  {
    id: "11",
    date: "2024-02-15",
    category: "Freelance",
    amount: 450.0,
    type: "income",
  },
  {
    id: "12",
    date: "2024-02-18",
    category: "Groceries",
    amount: 78.9,
    type: "expense",
  },
];

/* ---------- Chart colors ---------- */

const EXPENSE_COLORS = [
  "#3D4CEA",
  "#F0A825",
  "#8B5CF6",
  "#10B981",
  "#EF4444",
  "#6366F1",
];
const INCOME_COLOR = "#10B981";
const EXPENSE_COLOR = "#EF4444";

/* ---------- Helpers ---------- */

function monthKey(date: string) {
  return date.slice(0, 7); // "2024-02"
}

function formatMonthLabel(ym: string) {
  const [y, m] = ym.split("-");
  const d = new Date(Number(y), Number(m) - 1, 1);
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function toCSV(rows: ReportItem[]) {
  const header = "Date,Category,Type,Amount";
  const body = rows
    .map((r) => `${r.date},${r.category},${r.type},${r.amount.toFixed(2)}`)
    .join("\n");
  return `${header}\n${body}`;
}

function parseCSV(text: string): { rows: ReportItem[]; errors: string[] } {
  const lines = text.split(/\r?\n/).filter((l) => l.trim() !== "");
  const errors: string[] = [];
  const rows: ReportItem[] = [];

  if (lines.length === 0) {
    return { rows, errors: ["File is empty"] };
  }

  // Skip header if present
  const start = lines[0].toLowerCase().includes("date") ? 1 : 0;

  for (let i = start; i < lines.length; i++) {
    const line = lines[i];
    const parts = line.split(",").map((p) => p.trim());
    if (parts.length < 4) {
      errors.push(`Row ${i + 1}: expected 4 columns, got ${parts.length}`);
      continue;
    }
    const [date, category, type, amountStr] = parts;

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      errors.push(`Row ${i + 1}: invalid date "${date}" (use YYYY-MM-DD)`);
      continue;
    }
    if (type !== "income" && type !== "expense") {
      errors.push(`Row ${i + 1}: type must be "income" or "expense"`);
      continue;
    }
    const amount = Number(amountStr);
    if (!Number.isFinite(amount) || amount < 0) {
      errors.push(`Row ${i + 1}: invalid amount "${amountStr}"`);
      continue;
    }

    rows.push({
      id: `imported-${Date.now()}-${i}`,
      date,
      category,
      type: type as "income" | "expense",
      amount,
    });
  }

  return { rows, errors };
}

/* ---------- Page ---------- */

export default function ReportsPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [data, setData] = useState<ReportItem[]>(SAMPLE);
  const [month, setMonth] = useState<string>("2024-02");
  const [toast, setToast] = useState<{
    kind: "ok" | "err";
    msg: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const availableMonths = useMemo(() => {
    const set = new Set(data.map((d) => monthKey(d.date)));
    return Array.from(set).sort().reverse();
  }, [data]);

  const monthData = useMemo(
    () => data.filter((d) => monthKey(d.date) === month),
    [data, month],
  );

  const totals = useMemo(() => {
    let income = 0;
    let expense = 0;
    for (const item of monthData) {
      if (item.type === "income") income += item.amount;
      else expense += item.amount;
    }
    return { income, expense, net: income - expense };
  }, [monthData]);

  const categoryBreakdown = useMemo(() => {
    const map = new Map<string, { expense: number; income: number }>();
    for (const item of monthData) {
      const cur = map.get(item.category) ?? { expense: 0, income: 0 };
      if (item.type === "expense") cur.expense += item.amount;
      else cur.income += item.amount;
      map.set(item.category, cur);
    }
    return Array.from(map.entries()).map(([category, v]) => ({
      category,
      expense: Number(v.expense.toFixed(2)),
      income: Number(v.income.toFixed(2)),
    }));
  }, [monthData]);

  const expenseByCategory = useMemo(
    () =>
      categoryBreakdown
        .filter((c) => c.expense > 0)
        .map((c) => ({ name: c.category, value: c.expense })),
    [categoryBreakdown],
  );

  /* ---------- Handlers ---------- */

  const flash = (kind: "ok" | "err", msg: string) => {
    setToast({ kind, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const handleExport = () => {
    if (monthData.length === 0) {
      flash("err", "No transactions to export for this month.");
      return;
    }
    const csv = toCSV(monthData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `expensemate-${month}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    flash(
      "ok",
      `Exported ${monthData.length} rows for ${formatMonthLabel(month)}.`,
    );
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const { rows, errors } = parseCSV(text);

    if (rows.length === 0) {
      flash("err", errors[0] ?? "No valid rows found.");
      e.target.value = "";
      return;
    }

    // Merge into existing data (avoid duplicate IDs by regenerating)
    setData((prev) => [...prev, ...rows]);

    if (errors.length > 0) {
      flash("err", `Imported ${rows.length} rows · ${errors.length} skipped.`);
    } else {
      flash("ok", `Imported ${rows.length} transactions successfully.`);
    }

    // Jump to the month of the first imported row
    setMonth(monthKey(rows[0].date));

    e.target.value = "";
  };

  /* ---------- Render ---------- */

  return (
    <div className="flex min-h-screen bg-[#F8F7FC]">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
        <TopBar onMenu={() => setMenuOpen(true)} />

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-ink-900 sm:text-[28px]">
              Reports
            </h1>
            <p className="mt-1 text-sm text-ink-500">
              Monthly income vs. expenses, at a glance.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            {/* Month selector */}
            <div className="flex items-center gap-2 rounded-2xl border border-lavender-200 bg-white px-3 py-2">
              <Calendar className="h-4 w-4 text-ink-400" />
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="bg-transparent text-sm font-medium text-ink-900 focus:outline-none"
              >
                {(availableMonths.length ? availableMonths : [month]).map(
                  (m) => (
                    <option key={m} value={m}>
                      {formatMonthLabel(m)}
                    </option>
                  ),
                )}
              </select>
            </div>

            <button
              onClick={handleImportClick}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-lavender-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-700 transition-colors hover:bg-lavender-50 sm:w-auto"
            >
              <Upload className="h-4 w-4" />
              Import CSV
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              onClick={handleExport}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-primary-600 sm:w-auto"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div
            className={`mb-4 flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium ${
              toast.kind === "ok"
                ? "border-green-100 bg-green-50 text-green-700"
                : "border-amber-100 bg-amber-50 text-amber-700"
            }`}
          >
            {toast.kind === "ok" ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertTriangle className="h-4 w-4" />
            )}
            {toast.msg}
          </div>
        )}

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

        {/* Empty state */}
        {monthData.length === 0 ? (
          <section className="rounded-3xl bg-white p-10 text-center shadow-card">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-lavender-50 text-ink-400">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h2 className="mt-3 text-sm font-semibold text-ink-900">
              No data for {formatMonthLabel(month)}
            </h2>
            <p className="mx-auto mt-1 max-w-xs text-xs text-ink-500">
              Import a CSV to see charts and totals for this month.
            </p>
          </section>
        ) : (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            {/* Bar chart: income vs expense by category */}
            <section className="rounded-3xl bg-white p-5 shadow-card sm:p-6">
              <div className="mb-5 flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
                  <BarChart3 className="h-4 w-4" />
                </span>
                <div>
                  <h2 className="text-sm font-semibold text-ink-900">
                    Income vs Expenses
                  </h2>
                  <p className="text-[11px] text-ink-400">
                    By category · {formatMonthLabel(month)}
                  </p>
                </div>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={categoryBreakdown}
                    margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#EEF0F6"
                    />
                    <XAxis
                      dataKey="category"
                      tick={{ fontSize: 11, fill: "#6E6E85" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#6E6E85" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      formatter={(value) => `${Number(value ?? 0).toFixed(2)}€`}
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid #E6E4F1",
                        fontSize: 12,
                      }}
                    />
                    <Bar
                      dataKey="income"
                      fill={INCOME_COLOR}
                      radius={[6, 6, 0, 0]}
                    />
                    <Bar
                      dataKey="expense"
                      fill={EXPENSE_COLOR}
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* Pie chart: expenses by category */}
            <section className="rounded-3xl bg-white p-5 shadow-card sm:p-6">
              <div className="mb-5 flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-100 text-gold-600">
                  <PieIcon className="h-4 w-4" />
                </span>
                <div>
                  <h2 className="text-sm font-semibold text-ink-900">
                    Expenses by Category
                  </h2>
                  <p className="text-[11px] text-ink-400">
                    Where your money went this month
                  </p>
                </div>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseByCategory}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={95}
                      paddingAngle={3}
                    >
                      {expenseByCategory.map((_, i) => (
                        <Cell
                          key={i}
                          fill={EXPENSE_COLORS[i % EXPENSE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
  formatter={(value) =>
    `${Number(value ?? 0).toFixed(2)}€`
  }
  contentStyle={{
    borderRadius: 12,
    border: "1px solid #E6E4F1",
    fontSize: 12,
  }}
/>
                    <Legend
                      iconType="circle"
                      wrapperStyle={{ fontSize: 12, color: "#6E6E85" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>
        )}

        {/* Footer note */}
        <p className="mt-6 text-center text-[11px] text-ink-400">
          CSV format: <code>Date,Category,Type,Amount</code> · Date as{" "}
          <code>YYYY-MM-DD</code>
        </p>
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
