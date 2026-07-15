import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSessionProfile } from "@/lib/auth/session";

type Params = { params: Promise<{ memberId: string }> };

export async function DELETE(request: Request, { params }: Params) {
  const profile = await getSessionProfile();
  if (!profile || profile.role !== "owner") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { memberId } = await params;
  const kind = new URL(request.url).searchParams.get("kind");
  const supabase = await createClient();

  const { error } =
    kind === "invite"
      ? await supabase.from("invites").delete().eq("id", memberId)
      : await supabase
          .from("profiles")
          .delete()
          .eq("id", memberId)
          .neq("role", "owner");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
