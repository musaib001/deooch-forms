import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { NavLink } from "@/components/portal/NavLink";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getSessionProfile();
  if (!profile) redirect("/login");

  async function signOut() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-card px-3 py-5">
        <Link href="/dashboard" className="mb-6 flex items-center gap-2 px-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand text-sm font-bold text-brand-foreground">
            d
          </span>
          <span className="text-base font-semibold tracking-tight text-foreground">
            deoochform
          </span>
        </Link>

        <nav className="flex flex-col gap-1">
          <NavLink href="/dashboard" label="Forms" />
          {profile.role === "owner" && (
            <NavLink href="/settings/members" label="Members" />
          )}
          <NavLink href="/settings/tokens" label="API Tokens" />
        </nav>

        <form action={signOut} className="mt-auto border-t border-border pt-3">
          <p className="truncate px-2 pb-2 text-xs text-muted-foreground" title={profile.email}>
            {profile.email}
          </p>
          <button className="w-full rounded-lg px-2 py-1.5 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            Sign out
          </button>
        </form>
      </aside>

      <main className="flex-1 px-8 py-10">
        <div className="mx-auto max-w-4xl">{children}</div>
      </main>
    </div>
  );
}
