// "use client";

// import { useState } from "react";
// import {
//   Wallet,
//   TrendingUp,
//   TrendingDown,
//   Plus,
//   FolderPlus,
//   PlusCircle,
//   Filter,
//   Download,
//   Printer,
//   ArrowUpRight,
//   ArrowDownRight,
//   AlertTriangle,
//   CheckCircle2,
// } from "lucide-react";

// import TopBar from "../components/TopBar";
// import ExpenseTable, { Expense } from "../components/ExpenseTable";
// import Sidebar from "../components/Sidebar";

// /* ---------- Sample data (replace with real data later) ---------- */

// type CategoryBudget = {
//   id: string;
//   name: string;
//   type: "expense" | "income";
//   limit: number;
//   spent: number;
// };

// const budgets: CategoryBudget[] = [
//   { id: "1", name: "Groceries", type: "expense", limit: 300, spent: 87.5 },
//   { id: "2", name: "Transport", type: "expense", limit: 150, spent: 132.4 },
//   { id: "3", name: "Entertainment", type: "expense", limit: 100, spent: 105.2 },
//   { id: "4", name: "Dining Out", type: "expense", limit: 200, spent: 60 },
// ];

// const expenses: Expense[] = [
//   { company: "Ryanair", budget: "Berlin Congress", date: "01/02/19", amount: "126,30€", status: "Approved", icon: "✈️" },
//   { company: "NH Hotels", budget: "Berlin Congress", date: "01/02/19", amount: "210,00€", status: "Approved", icon: "🛏️" },
//   { company: "Equinox Rest.", budget: "Berlin Congress", date: "03/02/19", amount: "32,54€", status: "Approved", icon: "🍽️" },
//   { company: "Grandma's Kitchen", budget: "Berlin Congress", date: "03/02/19", amount: "14,20€", status: "Approved", icon: "🍽️" },
//   { company: "Presents Store", budget: "Berlin Congress", date: "03/02/19", amount: "22,40€", status: "Approved", icon: "🎁" },
//   { company: "Car Stars", budget: "Berlin Congress", date: "03/02/19", amount: "5,10€", status: "Pending", icon: "🅿️" },
//   { company: "Paper Supplies", budget: "February Expenses", date: "04/02/19", amount: "6,12€", status: "Pending", icon: "📎" },
//   { company: "Galleta Rest.", budget: "February Expenses", date: "04/02/19", amount: "42,60€", status: "Pending", icon: "🍽️" },
//   { company: "Pakstore", budget: "February Expenses", date: "04/02/19", amount: "15,00€", status: "Pending", icon: "🍽️" },
// ];

// /* ---------- Page ---------- */

// export default function DashboardPage() {
//   const [menuOpen, setMenuOpen] = useState(false);

//   const totalIncome = 2450.0;
//   const totalExpenses = 1120.5;
//   const balance = totalIncome - totalExpenses;

//   return (
//     <div className="flex min-h-screen bg-[#F8F7FC]">
//       <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

//       <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
//         <TopBar onMenu={() => setMenuOpen(true)} />

//         {/* Page Header */}
//         <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
//           <div className="min-w-0">
//             <h1 className="text-2xl font-bold text-ink-900 sm:text-[28px]">
//               Dashboard
//             </h1>
//             <p className="mt-1 text-sm text-ink-500">
//               Welcome back. Here&apos;s your budget overview.
//             </p>
//           </div>
//           <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
//             <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-lavender-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-700 transition-colors hover:bg-lavender-50 sm:w-auto">
//               <FolderPlus className="h-4 w-4" />
//               Add Category
//             </button>
//             <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-primary-600 sm:w-auto">
//               <PlusCircle className="h-4 w-4" />
//               Add Transaction
//             </button>
//           </div>
//         </div>

//         {/* Summary Cards */}
//         <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//           <StatCard
//             label="Total Balance"
//             value={`${balance.toFixed(2)}€`}
//             hint="Income − Expenses"
//             icon={Wallet}
//             tone="primary"
//           />
//           <StatCard
//             label="Income (this month)"
//             value={`${totalIncome.toFixed(2)}€`}
//             hint="+3.2% vs last month"
//             icon={TrendingUp}
//             tone="green"
//           />
//           <StatCard
//             label="Expenses (this month)"
//             value={`${totalExpenses.toFixed(2)}€`}
//             hint="+1.8% vs last month"
//             icon={TrendingDown}
//             tone="red"
//           />
//         </div>

//         {/* Budgets by Category */}
//         <section className="mb-6 rounded-3xl bg-white p-5 shadow-card sm:p-6">
//           <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
//             <div>
//               <h2 className="text-sm font-semibold text-ink-900">
//                 Monthly Budgets
//               </h2>
//               <p className="mt-0.5 text-xs text-ink-400">
//                 Spending per category this month
//               </p>
//             </div>
//             <button className="flex items-center gap-1 rounded-xl border border-lavender-200 bg-white px-3 py-1.5 text-xs font-medium text-primary-500 transition-colors hover:bg-lavender-50">
//               <Plus className="h-3.5 w-3.5" />
//               Set budget
//             </button>
//           </div>

//           {/* ✅ Responsive grid: 1 col mobile → 2 col tablet → 3 col desktop */}
//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//             {budgets.map((b) => (
//               <CategoryBudgetCard key={b.id} budget={b} />
//             ))}
//           </div>
//         </section>

//         {/* Recent Transactions */}
//         <section className="rounded-3xl bg-white p-5 shadow-card sm:p-6">
//           <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
//             <h2 className="text-sm font-semibold text-ink-900">
//               Recent Transactions
//             </h2>
//             <div className="flex items-center gap-2">
//               <IconButton label="Filter">
//                 <Filter className="h-4 w-4" />
//               </IconButton>
//               <IconButton label="Export">
//                 <Download className="h-4 w-4" />
//               </IconButton>
//               <IconButton label="Print">
//                 <Printer className="h-4 w-4" />
//               </IconButton>
//             </div>
//           </div>

//           {/* Horizontal scroll only when table can't fit */}
//           <div className="-mx-2 overflow-x-auto sm:mx-0">
//             <div className="min-w-[560px] px-2 sm:min-w-0 sm:px-0">
//               <ExpenseTable rows={expenses} />
//             </div>
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// }

// /* ---------- Category Budget Card (responsive) ---------- */

// function CategoryBudgetCard({ budget }: { budget: CategoryBudget }) {
//   const pct = Math.min((budget.spent / budget.limit) * 100, 100);
//   const raw = (budget.spent / budget.limit) * 100;

//   const status: "ok" | "warning" | "over" =
//     raw >= 100 ? "over" : raw >= 80 ? "warning" : "ok";

//   const barColor =
//     status === "over"
//       ? "bg-red-500"
//       : status === "warning"
//       ? "bg-amber-500"
//       : "bg-primary-500";

//   const pill =
//     status === "over"
//       ? "bg-red-50 text-red-600"
//       : status === "warning"
//       ? "bg-amber-50 text-amber-600"
//       : "bg-green-50 text-green-600";

//   const StatusIcon =
//     status === "over" ? AlertTriangle : status === "warning" ? AlertTriangle : CheckCircle2;

//   const StatusLabel =
//     status === "over" ? "Over budget" : status === "warning" ? "Almost" : "On track";

//   return (
//     <div className="flex w-full min-w-0 flex-col gap-3 rounded-2xl border border-lavender-100 bg-white p-4">
//       {/* Top row: name + status pill */}
//       <div className="flex min-w-0 items-start justify-between gap-2">
//         <div className="min-w-0">
//           <p className="truncate text-sm font-semibold text-ink-900">
//             {budget.name}
//           </p>
//           <p className="mt-0.5 text-[11px] capitalize text-ink-400">
//             {budget.type}
//           </p>
//         </div>
//         <span
//           className={`flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${pill}`}
//         >
//           <StatusIcon className="h-3 w-3" />
//           {StatusLabel}
//         </span>
//       </div>

//       {/* Amounts */}
//       <div className="flex min-w-0 items-baseline justify-between gap-2">
//         <span className="truncate text-lg font-bold text-ink-900">
//           {budget.spent.toFixed(2)}€
//         </span>
//         <span className="shrink-0 text-xs text-ink-400">
//           of {budget.limit.toFixed(2)}€
//         </span>
//       </div>

//       {/* Progress bar */}
//       <div className="h-2 w-full overflow-hidden rounded-full bg-lavender-100">
//         <div
//           className={`h-full rounded-full transition-all ${barColor}`}
//           style={{ width: `${pct}%` }}
//         />
//       </div>

//       {/* Remaining */}
//       <p className="text-[11px] text-ink-500">
//         {budget.limit - budget.spent >= 0
//           ? `${(budget.limit - budget.spent).toFixed(2)}€ remaining`
//           : `${(budget.spent - budget.limit).toFixed(2)}€ over`}
//       </p>
//     </div>
//   );
// }

// /* ---------- Stat Card ---------- */

// function StatCard({
//   label,
//   value,
//   hint,
//   icon: Icon,
//   tone,
// }: {
//   label: string;
//   value: string;
//   hint: string;
//   icon: React.ComponentType<{ className?: string }>;
//   tone: "primary" | "green" | "red";
// }) {
//   const tones = {
//     primary: "bg-primary-50 text-primary-500",
//     green: "bg-green-50 text-green-600",
//     red: "bg-red-50 text-red-500",
//   };
//   const hintTones = {
//     primary: "text-ink-400",
//     green: "text-green-600",
//     red: "text-red-500",
//   };

//   return (
//     <div className="min-w-0 rounded-3xl bg-white p-5 shadow-card">
//       <div className="flex items-start justify-between gap-3">
//         <div
//           className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${tones[tone]}`}
//         >
//           <Icon className="h-5 w-5" />
//         </div>
//       </div>
//       <p className="mt-4 truncate text-[11px] font-medium uppercase tracking-wide text-ink-400">
//         {label}
//       </p>
//       <p className="mt-1 truncate text-xl font-bold text-ink-900">{value}</p>
//       <p className={`mt-1 flex items-center gap-1 text-[11px] ${hintTones[tone]}`}>
//         {tone === "green" && <ArrowUpRight className="h-3 w-3" />}
//         {tone === "red" && <ArrowDownRight className="h-3 w-3" />}
//         {hint}
//       </p>
//     </div>
//   );
// }

// /* ---------- Small helper ---------- */

// function IconButton({
//   children,
//   label,
// }: {
//   children: React.ReactNode;
//   label: string;
// }) {
//   return (
//     <button
//       aria-label={label}
//       className="flex h-9 w-9 items-center justify-center rounded-xl border border-lavender-200 bg-white text-ink-500 transition-colors hover:bg-lavender-50"
//     >
//       {children}
//     </button>
//   );
// }


















































// "use client";

// import { useCallback, useEffect, useState } from "react";
// import {
//   Wallet,
//   TrendingUp,
//   TrendingDown,
//   Plus,
//   FolderPlus,
//   PlusCircle,
//   Filter,
//   Download,
//   Printer,
//   ArrowUpRight,
//   ArrowDownRight,
//   AlertTriangle,
//   CheckCircle2,
// } from "lucide-react";

// import TopBar from "../components/TopBar";
// import ExpenseTable, { Expense } from "../components/ExpenseTable";
// import Sidebar from "../components/Sidebar";
// import CategoryModal from "../components/CategoryModal";

// /* ---------- Types ---------- */

// type CategoryFromAPI = {
//   _id: string;
//   catId: string;
//   name: string;
//   type: "income" | "expense";
// };

// type CategoryBudget = {
//   id: string;
//   name: string;
//   type: "expense" | "income";
//   limit: number;
//   spent: number;
// };

// /* ---------- Sample expenses (replace with real data later) ---------- */

// const expenses: Expense[] = [
//   { company: "Ryanair", budget: "Berlin Congress", date: "01/02/19", amount: "126,30€", status: "Approved", icon: "✈️" },
//   { company: "NH Hotels", budget: "Berlin Congress", date: "01/02/19", amount: "210,00€", status: "Approved", icon: "🛏️" },
//   { company: "Equinox Rest.", budget: "Berlin Congress", date: "03/02/19", amount: "32,54€", status: "Approved", icon: "🍽️" },
//   { company: "Grandma's Kitchen", budget: "Berlin Congress", date: "03/02/19", amount: "14,20€", status: "Approved", icon: "🍽️" },
//   { company: "Presents Store", budget: "Berlin Congress", date: "03/02/19", amount: "22,40€", status: "Approved", icon: "🎁" },
//   { company: "Car Stars", budget: "Berlin Congress", date: "03/02/19", amount: "5,10€", status: "Pending", icon: "🅿️" },
//   { company: "Paper Supplies", budget: "February Expenses", date: "04/02/19", amount: "6,12€", status: "Pending", icon: "📎" },
//   { company: "Galleta Rest.", budget: "February Expenses", date: "04/02/19", amount: "42,60€", status: "Pending", icon: "🍽️" },
//   { company: "Pakstore", budget: "February Expenses", date: "04/02/19", amount: "15,00€", status: "Pending", icon: "🍽️" },
// ];

// /* ---------- Page ---------- */

// export default function DashboardPage() {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [categoryModalOpen, setCategoryModalOpen] = useState(false);
//   const [categories, setCategories] = useState<CategoryFromAPI[]>([]);
//   const [loadingCategories, setLoadingCategories] = useState(true);

//   const totalIncome = 2450.0;
//   const totalExpenses = 1120.5;
//   const balance = totalIncome - totalExpenses;

//   /* ----- Load categories from the API ----- */
//   const fetchCategories = useCallback(async () => {
//     try {
//       setLoadingCategories(true);
//       const res = await fetch("/api/categories", {
//         headers: { "x-user-id": DEV_USER_ID },
//       });
//       const data = await res.json();
//       if (res.ok) {
//         setCategories(data);
//       } else {
//         console.error("Failed to load categories:", data.error);
//       }
//     } catch (err) {
//       console.error("Failed to load categories:", err);
//     } finally {
//       setLoadingCategories(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchCategories();
//   }, [fetchCategories]);

//   /* ----- Map API categories → budget cards (spent/limit are placeholders until budgets exist) ----- */
//   const budgets: CategoryBudget[] = categories.map((c) => ({
//     id: c._id,
//     name: c.name,
//     type: c.type,
//     limit: 0,
//     spent: 0,
//   }));

//   return (
//     <div className="flex min-h-screen bg-[#F8F7FC]">
//       <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

//       <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
//         <TopBar onMenu={() => setMenuOpen(true)} />

//         {/* Page Header */}
//         <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
//           <div className="min-w-0">
//             <h1 className="text-2xl font-bold text-ink-900 sm:text-[28px]">
//               Dashboard
//             </h1>
//             <p className="mt-1 text-sm text-ink-500">
//               Welcome back. Here&apos;s your budget overview.
//             </p>
//           </div>
//           <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
//             {/* ✅ Wire the "Add Category" button to open the modal */}
//             <button
//               onClick={() => setCategoryModalOpen(true)}
//               className="flex w-full items-center justify-center gap-2 rounded-2xl border border-lavender-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-700 transition-colors hover:bg-lavender-50 sm:w-auto"
//             >
//               <FolderPlus className="h-4 w-4" />
//               Add Category
//             </button>
//             <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-primary-600 sm:w-auto">
//               <PlusCircle className="h-4 w-4" />
//               Add Transaction
//             </button>
//           </div>
//         </div>

//         {/* Summary Cards */}
//         <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//           <StatCard
//             label="Total Balance"
//             value={`${balance.toFixed(2)}€`}
//             hint="Income − Expenses"
//             icon={Wallet}
//             tone="primary"
//           />
//           <StatCard
//             label="Income (this month)"
//             value={`${totalIncome.toFixed(2)}€`}
//             hint="+3.2% vs last month"
//             icon={TrendingUp}
//             tone="green"
//           />
//           <StatCard
//             label="Expenses (this month)"
//             value={`${totalExpenses.toFixed(2)}€`}
//             hint="+1.8% vs last month"
//             icon={TrendingDown}
//             tone="red"
//           />
//         </div>

//         {/* Budgets by Category */}
//         <section className="mb-6 rounded-3xl bg-white p-5 shadow-card sm:p-6">
//           <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
//             <div>
//               <h2 className="text-sm font-semibold text-ink-900">
//                 Monthly Budgets
//               </h2>
//               <p className="mt-0.5 text-xs text-ink-400">
//                 Spending per category this month
//               </p>
//             </div>
//             <button className="flex items-center gap-1 rounded-xl border border-lavender-200 bg-white px-3 py-1.5 text-xs font-medium text-primary-500 transition-colors hover:bg-lavender-50">
//               <Plus className="h-3.5 w-3.5" />
//               Set budget
//             </button>
//           </div>

//           {loadingCategories ? (
//             <p className="py-8 text-center text-sm text-ink-400">
//               Loading categories...
//             </p>
//           ) : budgets.length === 0 ? (
//             <div className="rounded-2xl border-2 border-dashed border-lavender-200 py-10 text-center">
//               <p className="mb-1 text-sm font-medium text-ink-700">
//                 No categories yet
//               </p>
//               <p className="mb-4 text-xs text-ink-400">
//                 Add your first category to start tracking budgets.
//               </p>
//               <button
//                 onClick={() => setCategoryModalOpen(true)}
//                 className="rounded-xl bg-primary-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-600"
//               >
//                 Add Category
//               </button>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//               {budgets.map((b) => (
//                 <CategoryBudgetCard key={b.id} budget={b} />
//               ))}
//             </div>
//           )}
//         </section>

//         {/* Recent Transactions */}
//         <section className="rounded-3xl bg-white p-5 shadow-card sm:p-6">
//           <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
//             <h2 className="text-sm font-semibold text-ink-900">
//               Recent Transactions
//             </h2>
//             <div className="flex items-center gap-2">
//               <IconButton label="Filter">
//                 <Filter className="h-4 w-4" />
//               </IconButton>
//               <IconButton label="Export">
//                 <Download className="h-4 w-4" />
//               </IconButton>
//               <IconButton label="Print">
//                 <Printer className="h-4 w-4" />
//               </IconButton>
//             </div>
//           </div>

//           <div className="-mx-2 overflow-x-auto sm:mx-0">
//             <div className="min-w-[560px] px-2 sm:min-w-0 sm:px-0">
//               <ExpenseTable rows={expenses} />
//             </div>
//           </div>
//         </section>
//       </main>

//       {/* ✅ Render the modal */}
//       <CategoryModal
//         isOpen={categoryModalOpen}
//         onClose={() => setCategoryModalOpen(false)}
//         onSuccess={fetchCategories}
//       />
//     </div>
//   );
// }

// /* ---------- Category Budget Card ---------- */

// function CategoryBudgetCard({ budget }: { budget: CategoryBudget }) {
//   const hasLimit = budget.limit > 0;
//   const raw = hasLimit ? (budget.spent / budget.limit) * 100 : 0;
//   const pct = Math.min(raw, 100);

//   const status: "ok" | "warning" | "over" | "unset" = !hasLimit
//     ? "unset"
//     : raw >= 100
//     ? "over"
//     : raw >= 80
//     ? "warning"
//     : "ok";

//   const barColor =
//     status === "over"
//       ? "bg-red-500"
//       : status === "warning"
//       ? "bg-amber-500"
//       : status === "unset"
//       ? "bg-lavender-200"
//       : "bg-primary-500";

//   const pill =
//     status === "over"
//       ? "bg-red-50 text-red-600"
//       : status === "warning"
//       ? "bg-amber-50 text-amber-600"
//       : status === "unset"
//       ? "bg-lavender-50 text-ink-500"
//       : "bg-green-50 text-green-600";

//   const StatusIcon =
//     status === "over"
//       ? AlertTriangle
//       : status === "warning"
//       ? AlertTriangle
//       : CheckCircle2;

//   const StatusLabel =
//     status === "over"
//       ? "Over budget"
//       : status === "warning"
//       ? "Almost"
//       : status === "unset"
//       ? "No budget"
//       : "On track";

//   return (
//     <div className="flex w-full min-w-0 flex-col gap-3 rounded-2xl border border-lavender-100 bg-white p-4">
//       <div className="flex min-w-0 items-start justify-between gap-2">
//         <div className="min-w-0">
//           <p className="truncate text-sm font-semibold text-ink-900">
//             {budget.name}
//           </p>
//           <p className="mt-0.5 text-[11px] capitalize text-ink-400">
//             {budget.type}
//           </p>
//         </div>
//         <span
//           className={`flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${pill}`}
//         >
//           <StatusIcon className="h-3 w-3" />
//           {StatusLabel}
//         </span>
//       </div>

//       <div className="flex min-w-0 items-baseline justify-between gap-2">
//         <span className="truncate text-lg font-bold text-ink-900">
//           {budget.spent.toFixed(2)}€
//         </span>
//         <span className="shrink-0 text-xs text-ink-400">
//           {hasLimit ? `of ${budget.limit.toFixed(2)}€` : "no limit set"}
//         </span>
//       </div>

//       <div className="h-2 w-full overflow-hidden rounded-full bg-lavender-100">
//         <div
//           className={`h-full rounded-full transition-all ${barColor}`}
//           style={{ width: `${hasLimit ? pct : 0}%` }}
//         />
//       </div>

//       <p className="text-[11px] text-ink-500">
//         {!hasLimit
//           ? "Set a monthly budget to track spending"
//           : budget.limit - budget.spent >= 0
//           ? `${(budget.limit - budget.spent).toFixed(2)}€ remaining`
//           : `${(budget.spent - budget.limit).toFixed(2)}€ over`}
//       </p>
//     </div>
//   );
// }

// /* ---------- Stat Card ---------- */

// function StatCard({
//   label,
//   value,
//   hint,
//   icon: Icon,
//   tone,
// }: {
//   label: string;
//   value: string;
//   hint: string;
//   icon: React.ComponentType<{ className?: string }>;
//   tone: "primary" | "green" | "red";
// }) {
//   const tones = {
//     primary: "bg-primary-50 text-primary-500",
//     green: "bg-green-50 text-green-600",
//     red: "bg-red-50 text-red-500",
//   };
//   const hintTones = {
//     primary: "text-ink-400",
//     green: "text-green-600",
//     red: "text-red-500",
//   };

//   return (
//     <div className="min-w-0 rounded-3xl bg-white p-5 shadow-card">
//       <div className="flex items-start justify-between gap-3">
//         <div
//           className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${tones[tone]}`}
//         >
//           <Icon className="h-5 w-5" />
//         </div>
//       </div>
//       <p className="mt-4 truncate text-[11px] font-medium uppercase tracking-wide text-ink-400">
//         {label}
//       </p>
//       <p className="mt-1 truncate text-xl font-bold text-ink-900">{value}</p>
//       <p className={`mt-1 flex items-center gap-1 text-[11px] ${hintTones[tone]}`}>
//         {tone === "green" && <ArrowUpRight className="h-3 w-3" />}
//         {tone === "red" && <ArrowDownRight className="h-3 w-3" />}
//         {hint}
//       </p>
//     </div>
//   );
// }

// /* ---------- Small helper ---------- */

// function IconButton({
//   children,
//   label,
// }: {
//   children: React.ReactNode;
//   label: string;
// }) {
//   return (
//     <button
//       aria-label={label}
//       className="flex h-9 w-9 items-center justify-center rounded-xl border border-lavender-200 bg-white text-ink-500 transition-colors hover:bg-lavender-50"
//     >
//       {children}
//     </button>
//   );
// }

























































"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
} from "lucide-react";

import TopBar from "../components/TopBar";
import Sidebar from "../components/Sidebar";
import CategoryModal from "../components/CategoryModal";
import TransactionModal from "../components/TransactionModal";
import { getSession } from "@/lib/auth/session";
import { getUser } from "@/lib/auth/getUser";
// import { DEV_USER_ID } from "@/lib/devUser";

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

type CategoryBudget = {
  id: string;
  name: string;
  type: "income" | "expense";
  limit: number;
  spent: number;
};

/* ---------- Page ---------- */

export default function DashboardPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);

  const [categories, setCategories] = useState<CategoryFromAPI[]>([]);
  const [transactions, setTransactions] = useState<TransactionFromAPI[]>([]);
  const [loading, setLoading] = useState(true);

  const user = getUser();
  /* ----- Load categories ----- */
  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/categories", {
        headers: { "x-user-id": user?.user?.userId || "" },
      });
      const data = await res.json();
      if (res.ok) setCategories(data);
      else console.error("Failed to load categories:", data.error);
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  }, []);

  /* ----- Load transactions ----- */
  const fetchTransactions = useCallback(async () => {
    try {
      const res = await fetch("/api/transactions", {
        headers: { "x-user-id": user?.user?.userId || "" },
      });
      const data = await res.json();
      if (res.ok) setTransactions(data);
      else console.error("Failed to load transactions:", data.error);
    } catch (err) {
      console.error("Failed to load transactions:", err);
    }
  }, []);

  /* ----- Initial load ----- */
  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([fetchCategories(), fetchTransactions()]);
      setLoading(false);
    })();
  }, [fetchCategories, fetchTransactions]);

  /* ----- Aggregate totals from transactions ----- */
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

  /* ----- Aggregate spent per category (expenses only) ----- */
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

  /* ----- Build budget cards from categories ----- */
  const budgets: CategoryBudget[] = categories.map((c) => ({
    id: c._id,
    name: c.name,
    type: c.type,
    limit: 0, // real limits come in the Budgets phase
    spent: spentByCatId.get(c._id) ?? 0,
  }));

  /* ----- Recent 10 transactions formatted for the table ----- */
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

  return (
    <div className="flex min-h-screen bg-[#F8F7FC]">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
        <TopBar onMenu={() => setMenuOpen(true)} />

        {/* Page Header */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-ink-900 sm:text-[28px]">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-ink-500">
              Welcome back. Here&apos;s your budget overview.
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
            label="Income (this month)"
            value={`${totalIncome.toFixed(2)}€`}
            hint="Live from transactions"
            icon={TrendingUp}
            tone="green"
          />
          <StatCard
            label="Expenses (this month)"
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
            <button className="flex items-center gap-1 rounded-xl border border-lavender-200 bg-white px-3 py-1.5 text-xs font-medium text-primary-500 transition-colors hover:bg-lavender-50">
              <Plus className="h-3.5 w-3.5" />
              Set budget
            </button>
          </div>

          {loading ? (
            <p className="py-8 text-center text-sm text-ink-400">
              Loading...
            </p>
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
                <CategoryBudgetCard key={b.id} budget={b} />
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
              <IconButton label="Filter">
                <Filter className="h-4 w-4" />
              </IconButton>
              <IconButton label="Export">
                <Download className="h-4 w-4" />
              </IconButton>
              <IconButton label="Print">
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

      {/* Modals */}
      <CategoryModal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        onSuccess={async () => {
          await fetchCategories();
        }}
      />
      <TransactionModal
        isOpen={transactionModalOpen}
        onClose={() => setTransactionModalOpen(false)}
        onSuccess={async () => {
          await Promise.all([fetchTransactions(), fetchCategories()]);
        }}
      />
    </div>
  );
}

/* ---------- Inline ExpenseTable (avoids separate import) ---------- */

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

function CategoryBudgetCard({ budget }: { budget: CategoryBudget }) {
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
          </p>
        </div>
        <span
          className={`flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${pill}`}
        >
          <StatusIcon className="h-3 w-3" />
          {StatusLabel}
        </span>
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
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <button
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-xl border border-lavender-200 bg-white text-ink-500 transition-colors hover:bg-lavender-50"
    >
      {children}
    </button>
  );
}