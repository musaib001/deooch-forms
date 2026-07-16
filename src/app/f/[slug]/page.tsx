import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { PublicFormRenderer } from "@/components/forms/PublicFormRenderer";

export default async function PublicFormPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // Admin client: this route intentionally serves any respondent, so reads
  // aren't scoped by an acting user's RLS grant.
  const admin = createAdminClient();
  const { data: form } = await admin
    .from("forms")
    .select("id, slug, title, description, fields, status")
    .eq("slug", slug)
    .single();

  if (!form) notFound();

  if (form.status !== "published") {
    return <FormUnavailable />;
  }

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

function FormUnavailable() {
  return (
    <div className="mx-auto flex w-full max-w-2xl px-4 py-16">
      <div className="w-full rounded-2xl border border-border bg-card px-8 py-14 text-center shadow-sm">
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          This form is no longer accepting responses.
        </h1>
        <p className="mt-2 text-[15px] text-muted-foreground">
          Please check back later or contact whoever shared this link with
          you.
        </p>
      </div>
    </div>
  );
}
