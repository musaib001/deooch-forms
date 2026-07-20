# Action Plan — forms.deooch.com

## Phase 1 — Critical Fixes (Week 1) ✅ DONE this session
- [x] Real `robots.txt` (`src/app/robots.ts`)
- [x] Real `sitemap.xml` (`src/app/sitemap.ts`)
- [x] Exclude SEO routes from auth proxy (`src/proxy.ts`)
- [x] Keyword title + template, canonical, Open Graph, Twitter card (`src/app/layout.tsx`)
- [x] OG image (`src/app/opengraph-image.tsx`)
- [x] Organization + WebSite + SoftwareApplication JSON-LD

## Phase 2 — High-Impact Improvements (Weeks 2–3)
- [ ] Add `src/app/llms.txt/route.ts` (plain-text) and exclude `/llms.txt` from the proxy — AI-search win, ~15 min
- [ ] Add security headers via `next.config` `headers()`: `X-Content-Type-Options`, `X-Frame-Options`/CSP `frame-ancestors`, `Referrer-Policy`
- [ ] Add `sameAs` social links to Organization schema once profiles exist

## Phase 3 — Content & Authority (Month 2) — the real traffic lever
- [ ] About page (company/team) + trust markers (logos, testimonials) → E-E-A-T
- [ ] 2–3 use-case landing pages ("AI form builder", "form builder for [X]", "MCP forms")
- [ ] Optional: `/blog` or `/docs` for ongoing topical content
- [ ] Add new content pages to `sitemap.ts`

## Phase 4 — Monitoring & Iteration (Ongoing)
- [ ] Submit sitemap in Google Search Console; watch indexed-page count
- [ ] Track impressions/clicks/CTR per page in GSC
- [ ] Lighthouse lab pass now; revisit CrUX field CWV once traffic accrues

**North-star metric:** indexed public pages in GSC (currently ~5 → grows with Phase 3).
