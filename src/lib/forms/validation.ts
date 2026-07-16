import type { Field } from "./schema";
import { isValidEmail, isValidPhone } from "@/lib/ui";
import { isAddressEmpty, missingAddressKeys } from "./address";

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
  // Address is checked first: it's stored as a fixed-length string[], so a
  // completely blank address still has length > 0 and would slip past the
  // generic isEmpty() required check below.
  if (field.type === "address") {
    if (isAddressEmpty(value)) {
      return field.required ? "This field is required." : null;
    }
    if (field.required && missingAddressKeys(value).length > 0) {
      return "Enter at least a street address, city, and postal code.";
    }
    return null;
  }

  if (field.required && isEmpty(value)) return "This field is required.";
  if (isEmpty(value)) return null;
  if (field.type === "email" && !isValidEmail(value as string))
    return "Enter a valid email address, like you@example.com.";
  if (field.type === "phone" && !isValidPhone(value as string))
    return "Enter a 10-digit phone number.";
  return null;
}
