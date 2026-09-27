import Link from "next/link";
import Logo from "@/components/Logo";
import DonutRing from "@/components/DonutRing";
import BudgetCard, { Budget } from "@/components/BudgetCard";

const previewBudgets: Budget[] = [
  { title: "February Expenses", total: 300, spent: 87.5, date: "01/02/19" },
  { title: "Berlin Congress", total: 850, spent: 297.5, date: "01/02/19" },
];

const FEATURES = [
  {
    title: "Snap a receipt",
    body: "Forward an email or drop a photo — ExpenseMate reads the amount, date and merchant for you.",
    icon: "📸",
  },
  {
    title: "Track every budget",
    body: "See what's requested, spent and remaining for each trip or project at a glance.",
    icon: "🧭",
  },
  {
    title: "Get approvals faster",
    body: "Managers approve or flag expenses from one queue, so nothing sits pending for long.",
    icon: "✅",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F1EFFB]">
      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm font-medium text-ink-500 md:flex">
          <a href="#features" className="hover:text-ink-900">Features</a>
          <a href="#pricing" className="hover:text-ink-900">Pricing</a>
          <a href="#faq" className="hover:text-ink-900">FAQ</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-sm font-semibold text-ink-700 sm:inline-block"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-2xl bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-primary-600"
          >
            Get started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-10 lg:grid-cols-2 lg:py-20">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-primary-500 shadow-card">
            New · Email receipts auto-import
          </span>
          <h1 className="mt-5 text-4xl font-bold leading-tight text-ink-900 sm:text-5xl">
            Track spend without the spreadsheet
          </h1>
          <p className="mt-5 max-w-md text-base text-ink-500">
            ExpenseMate gives your team one calm place to request, approve and
            follow every expense — from flight to coffee.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="rounded-2xl bg-primary-500 px-6 py-3.5 text-center text-sm font-semibold text-white shadow-soft transition-colors hover:bg-primary-600"
            >
              Start free trial
            </Link>
            <Link
              href="/login"
              className="rounded-2xl border border-lavender-200 bg-white px-6 py-3.5 text-center text-sm font-semibold text-ink-700 transition-colors hover:bg-lavender-50"
            >
              I already have an account
            </Link>
          </div>
          <p className="mt-4 text-xs text-ink-400">
            No card required · Free for teams under 5 people
          </p>
        </div>

        {/* Preview card */}
        <div className="relative">
          <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-gold-100" />
          <div className="relative rounded-3xl bg-white p-6 shadow-pop sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs text-ink-400">Total balance</p>
                <p className="text-2xl font-bold text-ink-900">550,20€</p>
              </div>
              <DonutRing
                size={72}
                strokeWidth={10}
                segments={[
                  { value: 467.86, color: "#3D4CEA" },
                  { value: 82.34, color: "#F0A825" },
                ]}
              />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              {previewBudgets.map((b) => (
                <BudgetCard key={b.title} budget={b} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-2 text-2xl font-bold text-ink-900">
          Everything an expense report needs
        </h2>
        <p className="mb-10 max-w-lg text-sm text-ink-500">
          Built for small teams who are tired of chasing receipts at the end
          of the month.
        </p>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-3xl bg-white p-6 shadow-card"
            >
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-lavender-50 text-xl">
                {f.icon}
              </span>
              <h3 className="mb-2 text-base font-semibold text-ink-900">
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed text-ink-500">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="flex flex-col items-center gap-6 rounded-3xl bg-primary-500 px-8 py-14 text-center shadow-soft sm:px-16">
          <h2 className="max-w-lg text-2xl font-bold text-white sm:text-3xl">
            Give your team a calmer way to handle expenses
          </h2>
          <Link
            href="/signup"
            className="rounded-2xl bg-white px-7 py-3.5 text-sm font-semibold text-primary-500 transition-transform hover:scale-[1.02]"
          >
            Create your free account
          </Link>
        </div>
      </section>

      <footer className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-lavender-200 px-6 py-8 text-xs text-ink-400 sm:flex-row">
        <Logo />
        <p>© {new Date().getFullYear()} ExpenseMate. All rights reserved.</p>
      </footer>
    </div>
  );
}
