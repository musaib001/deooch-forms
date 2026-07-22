import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  FileSpreadsheet,
  LayoutGrid,
  Link2,
  Plug,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { getSessionProfile } from "@/lib/auth/session";
import { SITE_URL } from "@/lib/site";
import {
  MarketingNav,
  MarketingFooter,
} from "@/components/marketing/MarketingNav";
import { HeroDemo } from "@/components/marketing/HeroDemo";

const CLIENTS = [
  "ChatGPT",
  "Claude",
  "Cursor",
  "Windsurf",
  "Any MCP client",
];

const FEATURES = [
  {
    icon: Sparkles,
    title: "Describe it, don't build it",
    description:
      "Say what you need in plain English. Fields, labels, and validation are chosen for you — then change anything by hand in the builder.",
    wide: true,
  },
  {
    icon: Plug,
    title: "Lives in your AI assistant",
    description:
      "Install once from the ChatGPT app directory. Six MCP tools let any assistant build forms and read responses, signed in as you.",
  },
  {
    icon: Link2,
    title: "One clean share link",
    description:
      "Every form gets a stable public URL that opens on any device. Respondents never need an account.",
  },
  {
    icon: LayoutGrid,
    title: "Responses in one table",
    description:
      "Search, star, and archive submissions in a workspace that stays tidy as it grows.",
  },
  {
    icon: FileSpreadsheet,
    title: "Export in one click",
    description:
      "Download the whole response set as Excel — one column per field, no cleanup needed.",
  },
  {
    icon: ShieldCheck,
    title: "Your data stays yours",
    description:
      "Connections are scoped to your workspace and act only as you. Revoke any of them the moment you want it gone.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Ask",
    body: "Tell ChatGPT or Claude what you need — or start from a template and drag the fields yourself.",
  },
  {
    n: "02",
    title: "Share",
    body: "Publish and send one link. It opens on every device and needs no sign-in to answer.",
  },
  {
    n: "03",
    title: "Collect",
    body: "Watch responses land in a searchable table, then export the whole set to Excel.",
  },
];

const TEMPLATES = [
  { slug: "customer-feedback", name: "Customer Feedback Survey" },
  { slug: "contact-us", name: "Contact Us" },
  { slug: "job-application", name: "Job Application" },
  { slug: "event-registration", name: "Event Registration" },
  { slug: "appointment-request", name: "Appointment Request" },
  { slug: "rsvp", name: "RSVP" },
];

const SOFTWARE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "deoochform",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: SITE_URL,
  description:
    "AI-native form builder with an MCP server. Ask ChatGPT, Claude, or any MCP client for a form in plain English — it is built and published instantly, collects responses in one place, and exports to Excel.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Free to start, no credit card required.",
  },
};

export default async function Home() {
  const profile = await getSessionProfile();
  if (profile) redirect("/dashboard");

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SOFTWARE_JSON_LD) }}
      />
      <MarketingNav tone="ink" />

      <main className="flex-1">
        {/* Hero — the dark band. The demo carries the pitch; the copy just
            names what you're watching. */}
        <section className="relative isolate overflow-hidden bg-ink">
          <div className="ink-grid absolute inset-0" aria-hidden />
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-[560px]"
            style={{
              background:
                "radial-gradient(58% 50% at 55% 0%, color-mix(in oklab, var(--brand) 32%, transparent), transparent 72%)",
            }}
          />
          <div
            aria-hidden
            className="absolute -left-40 bottom-0 h-[420px] w-[420px]"
            style={{
              background:
                "radial-gradient(closest-side, color-mix(in oklab, var(--logo-to) 26%, transparent), transparent)",
            }}
          />

          <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 pb-20 pt-16 lg:grid-cols-[1.02fr_1fr] lg:gap-12 lg:pb-24 lg:pt-24">
            <div>
              <Link
                href="/connect"
                className="inline-flex items-center gap-2 rounded-full border border-ink-border bg-ink-raised/70 py-1.5 pl-2 pr-3.5 text-xs font-semibold text-ink-foreground transition-colors duration-100 ease-out hover:border-ink-border-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] uppercase tracking-wide text-brand-foreground">
                  New
                </span>
                Live in the ChatGPT app directory
                <ArrowRight aria-hidden className="h-3.5 w-3.5 text-ink-muted" />
              </Link>

              <h1 className="mt-6 max-w-xl text-4xl font-extrabold leading-[1.05] tracking-tight text-ink-foreground sm:text-6xl">
                Your AI already knows how to build forms.
              </h1>

              <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-muted">
                Deooch Forms is an MCP server for ChatGPT, Claude, and every
                assistant that speaks the protocol. Ask for a form in plain
                English — it&apos;s built, published, and collecting answers
                before you&apos;ve finished the sentence.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/signup" className="btn btn-brand group">
                  Start free
                  <ArrowRight
                    aria-hidden
                    className="h-4 w-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5"
                  />
                </Link>
                <Link href="#how" className="btn btn-ink">
                  See how it works
                </Link>
              </div>

              <p className="mt-5 text-sm text-ink-muted">
                Free forever plan · No credit card · Set up in under a minute
              </p>
            </div>

            <div className="flex justify-center lg:justify-end">
              <HeroDemo />
            </div>
          </div>

          {/* Client strip closes the band. */}
          <div className="relative border-t border-ink-border">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-6 py-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-ink-muted">
                Works with
              </span>
              {CLIENTS.map((client) => (
                <span
                  key={client}
                  className="text-sm font-semibold text-ink-foreground/80"
                >
                  {client}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* MCP spotlight — the real screenshot is the proof, so it keeps its
            own full-bleed band. */}
        <section className="border-b border-border bg-card">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-subtle px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand">
                One-click install
              </span>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground">
                Search &ldquo;deooch&rdquo;. Install. Start asking.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Find us in ChatGPT&apos;s app directory and install in one
                click — then{" "}
                <span className="font-semibold text-foreground">
                  @deoochform
                </span>{" "}
                whatever you need. It speaks the Model Context Protocol, so any
                MCP-compatible assistant works the same way.
              </p>
              <ul className="mt-6 flex flex-col gap-3">
                {[
                  "One-click install from the ChatGPT app directory",
                  "Six tools: create, update, and read forms and submissions",
                  "Signs in through your browser — no keys to store",
                  "Revoke any connection instantly",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-foreground"
                  >
                    <span
                      aria-hidden
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/connect" className="btn btn-sm btn-brand group mt-8">
                Set up a connector
                <ArrowRight
                  aria-hidden
                  className="h-4 w-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5"
                />
              </Link>
            </div>

            <Image
              src="/chatgpt/directory-listing.jpg"
              alt="The deoochform listing in the ChatGPT app directory, with an Install plugin button and example prompts"
              width={1200}
              height={989}
              sizes="(max-width: 1024px) 100vw, 560px"
              className="w-full rounded-xl border border-border shadow-lg"
            />
          </div>
        </section>

        {/* Features — bento, so the lead feature isn't just one card of six. */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Everything you need to collect answers
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              From the first field to the final export — without the busywork in
              between.
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, description, wide }) => (
              <div
                key={title}
                className={`rounded-2xl border border-border bg-card p-6 transition-[transform,box-shadow,border-color] duration-150 ease-out hover:-translate-y-0.5 hover:border-input hover:shadow-lg ${
                  wide ? "lg:col-span-2 lg:p-8" : ""
                }`}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-subtle text-brand">
                  <Icon aria-hidden className="h-5 w-5" />
                </span>
                <h3
                  className={`mt-4 font-bold text-foreground ${
                    wide ? "text-xl" : "text-base"
                  }`}
                >
                  {title}
                </h3>
                <p
                  className={`mt-1.5 leading-relaxed text-muted-foreground ${
                    wide ? "max-w-md text-base" : "text-sm"
                  }`}
                >
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="scroll-mt-16 border-y border-border bg-card">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Live in three steps
            </h2>
            <div className="relative mt-12 grid gap-10 sm:grid-cols-3">
              {/* Connector rail. Static — animating it on scroll would move
                  content the reader is already reading. */}
              <span
                aria-hidden
                className="absolute left-0 right-0 top-5 hidden h-px bg-gradient-to-r from-brand/50 via-border to-transparent sm:block"
              />
              {STEPS.map(({ n, title, body }) => (
                <div key={n} className="relative">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background font-mono text-xs font-bold tabular-nums text-brand">
                    {n}
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-foreground">
                    {title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Templates */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Or start from a template
              </h2>
              <p className="mt-3 text-base text-muted-foreground">
                Ready-made forms you can publish as-is, or hand to your
                assistant and reshape in a sentence.
              </p>
            </div>
            <Link
              href="/templates"
              className="group inline-flex shrink-0 items-center gap-1.5 rounded-md text-sm font-semibold text-brand transition-colors duration-100 ease-out hover:text-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Browse all templates
              <ArrowRight
                aria-hidden
                className="h-4 w-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5"
              />
            </Link>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TEMPLATES.map(({ slug, name }) => (
              <Link
                key={slug}
                href={`/templates/${slug}`}
                className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-5 py-4 text-sm font-semibold text-foreground transition-[transform,box-shadow,border-color] duration-150 ease-out hover:-translate-y-0.5 hover:border-input hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {name}
                <ArrowRight
                  aria-hidden
                  className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-150 ease-out group-hover:translate-x-0.5"
                />
              </Link>
            ))}
          </div>
        </section>

        {/* Closing CTA — mirrors the hero band so the page bookends. */}
        <section className="relative isolate overflow-hidden bg-ink">
          <div className="ink-grid absolute inset-0" aria-hidden />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(50% 70% at 50% 100%, color-mix(in oklab, var(--brand) 30%, transparent), transparent 70%)",
            }}
          />
          <div className="relative mx-auto max-w-6xl px-6 py-24 text-center">
            <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight text-ink-foreground sm:text-4xl">
              Stop building forms. Start reading answers.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-ink-muted">
              Free to start, no card required. Upgrade only when you outgrow it.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/signup" className="btn btn-brand group">
                Start free
                <ArrowRight
                  aria-hidden
                  className="h-4 w-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5"
                />
              </Link>
              <Link href="/pricing" className="btn btn-ink">
                See pricing
              </Link>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
