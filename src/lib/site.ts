// The canonical public origin, used for URLs we *show* people to copy — the
// MCP connector address and example form links.
//
// Deliberately not NEXT_PUBLIC_APP_URL: that is the current environment's
// origin (http://localhost:4000 in dev) and drives OAuth callbacks, the
// .well-known documents, and real /f/<slug> links, so it has to stay
// per-environment. A localhost connector URL is useless to someone reading
// the docs, and copy-pasteable enough to be a support ticket.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://forms.deooch.com";

export const MCP_URL = `${SITE_URL}/api/mcp`;
