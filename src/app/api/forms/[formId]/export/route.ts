import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSessionProfile } from "@/lib/auth/session";
import { buildSubmissionsWorkbook } from "@/lib/export/xlsx";

type Params = { params: Promise<{ formId: string }> };

export async function GET(_request: Request, { params }: Params) {
  const profile = await getSessionProfile();
  if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { formId } = await params;
  const supabase = await createClient();

  const [{ data: form }, { data: submissions }] = await Promise.all([
    supabase.from("forms").select("title, slug, fields").eq("id", formId).single(),
    supabase
      .from("submissions")
      .select("answers, submitted_at")
      .eq("form_id", formId)
      .order("submitted_at", { ascending: false }),
  ]);

  if (!form) return NextResponse.json({ error: "Form not found" }, { status: 404 });

  const buffer = await buildSubmissionsWorkbook(
    form.title,
    form.fields,
    submissions ?? []
  );

  return new NextResponse(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${form.slug}-submissions.xlsx"`,
    },
  });
}
