"use client";

import { Menu, Search, Bell } from "lucide-react";

export default function TopBar({ onMenu }: { onMenu: () => void }) {
  return (
    <div className="mb-8 flex items-center justify-between gap-4">
      {/* Hamburger — mobile only */}
      <button
        onClick={onMenu}
        aria-label="Open menu"
        className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-ink-900 shadow-card transition-colors hover:bg-lavender-50 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Search — hidden on mobile */}
      <div className="hidden max-w-sm flex-1 items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-card sm:flex">
        <Search className="h-4 w-4 shrink-0 text-ink-400" />
        <input
          type="text"
          placeholder="Search expenses, budgets…"
          className="w-full bg-transparent text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none"
        />
      </div>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-3">
        <button
          aria-label="Notifications"
          className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-ink-900 shadow-card transition-colors hover:bg-lavender-50"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-gold-500" />
        </button>

        <div className="hidden h-11 w-11 items-center justify-center rounded-2xl bg-primary-500 text-sm font-semibold text-white sm:flex">
          MK
        </div>
      </div>
    </div>
  );
}