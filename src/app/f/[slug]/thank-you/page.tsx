export default function ThankYouPage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl px-4 py-16">
      <div className="w-full rounded-2xl border border-border bg-card px-8 py-14 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-brand-subtle">
          <svg
            className="h-7 w-7 text-brand"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Thanks — your response was recorded.
        </h1>
        <p className="mt-2 text-[15px] text-muted-foreground">
          You can safely close this page.
        </p>
      </div>
    </div>
  );
}
