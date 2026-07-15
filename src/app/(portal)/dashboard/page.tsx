import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: forms } = await supabase
    .from("forms")
    .select("id, title, status, created_at, submissions(count)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Forms</h1>
        <Link
          href="/forms/new"
          className="rounded bg-black px-4 py-2 text-sm text-white"
        >
          New form
        </Link>
      </div>

      {!forms?.length && <p className="text-gray-500">No forms yet.</p>}

      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b text-gray-500">
            <th className="py-2">Title</th>
            <th className="py-2">Status</th>
            <th className="py-2">Submissions</th>
            <th className="py-2">Created</th>
          </tr>
        </thead>
        <tbody>
          {forms?.map((form) => (
            <tr key={form.id} className="border-b">
              <td className="py-2">
                <Link href={`/forms/${form.id}`} className="underline">
                  {form.title}
                </Link>
              </td>
              <td className="py-2">{form.status}</td>
              <td className="py-2">
                {(form.submissions as { count: number }[])[0]?.count ?? 0}
              </td>
              <td className="py-2">
                {new Date(form.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
