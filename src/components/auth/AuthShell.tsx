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
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1.1fr_1fr]">
      {/* Brand panel */}
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
      <main className="flex flex-col items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-sm">
          <Link
            href="/"
            className="mb-8 flex items-center justify-center gap-2 lg:hidden"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-sm font-bold text-brand-foreground">
              d
            </span>
            <span className="text-base font-bold tracking-tight text-foreground">
              deoochform
            </span>
          </Link>
          {children}
        </div>
      </main>
    </div>
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
