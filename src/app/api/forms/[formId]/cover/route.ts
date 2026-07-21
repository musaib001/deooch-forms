import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSessionProfile } from "@/lib/auth/session";

const BUCKET = "form-assets";
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

// Owner-only upload of a form's cover image. Unlike the respondent upload
// route this goes through the caller's own session client, so storage RLS is
// what grants the write — and the bucket is public, because every anonymous
// respondent has to be able to load the image.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ formId: string }> }
) {
  const profile = await getSessionProfile();
  if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { formId } = await params;

  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return NextResponse.json({ error: "Expected multipart form data" }, { status: 400 });
  }

  const file = data.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (file.size === 0) {
    return NextResponse.json({ error: "File is empty" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image exceeds the 5 MB limit" }, { status: 413 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image files are allowed" }, { status: 415 });
  }

  const supabase = await createClient();

  // The form must exist and be visible under the caller's RLS grant — that's
  // the ownership check; a stranger's formId simply returns no row.
  const { data: form } = await supabase
    .from("forms")
    .select("id")
    .eq("id", formId)
    .is("deleted_at", null)
    .maybeSingle();
  if (!form) return NextResponse.json({ error: "Form not found" }, { status: 404 });

  const ext = /\.([a-z0-9]{1,8})$/i.exec(file.name)?.[1]?.toLowerCase() ?? "jpg";
  const objectPath = `${formId}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(objectPath, file, { contentType: file.type, upsert: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // ponytail: the previous cover is left in the bucket rather than deleted.
  // Covers are small and rarely changed; add a cleanup on replace if storage
  // cost ever shows up.
  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(objectPath);
  return NextResponse.json({ url: pub.publicUrl }, { status: 201 });
}
