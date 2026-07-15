import { redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/auth/session";
import { MembersTable } from "@/components/settings/MembersTable";

export default async function MembersPage() {
  const profile = await getSessionProfile();
  if (profile?.role !== "owner") redirect("/dashboard");

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">Members</h1>
      <MembersTable />
    </div>
  );
}
