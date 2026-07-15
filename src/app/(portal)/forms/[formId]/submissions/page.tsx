import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SubmissionsTable } from "@/components/submissions/SubmissionsTable";

export default async function FormSubmissionsPage({
  params,
}: {
  params: Promise<{ formId: string }>;
}) {
  const { formId } = await params;
  const supabase = await createClient();

  const [{ data: form }, { data: submissions }] = await Promise.all([
    supabase.from("forms").select("id, title, fields").eq("id", formId).single(),
    supabase
      .from("submissions")
      .select("id, answers, submitted_at")
      .eq("form_id", formId)
      .order("submitted_at", { ascending: false }),
  ]);

  if (!form) notFound();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">{form.title} — submissions</h1>
        <a
          href={`/api/forms/${formId}/export`}
          className="rounded bg-black px-4 py-2 text-sm text-white"
        >
          Export to Excel
        </a>
      </div>
      <SubmissionsTable fields={form.fields} submissions={submissions ?? []} />
    </div>
  );
}
