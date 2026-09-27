import Link from "next/link";
import Logo from "../components/Logo";

export default function SignupPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#F1EFFB] via-white to-[#F1EFFB] px-6 py-12">
      {/* Decorative background blobs */}
      <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary-100/60 blur-3xl" />
      <div className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-gold-100/60 blur-3xl" />

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl bg-white p-8 shadow-pop sm:p-10">
        {/* Logo at the top */}
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

        <form className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="First name" type="text" placeholder="Marcos" />
            <Field label="Last name" type="text" placeholder="Kahn" />
          </div>
          <Field label="Email" type="email" placeholder="marcos@company.com" />
          <Field label="Password" type="password" placeholder="••••••••" />

          
          <button
            type="submit"
            className="mt-2 rounded-2xl bg-primary-500 py-3.5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-primary-600"
          >
            Create account
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

function Field({
  label,
  type,
  placeholder,
}: {
  label: string;
  type: string;
  placeholder: string;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-ink-700">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        className="rounded-2xl border border-lavender-200 bg-white px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
      />
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.24 1.3-1.7 3.8-5.5 3.8-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.15.8 3.9 1.5l2.65-2.55C16.8 3.4 14.6 2.4 12 2.4 6.9 2.4 2.7 6.6 2.7 11.7S6.9 21 12 21c6.9 0 8.3-6.5 7.65-9.8H12Z"
      />
    </svg>
  );
}