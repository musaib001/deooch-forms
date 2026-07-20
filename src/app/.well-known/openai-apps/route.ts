// Domain verification for the ChatGPT app directory. OpenAI issues the token
// at submission time; set OPENAI_APPS_VERIFICATION_TOKEN and redeploy, then
// hit Verify in the platform dashboard.
export const dynamic = "force-static";

export function GET() {
  const token = process.env.OPENAI_APPS_VERIFICATION_TOKEN;
  if (!token) return new Response("Not found", { status: 404 });
  return new Response(token, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
