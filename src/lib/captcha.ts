const SITEVERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

// Cloudflare Turnstile. Enabled purely by the presence of the keys — set
// TURNSTILE_SECRET_KEY (+ NEXT_PUBLIC_TURNSTILE_SITE_KEY) and every published
// form gets the challenge; unset, and this is a no-op so local dev and existing
// deployments keep working untouched.
//
// ponytail: all-or-nothing per deployment, no per-form toggle. Add a
// `captcha` flag on the form row when someone actually wants it off for one form.
export async function verifyCaptcha(
  token: string | undefined,
  ip: string | null
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;

  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set("remoteip", ip);

  try {
    const res = await fetch(SITEVERIFY, { method: "POST", body });
    const json = (await res.json()) as { success?: boolean };
    return json.success === true;
  } catch {
    // Cloudflare unreachable — fail closed. A form that silently stops
    // spam-checking is worse than one that asks the respondent to retry.
    return false;
  }
}
