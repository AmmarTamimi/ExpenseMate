import DonutRing from "./DonutRing";

export interface Budget {
  title: string;
  total: number;
  spent: number;
  date: string;
  currency?: string;
}

export default function BudgetCard({ budget }: { budget: Budget }) {
  const { title, total, spent, date, currency = "€" } = budget;
  const remaining = Math.max(total - spent, 0);

  return (
    <div className="flex min-w-[220px] flex-1 flex-col rounded-3xl bg-white p-5 shadow-card">
      <div className="mb-4 flex items-start justify-between">
        <p className="text-sm font-semibold text-ink-900">{title}</p>
        <button aria-label="Budget options" className="text-ink-400">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="5" r="1.6" fill="currentColor" />
            <circle cx="12" cy="12" r="1.6" fill="currentColor" />
            <circle cx="12" cy="19" r="1.6" fill="currentColor" />
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-4">
        <DonutRing
          size={92}
          strokeWidth={12}
          segments={[
            { value: spent, color: "#3D4CEA" },
            { value: remaining, color: "#EFEDFA" },
          ]}
          centerLabel="Total"
          centerValue={`${total}${currency}`}
        />
        <div className="flex flex-1 flex-col gap-2 text-xs">
          <div>
            <p className="flex items-center gap-1.5 text-ink-400">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
              Spent
            </p>
            <p className="font-semibold text-ink-900">
              {spent.toFixed(2)}
              {currency}
            </p>
          </div>
          <div>
            <p className="flex items-center gap-1.5 text-ink-400">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
              Remaining
            </p>
            <p className="font-semibold text-ink-900">
              {remaining.toFixed(2)}
              {currency}
            </p>
          </div>
          <p className="pt-1 text-ink-400">{date}</p>
        </div>
      </div>
    </div>
  );
}
