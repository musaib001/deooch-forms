# Graph Report - deoochform  (2026-07-18)

## Corpus Check
- 118 files · ~171,569 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 499 nodes · 901 edges · 27 communities (20 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.7)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0e90d1c8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- createClient
- SubmissionsView.tsx
- EmailAuthForm.tsx
- server.ts
- schema.ts
- devDependencies
- compilerOptions
- dependencies
- page.tsx
- PublicFormRenderer.tsx
- MembersTable.tsx
- proxy.ts
- Full SEO Audit — forms.deooch.com
- README.md
- AGENTS.md
- CLAUDE.md
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- page.tsx
- route.ts
- page.tsx
- Action Plan — forms.deooch.com

## God Nodes (most connected - your core abstractions)
1. `getSessionProfile` - 39 edges
2. `createClient()` - 38 edges
3. `createAdminClient()` - 20 edges
4. `Field` - 16 edges
5. `compilerOptions` - 16 edges
6. `quotaFor()` - 12 edges
7. `isInputField()` - 11 edges
8. `formatDate()` - 10 edges
9. `Cell()` - 9 edges
10. `Full SEO Audit — forms.deooch.com` - 9 edges

## Surprising Connections (you probably didn't know these)
- `EditFormPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/(portal)/forms/[formId]/page.tsx → src/lib/supabase/server.ts
- `PortalLayout()` --calls--> `getSessionProfile`  [EXTRACTED]
  src/app/(portal)/layout.tsx → src/lib/auth/session.ts
- `MembersPage()` --calls--> `getSessionProfile`  [EXTRACTED]
  src/app/(portal)/settings/members/page.tsx → src/lib/auth/session.ts
- `ConnectPage()` --calls--> `getSessionProfile`  [EXTRACTED]
  src/app/connect/page.tsx → src/lib/auth/session.ts
- `Home()` --calls--> `getSessionProfile`  [EXTRACTED]
  src/app/page.tsx → src/lib/auth/session.ts

## Import Cycles
- None detected.

## Communities (27 total, 7 thin omitted)

### Community 0 - "createClient"
Cohesion: 0.10
Nodes (36): Format, FORMATS, GET(), Params, actionSchema, Params, POST(), DELETE() (+28 more)

### Community 1 - "SubmissionsView.tsx"
Cohesion: 0.05
Nodes (26): EMPTY_COPY, FormRecord, FormSubmissionsPage(), FormListItem, FormRow(), STATUS_STYLES, isViewId(), ViewId (+18 more)

### Community 2 - "EmailAuthForm.tsx"
Cohesion: 0.11
Nodes (7): AuthShell(), FEATURES, EmailAuthForm(), Mode, GoogleButton(), PasswordField(), createClient()

### Community 3 - "server.ts"
Cohesion: 0.10
Nodes (27): GET(), Params, ALLOWED(), Params, POST(), safeExt(), handle(), GET() (+19 more)

### Community 4 - "schema.ts"
Cohesion: 0.07
Nodes (28): Device, DEVICE_WIDTHS, Doc, ExistingForm, FormStudio(), SaveState, Doc, Inspector() (+20 more)

### Community 5 - "devDependencies"
Cohesion: 0.07
Nodes (28): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+20 more)

### Community 6 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 7 - "dependencies"
Cohesion: 0.06
Nodes (33): @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities, exceljs, lucide-react, @modelcontextprotocol/sdk, nanoid, next (+25 more)

### Community 8 - "page.tsx"
Cohesion: 0.06
Nodes (21): ConnectPage(), ERRORS, FAQS, metadata, TOOLS, geistMono, jakarta, JSON_LD (+13 more)

### Community 9 - "PublicFormRenderer.tsx"
Cohesion: 0.10
Nodes (30): AddressGroup(), CheckboxGroup(), FieldControl(), Value, asArray(), Cell(), isChoice(), RespondentMeta (+22 more)

### Community 11 - "proxy.ts"
Cohesion: 0.53
Nodes (5): config, isPublicPath(), proxy(), PUBLIC_PATHS, PUBLIC_PREFIXES

### Community 12 - "Full SEO Audit — forms.deooch.com"
Cohesion: 0.15
Nodes (12): AI Search Readiness — 60, Content Quality — 55, Executive Summary, Full SEO Audit — forms.deooch.com, Images — 75, On-Page SEO — 80, Performance (CWV) — 70 (unverified), Schema / Structured Data — 85 (+4 more)

### Community 13 - "README.md"
Cohesion: 0.40
Nodes (4): Architecture, Deploy on Vercel, Getting Started, Learn More

### Community 21 - "page.tsx"
Cohesion: 0.11
Nodes (7): EditFormPage(), MembersPage(), FAQS, metadata, Container(), Item, MembersTable()

### Community 25 - "page.tsx"
Cohesion: 0.17
Nodes (17): clientMeta(), closeFormsIfFreeAccountAtCap(), Params, POST(), submitSchema, Admin, escapeHtml(), notifyOwnerOfSubmission() (+9 more)

### Community 26 - "Action Plan — forms.deooch.com"
Cohesion: 0.33
Nodes (5): Action Plan — forms.deooch.com, Phase 1 — Critical Fixes (Week 1) ✅ DONE this session, Phase 2 — High-Impact Improvements (Weeks 2–3), Phase 3 — Content & Authority (Month 2) — the real traffic lever, Phase 4 — Monitoring & Iteration (Ongoing)

## Knowledge Gaps
- **145 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+140 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSessionProfile` connect `createClient` to `page.tsx`, `SubmissionsView.tsx`, `server.ts`, `page.tsx`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Why does `createClient()` connect `createClient` to `SubmissionsView.tsx`, `server.ts`, `page.tsx`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Why does `Field` connect `PublicFormRenderer.tsx` to `page.tsx`, `schema.ts`, `SubmissionsView.tsx`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _145 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `createClient` be split into smaller, more focused modules?**
  _Cohesion score 0.10040816326530612 - nodes in this community are weakly interconnected._
- **Should `SubmissionsView.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05245901639344262 - nodes in this community are weakly interconnected._
- **Should `EmailAuthForm.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10752688172043011 - nodes in this community are weakly interconnected._