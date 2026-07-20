"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { FormCard } from "./FormCard";
import type { FormListItem } from "./FormRow";
import type { ViewId } from "./views";

export type BoardStats = {
  total: number;
  published: number;
  drafts: number;
  responses: number;
};

export function FormsBoard({
  forms,
  view,
  stats,
}: {
  forms: FormListItem[];
  view: ViewId;
  stats: BoardStats;
}) {
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return forms;
    return forms.filter((f) => f.title.toLowerCase().includes(q));
  }, [forms, query]);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Total forms" value={stats.total} />
        <Stat label="Published" value={stats.published} accent />
        <Stat label="In draft" value={stats.drafts} />
        <Stat label="Total responses" value={stats.responses} />
      </div>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search forms by name…"
          aria-label="Search forms"
          className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-3 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground hover:border-brand/50 focus:border-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      {visible.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center text-sm text-muted-foreground">
          No forms match “{query}”.
        </p>
      ) : (
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}
        >
          {visible.map((form, i) => (
            <FormCard key={form.id} form={form} view={view} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-brand/40">
      <p
        className={
          "text-2xl font-bold tabular-nums tracking-tight " +
          (accent ? "text-brand" : "text-foreground")
        }
      >
        {value}
      </p>
      <p className="mt-0.5 text-xs font-medium text-muted-foreground">{label}</p>
    </div>
  );
}
