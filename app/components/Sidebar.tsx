"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { label: "Reports", href: "/dashboard/reports", icon: ReportIcon },
  { label: "History", href: "/dashboard/history", icon: HistoryIcon },
  { label: "Profile", href: "/dashboard/profile", icon: ProfileIcon },
  { label: "Settings", href: "/dashboard/settings", icon: SettingsIcon },
];

export default function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <button
          aria-label="Close menu"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-ink-900/30 backdrop-blur-sm lg:hidden"
        />
      )}
      <aside
        className={`fixed z-40 flex h-full w-72 flex-col justify-between bg-lavender-100 p-6 transition-transform duration-300 ease-out
        lg:static lg:z-auto lg:h-auto lg:min-h-screen lg:translate-x-0
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div>
          <div className="mb-10 flex items-center justify-between">
            <Logo />
          </div>

          <nav className="flex flex-col gap-1.5">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary-500 text-white shadow-soft"
                      : "text-ink-500 hover:bg-white/70 hover:text-ink-900"
                  }`}
                >
                  <Icon active={isActive} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-white/60 p-4">
          <div>
            <p className="text-sm font-semibold text-ink-900">Marcos Kahn</p>
            <p className="text-xs text-ink-400">Finance team</p>
          </div>
          <Link
            href="/login"
            aria-label="Sign out"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-ink-500 hover:bg-white"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </aside>
    </>
  );
}

function iconStroke(active?: boolean) {
  return active ? "#FFFFFF" : "#6E6E85";
}

function HomeIcon({ active }: { active?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 11.5 12 4l8 7.5M6 9.5V20h12V9.5"
        stroke={iconStroke(active)}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function ReportIcon({ active }: { active?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 4h10a1 1 0 0 1 1 1v15l-3-2-3 2-3-2-3 2V5a1 1 0 0 1 1-1Z"
        stroke={iconStroke(active)}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M9 9h6M9 13h6"
        stroke={iconStroke(active)}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function HistoryIcon({ active }: { active?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 12a9 9 0 1 0 3-6.7"
        stroke={iconStroke(active)}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M3 4v5h5M12 8v5l3 2"
        stroke={iconStroke(active)}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function ProfileIcon({ active }: { active?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3.4" stroke={iconStroke(active)} strokeWidth="2" />
      <path
        d="M5 20c1.4-3.4 4-5 7-5s5.6 1.6 7 5"
        stroke={iconStroke(active)}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function SettingsIcon({ active }: { active?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke={iconStroke(active)} strokeWidth="2" />
      <path
        d="M19.4 13.5a7.7 7.7 0 0 0 0-3l2-1.4-2-3.4-2.3.9a7.6 7.6 0 0 0-2.6-1.5L14 2.7h-4l-.5 2.4a7.6 7.6 0 0 0-2.6 1.5l-2.3-.9-2 3.4 2 1.4a7.7 7.7 0 0 0 0 3l-2 1.4 2 3.4 2.3-.9c.8.7 1.6 1.2 2.6 1.5l.5 2.4h4l.5-2.4a7.6 7.6 0 0 0 2.6-1.5l2.3.9 2-3.4-2-1.4Z"
        stroke={iconStroke(active)}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
