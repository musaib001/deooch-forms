"use client";

import { useEffect, useState } from "react";
import { buttonPrimaryClass, inputClass } from "@/lib/ui";
import { formatDate } from "@/lib/date";

type Token = {
  id: string;
  name: string;
  created_at: string;
  last_used_at: string | null;
  revoked_at: string | null;
};

export function TokensTable() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [name, setName] = useState("");
  const [rawToken, setRawToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function load() {
    const res = await fetch("/api/tokens");
    const data = await res.json();
    setTokens(data.tokens ?? []);
  }

  useEffect(() => {
    let ignore = false;
    fetch("/api/tokens")
      .then((res) => res.json())
      .then((data) => {
        if (!ignore) setTokens(data.tokens ?? []);
      });
    return () => {
      ignore = true;
    };
  }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    setRawToken(data.token.raw);
    setName("");
    load();
  }

  async function copyToken() {
    if (!rawToken) return;
    await navigator.clipboard.writeText(rawToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function revoke(id: string) {
    await fetch(`/api/tokens/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      {rawToken && (
        <div className="rounded-xl border border-brand/30 bg-brand-subtle p-4">
          <p className="mb-2 text-sm font-semibold text-foreground">
            Copy this token now — it won&apos;t be shown again.
          </p>
          <div className="flex items-center gap-2">
            <code className="block flex-1 break-all rounded-lg border border-border bg-card p-2.5 font-mono text-xs text-foreground">
              {rawToken}
            </code>
            <button
              onClick={copyToken}
              className="shrink-0 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <button
            onClick={() => setRawToken(null)}
            className="mt-2 text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
          >
            Dismiss
          </button>
        </div>
      )}

      <form onSubmit={create} className="flex gap-2">
        <input
          required
          placeholder="Token name (e.g. Claude connector)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />
        <button className={buttonPrimaryClass + " shrink-0"}>Create token</button>
      </form>

      {tokens.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card px-4 py-8 text-center text-sm text-muted-foreground">
          No tokens yet. Create one to connect Claude or GPT.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Created</th>
                <th className="px-4 py-3 font-semibold">Last used</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {tokens.map((t) => (
                <tr key={t.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-foreground">
                    {t.name}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(t.created_at)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {t.last_used_at ? formatDate(t.last_used_at) : "Never"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium " +
                        (t.revoked_at
                          ? "bg-muted text-muted-foreground"
                          : "bg-brand-subtle text-brand")
                      }
                    >
                      {t.revoked_at ? "Revoked" : "Active"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {!t.revoked_at && (
                      <button
                        onClick={() => revoke(t.id)}
                        className="rounded-md px-2 py-1 text-xs font-medium text-destructive transition-colors hover:bg-destructive-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
