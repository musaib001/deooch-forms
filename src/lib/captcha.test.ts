import { afterEach, expect, test, vi } from "vitest";
import { verifyCaptcha } from "./captcha";

afterEach(() => {
  delete process.env.TURNSTILE_SECRET_KEY;
  vi.unstubAllGlobals();
});

function stubSiteverify(payload: unknown) {
  const fetchMock = vi.fn().mockResolvedValue({ json: async () => payload });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

test("passes through when no secret is configured", async () => {
  expect(await verifyCaptcha(undefined, null)).toBe(true);
});

test("rejects a missing token once configured", async () => {
  process.env.TURNSTILE_SECRET_KEY = "secret";
  expect(await verifyCaptcha(undefined, null)).toBe(false);
});

test("accepts a token Cloudflare confirms, rejects one it doesn't", async () => {
  process.env.TURNSTILE_SECRET_KEY = "secret";

  const ok = stubSiteverify({ success: true });
  expect(await verifyCaptcha("tok", "1.2.3.4")).toBe(true);
  expect((ok.mock.calls[0][1].body as URLSearchParams).get("remoteip")).toBe("1.2.3.4");

  stubSiteverify({ success: false, "error-codes": ["invalid-input-response"] });
  expect(await verifyCaptcha("tok", null)).toBe(false);
});

test("fails closed when Cloudflare is unreachable", async () => {
  process.env.TURNSTILE_SECRET_KEY = "secret";
  vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network")));
  expect(await verifyCaptcha("tok", null)).toBe(false);
});
