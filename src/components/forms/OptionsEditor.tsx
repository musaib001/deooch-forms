"use client";

import type { FieldType } from "@/lib/forms/schema";

// Per-option row editor for choice fields, matching the JotForm-style list:
// each option is its own row with a type-appropriate marker, a text input,
// and a remove control.
export function OptionsEditor({
  type,
  options,
  onChange,
}: {
  type: FieldType;
  options: string[];
  onChange: (options: string[]) => void;
}) {
  const list = options.length ? options : [""];

  function update(index: number, value: string) {
    const next = [...list];
    next[index] = value;
    onChange(next);
  }

  function remove(index: number) {
    onChange(list.filter((_, i) => i !== index));
  }

  function add() {
    onChange([...list, ""]);
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border bg-muted/30 p-3">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Options
      </span>
      {list.map((opt, i) => (
        <div key={i} className="flex items-center gap-2">
          <Marker type={type} index={i} />
          <input
            className="min-w-0 flex-1 rounded-md border border-input bg-card px-2.5 py-1.5 text-sm text-foreground outline-none transition-[border-color,box-shadow] duration-100 placeholder:text-muted-foreground/70 focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-ring/40"
            placeholder={`Option ${i + 1}`}
            value={opt}
            onChange={(e) => update(i, e.target.value)}
          />
          <button
            type="button"
            onClick={() => remove(i)}
            disabled={list.length === 1}
            aria-label={`Remove option ${i + 1}`}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive-subtle hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-30"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="self-start rounded-md px-2 py-1 text-sm font-medium text-brand transition-colors hover:bg-brand-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        + Add option
      </button>
    </div>
  );
}

function Marker({ type, index }: { type: FieldType; index: number }) {
  if (type === "checkbox")
    return (
      <span
        aria-hidden
        className="h-4 w-4 shrink-0 rounded border-2 border-input"
      />
    );
  if (type === "radio")
    return (
      <span
        aria-hidden
        className="h-4 w-4 shrink-0 rounded-full border-2 border-input"
      />
    );
  // dropdown
  return (
    <span
      aria-hidden
      className="w-4 shrink-0 text-center text-xs font-medium text-muted-foreground"
    >
      {index + 1}
    </span>
  );
}
