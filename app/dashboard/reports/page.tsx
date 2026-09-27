"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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
import NotificationsPanel, {
  NotificationItem,
} from "../../components/NotificationsPanel";

/* ---------- Types ---------- */

type PopulatedCategory = {
  _id: string;
  name: string;
  type: "income" | "expense";
};

type TransactionFromAPI = {
  _id: string;
  trId: string;
  type: "income" | "expense";
  catId: PopulatedCategory;
  amount: number;
  date: string;
  note?: string;
};

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

function monthKey(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : date;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function formatMonthLabel(ym: string) {
  const [y, m] = ym.split("-");
  const d = new Date(Number(y), Number(m) - 1, 1);
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function toCSV(rows: TransactionFromAPI[]) {
  const header = "Date,Category,Type,Amount,Note";
  const body = rows
    .map((r) => {
      const date = new Date(r.date).toISOString().slice(0, 10);
      const cat = (r.catId?.name ?? "Uncategorized").replace(/"/g, '""');
      const note = (r.note ?? "").replace(/"/g, '""');
      return `"${date}","${cat}","${r.type}","${r.amount.toFixed(2)}","${note}"`;
    })
    .join("\n");
  return `${header}\n${body}`;
}

/* ---------- Page ---------- */

export default function ReportsPage() {
  const router = useRouter();

  /* --- Auth (same three-phase guard as the dashboard) --- */
  const [authState, setAuthState] = useState<
    "checking" | "authenticated" | "unauthenticated"
  >("checking");

  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (cancelled) return;

        if (!res.ok) {
          setAuthState("unauthenticated");
          return;
        }

        const data = await res.json();
        const fullName =
          data.user.firstName && data.user.firstName.trim().length > 0
            ? `${data.user.firstName} ${data.user.lastName ?? ""}`.trim()
            : data.user.email;

        setUserId(data.user.userId);
        setUserName(fullName);
        setUserEmail(data.user.email);
        setAuthState("authenticated");
      } catch {
        if (!cancelled) setAuthState("unauthenticated");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (authState === "unauthenticated") router.replace("/login");
  }, [authState, router]);

  /* --- UI state --- */
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  /* --- Data state --- */
  const [transactions, setTransactions] = useState<TransactionFromAPI[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  const [toast, setToast] = useState<{
    kind: "ok" | "err";
    msg: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ---------- Fetchers ---------- */

  const fetchTransactions = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await fetch("/api/transactions", {
        credentials: "include",
        headers: { "x-user-id": userId },
      });
      const data = await res.json();
      if (res.ok) setTransactions(data);
      else console.error("Transactions:", data.error);
    } catch (err) {
      console.error("Transactions:", err);
    }
  }, [userId]);

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await fetch("/api/notifications", {
        credentials: "include",
        headers: { "x-user-id": userId },
      });
      const data = await res.json();
      if (res.ok) setNotifications(data.notifications ?? []);
    } catch (err) {
      console.error("Notifications:", err);
    }
  }, [userId]);

  /* ---------- Initial load ---------- */
  useEffect(() => {
    if (authState !== "authenticated" || !userId) return;
    (async () => {
      setLoading(true);
      await Promise.all([fetchTransactions(), fetchNotifications()]);
      setLoading(false);
    })();
  }, [authState, userId, fetchTransactions, fetchNotifications]);

  /* ---------- Derived: all months present in data ---------- */
  const availableMonths = useMemo(() => {
    const set = new Set(transactions.map((t) => monthKey(t.date)));
    return Array.from(set).sort().reverse();
  }, [transactions]);

  /* Auto-select the newest month whenever data loads */
  useEffect(() => {
    if (!selectedMonth && availableMonths.length > 0) {
      setSelectedMonth(availableMonths[0]);
    }
  }, [availableMonths, selectedMonth]);

  /* ---------- Month-filtered data ---------- */
  const monthData = useMemo(
    () =>
      selectedMonth
        ? transactions.filter((t) => monthKey(t.date) === selectedMonth)
        : [],
    [transactions, selectedMonth]
  );

  /* ---------- Totals ---------- */
  const totals = useMemo(() => {
    let income = 0;
    let expense = 0;
    for (const t of monthData) {
      if (t.type === "income") income += t.amount;
      else expense += t.amount;
    }
    return { income, expense, net: income - expense };
  }, [monthData]);

  /* ---------- Category breakdown ---------- */
  const categoryBreakdown = useMemo(() => {
    const map = new Map<string, { expense: number; income: number }>();
    for (const t of monthData) {
      const cat = t.catId?.name ?? "Uncategorized";
      const cur = map.get(cat) ?? { expense: 0, income: 0 };
      if (t.type === "expense") cur.expense += t.amount;
      else cur.income += t.amount;
      map.set(cat, cur);
    }
    return Array.from(map.entries()).map(([category, v]) => ({
      category,
      expense: Number(v.expense.toFixed(2)),
      income: Number(v.income.toFixed(2)),
    }));
  }, [monthData]);

  /* ---------- Pie data ---------- */
  const expenseByCategory = useMemo(
    () =>
      categoryBreakdown
        .filter((c) => c.expense > 0)
        .map((c) => ({ name: c.category, value: c.expense })),
    [categoryBreakdown]
  );

  /* ---------- Notification badge ---------- */
  const unreadCount = notifications.filter((n) => n.level !== "info").length;

  /* ---------- Sign out ---------- */
  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      router.replace("/login");
      router.refresh();
    }
  };

  /* ---------- Toast helper ---------- */
  const flash = (kind: "ok" | "err", msg: string) => {
    setToast({ kind, msg });
    setTimeout(() => setToast(null), 3000);
  };

  /* ---------- Export ---------- */
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
    a.download = `expensemate-${selectedMonth}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    flash("ok", `Exported ${monthData.length} rows for ${formatMonthLabel(selectedMonth)}.`);
  };

  /* ---------- Import (kept for reference; server-side import comes later) ---------- */
  const handleImportClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    flash(
      "err",
      "CSV import will be wired to POST /api/transactions/import in a later phase."
    );
    e.target.value = "";
  };

  /* ---------- Loading splash ---------- */
  if (authState === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F7FC]">
        <div className="text-sm text-ink-400">Loading...</div>
      </div>
    );
  }
  if (authState === "unauthenticated") return null;

  /* ---------- Render ---------- */
  return (
    <div className="flex min-h-screen bg-[#F8F7FC]">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
        <TopBar
          onMenu={() => setMenuOpen(true)}
          userName={userName}
          userEmail={userEmail}
          notificationCount={unreadCount}
          onNotificationsClick={() => setNotificationsOpen(true)}
          onSignOut={handleSignOut}
        />

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
            {/* Month selector — populated from real data */}
            {availableMonths.length > 0 && (
              <div className="flex items-center gap-2 rounded-2xl border border-lavender-200 bg-white px-3 py-2">
                <Calendar className="h-4 w-4 text-ink-400" />
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="bg-transparent text-sm font-medium text-ink-900 focus:outline-none"
                >
                  {availableMonths.map((m) => (
                    <option key={m} value={m}>
                      {formatMonthLabel(m)}
                    </option>
                  ))}
                </select>
              </div>
            )}

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

        {/* Body */}
        {loading ? (
          <section className="rounded-3xl bg-white p-10 text-center shadow-card">
            <p className="text-sm text-ink-400">Loading reports...</p>
          </section>
        ) : transactions.length === 0 ? (
          <section className="rounded-3xl bg-white p-10 text-center shadow-card">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-lavender-50 text-ink-400">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h2 className="mt-3 text-sm font-semibold text-ink-900">
              No transactions yet
            </h2>
            <p className="mx-auto mt-1 max-w-xs text-xs text-ink-500">
              Add transactions from the dashboard to see reports here.
            </p>
          </section>
        ) : monthData.length === 0 ? (
          <section className="rounded-3xl bg-white p-10 text-center shadow-card">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-lavender-50 text-ink-400">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h2 className="mt-3 text-sm font-semibold text-ink-900">
              No data for {formatMonthLabel(selectedMonth)}
            </h2>
            <p className="mx-auto mt-1 max-w-xs text-xs text-ink-500">
              Pick another month from the dropdown above.
            </p>
          </section>
        ) : (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            {/* Bar chart */}
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
                    By category · {formatMonthLabel(selectedMonth)}
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

            {/* Pie chart */}
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
                      formatter={(value) => `${Number(value ?? 0).toFixed(2)}€`}
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
          CSV export format: <code>Date,Category,Type,Amount,Note</code> · Date as{" "}
          <code>YYYY-MM-DD</code>
        </p>
      </main>

      {/* Notifications panel */}
      <NotificationsPanel
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
      />
    </div>
  );
}

/* ---------- Summary Card ---------- */

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