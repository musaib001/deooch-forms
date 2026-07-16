import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getSessionProfile } from "@/lib/auth/session";

type Params = { params: Promise<{ formId: string }> };

const actionSchema = z.object({
  action: z.enum(["favorite", "unfavorite", "archive", "unarchive", "restore"]),
});

// Sidebar state changes. Favorites are per-user (a join row); archive/trash are
// states of the form itself, so they live on the forms row.
export async function POST(request: Request, { params }: Params) {
  const profile = await getSessionProfile();
  if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = actionSchema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }

  const { formId } = await params;
  const supabase = await createClient();
  const { action } = body.data;

  if (action === "favorite" || action === "unfavorite") {
    const { error } =
      action === "favorite"
        ? await supabase
            .from("form_favorites")
            .upsert({ user_id: profile.id, form_id: formId })
        : await supabase
            .from("form_favorites")
            .delete()
            .eq("user_id", profile.id)
            .eq("form_id", formId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  // restore clears both flags: a form can be archived and then trashed, and
  // "Restore" from Trash should put it back in the active list either way.
  const patch =
    action === "archive"
      ? { archived_at: new Date().toISOString() }
      : action === "unarchive"
        ? { archived_at: null }
        : { deleted_at: null, archived_at: null };

  const { error } = await supabase
    .from("forms")
    .update({ ...patch, updated_by: profile.id })
    .eq("id", formId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
