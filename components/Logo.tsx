export default function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-500 text-white shadow-soft">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M4 12c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path
            d="M12 8v4l3 2"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span
        className={`text-lg font-bold tracking-tight ${
          dark ? "text-white" : "text-ink-900"
        }`}
      >
        Expense<span className="text-primary-500">Mate</span>
      </span>
    </div>
  );
}
