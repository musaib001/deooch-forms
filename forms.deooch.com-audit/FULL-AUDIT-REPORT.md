# Full SEO Audit — forms.deooch.com

**Date:** 2026-07-18
**Business type:** SaaS (AI-native form builder)
**Audit target:** live production (post-fix state)

## Executive Summary

**SEO Health Score: 72 / 100** 🟢 (up from 43 baseline before this session's fixes)

The critical crawlability and on-page gaps are resolved and live in production:
real `robots.txt` + `sitemap.xml`, keyword-rich title, canonical, Open Graph +
auto-generated OG image, and Organization / WebSite / SoftwareApplication
structured data. Remaining work is content depth and E-E-A-T — the levers that
actually earn organic traffic — plus a few low-effort hardening items.

### Score by category

| Category | Score | Weight |
|---|---|---|
| Technical SEO | 82 | 22% |
| Content Quality | 55 | 23% |
| On-Page SEO | 80 | 20% |
| Schema / Structured Data | 85 | 10% |
| Performance (CWV) | 70* | 10% |
| AI Search Readiness | 60 | 10% |
| Images | 75 | 5% |

\* Unverified — no CrUX field data (site has near-zero traffic). Lab audit recommended once traffic exists.

### Top 5 issues remaining
1. **Thin content** — one marketing page; no blog, docs, use-case, or About pages (Medium)
2. **Weak E-E-A-T** — no About/company/author info or trust markers (Medium)
3. **No `llms.txt`** — `/llms.txt` still auth-redirects (307 → /login) (Medium, AI search)
4. **Partial security headers** — only HSTS present; missing X-Frame-Options, X-Content-Type-Options, Referrer-Policy (Low)
5. **Soft-404 on unknown routes** — truly unknown paths return the login shell via the proxy, not a 404 (Low)

### Top 5 quick wins (already done this session)
1. ✅ Real `robots.txt` with sitemap reference
2. ✅ Real `sitemap.xml` (5 public routes)
3. ✅ Keyword title + canonical + Open Graph + Twitter card
4. ✅ Auto-generated 1200×630 OG image (`/opengraph-image`, 200 image/png)
5. ✅ Organization + WebSite + SoftwareApplication JSON-LD

---

## Technical SEO — 82

**What works:** HTTPS + HSTS (`max-age=63072000`); valid `robots.txt` disallowing
`/api`, `/dashboard`, `/forms`, `/settings`, `/f/`; valid `sitemap.xml`; canonical
tag; mobile viewport; Next.js 16 on Vercel edge.

**Findings:**
- *Low* — Only HSTS is set. Add `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY` (or CSP `frame-ancestors`), and `Referrer-Policy: strict-origin-when-cross-origin` via `next.config` headers.
- *Low* — Unknown routes resolve to the login shell (auth proxy) with a redirect rather than a real 404. Low crawl-budget impact for a small site, but worth a proper `not-found`.

## Content Quality — 55

**What works:** Clear value proposition, benefit-driven feature copy, logical
section flow (hero → differentiator → features → how-it-works → CTA).

**Findings:**
- *Medium* — Single indexable content page. No blog/docs/use-case pages targeting queries like "AI form builder", "form builder for [use case]", "MCP forms". This is the primary organic-traffic gap.
- *Medium* — E-E-A-T signals absent: no About page, no company/team info, no customer logos or real testimonials, no `sameAs` social links on the Organization schema.

## On-Page SEO — 80

**What works:** Title `deoochform — AI-native form builder`; strong meta
description; single H1 on the marketing homepage; per-page title template
(`%s — deoochform`) with no double-suffixing; canonical + OG on every page.

**Findings:**
- *Low* — The login split-screen renders two H1s (marketing aside + "Welcome back"). Login isn't an index target, so low priority; demote the aside heading to a `<p>`/`<h2>` if convenient.

## Schema / Structured Data — 85

**What works:** `Organization` + `WebSite` (site-wide, in layout) and
`SoftwareApplication` with a free `Offer` (homepage). Valid JSON-LD, correct
`@id` graph linking.

**Findings:**
- *Low* — Add `sameAs` (social profiles) to Organization once profiles exist. Consider `BreadcrumbList` if a deeper page hierarchy is added.

## Performance (CWV) — 70 (unverified)

**What works:** Static prerendering where possible, preloaded fonts, minimal
third-party JS (only Vercel Analytics), Vercel edge delivery.

**Findings:**
- *Info* — No field data available (near-zero traffic). Run a Lighthouse lab pass, and revisit CrUX once real traffic accrues.

## AI Search Readiness — 60

**What works:** Rich structured data, clean semantic HTML, clear declarative copy
that's easy for LLMs to cite; OG metadata for link unfurling.

**Findings:**
- *Medium* — `/llms.txt` returns 307 → /login (not a real file). Add an `llms.txt` route listing key pages + value prop, and exclude it from the auth proxy.
- *Medium* — Thin content limits citable passages; the content-depth work above doubles as AI-search improvement.

## Images — 75

**What works:** OG share image now present; SVG brand icons marked
`aria-hidden`; favicon (`.ico` + `.svg`) set.

**Findings:**
- *Low* — Few content images; nothing oversized. Add descriptive `alt` to any future screenshots/marketing imagery.

---

*Artifacts: `ACTION-PLAN.md`, `audit-data.json`. Screenshots skipped (no Playwright in this run).*
