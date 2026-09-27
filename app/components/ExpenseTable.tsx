export interface Expense {
  company: string;
  budget: string;
  date: string;
  amount: string;
  status: "Approved" | "Pending" | "Rejected";
  icon: string;
}

const STATUS_STYLES: Record<Expense["status"], string> = {
  Approved: "text-primary-500",
  Pending: "text-gold-600",
  Rejected: "text-red-500",
};

const STATUS_DOT: Record<Expense["status"], string> = {
  Approved: "bg-primary-500",
  Pending: "bg-gold-500",
  Rejected: "bg-red-500",
};

export default function ExpenseTable({ rows }: { rows: Expense[] }) {
  return (
    <div className="overflow-x-auto rounded-3xl bg-white p-2 shadow-card scrollbar-thin">
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-ink-400">
            <th className="px-4 py-3 font-medium">Company</th>
            <th className="px-4 py-3 font-medium">Budget</th>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Amount</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="rounded-2xl text-ink-700 transition-colors hover:bg-lavender-50"
            >
              <td className="whitespace-nowrap px-4 py-3">
                <span className="flex items-center gap-2 font-medium text-ink-900">
                  <span aria-hidden className="text-base">
                    {row.icon}
                  </span>
                  {row.company}
                </span>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-ink-500">
                {row.budget}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-ink-500">
                {row.date}
              </td>
              <td className="whitespace-nowrap px-4 py-3 font-medium text-ink-900">
                {row.amount}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <span
                  className={`flex items-center gap-1.5 font-medium ${STATUS_STYLES[row.status]}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[row.status]}`} />
                  {row.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
