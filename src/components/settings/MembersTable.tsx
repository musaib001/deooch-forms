"use client";

import { useEffect, useState } from "react";
import { buttonPrimaryClass, inputClass } from "@/lib/ui";

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
          autoComplete="email"
          spellCheck={false}
          placeholder="teammate@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
        <button disabled={loading} className={buttonPrimaryClass + " shrink-0"}>
          {loading ? "Inviting…" : "Invite"}
        </button>
      </form>

      <Section title="Members">
        {members.map((m) => (
          <Row
            key={m.id}
            label={m.email}
            meta={m.role}
            action={
              m.role !== "owner" ? (
                <RemoveButton onClick={() => remove(m)} label="Remove" />
              ) : (
                <span className="text-xs text-muted-foreground">Owner</span>
              )
            }
          />
        ))}
      </Section>

      <Section title="Pending invites" emptyLabel="No pending invites">
        {pendingInvites.map((i) => (
          <Row
            key={i.id}
            label={i.email}
            action={<RemoveButton onClick={() => remove(i)} label="Cancel" />}
          />
        ))}
      </Section>
    </div>
  );
}

function Section({
  title,
  emptyLabel,
  children,
}: {
  title: string;
  emptyLabel?: string;
  children: React.ReactNode;
}) {
  const isEmpty = Array.isArray(children) && children.length === 0;
  return (
    <div>
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h2>
      <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
        {isEmpty ? (
          <p className="px-4 py-3 text-sm text-muted-foreground">
            {emptyLabel ?? "Nothing here yet"}
          </p>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

function Row({
  label,
  meta,
  action,
}: {
  label: string;
  meta?: string;
  action: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3 text-sm">
      <span className="text-foreground">
        {label}
        {meta && (
          <span className="ml-2 capitalize text-muted-foreground">({meta})</span>
        )}
      </span>
      {action}
    </div>
  );
}

function RemoveButton({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-md px-2 py-1 text-xs font-medium text-destructive transition-colors hover:bg-destructive-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {label}
    </button>
  );
}
