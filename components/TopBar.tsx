"use client";

export default function TopBar({ onMenu }: { onMenu: () => void }) {
  return (
    <div className="mb-8 flex items-center justify-between gap-4">
      <button
        onClick={onMenu}
        aria-label="Open menu"
        className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-card lg:hidden"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M4 7h16M4 12h16M4 17h16"
            stroke="#1B1B2F"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <div className="hidden flex-1 max-w-sm items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-card sm:flex">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="7" stroke="#9797AA" strokeWidth="2" />
          <path
            d="m20 20-3.5-3.5"
            stroke="#9797AA"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <input
          type="text"
          placeholder="Search expenses, budgets…"
          className="w-full bg-transparent text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none"
        />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <button
          aria-label="Notifications"
          className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-card"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 13 6 9Z"
              stroke="#1B1B2F"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path
              d="M10 18a2 2 0 0 0 4 0"
              stroke="#1B1B2F"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-gold-500" />
        </button>
        <div className="hidden h-11 w-11 items-center justify-center rounded-2xl bg-primary-500 text-sm font-semibold text-white sm:flex">
          MK
        </div>
      </div>
    </div>
  );
}
