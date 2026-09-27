"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Plus,
  FolderPlus,
  PlusCircle,
  Filter,
  Download,
  Printer,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  CheckCircle2,
  Pencil,
} from "lucide-react";

import TopBar from "../components/TopBar";
import Sidebar from "../components/Sidebar";
import CategoryModal from "../components/CategoryModal";
import TransactionModal from "../components/TransactionModal";
import BudgetModal from "../components/BudgetModal";
import NotificationsPanel, {
  NotificationItem,
} from "../components/NotificationsPanel";

/* ---------- Types ---------- */

type CategoryFromAPI = {
  _id: string;
  catId: string;
  name: string;
  type: "income" | "expense";
};

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

type BudgetFromAPI = {
  _id: string;
  catId: PopulatedCategory;
  monthlyLimit: number;
  month: string;
  status: "ok" | "warning" | "exceeded";
};

type CategoryBudget = {
  id: string;
  catId: string;
  budgetId?: string;
  name: string;
  type: "income" | "expense";
  limit: number;
  spent: number;
  month: string;
};

/* ---------- Page ---------- */

export default function DashboardPage() {
  const router = useRouter();

  /* --- Auth state --- */
  const [authState, setAuthState] = useState<
    "checking" | "authenticated" | "unauthenticated"
  >("checking");

  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("");

  /* Fetch current user from the cookie-based session */
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
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  const [budgetModalOpen, setBudgetModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<BudgetFromAPI | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  /* --- Data state --- */
  const [categories, setCategories] = useState<CategoryFromAPI[]>([]);
  const [transactions, setTransactions] = useState<TransactionFromAPI[]>([]);
  const [budgetsAPI, setBudgetsAPI] = useState<BudgetFromAPI[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------- Fetchers ---------- */

  const fetchCategories = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await fetch("/api/categories", {
        credentials: "include",
        headers: { "x-user-id": userId },
      });
      const data = await res.json();
      if (res.ok) setCategories(data);
      else console.error("Categories:", data.error);
    } catch (err) {
      console.error("Categories:", err);
    }
  }, [userId]);

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

  const fetchBudgets = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await fetch("/api/budgets", {
        credentials: "include",
        headers: { "x-user-id": userId },
      });
      const data = await res.json();
      if (res.ok) setBudgetsAPI(data);
      else console.error("Budgets:", data.error);
    } catch (err) {
      console.error("Budgets:", err);
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
      await Promise.all([
        fetchCategories(),
        fetchTransactions(),
        fetchBudgets(),
        fetchNotifications(),
      ]);
      setLoading(false);
    })();
  }, [
    authState,
    userId,
    fetchCategories,
    fetchTransactions,
    fetchBudgets,
    fetchNotifications,
  ]);

  /* ---------- Derived totals ---------- */
  const { totalIncome, totalExpenses, balance } = useMemo(() => {
    let income = 0;
    let expense = 0;
    for (const t of transactions) {
      if (t.type === "income") income += t.amount;
      else expense += t.amount;
    }
    return {
      totalIncome: income,
      totalExpenses: expense,
      balance: income - expense,
    };
  }, [transactions]);

  /* ---------- Spent per category ---------- */
  const spentByCatId = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of transactions) {
      if (t.type === "expense") {
        const key = t.catId?._id ?? "";
        map.set(key, (map.get(key) ?? 0) + t.amount);
      }
    }
    return map;
  }, [transactions]);

  /* ---------- Budget cards ---------- */
  const budgets: CategoryBudget[] = useMemo(() => {
    return categories.map((c) => {
      const matchingBudget = budgetsAPI.find((b) => b.catId?._id === c._id);
      return {
        id: c._id,
        catId: c._id,
        budgetId: matchingBudget?._id,
        name: c.name,
        type: c.type,
        limit: matchingBudget?.monthlyLimit ?? 0,
        spent: spentByCatId.get(c._id) ?? 0,
        month: matchingBudget?.month ?? "",
      };
    });
  }, [categories, budgetsAPI, spentByCatId]);

  /* ---------- Recent rows ---------- */
  const recentRows = useMemo(
    () =>
      transactions.slice(0, 10).map((t) => ({
        company: t.catId?.name ?? "Uncategorized",
        budget: t.note || "—",
        date: new Date(t.date).toLocaleDateString(),
        amount: `${t.type === "expense" ? "-" : "+"}${t.amount.toFixed(2)}€`,
        status: t.type === "income" ? "Approved" : "Pending",
        icon: t.type === "income" ? "💰" : "💸",
      })),
    [transactions]
  );

  /* ---------- Notifications badge ---------- */
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

  /* ---------- Refresh all ---------- */
  const refreshAll = useCallback(async () => {
    await Promise.all([
      fetchCategories(),
      fetchTransactions(),
      fetchBudgets(),
      fetchNotifications(),
    ]);
  }, [fetchCategories, fetchTransactions, fetchBudgets, fetchNotifications]);

  /* ---------- Top-right action handlers ---------- */
  const handleExport = () => {
    if (transactions.length === 0) {
      alert("No transactions to export.");
      return;
    }
    const headers = ["Date", "Type", "Category", "Amount", "Note"];
    const rows = transactions.map((t) => [
      new Date(t.date).toISOString().slice(0, 10),
      t.type,
      t.catId?.name ?? "",
      t.amount.toString(),
      (t.note ?? "").replace(/"/g, '""'),
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((r) => r.map((v) => `"${v}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `transactions-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => window.print();

  const handleFilter = () => {
    const choice = window.prompt(
      "Filter by type? Type: 'income', 'expense', or leave blank for all"
    );
    if (choice === null) return;
    if (choice === "" || choice === "all") {
      fetchTransactions();
      return;
    }
    if (choice !== "income" && choice !== "expense") {
      alert("Please type 'income' or 'expense'");
      return;
    }
    (async () => {
      const res = await fetch(`/api/transactions?type=${choice}`, {
        credentials: "include",
        headers: { "x-user-id": userId },
      });
      const data = await res.json();
      if (res.ok) setTransactions(data);
    })();
  };

  /* ---------- Loading splash ---------- */
  if (authState === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F7FC]">
        <div className="text-sm text-ink-400">Loading...</div>
      </div>
    );
  }

  /* ---------- Unauthenticated (redirect in-flight) ---------- */
  if (authState === "unauthenticated") return null;

  /* ---------- Authenticated ---------- */
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

        {/* Page Header */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-ink-900 sm:text-[28px]">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-ink-500">
              Welcome back, {userName}. Here&apos;s your budget overview.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <button
              onClick={() => setCategoryModalOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-lavender-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-700 transition-colors hover:bg-lavender-50 sm:w-auto"
            >
              <FolderPlus className="h-4 w-4" />
              Add Category
            </button>
            <button
              onClick={() => setTransactionModalOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-primary-600 sm:w-auto"
            >
              <PlusCircle className="h-4 w-4" />
              Add Transaction
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            label="Total Balance"
            value={`${balance.toFixed(2)}€`}
            hint="Income − Expenses"
            icon={Wallet}
            tone="primary"
          />
          <StatCard
            label="Income (all time)"
            value={`${totalIncome.toFixed(2)}€`}
            hint="Live from transactions"
            icon={TrendingUp}
            tone="green"
          />
          <StatCard
            label="Expenses (all time)"
            value={`${totalExpenses.toFixed(2)}€`}
            hint="Live from transactions"
            icon={TrendingDown}
            tone="red"
          />
        </div>

        {/* Budgets by Category */}
        <section className="mb-6 rounded-3xl bg-white p-5 shadow-card sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-ink-900">
                Monthly Budgets
              </h2>
              <p className="mt-0.5 text-xs text-ink-400">
                Spending per category this month
              </p>
            </div>
            <button
              onClick={() => {
                setEditingBudget(null);
                setBudgetModalOpen(true);
              }}
              className="flex items-center gap-1 rounded-xl border border-lavender-200 bg-white px-3 py-1.5 text-xs font-medium text-primary-500 transition-colors hover:bg-lavender-50"
            >
              <Plus className="h-3.5 w-3.5" />
              Set budget
            </button>
          </div>

          {loading ? (
            <p className="py-8 text-center text-sm text-ink-400">Loading...</p>
          ) : budgets.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-lavender-200 py-10 text-center">
              <p className="mb-1 text-sm font-medium text-ink-700">
                No categories yet
              </p>
              <p className="mb-4 text-xs text-ink-400">
                Add your first category to start tracking budgets.
              </p>
              <button
                onClick={() => setCategoryModalOpen(true)}
                className="rounded-xl bg-primary-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-600"
              >
                Add Category
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {budgets.map((b) => (
                <CategoryBudgetCard
                  key={b.id}
                  budget={b}
                  onEdit={() => {
                    if (!b.budgetId) {
                      setEditingBudget(null);
                      setBudgetModalOpen(true);
                      return;
                    }
                    const match = budgetsAPI.find((x) => x._id === b.budgetId);
                    if (match) {
                      setEditingBudget(match);
                      setBudgetModalOpen(true);
                    }
                  }}
                  onDelete={async () => {
                    if (!b.budgetId) return;
                    if (!confirm(`Delete budget for "${b.name}"?`)) return;
                    const res = await fetch(`/api/budgets/${b.budgetId}`, {
                      method: "DELETE",
                      credentials: "include",
                      headers: { "x-user-id": userId },
                    });
                    if (res.ok || res.status === 204) {
                      await refreshAll();
                    } else {
                      const data = await res.json();
                      alert(data.error || "Failed to delete budget");
                    }
                  }}
                />
              ))}
            </div>
          )}
        </section>

        {/* Recent Transactions */}
        <section className="rounded-3xl bg-white p-5 shadow-card sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-ink-900">
              Recent Transactions
            </h2>
            <div className="flex items-center gap-2">
              <IconButton label="Filter" onClick={handleFilter}>
                <Filter className="h-4 w-4" />
              </IconButton>
              <IconButton label="Export CSV" onClick={handleExport}>
                <Download className="h-4 w-4" />
              </IconButton>
              <IconButton label="Print" onClick={handlePrint}>
                <Printer className="h-4 w-4" />
              </IconButton>
            </div>
          </div>

          {loading ? (
            <p className="py-8 text-center text-sm text-ink-400">
              Loading transactions...
            </p>
          ) : recentRows.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-lavender-200 py-10 text-center">
              <p className="mb-1 text-sm font-medium text-ink-700">
                No transactions yet
              </p>
              <p className="mb-4 text-xs text-ink-400">
                Add your first transaction to see it here.
              </p>
              <button
                onClick={() => setTransactionModalOpen(true)}
                className="rounded-xl bg-primary-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-600"
              >
                Add Transaction
              </button>
            </div>
          ) : (
            <div className="-mx-2 overflow-x-auto sm:mx-0">
              <div className="min-w-[560px] px-2 sm:min-w-0 sm:px-0">
                <ExpenseTable rows={recentRows} />
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Modals & Panels */}
      <CategoryModal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        onSuccess={refreshAll}
      />
      <TransactionModal
        isOpen={transactionModalOpen}
        onClose={() => setTransactionModalOpen(false)}
        onSuccess={refreshAll}
      />
      <BudgetModal
        isOpen={budgetModalOpen}
        onClose={() => {
          setBudgetModalOpen(false);
          setEditingBudget(null);
        }}
        onSuccess={refreshAll}
        userId={userId}
        initial={
          editingBudget
            ? {
                id: editingBudget._id,
                catId: editingBudget.catId._id,
                monthlyLimit: editingBudget.monthlyLimit,
                month: editingBudget.month,
              }
            : undefined
        }
      />
      <NotificationsPanel
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
      />
    </div>
  );
}

/* ---------- ExpenseTable ---------- */

type ExpenseRow = {
  company: string;
  budget: string;
  date: string;
  amount: string;
  status: string;
  icon?: string;
};

function ExpenseTable({ rows }: { rows: ExpenseRow[] }) {
  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="border-b border-lavender-100 text-[11px] uppercase tracking-wide text-ink-400">
          <th className="py-3 pr-4 font-medium">Category</th>
          <th className="py-3 pr-4 font-medium">Note</th>
          <th className="py-3 pr-4 font-medium">Date</th>
          <th className="py-3 pr-4 font-medium">Amount</th>
          <th className="py-3 pr-2 font-medium">Status</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr
            key={i}
            className="border-b border-lavender-50 text-ink-700 last:border-none"
          >
            <td className="py-3 pr-4">
              <span className="mr-2">{r.icon}</span>
              {r.company}
            </td>
            <td className="py-3 pr-4 text-ink-500">{r.budget}</td>
            <td className="py-3 pr-4 text-ink-500">{r.date}</td>
            <td className="py-3 pr-4 font-semibold">{r.amount}</td>
            <td className="py-3 pr-2">
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  r.status === "Approved"
                    ? "bg-green-50 text-green-600"
                    : "bg-amber-50 text-amber-600"
                }`}
              >
                {r.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ---------- Category Budget Card ---------- */

function CategoryBudgetCard({
  budget,
  onEdit,
  onDelete,
}: {
  budget: CategoryBudget;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const hasLimit = budget.limit > 0;
  const raw = hasLimit ? (budget.spent / budget.limit) * 100 : 0;
  const pct = Math.min(raw, 100);

  const status: "ok" | "warning" | "over" | "unset" = !hasLimit
    ? "unset"
    : raw >= 100
    ? "over"
    : raw >= 80
    ? "warning"
    : "ok";

  const barColor =
    status === "over"
      ? "bg-red-500"
      : status === "warning"
      ? "bg-amber-500"
      : status === "unset"
      ? "bg-lavender-200"
      : "bg-primary-500";

  const pill =
    status === "over"
      ? "bg-red-50 text-red-600"
      : status === "warning"
      ? "bg-amber-50 text-amber-600"
      : status === "unset"
      ? "bg-lavender-50 text-ink-500"
      : "bg-green-50 text-green-600";

  const StatusIcon =
    status === "over"
      ? AlertTriangle
      : status === "warning"
      ? AlertTriangle
      : CheckCircle2;

  const StatusLabel =
    status === "over"
      ? "Over budget"
      : status === "warning"
      ? "Almost"
      : status === "unset"
      ? "No budget"
      : "On track";

  return (
    <div className="flex w-full min-w-0 flex-col gap-3 rounded-2xl border border-lavender-100 bg-white p-4">
      <div className="flex min-w-0 items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink-900">
            {budget.name}
          </p>
          <p className="mt-0.5 text-[11px] capitalize text-ink-400">
            {budget.type}
            {budget.month ? ` · ${budget.month}` : ""}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <span
            className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${pill}`}
          >
            <StatusIcon className="h-3 w-3" />
            {StatusLabel}
          </span>
          <button
            onClick={onEdit}
            className="rounded-full p-1 text-ink-400 hover:bg-lavender-50 hover:text-primary-500"
            aria-label="Edit budget"
            title={hasLimit ? "Edit budget" : "Set budget"}
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          {budget.budgetId && (
            <button
              onClick={onDelete}
              className="rounded-full p-1 text-ink-400 hover:bg-red-50 hover:text-red-500"
              aria-label="Delete budget"
              title="Delete budget"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="flex min-w-0 items-baseline justify-between gap-2">
        <span className="truncate text-lg font-bold text-ink-900">
          {budget.spent.toFixed(2)}€
        </span>
        <span className="shrink-0 text-xs text-ink-400">
          {hasLimit ? `of ${budget.limit.toFixed(2)}€` : "no limit set"}
        </span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-lavender-100">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${hasLimit ? pct : 0}%` }}
        />
      </div>

      <p className="text-[11px] text-ink-500">
        {!hasLimit
          ? "Set a monthly budget to track spending"
          : budget.limit - budget.spent >= 0
          ? `${(budget.limit - budget.spent).toFixed(2)}€ remaining`
          : `${(budget.spent - budget.limit).toFixed(2)}€ over`}
      </p>
    </div>
  );
}

/* ---------- Stat Card ---------- */

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: "primary" | "green" | "red";
}) {
  const tones = {
    primary: "bg-primary-50 text-primary-500",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-500",
  };
  const hintTones = {
    primary: "text-ink-400",
    green: "text-green-600",
    red: "text-red-500",
  };

  return (
    <div className="min-w-0 rounded-3xl bg-white p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${tones[tone]}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-4 truncate text-[11px] font-medium uppercase tracking-wide text-ink-400">
        {label}
      </p>
      <p className="mt-1 truncate text-xl font-bold text-ink-900">{value}</p>
      <p className={`mt-1 flex items-center gap-1 text-[11px] ${hintTones[tone]}`}>
        {tone === "green" && <ArrowUpRight className="h-3 w-3" />}
        {tone === "red" && <ArrowDownRight className="h-3 w-3" />}
        {hint}
      </p>
    </div>
  );
}

/* ---------- Small helper ---------- */

function IconButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      aria-label={label}
      title={label}
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-xl border border-lavender-200 bg-white text-ink-500 transition-colors hover:bg-lavender-50"
    >
      {children}
    </button>
  );
}