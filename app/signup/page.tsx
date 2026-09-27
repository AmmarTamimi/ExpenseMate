import Link from "next/link";
import AuthLayout from "@/components/AuthLayout";

export default function SignupPage() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start tracking expenses and budgets in minutes."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary-500">
            Log in
          </Link>
        </>
      }
    >
      <form className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="First name" type="text" placeholder="Marcos" />
          <Field label="Last name" type="text" placeholder="Kahn" />
        </div>
        <Field label="Email" type="email" placeholder="marcos@company.com" />
        <Field label="Password" type="password" placeholder="••••••••" />

        <label className="flex items-start gap-2 text-xs text-ink-500">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-lavender-300 text-primary-500 focus:ring-primary-400"
          />
          I agree to the Terms of Service and Privacy Policy
        </label>

        <button
          type="submit"
          className="mt-2 rounded-2xl bg-primary-500 py-3.5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-primary-600"
        >
          Create account
        </button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-ink-400">
        <span className="h-px flex-1 bg-lavender-200" />
        or continue with
        <span className="h-px flex-1 bg-lavender-200" />
      </div>

      <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-lavender-200 bg-white py-3 text-sm font-medium text-ink-700 transition-colors hover:bg-lavender-50">
        <GoogleIcon />
        Google
      </button>
    </AuthLayout>
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
