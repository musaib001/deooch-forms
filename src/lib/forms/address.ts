// An address answer is stored as a positional string[] matching ADDRESS_PARTS,
// which keeps it inside the existing `Record<string, string | string[]>` answer
// shape — no schema or migration needed. Every consumer (renderer, validation,
// grid cells, exports) reads the order from here so they can't drift apart.

export const ADDRESS_PARTS = [
  { key: "street1", label: "Street address", autoComplete: "address-line1" },
  { key: "street2", label: "Street address line 2", autoComplete: "address-line2" },
  { key: "city", label: "City", autoComplete: "address-level2" },
  { key: "state", label: "State / Province", autoComplete: "address-level1" },
  { key: "postal", label: "Postal code", autoComplete: "postal-code" },
  { key: "country", label: "Country", autoComplete: "country-name" },
] as const;

/** Sub-fields that must be filled for a *required* address to count as answered. */
export const ADDRESS_REQUIRED_KEYS = ["street1", "city", "postal"] as const;

/** Normalises any stored value to exactly ADDRESS_PARTS.length slots. */
export function addressParts(value: string | string[] | undefined): string[] {
  const arr = Array.isArray(value) ? value : [];
  return ADDRESS_PARTS.map((_, i) => arr[i] ?? "");
}

export function isAddressEmpty(value: string | string[] | undefined) {
  return addressParts(value).every((p) => p.trim() === "");
}

/** Non-empty parts joined for single-line display (grid cell, CSV, Excel). */
export function formatAddress(value: string | string[] | undefined) {
  return addressParts(value)
    .map((p) => p.trim())
    .filter(Boolean)
    .join(", ");
}

/** Which required sub-fields are still blank. Empty array = acceptable. */
export function missingAddressKeys(value: string | string[] | undefined) {
  const parts = addressParts(value);
  return ADDRESS_REQUIRED_KEYS.filter((key) => {
    const i = ADDRESS_PARTS.findIndex((p) => p.key === key);
    return parts[i].trim() === "";
  });
}
