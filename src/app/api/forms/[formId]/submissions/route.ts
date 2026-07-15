import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSessionProfile } from "@/lib/auth/session";

type Params = { params: Promise<{ formId: string }> };

export async function GET(_request: Request, { params }: Params) {
  const profile = await getSessionProfile();
  if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { formId } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("submissions")
    .select("id, answers, submitted_at")
    .eq("form_id", formId)
    .order("submitted_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ submissions: data });
}
