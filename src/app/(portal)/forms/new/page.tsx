import Link from "next/link";
import { FormBuilder } from "@/components/forms/FormBuilder";

export default function NewFormPage() {
  return (
    <div>
      <Link
        href="/dashboard"
        className="mb-4 inline-block text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to forms
      </Link>
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-foreground">
        New form
      </h1>
      <FormBuilder />
    </div>
  );
}
