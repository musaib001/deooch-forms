"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Field, FieldType } from "@/lib/forms/schema";
import { CHOICE_FIELD_TYPES, isInputField } from "@/lib/forms/schema";
import { formatDate, formatDateTime } from "@/lib/date";

type Submission = {
  id: string;
  answers: Record<string, string | string[]>;
  submitted_at: string;
};

// Categorical tag colors (not brand tokens — deterministic per value, like
// data-viz categories). Each has a light + dark pairing.
const TAG_COLORS = [
  "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
  "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
  "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  "bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300",
];

function tagColor(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) hash = (hash * 31 + value.charCodeAt(i)) | 0;
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length];
}

function asArray(value: string | string[] | undefined) {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

function isChoice(field: Field) {
  return CHOICE_FIELD_TYPES.includes(field.type);
}

function Cell({ field, value }: { field: Field; value: string | string[] | undefined }) {
  const values = asArray(value).filter((v) => v !== "");
  if (values.length === 0)
    return <span className="text-muted-foreground/50">—</span>;

  if (isChoice(field)) {
    return (
      <div className="flex flex-wrap gap-1">
        {values.map((v) => (
          <span
            key={v}
            className={
              "inline-flex rounded-md px-2 py-0.5 text-xs font-medium " +
              tagColor(v)
            }
          >
            {v}
          </span>
        ))}
      </div>
    );
  }

  return <span className="text-foreground">{values.join(", ")}</span>;
}

export function SubmissionsView({
  formId,
  fields,
  submissions,
}: {
  formId: string;
  fields: Field[];
  submissions: Submission[];
}) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [showFilters, setShowFilters] = useState(false);
  const [selected, setSelected] = useState<Submission | null>(null);

  const columns = useMemo(
    () => [...fields].filter(isInputField).sort((a, b) => a.order - b.order),
    [fields]
  );

  const choiceColumns = useMemo(
    () => columns.filter((f) => isChoice(f) && (f.options?.length ?? 0) > 0),
    [columns]
  );

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return submissions.filter((s) => {
      if (
        q &&
        !columns.some((f) =>
          asArray(s.answers[f.id]).join(" ").toLowerCase().includes(q)
        )
      )
        return false;
      for (const [fieldId, value] of Object.entries(filters)) {
        if (!value) continue;
        if (!asArray(s.answers[fieldId]).includes(value)) return false;
      }
      return true;
    });
  }, [query, filters, submissions, columns]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full max-w-xs">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search responses"
              className="w-full rounded-lg border border-input bg-card py-2 pl-9 pr-3 text-sm text-foreground outline-none transition-[border-color,box-shadow] duration-100 placeholder:text-muted-foreground/70 focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-ring/40"
            />
          </div>
          {choiceColumns.length > 0 && (
            <button
              onClick={() => setShowFilters((v) => !v)}
              aria-expanded={showFilters}
              className={
                "inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
                (activeFilterCount > 0
                  ? "border-brand bg-brand-subtle text-brand"
                  : "border-border bg-card text-foreground hover:bg-muted")
              }
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden
              >
                <path d="M3 4h18l-7 8v6l-4 2v-8L3 4Z" />
              </svg>
              Filter
              {activeFilterCount > 0 && (
                <span className="ml-0.5 rounded-full bg-brand px-1.5 text-xs font-semibold text-brand-foreground">
                  {activeFilterCount}
                </span>
              )}
            </button>
          )}
        </div>
        {submissions.length > 0 && (
          <a
            href={`/api/forms/${formId}/export`}
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground shadow-sm transition-[background-color,transform] duration-100 hover:bg-brand-hover active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 21h16" />
            </svg>
            Download Excel
          </a>
        )}
      </div>

      {showFilters && choiceColumns.length > 0 && (
        <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
          {choiceColumns.map((field) => (
            <label key={field.id} className="flex flex-col gap-1 text-xs">
              <span className="font-semibold text-muted-foreground">
                {field.label}
              </span>
              <select
                value={filters[field.id] ?? ""}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, [field.id]: e.target.value }))
                }
                className="rounded-lg border border-input bg-card px-2.5 py-1.5 text-sm text-foreground outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-ring/40"
              >
                <option value="">All</option>
                {(field.options ?? []).map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </label>
          ))}
          {activeFilterCount > 0 && (
            <button
              onClick={() => setFilters({})}
              className="rounded-lg px-2.5 py-1.5 text-sm font-medium text-muted-foreground underline underline-offset-2 hover:text-foreground"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {submissions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
          <p className="text-sm font-medium text-foreground">No submissions yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Share the public link and responses will appear here.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
          <p className="text-sm font-medium text-foreground">No matches</p>
          <p className="mt-1 text-sm text-muted-foreground">
            No responses match your search or filters.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                <th className="w-10 px-3 py-3 text-right font-semibold">#</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold">
                  Submitted
                </th>
                {columns.map((field) => (
                  <th
                    key={field.id}
                    className="whitespace-nowrap px-4 py-3 font-semibold"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <FieldTypeIcon type={field.type} />
                      {field.label}
                    </span>
                  </th>
                ))}
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr
                  key={s.id}
                  className="group border-b border-border last:border-0 transition-colors hover:bg-muted/40"
                >
                  <td className="px-3 py-3 text-right tabular-nums text-muted-foreground">
                    {i + 1}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                    {formatDate(s.submitted_at)}
                  </td>
                  {columns.map((field) => (
                    <td key={field.id} className="px-4 py-3 align-top">
                      <Cell field={field} value={s.answers[field.id]} />
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setSelected(s)}
                      className="rounded-md border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group-hover:text-foreground"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <SubmissionModal
          fields={columns}
          submission={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

function FieldTypeIcon({ type }: { type: FieldType }) {
  const glyph: Record<FieldType, string> = {
    text: "T",
    textarea: "¶",
    email: "@",
    phone: "☎",
    number: "#",
    select: "▾",
    radio: "◉",
    checkbox: "☑",
    date: "▦",
    file: "🔗",
    heading: "H",
  };
  return (
    <span
      aria-hidden
      className="flex h-4 w-4 items-center justify-center rounded bg-muted text-[10px] font-semibold leading-none text-muted-foreground"
    >
      {glyph[type]}
    </span>
  );
}

function SubmissionModal({
  fields,
  submission,
  onClose,
}: {
  fields: Field[];
  submission: Submission;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Submission details"
    >
      <div
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Submission details
            </h2>
            <p className="text-xs text-muted-foreground">
              {formatDateTime(submission.submitted_at)}
            </p>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            ✕
          </button>
        </div>
        <dl className="divide-y divide-border">
          {fields.map((field) => (
            <div key={field.id} className="px-5 py-3.5">
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {field.label}
              </dt>
              <dd className="mt-1 text-sm text-foreground">
                {asArray(submission.answers[field.id])
                  .filter((v) => v !== "")
                  .join(", ") || (
                  <span className="text-muted-foreground/50">No answer</span>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
