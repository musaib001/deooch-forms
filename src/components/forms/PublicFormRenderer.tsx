"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Field } from "@/lib/forms/schema";

export function PublicFormRenderer({
  formId,
  slug,
  title,
  description,
  fields,
}: {
  formId: string;
  slug: string;
  title: string;
  description: string | null;
  fields: Field[];
}) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setAnswer(fieldId: string, value: string | string[]) {
    setAnswers((prev) => ({ ...prev, [fieldId]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await fetch(`/api/forms/${formId}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    });

    setSubmitting(false);

    if (!res.ok) {
      setError("Could not submit the form. Please check required fields.");
      return;
    }

    router.push(`/f/${slug}/thank-you`);
  }

  return (
    <form onSubmit={submit} className="mx-auto flex max-w-xl flex-col gap-4 p-8">
      <h1 className="text-2xl font-semibold">{title}</h1>
      {description && <p className="text-gray-600">{description}</p>}

      {[...fields]
        .sort((a, b) => a.order - b.order)
        .map((field) => (
          <label key={field.id} className="flex flex-col gap-1">
            <span className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-600"> *</span>}
            </span>
            <FieldInput field={field} onChange={(v) => setAnswer(field.id, v)} />
          </label>
        ))}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-fit rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {submitting ? "Submitting…" : "Submit"}
      </button>
    </form>
  );
}

function FieldInput({
  field,
  onChange,
}: {
  field: Field;
  onChange: (value: string | string[]) => void;
}) {
  switch (field.type) {
    case "textarea":
      return (
        <textarea
          required={field.required}
          className="rounded border px-3 py-2"
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "select":
      return (
        <select
          required={field.required}
          className="rounded border px-3 py-2"
          defaultValue=""
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="" disabled>
            Select…
          </option>
          {(field.options ?? []).map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    case "radio":
      return (
        <div className="flex flex-col gap-1">
          {(field.options ?? []).map((opt) => (
            <label key={opt} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name={field.id}
                required={field.required}
                onChange={() => onChange(opt)}
              />
              {opt}
            </label>
          ))}
        </div>
      );
    case "checkbox":
      return (
        <CheckboxGroup options={field.options ?? []} onChange={onChange} />
      );
    case "date":
      return (
        <input
          type="date"
          required={field.required}
          className="rounded border px-3 py-2"
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "number":
      return (
        <input
          type="number"
          required={field.required}
          className="rounded border px-3 py-2"
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "email":
      return (
        <input
          type="email"
          required={field.required}
          className="rounded border px-3 py-2"
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "file":
      return (
        <input
          type="text"
          placeholder="File upload not yet supported — paste a link"
          className="rounded border px-3 py-2"
          onChange={(e) => onChange(e.target.value)}
        />
      );
    default:
      return (
        <input
          type="text"
          required={field.required}
          className="rounded border px-3 py-2"
          onChange={(e) => onChange(e.target.value)}
        />
      );
  }
}

function CheckboxGroup({
  options,
  onChange,
}: {
  options: string[];
  onChange: (value: string[]) => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(opt: string, checked: boolean) {
    const next = checked
      ? [...selected, opt]
      : selected.filter((o) => o !== opt);
    setSelected(next);
    onChange(next);
  }

  return (
    <div className="flex flex-col gap-1">
      {options.map((opt) => (
        <label key={opt} className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            onChange={(e) => toggle(opt, e.target.checked)}
          />
          {opt}
        </label>
      ))}
    </div>
  );
}
