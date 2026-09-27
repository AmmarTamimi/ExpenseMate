"use client";

import { useState } from "react";
import {
  User,
  Lock,
  Bell,
  Trash2,
  Save,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";

export default function SettingsPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);

  // Profile state (replace with real user later)
  const [name, setName] = useState("Marcos Kahn");
  const [email, setEmail] = useState("marcos@company.com");

  // Password state
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  // Notification preferences
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(true);

  const flash = (msg: string) => {
    setSaved(msg);
    setTimeout(() => setSaved(null), 2000);
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: call API to update profile
    flash("Profile updated");
  };

  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw !== confirmPw) {
      flash("Passwords do not match");
      return;
    }
    // TODO: call API to change password
    flash("Password changed");
    setCurrentPw("");
    setNewPw("");
    setConfirmPw("");
  };

  return (
    <div className="flex min-h-screen bg-[#F8F7FC]">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
        <TopBar onMenu={() => setMenuOpen(true)} />

        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-ink-900 sm:text-[28px]">
            Settings
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            Manage your account and preferences.
          </p>
        </div>

        {/* Success toast */}
        {saved && (
          <div className="mb-4 flex items-center gap-2 rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            <CheckCircle2 className="h-4 w-4" />
            {saved}
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
                <SaveButton>
                  <Save className="h-4 w-4" />
                  Save changes
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
                <SaveButton>
                  <Save className="h-4 w-4" />
                  Update password
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
                onChange={setEmailAlerts}
              />
              <Toggle
                label="In-app budget alerts"
                description="Show a toast notification when you're near a limit."
                checked={budgetAlerts}
                onChange={setBudgetAlerts}
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
                onClick={() => {
                  if (confirm("Are you sure? This will delete everything.")) {
                    // TODO: call API to delete account
                    flash("Account deletion requested");
                  }
                }}
                className="flex items-center justify-center gap-2 rounded-2xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                Delete account
              </button>
            </div>
          </Section>
        </div>
      </main>
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

function SaveButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="submit"
      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-primary-600 sm:w-auto"
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