"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";

const ERROR_MESSAGES: Record<string, string> = {
  not_invited: "That Google account hasn't been invited to this workspace.",
};

async function signInWithGoogle() {
  const supabase = createClient();
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  });
}

function LoginError() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  if (!error) return null;

  return (
    <p className="rounded bg-red-50 p-3 text-sm text-red-700">
      {ERROR_MESSAGES[error] ?? "Sign-in failed. Please try again."}
    </p>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-4 text-center">
        <h1 className="text-2xl font-semibold">deoochform</h1>
        <Suspense fallback={null}>
          <LoginError />
        </Suspense>
        <button
          onClick={signInWithGoogle}
          className="w-full rounded bg-black px-4 py-2 text-white hover:bg-gray-800"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
