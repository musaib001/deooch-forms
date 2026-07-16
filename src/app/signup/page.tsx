import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { EmailAuthForm } from "@/components/auth/EmailAuthForm";

export default function SignupPage() {
  return (
    <AuthShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Create your account
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Free plan includes 2 forms and 50 submissions.
        </p>
      </div>

      <GoogleButton label="Sign up with Google" />

      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          or
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <EmailAuthForm mode="signup" />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-brand hover:text-brand-hover">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
