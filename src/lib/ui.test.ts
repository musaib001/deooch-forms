import { describe, it, expect } from "vitest";
import { formatPhone, isValidEmail, isValidPhone } from "./ui";

describe("formatPhone", () => {
  it("formats a full 10-digit number", () => {
    expect(formatPhone("5551234567")).toBe("(555) 123-4567");
  });

  it("strips non-digits before formatting", () => {
    expect(formatPhone("555-123-4567")).toBe("(555) 123-4567");
    expect(formatPhone("(555) 123 4567 ext")).toBe("(555) 123-4567");
  });

  it("formats partial input progressively", () => {
    expect(formatPhone("")).toBe("");
    expect(formatPhone("55")).toBe("(55");
    expect(formatPhone("5551")).toBe("(555) 1");
    expect(formatPhone("555123")).toBe("(555) 123");
  });

  it("caps at 10 digits", () => {
    expect(formatPhone("55512345670000")).toBe("(555) 123-4567");
  });
});

describe("isValidEmail", () => {
  it("accepts well-formed addresses", () => {
    expect(isValidEmail("you@example.com")).toBe(true);
    expect(isValidEmail("a.b-c@sub.domain.co")).toBe(true);
  });

  it("rejects malformed addresses", () => {
    expect(isValidEmail("plainaddress")).toBe(false);
    expect(isValidEmail("no@dot")).toBe(false);
    expect(isValidEmail("@no-local.com")).toBe(false);
    expect(isValidEmail("spaces in@email.com")).toBe(false);
  });
});

describe("isValidPhone", () => {
  it("accepts exactly 10 digits in any format", () => {
    expect(isValidPhone("(555) 123-4567")).toBe(true);
    expect(isValidPhone("5551234567")).toBe(true);
  });

  it("rejects wrong digit counts", () => {
    expect(isValidPhone("12345")).toBe(false);
    expect(isValidPhone("555123456789")).toBe(false);
    expect(isValidPhone("")).toBe(false);
  });
});
