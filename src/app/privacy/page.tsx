import type { Metadata } from "next";
import Link from "next/link";
import { MarketingNav, MarketingFooter } from "@/components/marketing/MarketingNav";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What deoochform collects, why, and how to get it deleted.",
  alternates: { canonical: "/privacy" },
};

const UPDATED = "20 July 2026";

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <MarketingNav />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-6 py-16 text-sm leading-relaxed text-muted-foreground [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-foreground [&_li]:mt-1.5 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
            Privacy Policy
          </h1>
          <p className="mt-2 text-muted-foreground">Last updated {UPDATED}</p>

          <p>
            deoochform (&ldquo;we&rdquo;) runs the form builder at{" "}
            <Link href="/" className="font-semibold text-brand hover:text-brand-hover">
              forms.deooch.com
            </Link>{" "}
            and the MCP server at <code>forms.deooch.com/api/mcp</code>. This policy
            covers both.
          </p>

          <h2>What we collect</h2>
          <ul>
            <li>
              <strong className="text-foreground">Account data</strong> — your email
              address, name, workspace role, and plan. You give us this when you sign
              up.
            </li>
            <li>
              <strong className="text-foreground">Content you create</strong> — form
              titles, descriptions, fields, and version history.
            </li>
            <li>
              <strong className="text-foreground">Form responses</strong> — whatever
              respondents type into your public forms. We are a processor for this
              data; you are the controller and decide what to ask for.
            </li>
            <li>
              <strong className="text-foreground">Usage analytics</strong> — aggregate,
              cookieless page metrics from Vercel Analytics. No cross-site tracking, no
              advertising identifiers.
            </li>
          </ul>
          <p>
            We do not sell personal data, and we do not use your forms or responses to
            train AI models.
          </p>

          <h2>MCP and AI assistants</h2>
          <p>
            When you connect an AI assistant (Claude, ChatGPT, or any MCP client), it
            authenticates over OAuth and acts on your behalf using a scoped access
            token. It can read and write only the forms and submissions your own
            account can already reach. You can revoke the connection at any time from
            your client&rsquo;s connector settings, which immediately invalidates the
            token.
          </p>
          <p>
            Data the assistant retrieves is handled under that assistant vendor&rsquo;s
            own privacy policy once it leaves our server. We never send your data to a
            model provider ourselves.
          </p>

          <h2>Who we share it with</h2>
          <p>
            Only the subprocessors we need to run the service:{" "}
            <strong className="text-foreground">Supabase</strong> (database and
            authentication), <strong className="text-foreground">Vercel</strong>{" "}
            (hosting and analytics), and{" "}
            <strong className="text-foreground">Resend</strong> (notification emails).
            We also disclose data when the law requires it.
          </p>

          <h2>How long we keep it</h2>
          <p>
            Forms and submissions live until you delete them. Deleted forms are
            soft-deleted first and purged within 30 days. Closing your account removes
            your account data and all associated forms and submissions within 30 days,
            except where we must retain records to meet a legal obligation.
          </p>

          <h2>Security</h2>
          <p>
            Traffic is encrypted with TLS and data is encrypted at rest. Access is
            scoped per workspace and enforced at the database layer, so members of one
            workspace cannot read another&rsquo;s data. No system is perfectly secure,
            but we treat a breach affecting your data as something you hear about from
            us promptly.
          </p>

          <h2>Your rights</h2>
          <p>
            You can access, correct, export, or delete your data at any time — most of
            it directly from the dashboard, and the rest by emailing us. If you are in
            the EEA or UK, the GDPR rights of access, rectification, erasure,
            restriction, portability, and objection apply. If you are in California,
            the CCPA rights of know, delete, correct, and opt out of sale apply — and
            we do not sell data, so there is nothing to opt out of.
          </p>

          <h2>Children</h2>
          <p>
            deoochform is not directed at children under 13, and we do not knowingly
            collect their data.
          </p>

          <h2>Changes</h2>
          <p>
            If we change this policy materially, we will update the date above and
            email account holders before it takes effect.
          </p>

          <h2>Contact</h2>
          <p>
            Privacy questions, data requests, or anything else:{" "}
            <a
              href="mailto:help@deooch.com"
              className="font-semibold text-brand hover:text-brand-hover"
            >
              help@deooch.com
            </a>
            . We reply within one business day.
          </p>
        </article>
      </main>
      <MarketingFooter />
    </div>
  );
}
