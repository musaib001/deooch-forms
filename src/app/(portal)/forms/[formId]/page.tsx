import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { FormBuilder } from "@/components/forms/FormBuilder";

export default async function EditFormPage({
  params,
}: {
  params: Promise<{ formId: string }>;
}) {
  const { formId } = await params;
  const supabase = await createClient();
  const { data: form } = await supabase
    .from("forms")
    .select("*")
    .eq("id", formId)
    .single();

  if (!form) notFound();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">{form.title}</h1>
        <Link
          href={`/forms/${form.id}/submissions`}
          className="text-sm underline"
        >
          View submissions
        </Link>
      </div>
      <FormBuilder existing={form} />
    </div>
  );
}
