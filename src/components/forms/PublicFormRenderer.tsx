"use client";

import { useRouter } from "next/navigation";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import type { Field } from "@/lib/forms/schema";
import { isInputField } from "@/lib/forms/schema";
import { validateField, type FieldValue } from "@/lib/forms/validation";
import { ADDRESS_PARTS, addressParts } from "@/lib/forms/address";
import { themeStyle } from "@/lib/forms/themes";
import { formatPhone, helpTextClass, inputClass, labelClass } from "@/lib/ui";

type Value = FieldValue;

declare global {
  interface Window {
    turnstile?: { reset: (widget?: string) => void };
  }
}

export function PublicFormRenderer({
  formId,
  slug,
  title,
  description,
  fields,
  theme,
  coverUrl,
  preview = false,
}: {
  formId: string;
  slug: string;
  title: string;
  description: string | null;
  fields: Field[];
  theme?: string | null;
  coverUrl?: string | null;
  preview?: boolean;
}) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, Value>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [previewValid, setPreviewValid] = useState(false);
  const fieldRefs = useRef<Record<string, HTMLElement | null>>({});

  // Turnstile renders itself into any .cf-turnstile inside the form and injects
  // a hidden cf-turnstile-response input, which we read at submit time. Preview
  // never posts, so it never needs the challenge.
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const captcha = !preview && !!siteKey;

  const orderedFields = [...fields]
    .sort((a, b) => a.order - b.order)
    // ponytail: MCP clients sometimes add a heading repeating the title despite
    // the tool description saying not to; drop it rather than render it twice.
    .filter(
      (f) =>
        !(
          f.type === "heading" &&
          f.label.trim().toLowerCase() === title.trim().toLowerCase()
        )
    );
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
    // Captured before the first await: currentTarget is nulled out once React
    // recycles the synthetic event.
    const formEl = e.currentTarget as HTMLFormElement;
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

    let captchaToken: string | undefined;
    if (captcha) {
      captchaToken =
        formEl.querySelector<HTMLInputElement>('[name="cf-turnstile-response"]')?.value ||
        undefined;
      if (!captchaToken) {
        setFormError("Please complete the anti-spam check above.");
        return;
      }
    }

    setSubmitting(true);
    const res = await fetch(`/api/forms/${formId}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: values, captchaToken }),
    });
    setSubmitting(false);

    if (!res.ok) {
      // Turnstile tokens are single-use, so a retry needs a fresh challenge.
      if (captcha) window.turnstile?.reset();
      setFormError(
        res.status === 403
          ? "The anti-spam check failed. Please try again."
          : "Something went wrong submitting the form. Please try again."
      );
      return;
    }

    router.push(`/f/${slug}/thank-you`);
  }

  return (
    // The theme is scoped to this subtree, so the same renderer themes itself
    // on the public page, in the builder preview, and on a template page.
    <div className="w-full" style={themeStyle(theme)}>
      <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:py-16">
      <form
        onSubmit={submit}
        noValidate
        aria-busy={submitting}
        className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
      >
        {coverUrl ? (
          // Plain <img>: the URL is user-supplied at runtime, so next/image
          // would need every possible host allow-listed in next.config.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverUrl}
            alt=""
            className="h-40 w-full object-cover sm:h-56"
          />
        ) : (
          <div aria-hidden className="h-1.5 bg-brand" />
        )}
        <header className="border-b border-border bg-brand-subtle px-6 py-8 text-center sm:px-10">
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
                className="rounded-xl bg-brand-subtle px-4 py-3 text-center text-lg font-semibold text-foreground"
              >
                {field.label}
              </h2>
            ) : (
              <FieldRow
                key={field.id}
                field={field}
                formId={formId}
                preview={preview}
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

          {captcha && (
            <>
              <Script
                src="https://challenges.cloudflare.com/turnstile/v0/api.js"
                strategy="lazyOnload"
              />
              <div className="cf-turnstile self-center" data-sitekey={siteKey} />
            </>
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
            className="mt-1 inline-flex w-full items-center justify-center gap-2 self-center rounded-lg bg-brand px-8 py-3 text-[15px] font-semibold text-brand-foreground shadow-sm transition-[background-color,transform] duration-100 hover:bg-brand-hover active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card disabled:cursor-not-allowed disabled:opacity-70 disabled:active:translate-y-0 sm:w-auto"
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

      {/* Sits on the page surround, not the card, so it needs the theme's
          on-page text colour rather than --muted-foreground. */}
      <p
        className="mt-6 text-center text-xs"
        style={{ color: "var(--page-foreground)" }}
      >
        Powered by deoochform
      </p>
      </div>
    </div>
  );
}

function FieldRow({
  field,
  formId,
  preview,
  value,
  error,
  setValue,
  onBlur,
  registerRef,
}: {
  field: Field;
  formId: string;
  preview: boolean;
  value: Value | undefined;
  error?: string;
  setValue: (value: Value) => void;
  onBlur: () => void;
  registerRef: (el: HTMLElement | null) => void;
}) {
  const helpId = field.helpText ? `${field.id}-help` : undefined;
  const errorId = error ? `${field.id}-error` : undefined;
  const describedBy = [helpId, errorId].filter(Boolean).join(" ") || undefined;
  // Address renders a fieldset of sub-inputs, so nothing owns field.id and a
  // htmlFor here would dangle. Its own <legend> names the group instead.
  const isGroup = field.type === "address";
  const Label = isGroup ? "p" : "label";

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={isGroup ? undefined : field.id} className={labelClass}>
        {field.label}
        {field.required && (
          <span className="ml-0.5 text-destructive" aria-hidden>
            *
          </span>
        )}
      </Label>
      {field.helpText && (
        <p id={helpId} className={helpTextClass}>
          {field.helpText}
        </p>
      )}
      <FieldControl
        field={field}
        formId={formId}
        preview={preview}
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

function UploadControl({
  formId,
  preview,
  value,
  invalid,
  describedBy,
  setValue,
  onBlur,
  registerRef,
}: {
  formId: string;
  preview: boolean;
  value: string | undefined;
  invalid: boolean;
  describedBy?: string;
  setValue: (value: Value) => void;
  onBlur: () => void;
  registerRef: (el: HTMLElement | null) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const MAX_BYTES = 5 * 1024 * 1024;
  const allowed = (t: string) => t.startsWith("image/") || t === "application/pdf";

  function reject(message: string) {
    setError(message);
    setFileName(null);
    setValue("");
  }

  async function onSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    // Client-side guard for fast feedback; the server re-checks authoritatively.
    if (file.size > MAX_BYTES) return reject("File exceeds the 5 MB limit.");
    if (!allowed(file.type)) return reject("Only images and PDF files are allowed.");

    setFileName(file.name);

    // Preview never persists, and the form may still be a draft (the upload
    // endpoint only accepts published forms), so skip the network and just mark
    // the field satisfied so validation can be exercised.
    if (preview) {
      setValue(`preview://${file.name}`);
      return;
    }

    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch(`/api/forms/${formId}/upload`, { method: "POST", body });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) return reject(json.error ?? "Upload failed. Try again.");
      setValue(json.url as string);
    } catch {
      reject("Upload failed. Check your connection and try again.");
    } finally {
      setUploading(false);
    }
  }

  const hasFile = !!value && !error;

  return (
    <div className="flex flex-col gap-2">
      <label
        className={
          "flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed bg-background px-4 text-sm text-muted-foreground transition-colors " +
          (invalid ? "border-destructive" : "border-input hover:border-brand")
        }
      >
        <input
          type="file"
          accept="image/*,application/pdf"
          ref={registerRef}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          onChange={onSelect}
          onBlur={onBlur}
          disabled={uploading}
          className="sr-only"
        />
        {uploading
          ? "Uploading…"
          : hasFile
            ? `✓ ${fileName ?? "File attached"}`
            : "Choose a file (image or PDF, up to 5 MB)"}
      </label>
      {error && <p className="text-[13px] font-medium text-destructive">{error}</p>}
    </div>
  );
}

// Internal buffer is fixed and the element is CSS-scaled, so pointer coords are
// converted rather than resized on the fly.
const SIG_W = 600;
const SIG_H = 180;

function SignatureControl({
  formId,
  preview,
  value,
  invalid,
  describedBy,
  setValue,
  onBlur,
  registerRef,
}: {
  formId: string;
  preview: boolean;
  value: string | undefined;
  invalid: boolean;
  describedBy?: string;
  setValue: (value: Value) => void;
  onBlur: () => void;
  registerRef: (el: HTMLElement | null) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#111827";
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  function point(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  }

  function start(e: React.PointerEvent<HTMLCanvasElement>) {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const ctx = e.currentTarget.getContext("2d");
    if (!ctx) return;
    const p = point(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    // A tap with no drag should still leave a mark.
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    drawing.current = true;
  }

  function move(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const ctx = e.currentTarget.getContext("2d");
    if (!ctx) return;
    const p = point(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  }

  function end() {
    if (!drawing.current) return;
    drawing.current = false;
    // Debounced so a multi-stroke signature uploads once at the end instead of
    // leaving an orphaned object per stroke.
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(save, 700);
  }

  function clear() {
    const canvas = canvasRef.current;
    canvas?.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setError(null);
    setValue("");
  }

  function save() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Preview never persists, and the upload endpoint only accepts published
    // forms, so mark the field satisfied without touching the network.
    if (preview) return setValue("preview://signature.png");

    setSaving(true);
    canvas.toBlob(async (blob) => {
      try {
        if (!blob) throw new Error("empty canvas");
        const body = new FormData();
        body.append("file", new File([blob], "signature.png", { type: "image/png" }));
        const res = await fetch(`/api/forms/${formId}/upload`, { method: "POST", body });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json.error ?? "upload failed");
        setValue(json.url as string);
        setError(null);
      } catch {
        setError("Could not save the signature. Draw again to retry.");
        setValue("");
      } finally {
        setSaving(false);
        onBlur();
      }
    }, "image/png");
  }

  return (
    <div className="flex flex-col gap-2">
      <canvas
        ref={(el) => {
          canvasRef.current = el;
          registerRef(el);
        }}
        width={SIG_W}
        height={SIG_H}
        tabIndex={0}
        // ponytail: pointer-only, as a signature pad is. If a keyboard-accessible
        // alternative is needed, add a "type your full name" fallback beside it.
        aria-label="Signature pad — draw your signature"
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
        className={
          "h-40 w-full touch-none rounded-lg border bg-background " +
          (invalid ? "border-destructive" : "border-input")
        }
      />
      <div className="flex items-center gap-3 text-[13px]">
        <button
          type="button"
          onClick={clear}
          className="rounded-md px-2 py-1 font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Clear
        </button>
        <span className="text-muted-foreground">
          {saving ? "Saving…" : value ? "✓ Signature captured" : "Sign above"}
        </span>
      </div>
      {error && <p className="text-[13px] font-medium text-destructive">{error}</p>}
    </div>
  );
}

function FieldControl({
  field,
  formId,
  preview,
  value,
  invalid,
  describedBy,
  setValue,
  onBlur,
  registerRef,
}: {
  field: Field;
  formId: string;
  preview: boolean;
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
    case "address":
      return (
        <AddressGroup
          field={field}
          value={value}
          invalid={invalid}
          describedBy={describedBy}
          setValue={setValue}
          onBlur={onBlur}
          registerRef={registerRef}
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
    case "signature":
      return (
        <SignatureControl
          formId={formId}
          preview={preview}
          value={value as string | undefined}
          invalid={invalid}
          describedBy={describedBy}
          setValue={setValue}
          onBlur={onBlur}
          registerRef={registerRef}
        />
      );
    case "upload":
      return (
        <UploadControl
          formId={formId}
          preview={preview}
          value={value as string | undefined}
          invalid={invalid}
          describedBy={describedBy}
          setValue={setValue}
          onBlur={onBlur}
          registerRef={registerRef}
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

function AddressGroup({
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
  const parts = addressParts(value);

  function setPart(index: number, next: string) {
    const updated = [...parts];
    updated[index] = next;
    setValue(updated);
  }

  return (
    <fieldset className="grid grid-cols-1 gap-3 sm:grid-cols-2" aria-describedby={describedBy}>
      <legend className="sr-only">{field.label}</legend>
      {ADDRESS_PARTS.map((part, i) => {
        // Street lines span the full width; city/state/postal/country pair up.
        const fullWidth = part.key === "street1" || part.key === "street2";
        const partId = `${field.id}-${part.key}`;
        return (
          <div key={part.key} className={fullWidth ? "sm:col-span-2" : undefined}>
            <input
              id={partId}
              // Only the first input is registered for focus-on-error, and only
              // it carries the aria-invalid for the group's error message.
              ref={i === 0 ? registerRef : undefined}
              aria-invalid={i === 0 ? invalid || undefined : undefined}
              type="text"
              autoComplete={part.autoComplete}
              value={parts[i]}
              onChange={(e) => setPart(i, e.target.value)}
              onBlur={onBlur}
              className={inputClass}
            />
            {/* Caption sits under its input: the sub-label describes what was
                just typed rather than prompting for it, which is the postal-form
                convention the reference follows. */}
            <label
              htmlFor={partId}
              className="mt-1.5 block text-[13px] text-muted-foreground"
            >
              {part.label}
            </label>
          </div>
        );
      })}
    </fieldset>
  );
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
