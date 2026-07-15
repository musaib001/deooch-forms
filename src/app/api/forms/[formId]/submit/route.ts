import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { Field } from "@/lib/forms/schema";

const submitSchema = z.object({
  answers: z.record(z.string(), z.union([z.string(), z.array(z.string())])),
});

type Params = { params: Promise<{ formId: string }> };

// ponytail: no rate limiting yet; add an Upstash/Vercel-KV token bucket
// keyed by IP+formId if abusive public submissions become a problem.
export async function POST(request: Request, { params }: Params) {
  const { formId } = await params;
  const body = submitSchema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ error: body.error.flatten() }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: form } = await supabase
    .from("forms")
    .select("id, status, fields")
    .eq("id", formId)
    .eq("status", "published")
    .single();

  if (!form) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }

  const missingRequired = (form.fields as Field[]).some(
    (field) => field.required && !body.data.answers[field.id]
  );
  if (missingRequired) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const { error } = await supabase.from("submissions").insert({
    form_id: formId,
    answers: body.data.answers,
    respondent_meta: {
      userAgent: request.headers.get("user-agent"),
    },
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true }, { status: 201 });
}
