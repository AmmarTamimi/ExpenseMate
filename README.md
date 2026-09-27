# ExpenseMate

A Next.js (App Router) + TypeScript + Tailwind starter matching the dashboard theme you shared: lavender sidebar, indigo/gold accents, rounded white cards.

## Pages included
- `/` — landing page (hero, features, CTA)
- `/login` — login page
- `/signup` — sign-up page
- `/dashboard` — dashboard UI matching the reference screenshot (balance ring, budget cards, expense table), responsive with a slide-in sidebar on mobile

## Getting started
```bash
npm install
npm run dev
```
Open http://localhost:3000

## Theme tokens (tailwind.config.ts)
- `primary` — indigo/blue accent (#3D4CEA)
- `gold` — amber accent for "remaining/pending" states
- `lavender` — sidebar/background tones
- `ink` — text colors
- Font: Plus Jakarta Sans (loaded via `next/font/google`, needs internet on first build)

## Structure
```
app/
  layout.tsx, globals.css
  page.tsx           -> landing
  login/page.tsx
  signup/page.tsx
  dashboard/page.tsx
components/
  Sidebar.tsx, TopBar.tsx, Logo.tsx
  DonutRing.tsx      -> reusable SVG ring chart
  BudgetCard.tsx, ExpenseTable.tsx
  AuthLayout.tsx      -> shared split layout for login/signup
```

## Notes
- All data on the dashboard/landing pages is mock/placeholder — wire it up to your API or DB of choice.
- The sidebar routes to `/dashboard/reports`, `/dashboard/history`, `/dashboard/profile`, `/dashboard/settings` — those pages aren't built yet, add them following the same layout pattern (Sidebar + TopBar + content).
- No auth logic is wired up yet; the login/signup forms are UI only.
