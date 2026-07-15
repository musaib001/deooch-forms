import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

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
      <aside className="w-56 shrink-0 border-r p-4 flex flex-col gap-2">
        <span className="mb-4 text-lg font-semibold">deoochform</span>
        <Link href="/dashboard" className="rounded px-2 py-1 hover:bg-gray-100">
          Forms
        </Link>
        {profile.role === "owner" && (
          <Link
            href="/settings/members"
            className="rounded px-2 py-1 hover:bg-gray-100"
          >
            Members
          </Link>
        )}
        <Link
          href="/settings/tokens"
          className="rounded px-2 py-1 hover:bg-gray-100"
        >
          API Tokens
        </Link>
        <form action={signOut} className="mt-auto">
          <button className="w-full rounded px-2 py-1 text-left text-sm text-gray-500 hover:bg-gray-100">
            Sign out ({profile.email})
          </button>
        </form>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
