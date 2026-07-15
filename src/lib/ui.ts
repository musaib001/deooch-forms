// Shared class strings + small helpers so the builder and public form render
// consistently. Keeps input/button styling in one place.

export const inputClass =
  "w-full rounded-lg border border-input bg-card px-3.5 py-2.5 text-[15px] text-foreground shadow-sm outline-none transition-[border-color,box-shadow] duration-100 placeholder:text-muted-foreground/70 focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-60 aria-[invalid=true]:border-destructive aria-[invalid=true]:focus-visible:ring-destructive/30";

export const labelClass = "block text-sm font-semibold text-foreground";

export const helpTextClass = "text-[13px] leading-snug text-muted-foreground";

export const buttonPrimaryClass =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground shadow-sm transition-[background-color,transform] duration-100 hover:bg-brand-hover active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60 disabled:active:translate-y-0";

export const buttonSecondaryClass =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors duration-100 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

// ponytail: US-style formatting only; swap for libphonenumber if you need
// international numbers.
export function formatPhone(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  const len = digits.length;
  if (len === 0) return "";
  if (len < 4) return `(${digits}`;
  if (len < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isValidPhone(value: string) {
  return value.replace(/\D/g, "").length === 10;
}
