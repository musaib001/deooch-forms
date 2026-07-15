"use client";

import { useEffect, useState } from "react";

type Item = {
  id: string;
  email: string;
  kind: "member" | "invite";
  role?: string;
};

export function MembersTable() {
  const [members, setMembers] = useState<Item[]>([]);
  const [pendingInvites, setPendingInvites] = useState<Item[]>([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    const res = await fetch("/api/members");
    const data = await res.json();
    setMembers(data.members ?? []);
    setPendingInvites(data.pendingInvites ?? []);
  }

  useEffect(() => {
    let ignore = false;
    fetch("/api/members")
      .then((res) => res.json())
      .then((data) => {
        if (ignore) return;
        setMembers(data.members ?? []);
        setPendingInvites(data.pendingInvites ?? []);
      });
    return () => {
      ignore = true;
    };
  }, []);

  async function invite(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setEmail("");
    setLoading(false);
    load();
  }

  async function remove(item: Item) {
    await fetch(`/api/members/${item.id}?kind=${item.kind}`, {
      method: "DELETE",
    });
    load();
  }

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <form onSubmit={invite} className="flex gap-2">
        <input
          type="email"
          required
          placeholder="teammate@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 rounded border px-3 py-2"
        />
        <button
          disabled={loading}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          Invite
        </button>
      </form>

      <div>
        <h2 className="mb-2 text-sm font-medium text-gray-500">Members</h2>
        <ul className="flex flex-col gap-1">
          {members.map((m) => (
            <li key={m.id} className="flex items-center justify-between text-sm">
              <span>
                {m.email} <span className="text-gray-400">({m.role})</span>
              </span>
              {m.role !== "owner" && (
                <button onClick={() => remove(m)} className="text-red-600">
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="mb-2 text-sm font-medium text-gray-500">Pending invites</h2>
        <ul className="flex flex-col gap-1">
          {pendingInvites.map((i) => (
            <li key={i.id} className="flex items-center justify-between text-sm">
              <span>{i.email}</span>
              <button onClick={() => remove(i)} className="text-red-600">
                Cancel
              </button>
            </li>
          ))}
          {!pendingInvites.length && (
            <li className="text-sm text-gray-400">None</li>
          )}
        </ul>
      </div>
    </div>
  );
}
