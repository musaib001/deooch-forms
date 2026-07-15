import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=not_invited`);
  }

  const supabase = await createClient();
  const { error: exchangeError } =
    await supabase.auth.exchangeCodeForSession(code);
  if (exchangeError) {
    return NextResponse.redirect(`${origin}/login?error=not_invited`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.redirect(`${origin}/login?error=not_invited`);
  }

  const admin = createAdminClient();

  const { data: existingProfile } = await admin
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!existingProfile) {
    const isOwner =
      user.email.toLowerCase() === process.env.OWNER_EMAIL?.toLowerCase();

    if (isOwner) {
      await admin
        .from("profiles")
        .insert({ id: user.id, email: user.email, role: "owner" });
    } else {
      const { data: invite } = await admin
        .from("invites")
        .select("id, accepted")
        .eq("email", user.email)
        .maybeSingle();

      if (!invite || invite.accepted) {
        await supabase.auth.signOut();
        return NextResponse.redirect(`${origin}/login?error=not_invited`);
      }

      await admin
        .from("profiles")
        .insert({ id: user.id, email: user.email, role: "member" });
      await admin.from("invites").update({ accepted: true }).eq("id", invite.id);
    }
  }

  return NextResponse.redirect(`${origin}/dashboard`);
}
