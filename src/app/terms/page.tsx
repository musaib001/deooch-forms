import type { Metadata } from "next";
import Link from "next/link";
import { MarketingNav, MarketingFooter } from "@/components/marketing/MarketingNav";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The rules for using deoochform.",
  alternates: { canonical: "/terms" },
};

const UPDATED = "20 July 2026";

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <MarketingNav />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-6 py-16 text-sm leading-relaxed text-muted-foreground [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-foreground [&_li]:mt-1.5 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
            Terms of Service
          </h1>
          <p className="mt-2 text-muted-foreground">Last updated {UPDATED}</p>

          <p>
            These terms govern your use of deoochform, including the web app and the
            MCP server. By creating an account or connecting an AI assistant, you agree
            to them.
          </p>

          <h2>Your account</h2>
          <p>
            You must be 13 or older and provide accurate information. You are
            responsible for activity under your account and for keeping your
            credentials and MCP access tokens confidential. Tell us promptly if you
            suspect unauthorized access.
          </p>

          <h2>Your content</h2>
          <p>
            You own your forms and the responses you collect. You grant us only the
            licence needed to host, process, and display that content so the service
            works. You are responsible for what you collect — including having a lawful
            basis for it, telling respondents what you are doing with their data, and
            complying with privacy law where your respondents live.
          </p>

          <h2>Acceptable use</h2>
          <p>You agree not to use deoochform to:</p>
          <ul>
            <li>
              collect payment card numbers, government ID numbers, health records, or
              other data we are not built to safeguard;
            </li>
            <li>
              run phishing, impersonate a person or organisation, or solicit
              credentials;
            </li>
            <li>
              send spam, distribute malware, or publish unlawful, harassing, or
              infringing content;
            </li>
            <li>
              probe, scrape, overload, or attempt to bypass authentication, quotas, or
              rate limits.
            </li>
          </ul>
          <p>
            We may suspend or remove content or accounts that breach this section,
            usually with notice, immediately where the harm is ongoing.
          </p>

          <h2>Plans, quotas, and billing</h2>
          <p>
            Free accounts are capped at 2 forms and 50 total submissions. Paid plans
            raise those limits — see{" "}
            <Link href="/pricing" className="font-semibold text-brand hover:text-brand-hover">
              pricing
            </Link>
            . Paid plans are billed in advance in USD and renew until cancelled.
            Cancelling stops the next renewal and keeps your access until the end of
            the paid period. Fees already paid are non-refundable except where the law
            requires otherwise.
          </p>

          <h2>MCP connections</h2>
          <p>
            An AI assistant you connect acts with your permissions. You are responsible
            for what it does with your account, so review actions before you approve
            them and disconnect clients you no longer use. Assistants can misread
            instructions; treat the tools as you would any automation with write access.
          </p>

          <h2>Availability</h2>
          <p>
            We aim to keep the service up but do not promise uninterrupted access. We
            may change or discontinue features. If we discontinue the service entirely,
            we will give you at least 30 days&rsquo; notice and a way to export your
            data.
          </p>

          <h2>Warranties and liability</h2>
          <p>
            The service is provided &ldquo;as is&rdquo;, without warranties of any kind
            to the extent the law allows. We are not liable for indirect, incidental, or
            consequential damages, or for lost profits or lost data. Our total liability
            for any claim is capped at the greater of the fees you paid us in the twelve
            months before the claim, or USD 100. Nothing here limits liability that
            cannot lawfully be limited.
          </p>

          <h2>Termination</h2>
          <p>
            You can close your account at any time. We may terminate for material breach
            of these terms. On termination your data is deleted as described in the{" "}
            <Link href="/privacy" className="font-semibold text-brand hover:text-brand-hover">
              Privacy Policy
            </Link>
            , so export anything you want to keep first.
          </p>

          <h2>Changes</h2>
          <p>
            We may update these terms. Material changes are emailed to account holders
            before taking effect; continuing to use the service after that means you
            accept them.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about these terms:{" "}
            <a
              href="mailto:help@deooch.com"
              className="font-semibold text-brand hover:text-brand-hover"
            >
              help@deooch.com
            </a>
            .
          </p>
        </article>
      </main>
      <MarketingFooter />
    </div>
  );
}
