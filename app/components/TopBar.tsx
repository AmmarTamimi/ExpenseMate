// "use client";

// import { Menu, Search, Bell } from "lucide-react";

// export default function TopBar({ onMenu }: { onMenu: () => void }) {
//   return (
//     <div className="mb-8 flex items-center justify-between gap-4">
//       {/* Hamburger — mobile only */}
//       <button
//         onClick={onMenu}
//         aria-label="Open menu"
//         className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-ink-900 shadow-card transition-colors hover:bg-lavender-50 lg:hidden"
//       >
//         <Menu className="h-5 w-5" />
//       </button>

//       {/* Search — hidden on mobile */}
//       <div className="hidden max-w-sm flex-1 items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-card sm:flex">
//         <Search className="h-4 w-4 shrink-0 text-ink-400" />
//         <input
//           type="text"
//           placeholder="Search expenses, budgets…"
//           className="w-full bg-transparent text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none"
//         />
//       </div>

//       {/* Right side */}
//       <div className="ml-auto flex items-center gap-3">
//         <button
//           aria-label="Notifications"
//           className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-ink-900 shadow-card transition-colors hover:bg-lavender-50"
//         >
//           <Bell className="h-5 w-5" />
//           <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-gold-500" />
//         </button>

//         <div className="hidden h-11 w-11 items-center justify-center rounded-2xl bg-primary-500 text-sm font-semibold text-white sm:flex">
//           MK
//         </div>
//       </div>
//     </div>
//   );
// }

























































"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, LogOut, Menu, User as UserIcon, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

interface TopBarProps {
  onMenu: () => void;
  /** User info passed from dashboard */
  userName?: string;
  userEmail?: string;
  /** Notification count badge */
  notificationCount?: number;
  /** Click handler for the bell */
  onNotificationsClick?: () => void;
  /** Sign-out handler */
  onSignOut?: () => void;
}

/** Get initials from a full name, e.g. "Ali Khan" → "AK" */
function getInitials(name?: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function TopBar({
  onMenu,
  userName = "Guest",
  userEmail = "",
  notificationCount = 0,
  onNotificationsClick,
  onSignOut,
}: TopBarProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  /* Close profile dropdown on outside click */
  useEffect(() => {
    if (!profileOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [profileOpen]);

  const initials = getInitials(userName);

  const handleSignOut = () => {
    setProfileOpen(false);
    if (onSignOut) {
      onSignOut();
    } else {
      // Default: clear session and route to login
      if (typeof window !== "undefined") {
        localStorage.removeItem("session");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
      router.push("/login");
    }
  };

  return (
    <header className="mb-6 flex items-center justify-between gap-3">
      {/* Left: mobile menu + welcome text */}
      <div className="flex min-w-0 items-center gap-3">
        <button
          onClick={onMenu}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-lavender-200 bg-white text-ink-500 lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="min-w-0">
          <p className="truncate text-xs text-ink-400">Welcome back</p>
          <p className="truncate text-sm font-semibold text-ink-900">
            {userName}
          </p>
        </div>
      </div>

      {/* Right: bell + avatar */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notifications */}
        <button
          onClick={onNotificationsClick}
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-lavender-200 bg-white text-ink-500 transition hover:bg-lavender-50"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </button>

        {/* Avatar + dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-500 text-sm font-bold text-white transition hover:bg-primary-600"
            aria-label="Account menu"
          >
            {initials}
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border border-lavender-100 bg-white shadow-xl">
              {/* User info header */}
              <div className="border-b border-lavender-100 bg-lavender-50/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-500 text-base font-bold text-white">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink-900">
                      {userName}
                    </p>
                    {userEmail && (
                      <p className="truncate text-xs text-ink-500">
                        {userEmail}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Menu items */}
              <div className="p-2">
                <button
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-ink-700 hover:bg-lavender-50"
                  onClick={() => setProfileOpen(false)}
                >
                  <UserIcon className="h-4 w-4 text-ink-400" />
                  My Profile
                </button>
                <button
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-ink-700 hover:bg-lavender-50"
                  onClick={() => setProfileOpen(false)}
                >
                  <Settings className="h-4 w-4 text-ink-400" />
                  Settings
                </button>
              </div>

              {/* Sign out */}
              <div className="border-t border-lavender-100 p-2">
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}