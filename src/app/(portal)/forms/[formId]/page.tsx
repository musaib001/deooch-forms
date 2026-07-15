import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { FormBuilder } from "@/components/forms/FormBuilder";
import { buttonSecondaryClass } from "@/lib/ui";

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
      <Link
        href="/dashboard"
        className="mb-4 inline-block text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to forms
      </Link>
      <div className="mb-6 flex items-start justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {form.title}
        </h1>
        <Link
          href={`/forms/${form.id}/submissions`}
          className={buttonSecondaryClass}
        >
          View submissions
        </Link>
      </div>
      <FormBuilder existing={form} />
    </div>
  );
}
