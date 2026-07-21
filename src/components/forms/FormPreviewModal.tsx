"use client";

import { useEffect } from "react";
import type { Field } from "@/lib/forms/schema";
import { PublicFormRenderer } from "./PublicFormRenderer";

export function FormPreviewModal({
  title,
  description,
  fields,
  theme,
  coverUrl,
  onClose,
}: {
  title: string;
  description: string;
  fields: Field[];
  theme?: string | null;
  coverUrl?: string | null;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Drop blank option rows so the preview matches what respondents will see.
  const cleaned = fields.map((f) =>
    f.options
      ? { ...f, options: f.options.map((o) => o.trim()).filter(Boolean) }
      : f
  );

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-foreground/40"
      role="dialog"
      aria-modal="true"
      aria-label="Form preview"
    >
      <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
        <span className="text-sm font-semibold text-foreground">
          Preview — how respondents see this form
        </span>
        <button
          onClick={onClose}
          className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Close preview
        </button>
      </div>
      <div className="flex-1 overflow-y-auto bg-background">
        <PublicFormRenderer
          preview
          formId="preview"
          slug="preview"
          title={title || "Untitled form"}
          description={description || null}
          fields={cleaned}
          theme={theme}
          coverUrl={coverUrl}
        />
      </div>
    </div>
  );
}
