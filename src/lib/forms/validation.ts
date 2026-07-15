import type { Field } from "./schema";
import { isValidEmail, isValidPhone } from "@/lib/ui";

export type FieldValue = string | string[];

export function isEmpty(value: FieldValue | undefined) {
  if (Array.isArray(value)) return value.length === 0;
  return !value || value.trim() === "";
}

// Returns an error message, or null if the value is acceptable.
export function validateField(
  field: Field,
  value: FieldValue | undefined
): string | null {
  if (field.required && isEmpty(value)) return "This field is required.";
  if (isEmpty(value)) return null;
  if (field.type === "email" && !isValidEmail(value as string))
    return "Enter a valid email address, like you@example.com.";
  if (field.type === "phone" && !isValidPhone(value as string))
    return "Enter a 10-digit phone number.";
  return null;
}
