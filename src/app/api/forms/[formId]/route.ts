import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSessionProfile } from "@/lib/auth/session";
import { updateFormSchema } from "@/lib/forms/schema";

type Params = { params: Promise<{ formId: string }> };

export async function GET(_request: Request, { params }: Params) {
  const profile = await getSessionProfile();
  if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { formId } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("forms")
    .select("*")
    .eq("id", formId)
    .is("deleted_at", null)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json({ form: data });
}

export async function PATCH(request: Request, { params }: Params) {
  const profile = await getSessionProfile();
  if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { formId } = await params;
  const body = updateFormSchema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ error: body.error.flatten() }, { status: 400 });
  }

  const supabase = await createClient();

  if (body.data.fields) {
    await supabase
      .from("form_versions")
      .insert({ form_id: formId, fields: body.data.fields, edited_by: profile.id });
  }

  const { data, error } = await supabase
    .from("forms")
    .update({ ...body.data, updated_by: profile.id })
    .eq("id", formId)
    .is("deleted_at", null)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ form: data });
}

// Soft delete: moves the form to Trash rather than destroying it (and its
// submissions) outright. `?permanent=1` is the real delete, used by the Trash
// view's "Delete forever" — that one cascades to submissions and is final.
export async function DELETE(request: Request, { params }: Params) {
  const profile = await getSessionProfile();
  if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { formId } = await params;
  const permanent = new URL(request.url).searchParams.get("permanent") === "1";
  const supabase = await createClient();

  const { error } = permanent
    ? await supabase.from("forms").delete().eq("id", formId)
    : await supabase
        .from("forms")
        .update({ deleted_at: new Date().toISOString(), updated_by: profile.id })
        .eq("id", formId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
