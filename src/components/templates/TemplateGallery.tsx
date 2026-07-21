"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Eye, Search } from "lucide-react";
import { TEMPLATES, TEMPLATE_CATEGORIES } from "@/lib/forms/templates";
import { TemplateThumb } from "./TemplateThumb";
import { inputClass } from "@/lib/ui";

export function TemplateGallery() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TEMPLATES.filter(
      (t) =>
        (!category || t.category === category) &&
        (!q ||
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q))
    );
  }, [query, category]);

  return (
    <div className="flex flex-col gap-8">
      <div className="relative mx-auto w-full max-w-xl">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search templates…"
          aria-label="Search templates"
          className={inputClass + " h-12 pl-10"}
        />
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        <Chip active={category === null} onClick={() => setCategory(null)}>
          All
        </Chip>
        {TEMPLATE_CATEGORIES.map((c) => (
          <Chip key={c} active={category === c} onClick={() => setCategory(c)}>
            {c}
          </Chip>
        ))}
      </div>

      {results.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          No templates match “{query}”. Try a broader search — or{" "}
          <Link href="/forms/new" className="font-semibold text-brand hover:text-brand-hover">
            start from a blank form
          </Link>
          .
        </p>
      ) : (
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((t) => (
            <li key={t.slug} className="flex flex-col gap-3">
              <Link
                href={`/templates/${t.slug}`}
                className="group relative block h-64 overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-[border-color,box-shadow] hover:border-brand/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <TemplateThumb title={t.name} fields={t.fields} />
                {/* Fades the clipped bottom edge so it reads as "there's more"
                    rather than a cut-off render. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card to-transparent"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-foreground/5 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background shadow-lg">
                    <Eye className="h-4 w-4" aria-hidden />
                    Preview
                  </span>
                </span>
              </Link>

              <div className="flex flex-1 flex-col gap-2">
                <Link
                  href={`/templates/${t.slug}`}
                  className="text-base font-bold tracking-tight text-foreground hover:text-brand"
                >
                  {t.name}
                </Link>
                <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                  {t.description}
                </p>
                <span className="w-fit rounded-md bg-brand-subtle px-2 py-1 text-xs font-semibold text-brand">
                  {t.category}
                </span>
              </div>

              <Link
                href={`/forms/new?template=${t.slug}`}
                className="flex h-10 items-center justify-center rounded-lg border border-brand text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-brand-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Use template
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={
        "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
        (active
          ? "border-brand bg-brand text-brand-foreground"
          : "border-border text-muted-foreground hover:border-brand/40 hover:text-foreground")
      }
    >
      {children}
    </button>
  );
}
