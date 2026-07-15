import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getSessionProfile } from "@/lib/auth/session";
import { generateToken } from "@/lib/auth/pat";

export async function GET() {
  const profile = await getSessionProfile();
  if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("api_tokens")
    .select("id, name, created_at, last_used_at, revoked_at")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ tokens: data });
}

const createTokenSchema = z.object({ name: z.string().min(1) });

export async function POST(request: Request) {
  const profile = await getSessionProfile();
  if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = createTokenSchema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ error: body.error.flatten() }, { status: 400 });
  }

  const { raw, hash } = generateToken();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("api_tokens")
    .insert({ user_id: profile.id, name: body.data.name, token_hash: hash })
    .select("id, name, created_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ token: { ...data, raw } }, { status: 201 });
}
