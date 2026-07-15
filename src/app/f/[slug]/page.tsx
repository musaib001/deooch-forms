import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PublicFormRenderer } from "@/components/forms/PublicFormRenderer";

export default async function PublicFormPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: form } = await supabase
    .from("forms")
    .select("id, slug, title, description, fields, status")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!form) notFound();

  return (
    <PublicFormRenderer
      formId={form.id}
      slug={form.slug}
      title={form.title}
      description={form.description}
      fields={form.fields}
    />
  );
}
