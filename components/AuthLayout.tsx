import Link from "next/link";
import Logo from "./Logo";
import DonutRing from "./DonutRing";

export default function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#F1EFFB]">
      {/* Form side */}
      <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-12 lg:w-1/2 lg:px-20">
        <div className="mx-auto w-full max-w-sm">
          <Link href="/" className="mb-10 inline-flex">
            <Logo />
          </Link>

          <h1 className="text-2xl font-bold text-ink-900 sm:text-[28px]">
            {title}
          </h1>
          <p className="mt-2 mb-8 text-sm text-ink-500">{subtitle}</p>

          {children}

          <p className="mt-8 text-center text-sm text-ink-500">{footer}</p>
        </div>
      </div>

      {/* Brand side */}
      <div className="relative hidden w-1/2 items-center justify-center overflow-hidden bg-lavender-100 lg:flex">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary-100" />
        <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-gold-100" />

        <div className="relative z-10 w-full max-w-sm rounded-3xl bg-white p-8 shadow-pop">
          <p className="mb-1 text-xs font-medium text-ink-400">Total balance</p>
          <div className="mb-6 flex items-center justify-between">
            <span className="text-2xl font-bold text-ink-900">550,20€</span>
            <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-500">
              +12.4%
            </span>
          </div>

          <div className="flex items-center gap-5">
            <DonutRing
              size={120}
              strokeWidth={14}
              segments={[
                { value: 467.86, color: "#3D4CEA" },
                { value: 82.34, color: "#F0A825" },
              ]}
            />
            <div className="flex flex-col gap-3 text-xs">
              <div>
                <p className="flex items-center gap-1.5 text-ink-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                  Requested
                </p>
                <p className="font-semibold text-ink-900">467,86€</p>
              </div>
              <div>
                <p className="flex items-center gap-1.5 text-ink-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
                  Unrequested
                </p>
                <p className="font-semibold text-ink-900">82,34€</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between rounded-2xl bg-lavender-50 px-4 py-3">
            <span className="text-xs font-medium text-ink-700">
              Berlin Congress
            </span>
            <span className="text-xs font-semibold text-primary-500">
              297,50€ / 850€
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
