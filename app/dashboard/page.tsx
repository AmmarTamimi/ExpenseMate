"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import DonutRing from "@/components/DonutRing";
import BudgetCard, { Budget } from "@/components/BudgetCard";
import ExpenseTable, { Expense } from "@/components/ExpenseTable";

const budgets: Budget[] = [
  { title: "February Expenses", total: 300, spent: 87.5, date: "01/02/19" },
  { title: "Berlin Congress", total: 850, spent: 297.5, date: "01/02/19" },
  { title: "Inditex Meeting", total: 400, spent: 187.5, date: "01/02/19" },
];

const expenses: Expense[] = [
  { company: "Ryanair", budget: "Berlin Congress", date: "01/02/19", amount: "126,30€", status: "Approved", icon: "✈️" },
  { company: "NH Hotels", budget: "Berlin Congress", date: "01/02/19", amount: "210,00€", status: "Approved", icon: "🛏️" },
  { company: "Equinox Rest.", budget: "Berlin Congress", date: "03/02/19", amount: "32,54€", status: "Approved", icon: "🍽️" },
  { company: "Grandma's Kitchen", budget: "Berlin Congress", date: "03/02/19", amount: "14,20€", status: "Approved", icon: "🍽️" },
  { company: "Presents Store", budget: "Berlin Congress", date: "03/02/19", amount: "22,40€", status: "Approved", icon: "🎁" },
  { company: "Car Stars", budget: "Berlin Congress", date: "03/02/19", amount: "5,10€", status: "Pending", icon: "🅿️" },
  { company: "Paper Supplies", budget: "February Expenses", date: "04/02/19", amount: "6,12€", status: "Pending", icon: "📎" },
  { company: "Galleta Rest.", budget: "February Expenses", date: "04/02/19", amount: "42,60€", status: "Pending", icon: "🍽️" },
  { company: "Pakstore", budget: "February Expenses", date: "04/02/19", amount: "15,00€", status: "Pending", icon: "🍽️" },
];

export default function DashboardPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const requested = 467.86;
  const unrequested = 82.34;
  const totalBalance = requested + unrequested;

  return (
    <div className="flex min-h-screen bg-[#F1EFFB]">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className="flex-1 p-5 sm:p-8">
        <TopBar onMenu={() => setMenuOpen(true)} />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[340px_1fr]">
          {/* Left: balance overview */}
          <section className="flex flex-col gap-6">
            <div>
              <h1 className="text-2xl font-bold text-ink-900 sm:text-[28px]">
                Hello Marcos,
              </h1>
              <p className="mt-1 text-sm text-ink-500">
                Take a look at your current balance 👋
              </p>
            </div>

            <div className="flex flex-col items-center rounded-3xl bg-white p-8 shadow-card">
              <div className="mb-6 flex w-full items-center justify-between text-xs">
                <span className="text-ink-400">Requested</span>
                <span className="flex items-center gap-1.5 font-semibold text-primary-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                  {requested.toFixed(2)}€
                </span>
              </div>

              <DonutRing
                size={220}
                strokeWidth={26}
                segments={[
                  { value: requested, color: "#3D4CEA" },
                  { value: unrequested, color: "#F0A825" },
                ]}
                centerLabel="Total"
                centerValue={`${totalBalance.toFixed(2)}€`}
              />

              <div className="mt-6 flex w-full items-center justify-end text-xs">
                <span className="flex items-center gap-1.5 font-semibold text-gold-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
                  Unrequested {unrequested.toFixed(2)}€
                </span>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-card">
              <button className="mb-4 flex items-center gap-2 text-sm font-semibold text-ink-900">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold-100 text-gold-600">
                  +
                </span>
                Add a New Expense
              </button>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Email", icon: "✉️" },
                  { label: "Library", icon: "🖼️" },
                  { label: "Manually", icon: "✍️" },
                ].map((action) => (
                  <button
                    key={action.label}
                    className="flex flex-col items-center gap-2 rounded-2xl bg-lavender-50 py-4 text-xs font-medium text-ink-700 transition-colors hover:bg-lavender-100"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-base shadow-card">
                      {action.icon}
                    </span>
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Right: budgets + expenses */}
          <section className="flex flex-col gap-6">
            <div>
              <h2 className="mb-4 text-sm font-semibold text-ink-900">
                Your Current Budgets
              </h2>
              <div className="flex flex-col gap-4 sm:flex-row">
                {budgets.map((b) => (
                  <BudgetCard key={b.title} budget={b} />
                ))}
              </div>
            </div>

            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-ink-900">
                  Your Expenses
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    aria-label="Export"
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-ink-500 shadow-card"
                  >
                    ⭳
                  </button>
                  <button
                    aria-label="Print"
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-ink-500 shadow-card"
                  >
                    🖨️
                  </button>
                  <select className="rounded-xl bg-white px-3 py-2 text-xs font-medium text-ink-700 shadow-card focus:outline-none">
                    <option>Sort By</option>
                    <option>Date</option>
                    <option>Amount</option>
                    <option>Status</option>
                  </select>
                </div>
              </div>
              <ExpenseTable rows={expenses} />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
