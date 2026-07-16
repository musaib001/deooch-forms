import Link from "next/link";

const FEATURES = [
  {
    title: "Build with AI or by hand",
    description:
      "Describe a form to Claude or GPT and it's created instantly — or build it yourself.",
    icon: SparkleIcon,
  },
  {
    title: "Share one clean link",
    description:
      "Every form gets a stable public link respondents can fill out — no account required.",
    icon: LinkIcon,
  },
  {
    title: "Export responses anytime",
    description:
      "Browse submissions in a searchable table or download the full set as Excel.",
    icon: TableIcon,
  },
];

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col lg:grid lg:grid-cols-[1.1fr_1fr]">
      {/* Mobile brand header (compact, dark) */}
      <div className="bg-foreground px-6 pb-8 pt-10 lg:hidden">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-sm font-bold text-brand-foreground">
            d
          </span>
          <span className="text-base font-bold tracking-tight text-white">
            deoochform
          </span>
        </Link>
        <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-brand">
          AI-native form builder
        </p>
        <h1 className="mt-2 text-3xl font-extrabold leading-[1.1] tracking-tight text-white">
          Forms that build themselves.
        </h1>
        <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
          {FEATURES.map(({ title }) => (
            <li key={title} className="flex items-center gap-1.5 text-sm text-white/70">
              <span className="text-brand">
                <CheckIcon />
              </span>
              {title}
            </li>
          ))}
        </ul>
      </div>

      {/* Desktop brand panel */}
      <aside className="relative hidden flex-col justify-between bg-foreground px-10 py-10 lg:flex xl:px-16">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-base font-bold text-brand-foreground">
            d
          </span>
          <span className="text-lg font-bold tracking-tight text-white">
            deoochform
          </span>
        </Link>

        <div className="max-w-md">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand">
            AI-native form builder
          </p>
          <h1 className="mt-4 text-4xl font-extrabold leading-[1.1] tracking-tight text-white">
            Forms that build themselves.
          </h1>
          <ul className="mt-10 flex flex-col gap-6">
            {FEATURES.map(({ title, description, icon: Icon }) => (
              <li key={title} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-brand">
                  <Icon />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-white/60">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-white/40">
          © {new Date().getUTCFullYear()} deoochform
        </p>
      </aside>

      {/* Form panel */}
      <main className="flex flex-1 flex-col items-center justify-center bg-background px-6 py-10 sm:py-12">
        <div className="w-full max-w-sm">{children}</div>
      </main>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9 17H7a5 5 0 0 1 0-10h2M15 7h2a5 5 0 1 1 0 10h-2M8 12h8" />
    </svg>
  );
}

function TableIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 10h18M9 10v10" />
    </svg>
  );
}
