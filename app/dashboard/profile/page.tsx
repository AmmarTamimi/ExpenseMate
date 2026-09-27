"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  User,
  Briefcase,
  Calendar,
  Wallet,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
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
  catId: PopulatedCategory | string;
  amount: number;
  date: string;
  note?: string;
};

/* ---------- Page ---------- */

export default function ProfilePage() {
  const router = useRouter();

  /* --- Auth state --- */
  const [authState, setAuthState] = useState<
    "checking" | "authenticated" | "unauthenticated"
  >("checking");

  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

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
        const fn = data.user.firstName ?? "";
        const ln = data.user.lastName ?? "";
        const fullName = `${fn} ${ln}`.trim() || data.user.email;

        setUserId(data.user.userId);
        setFirstName(fn);
        setLastName(ln);
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
  const [loadingTx, setLoadingTx] = useState(true);

  /* ---------- Fetchers ---------- */

  const fetchTransactions = useCallback(async () => {
    if (!userId) return;
    try {
      setLoadingTx(true);
      const res = await fetch("/api/transactions", {
        credentials: "include",
        headers: { "x-user-id": userId },
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setTransactions(data);
      }
    } catch (err) {
      console.error("Transactions:", err);
    } finally {
      setLoadingTx(false);
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

  useEffect(() => {
    if (authState !== "authenticated" || !userId) return;
    fetchTransactions();
    fetchNotifications();
  }, [authState, userId, fetchTransactions, fetchNotifications]);

  /* ---------- Derived summary (real numbers) ---------- */
  let totalIncome = 0;
  let totalExpenses = 0;
  for (const t of transactions) {
    if (t.type === "income") totalIncome += t.amount;
    else totalExpenses += t.amount;
  }
  const balance = totalIncome - totalExpenses;
  const transactionsCount = transactions.length;

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

  /* ---------- Display values ---------- */
  const fullName = `${firstName} ${lastName}`.trim() || userName || "Unnamed user";
  const initials =
    ((firstName?.[0] ?? "") + (lastName?.[0] ?? "")).toUpperCase() || "?";

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

        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-ink-900 sm:text-[28px]">
            Profile
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            Your basic account information.
          </p>
        </div>

        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
          {/* Identity card */}
          <section className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
            <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-primary-500 text-2xl font-bold text-white shadow-soft">
                {initials}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-xl font-bold text-ink-900">
                    {fullName}
                  </h2>
                  <span className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-600">
                    <ShieldCheck className="h-3 w-3" />
                    Verified
                  </span>
                </div>
                <p className="mt-1 truncate text-sm text-ink-500">
                  {userEmail}
                </p>
              </div>
            </div>
          </section>

          {/* Info grid */}
          <section className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
            <h3 className="mb-5 text-sm font-semibold text-ink-900">
              Account details
            </h3>
            <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <InfoRow icon={User} label="Full name" value={fullName} />
              <InfoRow icon={Mail} label="Email address" value={userEmail} />
              <InfoRow
                icon={Briefcase}
                label="Account ID"
                value={`#${userId.slice(-6).toUpperCase()}`}
              />
              <InfoRow icon={Calendar} label="Role" value="Member" />
            </dl>
          </section>

          {/* Activity summary — real data */}
          <section className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-ink-900">
                Activity summary
              </h3>
              {loadingTx && (
                <span className="text-[11px] text-ink-400">Loading…</span>
              )}
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MiniStat
                icon={Wallet}
                label="Balance"
                value={`${balance.toFixed(2)}€`}
                tone={balance >= 0 ? "primary" : "red"}
              />
              <MiniStat
                icon={TrendingUp}
                label="Income"
                value={`${totalIncome.toFixed(2)}€`}
                tone="green"
              />
              <MiniStat
                icon={TrendingDown}
                label="Expenses"
                value={`${totalExpenses.toFixed(2)}€`}
                tone="red"
              />
              <MiniStat
                icon={Calendar}
                label="Transactions"
                value={`${transactionsCount}`}
                tone="primary"
              />
            </div>
          </section>
        </div>
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

/* ---------- Sub-components ---------- */

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-lavender-50 text-primary-500">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <dt className="text-[11px] font-medium uppercase tracking-wide text-ink-400">
          {label}
        </dt>
        <dd className="mt-0.5 truncate text-sm font-semibold text-ink-900">
          {value}
        </dd>
      </div>
    </div>
  );
}

function MiniStat({
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
    <div className="min-w-0 rounded-2xl border border-lavender-100 bg-white p-4">
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-xl ${tones[tone]}`}
      >
        <Icon className="h-4 w-4" />
      </div>
      <p className="mt-3 truncate text-[10px] font-medium uppercase tracking-wide text-ink-400">
        {label}
      </p>
      <p className="mt-0.5 truncate text-base font-bold text-ink-900">
        {value}
      </p>
    </div>
  );
}