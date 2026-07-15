import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getSessionProfile } from "@/lib/auth/session";

export async function GET() {
  const profile = await getSessionProfile();
  if (!profile || profile.role !== "owner") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = await createClient();
  const [{ data: members }, { data: invites }] = await Promise.all([
    supabase.from("profiles").select("id, email, role, created_at"),
    supabase
      .from("invites")
      .select("id, email, created_at")
      .eq("accepted", false),
  ]);

  return NextResponse.json({
    members: (members ?? []).map((m) => ({ ...m, kind: "member" as const })),
    pendingInvites: (invites ?? []).map((i) => ({ ...i, kind: "invite" as const })),
  });
}

const inviteSchema = z.object({ email: z.string().email() });

export async function POST(request: Request) {
  const profile = await getSessionProfile();
  if (!profile || profile.role !== "owner") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = inviteSchema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ error: body.error.flatten() }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("invites")
    .insert({ email: body.data.email.toLowerCase(), invited_by: profile.id })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ invite: data }, { status: 201 });
}
