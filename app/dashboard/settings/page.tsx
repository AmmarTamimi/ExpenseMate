// "use client";

// import { useState } from "react";
// import {
//   User,
//   Lock,
//   Bell,
//   Trash2,
//   Save,
//   Eye,
//   EyeOff,
//   CheckCircle2,
// } from "lucide-react";
// import Sidebar from "../../components/Sidebar";
// import TopBar from "../../components/TopBar";

// export default function SettingsPage() {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [saved, setSaved] = useState<string | null>(null);

//   // Profile state (replace with real user later)
//   const [name, setName] = useState("Marcos Kahn");
//   const [email, setEmail] = useState("marcos@company.com");

//   // Password state
//   const [currentPw, setCurrentPw] = useState("");
//   const [newPw, setNewPw] = useState("");
//   const [confirmPw, setConfirmPw] = useState("");

//   // Notification preferences
//   const [emailAlerts, setEmailAlerts] = useState(true);
//   const [budgetAlerts, setBudgetAlerts] = useState(true);

//   const flash = (msg: string) => {
//     setSaved(msg);
//     setTimeout(() => setSaved(null), 2000);
//   };

//   const handleProfileSave = (e: React.FormEvent) => {
//     e.preventDefault();
//     // TODO: call API to update profile
//     flash("Profile updated");
//   };

//   const handlePasswordSave = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (newPw !== confirmPw) {
//       flash("Passwords do not match");
//       return;
//     }
//     // TODO: call API to change password
//     flash("Password changed");
//     setCurrentPw("");
//     setNewPw("");
//     setConfirmPw("");
//   };

//   return (
//     <div className="flex min-h-screen bg-[#F8F7FC]">
//       <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

//       <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
//         <TopBar onMenu={() => setMenuOpen(true)} />

//         {/* Page header */}
//         <div className="mb-6">
//           <h1 className="text-2xl font-bold text-ink-900 sm:text-[28px]">
//             Settings
//           </h1>
//           <p className="mt-1 text-sm text-ink-500">
//             Manage your account and preferences.
//           </p>
//         </div>

//         {/* Success toast */}
//         {saved && (
//           <div className="mb-4 flex items-center gap-2 rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
//             <CheckCircle2 className="h-4 w-4" />
//             {saved}
//           </div>
//         )}

//         <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
//           {/* ---------- Profile ---------- */}
//           <Section
//             icon={User}
//             title="Profile"
//             description="Update your name and email address."
//           >
//             <form onSubmit={handleProfileSave} className="flex flex-col gap-4">
//               <Field
//                 label="Full name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 placeholder="Your name"
//               />
//               <Field
//                 label="Email"
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="you@example.com"
//               />
//               <div className="flex justify-end">
//                 <SaveButton>
//                   <Save className="h-4 w-4" />
//                   Save changes
//                 </SaveButton>
//               </div>
//             </form>
//           </Section>

//           {/* ---------- Password ---------- */}
//           <Section
//             icon={Lock}
//             title="Password"
//             description="Change your account password."
//           >
//             <form onSubmit={handlePasswordSave} className="flex flex-col gap-4">
//               <PasswordField
//                 label="Current password"
//                 value={currentPw}
//                 onChange={(e) => setCurrentPw(e.target.value)}
//                 show={showPassword}
//                 onToggle={() => setShowPassword((s) => !s)}
//               />
//               <PasswordField
//                 label="New password"
//                 value={newPw}
//                 onChange={(e) => setNewPw(e.target.value)}
//                 show={showPassword}
//                 onToggle={() => setShowPassword((s) => !s)}
//               />
//               <PasswordField
//                 label="Confirm new password"
//                 value={confirmPw}
//                 onChange={(e) => setConfirmPw(e.target.value)}
//                 show={showPassword}
//                 onToggle={() => setShowPassword((s) => !s)}
//               />
//               <div className="flex justify-end">
//                 <SaveButton>
//                   <Save className="h-4 w-4" />
//                   Update password
//                 </SaveButton>
//               </div>
//             </form>
//           </Section>

//           {/* ---------- Notifications ---------- */}
//           <Section
//             icon={Bell}
//             title="Notifications"
//             description="Choose what you want to be notified about."
//           >
//             <div className="flex flex-col gap-3">
//               <Toggle
//                 label="Email alerts"
//                 description="Receive an email when you hit 80% or 100% of a budget."
//                 checked={emailAlerts}
//                 onChange={setEmailAlerts}
//               />
//               <Toggle
//                 label="In-app budget alerts"
//                 description="Show a toast notification when you're near a limit."
//                 checked={budgetAlerts}
//                 onChange={setBudgetAlerts}
//               />
//             </div>
//           </Section>

//           {/* ---------- Danger Zone ---------- */}
//           <Section
//             icon={Trash2}
//             title="Danger Zone"
//             description="Permanently delete your account and all data."
//             danger
//           >
//             <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//               <p className="text-xs text-ink-500">
//                 This action cannot be undone.
//               </p>
//               <button
//                 type="button"
//                 onClick={() => {
//                   if (confirm("Are you sure? This will delete everything.")) {
//                     // TODO: call API to delete account
//                     flash("Account deletion requested");
//                   }
//                 }}
//                 className="flex items-center justify-center gap-2 rounded-2xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50"
//               >
//                 <Trash2 className="h-4 w-4" />
//                 Delete account
//               </button>
//             </div>
//           </Section>
//         </div>
//       </main>
//     </div>
//   );
// }

// /* ---------- Sub-components ---------- */

// function Section({
//   icon: Icon,
//   title,
//   description,
//   children,
//   danger = false,
// }: {
//   icon: React.ComponentType<{ className?: string }>;
//   title: string;
//   description: string;
//   children: React.ReactNode;
//   danger?: boolean;
// }) {
//   return (
//     <section
//       className={`rounded-3xl bg-white p-5 shadow-card sm:p-6 ${
//         danger ? "border border-red-100" : ""
//       }`}
//     >
//       <div className="mb-5 flex items-start gap-3">
//         <span
//           className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
//             danger ? "bg-red-50 text-red-500" : "bg-primary-50 text-primary-500"
//           }`}
//         >
//           <Icon className="h-5 w-5" />
//         </span>
//         <div className="min-w-0">
//           <h2
//             className={`text-sm font-semibold ${
//               danger ? "text-red-600" : "text-ink-900"
//             }`}
//           >
//             {title}
//           </h2>
//           <p className="mt-0.5 text-xs text-ink-500">{description}</p>
//         </div>
//       </div>
//       {children}
//     </section>
//   );
// }

// function Field({
//   label,
//   value,
//   onChange,
//   type = "text",
//   placeholder,
// }: {
//   label: string;
//   value: string;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   type?: string;
//   placeholder?: string;
// }) {
//   return (
//     <label className="flex min-w-0 flex-col gap-1.5 text-sm">
//       <span className="font-medium text-ink-700">{label}</span>
//       <input
//         type={type}
//         value={value}
//         onChange={onChange}
//         placeholder={placeholder}
//         className="w-full rounded-2xl border border-lavender-200 bg-white px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
//       />
//     </label>
//   );
// }

// function PasswordField({
//   label,
//   value,
//   onChange,
//   show,
//   onToggle,
// }: {
//   label: string;
//   value: string;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   show: boolean;
//   onToggle: () => void;
// }) {
//   return (
//     <label className="flex min-w-0 flex-col gap-1.5 text-sm">
//       <span className="font-medium text-ink-700">{label}</span>
//       <div className="relative">
//         <input
//           type={show ? "text" : "password"}
//           value={value}
//           onChange={onChange}
//           placeholder="••••••••"
//           className="w-full rounded-2xl border border-lavender-200 bg-white px-4 py-3 pr-11 text-sm text-ink-900 placeholder:text-ink-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
//         />
//         <button
//           type="button"
//           onClick={onToggle}
//           aria-label={show ? "Hide password" : "Show password"}
//           className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl text-ink-400 transition-colors hover:bg-lavender-50 hover:text-ink-700"
//         >
//           {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//         </button>
//       </div>
//     </label>
//   );
// }

// function SaveButton({ children }: { children: React.ReactNode }) {
//   return (
//     <button
//       type="submit"
//       className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-primary-600 sm:w-auto"
//     >
//       {children}
//     </button>
//   );
// }

// function Toggle({
//   label,
//   description,
//   checked,
//   onChange,
// }: {
//   label: string;
//   description: string;
//   checked: boolean;
//   onChange: (v: boolean) => void;
// }) {
//   return (
//     <div className="flex items-start justify-between gap-4 rounded-2xl border border-lavender-100 p-4">
//       <div className="min-w-0">
//         <p className="text-sm font-medium text-ink-900">{label}</p>
//         <p className="mt-0.5 text-xs text-ink-500">{description}</p>
//       </div>
//       <button
//         type="button"
//         role="switch"
//         aria-checked={checked}
//         onClick={() => onChange(!checked)}
//         className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
//           checked ? "bg-primary-500" : "bg-lavender-200"
//         }`}
//       >
//         <span
//           className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
//             checked ? "translate-x-[22px]" : "translate-x-0.5"
//           }`}
//         />
//       </button>
//     </div>
//   );
// }



































































"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Lock,
  Bell,
  Trash2,
  Save,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";
import NotificationsPanel, {
  NotificationItem,
} from "../../components/NotificationsPanel";

/* ---------- Page ---------- */

export default function SettingsPage() {
  const router = useRouter();

  /* --- Auth state --- */
  const [authState, setAuthState] = useState<
    "checking" | "authenticated" | "unauthenticated"
  >("checking");

  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (cancelled) return;

        if (!res.ok) {
          setAuthState("unauthenticated");
          return;
        }

        const data = await res.json();
        const fn = data.user.firstName ?? "";
        const ln = data.user.lastName ?? "";
        const fullName = `${fn} ${ln}`.trim() || data.user.email;

        setUserId(data.user.userId);
        setUserName(fullName);
        setUserEmail(data.user.email);
        setAuthState("authenticated");
      } catch {
        if (!cancelled) setAuthState("unauthenticated");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (authState === "unauthenticated") router.replace("/login");
  }, [authState, router]);

  /* --- UI state --- */
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState<{
    kind: "ok" | "err";
    msg: string;
  } | null>(null);

  /* --- Profile form state (hydrated from session) --- */
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (authState === "authenticated") {
      setName(userName);
      setEmail(userEmail);
    }
  }, [authState, userName, userEmail]);

  /* --- Password form state --- */
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  /* --- Notification prefs (localStorage for now) --- */
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(true);

  /* --- Notifications from API --- */
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  /* --- Submitting state --- */
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [deleting, setDeleting] = useState(false);

  /* ---------- Load prefs from localStorage ---------- */
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("notificationPrefs");
      if (raw) {
        const prefs = JSON.parse(raw);
        setEmailAlerts(!!prefs.emailAlerts);
        setBudgetAlerts(!!prefs.budgetAlerts);
      }
    } catch {
      /* ignore */
    }
  }, []);

  /* ---------- Notifications fetcher ---------- */
  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await fetch("/api/notifications", {
        credentials: "include",
        headers: { "x-user-id": userId },
      });
      const data = await res.json();
      if (res.ok) setNotifications(data.notifications ?? []);
    } catch (err) {
      console.error("Notifications:", err);
    }
  }, [userId]);

  useEffect(() => {
    if (authState !== "authenticated" || !userId) return;
    fetchNotifications();
  }, [authState, userId, fetchNotifications]);

  /* ---------- Toast helper ---------- */
  const flash = (kind: "ok" | "err", msg: string) => {
    setToast({ kind, msg });
    setTimeout(() => setToast(null), 2500);
  };

  /* ---------- Notification badge ---------- */
  const unreadCount = notifications.filter((n) => n.level !== "info").length;

  /* ---------- Sign out ---------- */
  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      router.replace("/login");
      router.refresh();
    }
  };

  /* ---------- Profile save ---------- */
  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName || trimmedName.length < 2) {
      flash("err", "Name must be at least 2 characters");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      flash("err", "Please enter a valid email");
      return;
    }

    setSavingProfile(true);
    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({ name: trimmedName, email: trimmedEmail }),
      });

      const data = await res.json();
      if (!res.ok) {
        flash("err", data.error || "Failed to update profile");
        return;
      }

      setUserName(trimmedName);
      setUserEmail(trimmedEmail);
      flash("ok", "Profile updated");
      router.refresh();
    } catch {
      flash("err", "Network error. Please try again.");
    } finally {
      setSavingProfile(false);
    }
  };

  /* ---------- Password change ---------- */
  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPw || !newPw || !confirmPw) {
      flash("err", "Please fill all password fields");
      return;
    }
    if (newPw.length < 6) {
      flash("err", "New password must be at least 6 characters");
      return;
    }
    if (newPw !== confirmPw) {
      flash("err", "Passwords do not match");
      return;
    }
    if (newPw === currentPw) {
      flash("err", "New password must be different from current");
      return;
    }

    setSavingPassword(true);
    try {
      const res = await fetch("/api/users/me/password", {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({
          currentPassword: currentPw,
          newPassword: newPw,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        flash("err", data.error || "Failed to change password");
        return;
      }

      flash("ok", "Password changed");
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
    } catch {
      flash("err", "Network error. Please try again.");
    } finally {
      setSavingPassword(false);
    }
  };

  /* ---------- Notification prefs ---------- */
  const persistPrefs = (next: { emailAlerts: boolean; budgetAlerts: boolean }) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("notificationPrefs", JSON.stringify(next));
  };

  const handleEmailAlertsChange = (v: boolean) => {
    setEmailAlerts(v);
    persistPrefs({ emailAlerts: v, budgetAlerts });
  };

  const handleBudgetAlertsChange = (v: boolean) => {
    setBudgetAlerts(v);
    persistPrefs({ emailAlerts, budgetAlerts: v });
  };

  /* ---------- Delete account ---------- */
  const handleDeleteAccount = async () => {
    const confirmText = prompt(
      'Type "DELETE" to permanently delete your account and all data:'
    );
    if (confirmText !== "DELETE") {
      flash("err", "Deletion cancelled");
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch("/api/users/me", {
        method: "DELETE",
        credentials: "include",
        headers: { "x-user-id": userId },
      });

      if (!res.ok && res.status !== 204) {
        const data = await res.json().catch(() => ({}));
        flash("err", data.error || "Failed to delete account");
        return;
      }

      /* Cookie cleared by API — send user to login */
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      }).catch(() => {});

      router.replace("/login");
      router.refresh();
    } catch {
      flash("err", "Network error. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  /* ---------- Loading splash ---------- */
  if (authState === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F7FC]">
        <div className="text-sm text-ink-400">Loading...</div>
      </div>
    );
  }
  if (authState === "unauthenticated") return null;

  /* ---------- Render ---------- */
  return (
    <div className="flex min-h-screen bg-[#F8F7FC]">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
        <TopBar
          onMenu={() => setMenuOpen(true)}
          userName={userName}
          userEmail={userEmail}
          notificationCount={unreadCount}
          onNotificationsClick={() => setNotificationsOpen(true)}
          onSignOut={handleSignOut}
        />

        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-ink-900 sm:text-[28px]">
            Settings
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            Manage your account and preferences.
          </p>
        </div>

        {/* Toast */}
        {toast && (
          <div
            className={`mb-4 flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium ${
              toast.kind === "ok"
                ? "border-green-100 bg-green-50 text-green-700"
                : "border-amber-100 bg-amber-50 text-amber-700"
            }`}
          >
            {toast.kind === "ok" ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertTriangle className="h-4 w-4" />
            )}
            {toast.msg}
          </div>
        )}

        <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
          {/* ---------- Profile ---------- */}
          <Section
            icon={User}
            title="Profile"
            description="Update your name and email address."
          >
            <form onSubmit={handleProfileSave} className="flex flex-col gap-4">
              <Field
                label="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
              <Field
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
              <div className="flex justify-end">
                <SaveButton disabled={savingProfile}>
                  <Save className="h-4 w-4" />
                  {savingProfile ? "Saving..." : "Save changes"}
                </SaveButton>
              </div>
            </form>
          </Section>

          {/* ---------- Password ---------- */}
          <Section
            icon={Lock}
            title="Password"
            description="Change your account password."
          >
            <form onSubmit={handlePasswordSave} className="flex flex-col gap-4">
              <PasswordField
                label="Current password"
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                show={showPassword}
                onToggle={() => setShowPassword((s) => !s)}
              />
              <PasswordField
                label="New password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                show={showPassword}
                onToggle={() => setShowPassword((s) => !s)}
              />
              <PasswordField
                label="Confirm new password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                show={showPassword}
                onToggle={() => setShowPassword((s) => !s)}
              />
              <div className="flex justify-end">
                <SaveButton disabled={savingPassword}>
                  <Save className="h-4 w-4" />
                  {savingPassword ? "Updating..." : "Update password"}
                </SaveButton>
              </div>
            </form>
          </Section>

          {/* ---------- Notifications ---------- */}
          <Section
            icon={Bell}
            title="Notifications"
            description="Choose what you want to be notified about."
          >
            <div className="flex flex-col gap-3">
              <Toggle
                label="Email alerts"
                description="Receive an email when you hit 80% or 100% of a budget."
                checked={emailAlerts}
                onChange={handleEmailAlertsChange}
              />
              <Toggle
                label="In-app budget alerts"
                description="Show a toast notification when you're near a limit."
                checked={budgetAlerts}
                onChange={handleBudgetAlertsChange}
              />
            </div>
          </Section>

          {/* ---------- Danger Zone ---------- */}
          <Section
            icon={Trash2}
            title="Danger Zone"
            description="Permanently delete your account and all data."
            danger
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-ink-500">
                This action cannot be undone.
              </p>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="flex items-center justify-center gap-2 rounded-2xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                {deleting ? "Deleting..." : "Delete account"}
              </button>
            </div>
          </Section>
        </div>
      </main>

      {/* Notifications panel */}
      <NotificationsPanel
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
      />
    </div>
  );
}

/* ---------- Sub-components ---------- */

function Section({
  icon: Icon,
  title,
  description,
  children,
  danger = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <section
      className={`rounded-3xl bg-white p-5 shadow-card sm:p-6 ${
        danger ? "border border-red-100" : ""
      }`}
    >
      <div className="mb-5 flex items-start gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
            danger ? "bg-red-50 text-red-500" : "bg-primary-50 text-primary-500"
          }`}
        >
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <h2
            className={`text-sm font-semibold ${
              danger ? "text-red-600" : "text-ink-900"
            }`}
          >
            {title}
          </h2>
          <p className="mt-0.5 text-xs text-ink-500">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1.5 text-sm">
      <span className="font-medium text-ink-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-lavender-200 bg-white px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
      />
    </label>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  show,
  onToggle,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  show: boolean;
  onToggle: () => void;
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1.5 text-sm">
      <span className="font-medium text-ink-700">{label}</span>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder="••••••••"
          className="w-full rounded-2xl border border-lavender-200 bg-white px-4 py-3 pr-11 text-sm text-ink-900 placeholder:text-ink-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl text-ink-400 transition-colors hover:bg-lavender-50 hover:text-ink-700"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </label>
  );
}

function SaveButton({
  children,
  disabled,
}: {
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
    >
      {children}
    </button>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-lavender-100 p-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-ink-900">{label}</p>
        <p className="mt-0.5 text-xs text-ink-500">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-primary-500" : "bg-lavender-200"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
            checked ? "translate-x-[22px]" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}