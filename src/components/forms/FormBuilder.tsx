"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Field, FormStatus } from "@/lib/forms/schema";
import {
  buttonPrimaryClass,
  buttonSecondaryClass,
  inputClass,
  labelClass,
} from "@/lib/ui";
import { FieldList } from "./FieldList";
import { FormPreviewModal } from "./FormPreviewModal";

type ExistingForm = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  fields: Field[];
  status: FormStatus;
};

const STATUSES: { value: FormStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "closed", label: "Closed" },
];

export function FormBuilder({ existing }: { existing?: ExistingForm }) {
  const router = useRouter();
  const [title, setTitle] = useState(existing?.title ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [fields, setFields] = useState<Field[]>(existing?.fields ?? []);
  const [status, setStatus] = useState<FormStatus>(existing?.status ?? "published");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const publicUrl = existing
    ? `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/f/${existing.slug}`
    : null;

  async function save() {
    setSaving(true);
    setError(null);

    // Drop blank option rows left behind while editing choice fields.
    const cleanedFields = fields.map((f) =>
      f.options
        ? { ...f, options: f.options.map((o) => o.trim()).filter(Boolean) }
        : f
    );

    const res = await fetch(
      existing ? `/api/forms/${existing.id}` : "/api/forms",
      {
        method: existing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, fields: cleanedFields, status }),
      }
    );

    setSaving(false);

    if (!res.ok) {
      setError("Couldn't save the form. Please try again.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  async function copyLink() {
    if (!publicUrl) return;
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="form-title" className={labelClass}>
              Form title
            </label>
            <input
              id="form-title"
              className={inputClass}
              placeholder="e.g. Hospital AI Readiness Assessment"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="form-desc" className={labelClass}>
              Description
              <span className="ml-1 font-normal text-muted-foreground">
                (optional)
              </span>
            </label>
            <textarea
              id="form-desc"
              rows={2}
              className={inputClass}
              placeholder="A short line shown under the title"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          {existing && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="form-status" className={labelClass}>
                Status
              </label>
              <select
                id="form-status"
                className={inputClass + " w-auto"}
                value={status}
                onChange={(e) => setStatus(e.target.value as FormStatus)}
              >
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Fields
        </h2>
        <FieldList fields={fields} onChange={setFields} />
      </section>

      {error && (
        <p
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive-subtle px-4 py-3 text-sm text-destructive"
        >
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={saving || !title}
          onClick={save}
          className={buttonPrimaryClass}
        >
          {saving && (
            <span
              aria-hidden
              className="h-4 w-4 animate-spin rounded-full border-2 border-brand-foreground/40 border-t-brand-foreground"
            />
          )}
          {saving ? "Saving…" : "Save form"}
        </button>
        <button
          type="button"
          onClick={() => setShowPreview(true)}
          className={buttonSecondaryClass}
        >
          Preview
        </button>
      </div>

      {publicUrl && (
        <div className="flex flex-col gap-2 rounded-xl border border-border bg-muted/40 p-4">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Public link
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <a
              className="font-mono text-sm text-brand underline underline-offset-2 hover:text-brand-hover"
              href={`/f/${existing!.slug}`}
              target="_blank"
              rel="noreferrer"
            >
              {publicUrl}
            </a>
            <button
              type="button"
              onClick={copyLink}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      )}

      {showPreview && (
        <FormPreviewModal
          title={title}
          description={description}
          fields={fields}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}
