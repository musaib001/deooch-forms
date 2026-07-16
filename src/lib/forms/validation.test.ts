import { describe, it, expect } from "vitest";
import { validateField, isEmpty } from "./validation";
import type { Field } from "./schema";

function field(overrides: Partial<Field>): Field {
  return {
    id: "f1",
    type: "text",
    label: "Field",
    required: false,
    order: 0,
    ...overrides,
  };
}

describe("isEmpty", () => {
  it("treats undefined, blank strings, and empty arrays as empty", () => {
    expect(isEmpty(undefined)).toBe(true);
    expect(isEmpty("")).toBe(true);
    expect(isEmpty("   ")).toBe(true);
    expect(isEmpty([])).toBe(true);
  });

  it("treats non-blank values as non-empty", () => {
    expect(isEmpty("a")).toBe(false);
    expect(isEmpty(["x"])).toBe(false);
  });
});

describe("validateField", () => {
  it("flags required fields that are empty", () => {
    expect(validateField(field({ required: true }), "")).toBe(
      "This field is required."
    );
    expect(validateField(field({ required: true, type: "checkbox" }), [])).toBe(
      "This field is required."
    );
  });

  it("passes optional empty fields", () => {
    expect(validateField(field({ required: false }), "")).toBeNull();
  });

  it("validates email format only when a value is present", () => {
    const email = field({ type: "email" });
    expect(validateField(email, "")).toBeNull();
    expect(validateField(email, "nope")).toMatch(/valid email/);
    expect(validateField(email, "you@example.com")).toBeNull();
  });

  it("validates phone format only when a value is present", () => {
    const phone = field({ type: "phone" });
    expect(validateField(phone, "")).toBeNull();
    expect(validateField(phone, "123")).toMatch(/10-digit/);
    expect(validateField(phone, "(555) 123-4567")).toBeNull();
  });

  it("required + invalid format prioritizes the required message when empty", () => {
    const email = field({ type: "email", required: true });
    expect(validateField(email, "")).toBe("This field is required.");
    expect(validateField(email, "bad")).toMatch(/valid email/);
  });
});

describe("validateField — address", () => {
  const blank = ["", "", "", "", "", ""];
  // [street1, street2, city, state, postal, country]
  const full = ["1 Main St", "", "Berlin", "BE", "10115", "Germany"];

  it("rejects an all-blank required address despite it being a non-empty array", () => {
    // Regression guard: isEmpty([...6 blanks]) is false (length > 0), so a
    // generic required check would wrongly pass this.
    expect(isEmpty(blank)).toBe(false);
    expect(validateField(field({ type: "address", required: true }), blank)).toBe(
      "This field is required."
    );
    expect(
      validateField(field({ type: "address", required: true }), undefined)
    ).toBe("This field is required.");
  });

  it("passes an all-blank optional address", () => {
    expect(validateField(field({ type: "address" }), blank)).toBeNull();
    expect(validateField(field({ type: "address" }), undefined)).toBeNull();
  });

  it("requires street, city and postal once a required address is started", () => {
    const partial = ["1 Main St", "", "", "", "", ""];
    expect(
      validateField(field({ type: "address", required: true }), partial)
    ).toMatch(/street address, city, and postal/);
    expect(validateField(field({ type: "address", required: true }), full)).toBeNull();
  });

  it("does not demand sub-fields for an optional partially-filled address", () => {
    const partial = ["1 Main St", "", "", "", "", ""];
    expect(validateField(field({ type: "address" }), partial)).toBeNull();
  });
});
