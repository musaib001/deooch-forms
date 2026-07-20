import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const BUCKET = "submission-uploads";
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED = (type: string) =>
  type.startsWith("image/") || type === "application/pdf";

type Params = { params: Promise<{ formId: string }> };

// Public, anonymous upload: respondents attach files to a published form before
// submitting, so this mirrors the submit route's service-role, no-session model.
// Files land in a private bucket and are only reachable through the
// owner-authorized download route.
//
// ponytail: no rate limiting and no orphan cleanup (a file uploaded but never
// submitted lingers). Add an IP+formId token bucket and a periodic sweep of
// objects with no referencing submission if abuse or storage cost shows up.
export async function POST(request: Request, { params }: Params) {
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
    return NextResponse.json({ error: "File exceeds the 5 MB limit" }, { status: 413 });
  }
  if (!ALLOWED(file.type)) {
    return NextResponse.json(
      { error: "Only images and PDF files are allowed" },
      { status: 415 }
    );
  }

  const admin = createAdminClient();

  // Only accept uploads for a real, published, non-trashed form — same gate as
  // the submit route, so uploads can't be aimed at arbitrary form ids.
  const { data: formRow } = await admin
    .from("forms")
    .select("id")
    .eq("id", formId)
    .eq("status", "published")
    .is("deleted_at", null)
    .maybeSingle();
  if (!formRow) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }

  const ext = safeExt(file.name, file.type);
  const objectName = `${crypto.randomUUID()}${ext}`;
  const objectPath = `${formId}/${objectName}`;

  const { error } = await admin.storage
    .from(BUCKET)
    .upload(objectPath, file, { contentType: file.type, upsert: false });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Store a stable, owner-authorized download URL as the answer. Every read
  // site (submissions table, CSV/XLSX/JSON export, MCP) renders it as a plain
  // link — no per-site signing needed.
  const origin = new URL(request.url).origin;
  const url = `${origin}/api/forms/${formId}/files/${objectName}`;
  return NextResponse.json({ url, name: file.name }, { status: 201 });
}

// Derive a short, safe extension from the filename, falling back to the MIME
// type. Purely cosmetic (object names are random UUIDs); never trusted for auth.
function safeExt(name: string, type: string) {
  const fromName = /\.([a-z0-9]{1,8})$/i.exec(name)?.[1];
  if (fromName) return `.${fromName.toLowerCase()}`;
  if (type === "application/pdf") return ".pdf";
  const sub = type.split("/")[1];
  return sub ? `.${sub.replace(/[^a-z0-9]/gi, "")}` : "";
}
