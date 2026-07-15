"use client";

import { useEffect, useState } from "react";

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

  async function revoke(id: string) {
    await fetch(`/api/tokens/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      {rawToken && (
        <div className="rounded border border-yellow-400 bg-yellow-50 p-3 text-sm">
          <p className="mb-1 font-medium">
            Copy this token now — it won&apos;t be shown again.
          </p>
          <code className="block break-all rounded bg-white p-2">{rawToken}</code>
          <button
            onClick={() => setRawToken(null)}
            className="mt-2 text-xs text-gray-500 underline"
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
          className="flex-1 rounded border px-3 py-2"
        />
        <button className="rounded bg-black px-4 py-2 text-white">
          Create token
        </button>
      </form>

      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b text-gray-500">
            <th className="py-2">Name</th>
            <th className="py-2">Created</th>
            <th className="py-2">Last used</th>
            <th className="py-2">Status</th>
            <th className="py-2" />
          </tr>
        </thead>
        <tbody>
          {tokens.map((t) => (
            <tr key={t.id} className="border-b">
              <td className="py-2">{t.name}</td>
              <td className="py-2">{new Date(t.created_at).toLocaleDateString()}</td>
              <td className="py-2">
                {t.last_used_at
                  ? new Date(t.last_used_at).toLocaleDateString()
                  : "Never"}
              </td>
              <td className="py-2">{t.revoked_at ? "Revoked" : "Active"}</td>
              <td className="py-2">
                {!t.revoked_at && (
                  <button
                    onClick={() => revoke(t.id)}
                    className="text-red-600"
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
  );
}
