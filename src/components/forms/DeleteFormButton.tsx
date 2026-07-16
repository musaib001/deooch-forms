"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteFormButton({
  formId,
  formTitle,
}: {
  formId: string;
  formTitle: string;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function confirmDelete() {
    setDeleting(true);
    const res = await fetch(`/api/forms/${formId}`, { method: "DELETE" });
    setDeleting(false);

    if (!res.ok) {
      setConfirming(false);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-destructive shadow-sm transition-colors hover:bg-destructive-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        Delete form
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive-subtle px-3 py-1.5">
      <span className="text-sm text-destructive">
        Delete “{formTitle}” and all its submissions?
      </span>
      <button
        type="button"
        disabled={deleting}
        onClick={confirmDelete}
        className="rounded-md bg-destructive px-2.5 py-1 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {deleting ? "Deleting…" : "Confirm"}
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="rounded-md px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        Cancel
      </button>
    </div>
  );
}
