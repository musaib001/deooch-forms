# Graph Report - deoochform  (2026-07-18)

## Corpus Check
- 117 files · ~171,221 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 493 nodes · 884 edges · 27 communities (20 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.69)
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
3. `createAdminClient()` - 19 edges
4. `compilerOptions` - 16 edges
5. `Field` - 15 edges
6. `quotaFor()` - 12 edges
7. `formatDate()` - 10 edges
8. `Cell()` - 9 edges
9. `isInputField()` - 9 edges
10. `Full SEO Audit — forms.deooch.com` - 9 edges

## Surprising Connections (you probably didn't know these)
- `EditFormPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/(portal)/forms/[formId]/page.tsx → src/lib/supabase/server.ts
- `ConnectPage()` --calls--> `getSessionProfile`  [EXTRACTED]
  src/app/connect/page.tsx → src/lib/auth/session.ts
- `Home()` --calls--> `getSessionProfile`  [EXTRACTED]
  src/app/page.tsx → src/lib/auth/session.ts
- `FormStudio()` --indirect_call--> `field()`  [INFERRED]
  src/components/builder/FormStudio.tsx → src/lib/forms/validation.test.ts
- `SubmissionsView()` --indirect_call--> `isInputField()`  [INFERRED]
  src/components/submissions/SubmissionsView.tsx → src/lib/forms/schema.ts

## Import Cycles
- None detected.

## Communities (27 total, 7 thin omitted)

### Community 0 - "createClient"
Cohesion: 0.10
Nodes (32): actionSchema, Params, POST(), DELETE(), GET(), Params, PATCH(), GET() (+24 more)

### Community 1 - "SubmissionsView.tsx"
Cohesion: 0.07
Nodes (21): FormSubmissionsPage(), asArray(), Cell(), FieldTypeIcon(), isChoice(), RespondentMeta, Submission, Tag() (+13 more)

### Community 2 - "EmailAuthForm.tsx"
Cohesion: 0.10
Nodes (9): AuthShell(), FEATURES, EmailAuthForm(), Mode, GoogleButton(), PasswordField(), BrandMark(), NavItem (+1 more)

### Community 3 - "server.ts"
Cohesion: 0.10
Nodes (27): GET(), Params, ALLOWED(), Params, POST(), safeExt(), handle(), GET() (+19 more)

### Community 4 - "schema.ts"
Cohesion: 0.08
Nodes (26): Device, DEVICE_WIDTHS, Doc, ExistingForm, FormStudio(), SaveState, Doc, Inspector() (+18 more)

### Community 5 - "devDependencies"
Cohesion: 0.07
Nodes (28): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+20 more)

### Community 6 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 7 - "dependencies"
Cohesion: 0.06
Nodes (31): @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities, exceljs, lucide-react, @modelcontextprotocol/sdk, nanoid, next (+23 more)

### Community 8 - "page.tsx"
Cohesion: 0.05
Nodes (27): clientMeta(), closeFormsIfFreeAccountAtCap(), Params, POST(), submitSchema, ConnectPage(), ERRORS, FAQS (+19 more)

### Community 9 - "PublicFormRenderer.tsx"
Cohesion: 0.09
Nodes (37): Format, FORMATS, GET(), Params, AddressGroup(), CheckboxGroup(), FieldControl(), PublicFormRenderer() (+29 more)

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
Cohesion: 0.15
Nodes (6): EditFormPage(), FAQS, metadata, Container(), Token, TokensTable()

### Community 25 - "page.tsx"
Cohesion: 0.16
Nodes (11): EMPTY_COPY, FormRecord, FormListItem, FormRow(), STATUS_STYLES, isViewId(), ViewId, VIEWS (+3 more)

### Community 26 - "Action Plan — forms.deooch.com"
Cohesion: 0.33
Nodes (5): Action Plan — forms.deooch.com, Phase 1 — Critical Fixes (Week 1) ✅ DONE this session, Phase 2 — High-Impact Improvements (Weeks 2–3), Phase 3 — Content & Authority (Month 2) — the real traffic lever, Phase 4 — Monitoring & Iteration (Ongoing)

## Knowledge Gaps
- **144 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+139 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSessionProfile` connect `createClient` to `page.tsx`, `PublicFormRenderer.tsx`, `server.ts`, `page.tsx`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **Why does `createClient()` connect `createClient` to `SubmissionsView.tsx`, `server.ts`, `PublicFormRenderer.tsx`, `page.tsx`, `page.tsx`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Why does `Field` connect `PublicFormRenderer.tsx` to `page.tsx`, `SubmissionsView.tsx`, `schema.ts`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _144 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `createClient` be split into smaller, more focused modules?**
  _Cohesion score 0.0963265306122449 - nodes in this community are weakly interconnected._
- **Should `SubmissionsView.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0730804810360777 - nodes in this community are weakly interconnected._
- **Should `EmailAuthForm.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09747899159663866 - nodes in this community are weakly interconnected._