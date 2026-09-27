"use client";

import { useState } from "react";
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
import { getUser } from "../../src/lib/auth/getUser";

export default function ProfilePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, loading } = getUser();

  // Derive display fields from the real session
  const fullName = user
    ? `${user.firstName} ${user.lastName}`.trim() || "Unnamed user"
    : "";
  const initials = user
    ? (
        (user.firstName?.[0] ?? "") + (user.lastName?.[0] ?? "")
      ).toUpperCase() || "?"
    : "";

  // These are still mock until we wire transactions
  const totalIncome = 2450.0;
  const totalExpenses = 1120.5;
  const balance = totalIncome - totalExpenses;
  const transactionsCount = 42;

  // Show skeleton while loading, or if not authenticated
  if (loading || !user) {
    return (
      <div className="flex min-h-screen bg-[#F8F7FC]">
        <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <TopBar onMenu={() => setMenuOpen(true)} />
          <div className="mx-auto w-full max-w-3xl animate-pulse space-y-6">
            <div className="h-28 rounded-3xl bg-white" />
            <div className="h-40 rounded-3xl bg-white" />
            <div className="h-32 rounded-3xl bg-white" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8F7FC]">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
        <TopBar onMenu={() => setMenuOpen(true)} />

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
                  {user.email}
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
              <InfoRow icon={Mail} label="Email address" value={user.email} />
              <InfoRow
                icon={Briefcase}
                label="Account ID"
                value={`#${user.userId.slice(-6).toUpperCase()}`}
              />
              <InfoRow icon={Calendar} label="Role" value="Member" />
            </dl>
          </section>

          {/* Summary stats */}
          <section className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
            <h3 className="mb-5 text-sm font-semibold text-ink-900">
              Activity summary
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MiniStat
                icon={Wallet}
                label="Balance"
                value={`${balance.toFixed(2)}€`}
                tone="primary"
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