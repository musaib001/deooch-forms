import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { buttonPrimaryClass } from "@/lib/ui";
import { formatDate } from "@/lib/date";

const STATUS_STYLES: Record<string, string> = {
  published: "bg-brand-subtle text-brand",
  draft: "bg-muted text-muted-foreground",
  closed: "bg-destructive-subtle text-destructive",
};

type FormRow = {
  id: string;
  title: string;
  status: string;
  created_at: string;
  submissions: { count: number }[];
};

function responseCount(form: FormRow) {
  return form.submissions[0]?.count ?? 0;
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("forms")
    .select("id, title, status, created_at, submissions(count)")
    .order("created_at", { ascending: false });

  const forms = (data ?? []) as FormRow[];
  const totalResponses = forms.reduce((sum, f) => sum + responseCount(f), 0);
  const publishedCount = forms.filter((f) => f.status === "published").length;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Forms
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Build forms in the portal or by asking Claude.
          </p>
        </div>
        <Link href="/forms/new" className={buttonPrimaryClass}>
          New form
        </Link>
      </div>

      {forms.length > 0 && (
        <div className="mb-6 grid grid-cols-3 gap-4">
          <Stat label="Forms" value={forms.length} />
          <Stat label="Responses" value={totalResponses} />
          <Stat label="Published" value={publishedCount} />
        </div>
      )}

      {forms.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <p className="text-base font-semibold text-foreground">No forms yet</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
            Create your first form to start collecting responses.
          </p>
          <Link href="/forms/new" className={buttonPrimaryClass + " mt-5"}>
            New form
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-semibold">Title</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Responses</th>
                <th className="px-5 py-3 font-semibold">Created</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {forms.map((form) => {
                const count = responseCount(form);
                return (
                  <tr
                    key={form.id}
                    className="group border-b border-border last:border-0 transition-colors hover:bg-muted/40"
                  >
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/forms/${form.id}`}
                        className="font-medium text-foreground hover:text-brand"
                      >
                        {form.title}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={
                          "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize " +
                          (STATUS_STYLES[form.status] ?? STATUS_STYLES.draft)
                        }
                      >
                        {form.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 tabular-nums text-foreground">
                      {count}
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">
                      {formatDate(form.created_at)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        href={`/forms/${form.id}/submissions`}
                        className="whitespace-nowrap text-xs font-medium text-brand transition-colors hover:text-brand-hover"
                      >
                        View responses →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-card px-5 py-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">
        {value}
      </p>
    </div>
  );
}
