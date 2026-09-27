"use client";

import Link from "next/link";
import { useState } from "react";
import Logo from "../components/Logo";
import { useRouter } from "next/navigation";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const INITIAL_FORM: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
};

export default function SignupPage() {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter()

  /**
   * Single change handler — reads `name` off the input
   * and updates only that field in state.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Basic client-side validation
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.message || "Failed to create account.");
      }

      // Success — redirect or reset
      // router.push("/login");  // uncomment if you have router
      setForm(INITIAL_FORM);
      // alert("Account created successfully!");
      router.push('/dashboard')
    } catch (err) {
      console.error("Failed to register new user:", err);
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#F1EFFB] via-white to-[#F1EFFB] px-6 py-12">
      {/* Decorative blobs */}
      <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary-100/60 blur-3xl" />
      <div className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-gold-100/60 blur-3xl" />

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl bg-white p-8 shadow-pop sm:p-10">
        <div className="mb-8 flex justify-center">
          <Link href="/">
            <Logo />
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-ink-900 sm:text-[28px]">
          Create your account
        </h1>
        <p className="mt-2 mb-8 text-sm text-ink-500">
          Start tracking expenses and budgets in minutes.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              label="First name"
              name="firstName"
              type="text"
              placeholder="Marcos"
              value={form.firstName}
              onChange={handleChange}
            />
            <Field
              label="Last name"
              name="lastName"
              type="text"
              placeholder="Kahn"
              value={form.lastName}
              onChange={handleChange}
            />
          </div>

          <Field
            label="Email"
            name="email"
            type="email"
            placeholder="marcos@company.com"
            value={form.email}
            onChange={handleChange}
          />

          <Field
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
          />

          {error && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-2xl bg-primary-500 py-3.5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-ink-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary-500">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

/* ---------- Field ---------- */

function Field({
  label,
  name,
  type,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-ink-700">{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="rounded-2xl border border-lavender-200 bg-white px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
      />
    </label>
  );
}