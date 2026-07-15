"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Field, FormStatus } from "@/lib/forms/schema";
import { FieldList } from "./FieldList";

type ExistingForm = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  fields: Field[];
  status: FormStatus;
};

export function FormBuilder({ existing }: { existing?: ExistingForm }) {
  const router = useRouter();
  const [title, setTitle] = useState(existing?.title ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [fields, setFields] = useState<Field[]>(existing?.fields ?? []);
  const [status, setStatus] = useState<FormStatus>(existing?.status ?? "published");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setError(null);

    const res = await fetch(
      existing ? `/api/forms/${existing.id}` : "/api/forms",
      {
        method: existing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, fields, status }),
      }
    );

    setSaving(false);

    if (!res.ok) {
      setError("Failed to save form.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <input
        className="rounded border px-3 py-2 text-lg font-medium"
        placeholder="Form title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="rounded border px-3 py-2"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      {existing && (
        <select
          className="w-fit rounded border px-2 py-1 text-sm"
          value={status}
          onChange={(e) => setStatus(e.target.value as FormStatus)}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="closed">Closed</option>
        </select>
      )}
      <FieldList fields={fields} onChange={setFields} />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="button"
        disabled={saving || !title}
        onClick={save}
        className="w-fit rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save form"}
      </button>
      {existing && (
        <p className="text-sm text-gray-500">
          Public link:{" "}
          <a
            className="underline"
            href={`/f/${existing.slug}`}
            target="_blank"
            rel="noreferrer"
          >
            {`${process.env.NEXT_PUBLIC_APP_URL ?? ""}/f/${existing.slug}`}
          </a>
        </p>
      )}
    </div>
  );
}
