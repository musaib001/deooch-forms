import type { Metadata } from "next";
import Link from "next/link";
import { MarketingNav, MarketingFooter } from "@/components/marketing/MarketingNav";

export const metadata: Metadata = {
  title: "Support",
  description: "Get help with deoochform — your account, forms, billing, or the MCP connector.",
  alternates: { canonical: "/support" },
};

export default function SupportPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <MarketingNav />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-6 py-16 text-sm leading-relaxed text-muted-foreground [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-foreground [&_li]:mt-1.5 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
            Support
          </h1>
          <p className="mt-2">
            Stuck on something? Email us and we&rsquo;ll get back to you, usually within
            one business day.
          </p>

          <a
            href="mailto:help@deooch.com"
            className="mt-6 inline-flex h-10 items-center rounded-lg bg-brand px-5 text-sm font-semibold text-brand-foreground hover:bg-brand-hover"
          >
            Email help@deooch.com
          </a>

          <h2>MCP connector issues</h2>
          <p>
            Connection errors, sign-in problems, and tool errors from AI assistants are
            covered on the{" "}
            <Link href="/connect" className="font-semibold text-brand hover:text-brand-hover">
              MCP connectors page
            </Link>{" "}
            — check the error table and FAQ there first, it covers the common cases
            faster than an email round-trip.
          </p>

          <h2>Account & billing</h2>
          <p>
            Plan changes, invoices, and cancellations: email us from the address on your
            account and include your workspace name so we can find you quickly.
          </p>

          <h2>Data & privacy requests</h2>
          <p>
            To export or delete your data, see the{" "}
            <Link href="/privacy" className="font-semibold text-brand hover:text-brand-hover">
              Privacy Policy
            </Link>{" "}
            for what we hold and how to request deletion.
          </p>
        </article>
      </main>
      <MarketingFooter />
    </div>
  );
}
