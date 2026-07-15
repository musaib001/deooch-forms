"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { Field } from "@/lib/forms/schema";
import { isInputField } from "@/lib/forms/schema";
import { validateField, type FieldValue } from "@/lib/forms/validation";
import { formatPhone, helpTextClass, inputClass, labelClass } from "@/lib/ui";

type Value = FieldValue;

export function PublicFormRenderer({
  formId,
  slug,
  title,
  description,
  fields,
  preview = false,
}: {
  formId: string;
  slug: string;
  title: string;
  description: string | null;
  fields: Field[];
  preview?: boolean;
}) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, Value>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [previewValid, setPreviewValid] = useState(false);
  const fieldRefs = useRef<Record<string, HTMLElement | null>>({});

  const orderedFields = [...fields].sort((a, b) => a.order - b.order);
  const inputFields = orderedFields.filter(isInputField);

  function setValue(fieldId: string, value: Value) {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      });
    }
  }

  function onBlur(field: Field) {
    const error = validateField(field, values[field.id]);
    setErrors((prev) => {
      const next = { ...prev };
      if (error) next[field.id] = error;
      else delete next[field.id];
      return next;
    });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setPreviewValid(false);

    const nextErrors: Record<string, string> = {};
    for (const field of inputFields) {
      const error = validateField(field, values[field.id]);
      if (error) nextErrors[field.id] = error;
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      const firstInvalid = inputFields.find((f) => nextErrors[f.id]);
      if (firstInvalid) {
        const el = fieldRefs.current[firstInvalid.id];
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
        el?.focus({ preventScroll: true });
      }
      return;
    }

    // Preview mode validates but never persists a submission.
    if (preview) {
      setPreviewValid(true);
      return;
    }

    setSubmitting(true);
    const res = await fetch(`/api/forms/${formId}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: values }),
    });
    setSubmitting(false);

    if (!res.ok) {
      setFormError("Something went wrong submitting the form. Please try again.");
      return;
    }

    router.push(`/f/${slug}/thank-you`);
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:py-16">
      <form
        onSubmit={submit}
        noValidate
        aria-busy={submitting}
        className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
      >
        <div aria-hidden className="h-1.5 bg-brand" />
        <header className="border-b border-border bg-brand-subtle px-6 py-8 sm:px-10">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
        </header>

        <div className="flex flex-col gap-7 px-6 py-8 sm:px-10">
          {orderedFields.map((field) =>
            field.type === "heading" ? (
              <h2
                key={field.id}
                className="border-b border-border pb-2 text-lg font-semibold text-foreground first:pt-0"
              >
                {field.label}
              </h2>
            ) : (
              <FieldRow
                key={field.id}
                field={field}
                value={values[field.id]}
                error={errors[field.id]}
                setValue={(v) => setValue(field.id, v)}
                onBlur={() => onBlur(field)}
                registerRef={(el) => {
                  fieldRefs.current[field.id] = el;
                }}
              />
            )
          )}

          {formError && (
            <p
              role="alert"
              className="rounded-lg border border-destructive/30 bg-destructive-subtle px-4 py-3 text-sm text-destructive"
            >
              {formError}
            </p>
          )}

          {preview && previewValid && (
            <p className="rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
              Looks good — this form would submit successfully. (Preview mode:
              nothing was saved.)
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-5 py-3 text-[15px] font-semibold text-brand-foreground shadow-sm transition-[background-color,transform] duration-100 hover:bg-brand-hover active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card disabled:cursor-not-allowed disabled:opacity-70 disabled:active:translate-y-0 sm:w-auto sm:self-start"
          >
            {submitting && (
              <span
                aria-hidden
                className="h-4 w-4 animate-spin rounded-full border-2 border-brand-foreground/40 border-t-brand-foreground"
              />
            )}
            {submitting ? "Submitting…" : "Submit"}
          </button>
        </div>
      </form>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Powered by deoochform
      </p>
    </div>
  );
}

function FieldRow({
  field,
  value,
  error,
  setValue,
  onBlur,
  registerRef,
}: {
  field: Field;
  value: Value | undefined;
  error?: string;
  setValue: (value: Value) => void;
  onBlur: () => void;
  registerRef: (el: HTMLElement | null) => void;
}) {
  const helpId = field.helpText ? `${field.id}-help` : undefined;
  const errorId = error ? `${field.id}-error` : undefined;
  const describedBy = [helpId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={field.id} className={labelClass}>
        {field.label}
        {field.required && (
          <span className="ml-0.5 text-destructive" aria-hidden>
            *
          </span>
        )}
      </label>
      {field.helpText && (
        <p id={helpId} className={helpTextClass}>
          {field.helpText}
        </p>
      )}
      <FieldControl
        field={field}
        value={value}
        invalid={!!error}
        describedBy={describedBy}
        setValue={setValue}
        onBlur={onBlur}
        registerRef={registerRef}
      />
      {error && (
        <p id={errorId} role="alert" className="text-[13px] font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

function FieldControl({
  field,
  value,
  invalid,
  describedBy,
  setValue,
  onBlur,
  registerRef,
}: {
  field: Field;
  value: Value | undefined;
  invalid: boolean;
  describedBy?: string;
  setValue: (value: Value) => void;
  onBlur: () => void;
  registerRef: (el: HTMLElement | null) => void;
}) {
  const common = {
    id: field.id,
    "aria-invalid": invalid || undefined,
    "aria-describedby": describedBy,
    onBlur,
  };

  switch (field.type) {
    case "textarea":
      return (
        <textarea
          {...common}
          ref={registerRef}
          rows={4}
          placeholder={field.placeholder}
          value={(value as string) ?? ""}
          onChange={(e) => setValue(e.target.value)}
          className={inputClass}
        />
      );
    case "select":
      return (
        <select
          {...common}
          ref={registerRef}
          value={(value as string) ?? ""}
          onChange={(e) => setValue(e.target.value)}
          className={inputClass}
        >
          <option value="" disabled>
            {field.placeholder || "Select an option…"}
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
        <fieldset className="flex flex-col gap-2" aria-describedby={describedBy}>
          {(field.options ?? []).map((opt, i) => (
            <label
              key={opt}
              className="flex cursor-pointer items-center gap-2.5 text-[15px] text-foreground"
            >
              <input
                type="radio"
                name={field.id}
                ref={i === 0 ? registerRef : undefined}
                checked={value === opt}
                onChange={() => setValue(opt)}
                onBlur={onBlur}
                className="h-4 w-4 accent-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              {opt}
            </label>
          ))}
        </fieldset>
      );
    case "checkbox":
      return (
        <CheckboxGroup
          field={field}
          value={(value as string[]) ?? []}
          onChange={setValue}
          onBlur={onBlur}
          registerRef={registerRef}
          describedBy={describedBy}
        />
      );
    case "date":
      return (
        <input
          {...common}
          ref={registerRef}
          type="date"
          value={(value as string) ?? ""}
          onChange={(e) => setValue(e.target.value)}
          className={inputClass}
        />
      );
    case "number":
      return (
        <input
          {...common}
          ref={registerRef}
          type="text"
          inputMode="decimal"
          placeholder={field.placeholder}
          value={(value as string) ?? ""}
          onChange={(e) => setValue(e.target.value)}
          className={inputClass}
        />
      );
    case "email":
      return (
        <input
          {...common}
          ref={registerRef}
          type="email"
          autoComplete="email"
          spellCheck={false}
          placeholder={field.placeholder || "you@example.com"}
          value={(value as string) ?? ""}
          onChange={(e) => setValue(e.target.value)}
          className={inputClass}
        />
      );
    case "phone":
      return (
        <input
          {...common}
          ref={registerRef}
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          placeholder={field.placeholder || "(555) 123-4567"}
          value={(value as string) ?? ""}
          onChange={(e) => setValue(formatPhone(e.target.value))}
          className={inputClass}
        />
      );
    case "file":
      return (
        <input
          {...common}
          ref={registerRef}
          type="url"
          inputMode="url"
          placeholder={field.placeholder || "https://link-to-your-file"}
          value={(value as string) ?? ""}
          onChange={(e) => setValue(e.target.value)}
          className={inputClass}
        />
      );
    default:
      return (
        <input
          {...common}
          ref={registerRef}
          type="text"
          placeholder={field.placeholder}
          value={(value as string) ?? ""}
          onChange={(e) => setValue(e.target.value)}
          className={inputClass}
        />
      );
  }
}

function CheckboxGroup({
  field,
  value,
  onChange,
  onBlur,
  registerRef,
  describedBy,
}: {
  field: Field;
  value: string[];
  onChange: (value: string[]) => void;
  onBlur: () => void;
  registerRef: (el: HTMLElement | null) => void;
  describedBy?: string;
}) {
  function toggle(opt: string, checked: boolean) {
    onChange(checked ? [...value, opt] : value.filter((o) => o !== opt));
  }

  return (
    <fieldset className="flex flex-col gap-2" aria-describedby={describedBy}>
      {(field.options ?? []).map((opt, i) => (
        <label
          key={opt}
          className="flex cursor-pointer items-center gap-2.5 text-[15px] text-foreground"
        >
          <input
            type="checkbox"
            ref={i === 0 ? registerRef : undefined}
            checked={value.includes(opt)}
            onChange={(e) => toggle(opt, e.target.checked)}
            onBlur={onBlur}
            className="h-4 w-4 rounded accent-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          {opt}
        </label>
      ))}
    </fieldset>
  );
}
