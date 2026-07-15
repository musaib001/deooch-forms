import { describe, it, expect } from "vitest";
import { formatDate, formatDateTime } from "./date";

// These must be locale/timezone-independent so server and client render
// identical strings (prevents React hydration mismatches).
describe("formatDate", () => {
  it("formats an ISO timestamp deterministically in UTC", () => {
    expect(formatDate("2026-07-15T23:30:00Z")).toBe("Jul 15, 2026");
  });

  it("does not shift the day based on the runtime timezone", () => {
    // 00:30 UTC — a US-timezone Date would roll back to Jul 14 without the
    // fixed UTC timeZone; the formatter must keep it on the 15th.
    expect(formatDate("2026-07-15T00:30:00Z")).toBe("Jul 15, 2026");
  });
});

describe("formatDateTime", () => {
  it("includes date and time in UTC", () => {
    expect(formatDateTime("2026-07-15T09:05:00Z")).toBe("Jul 15, 2026, 9:05 AM");
  });
});
