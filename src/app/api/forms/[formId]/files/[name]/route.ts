import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const BUCKET = "submission-uploads";

type Params = { params: Promise<{ formId: string; name: string }> };

// Owner-authorized download of a respondent upload. The bucket is private, so
// only someone whose RLS grant can read this form (owner or member) gets a
// short-lived signed URL; anonymous respondents cannot read back others' files.
export async function GET(_request: Request, { params }: Params) {
  const { formId, name } = await params;

  // RLS gate: if the caller can select this form, they may read its uploads.
  const supabase = await createClient();
  const { data: form } = await supabase
    .from("forms")
    .select("id")
    .eq("id", formId)
    .maybeSingle();
  if (!form) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // `name` is a single path segment (a UUID + extension); the form-id prefix is
  // taken from the authorized route param, so a caller can't traverse to
  // another form's objects.
  const objectPath = `${formId}/${name}`;
  const admin = createAdminClient();
  const { data, error } = await admin.storage
    .from(BUCKET)
    .createSignedUrl(objectPath, 60);
  if (error || !data) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  return NextResponse.redirect(data.signedUrl);
}
