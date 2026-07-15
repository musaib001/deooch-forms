import { randomBytes, createHash } from "crypto";

const PREFIX = "dff_";

export function generateToken() {
  const raw = PREFIX + randomBytes(24).toString("base64url");
  return { raw, hash: hashToken(raw) };
}

export function hashToken(raw: string) {
  return createHash("sha256").update(raw).digest("hex");
}
