import type { Field } from "@/lib/forms/schema";

// A flat, non-interactive sketch of the form — enough to recognise its shape at
// card size.
//
// ponytail: drawn from the field list rather than screenshotted, so it can never
// drift from the template. Swap for real screenshots only if the fidelity
// actually sells more templates.
export function TemplateThumb({ title, fields }: { title: string; fields: Field[] }) {
  return (
    <div className="pointer-events-none select-none px-6 py-5">
      <p className="mb-4 text-center text-[11px] font-bold tracking-tight text-foreground">
        {title}
      </p>
      <div className="flex flex-col gap-3">
        {fields.slice(0, 10).map((field) =>
          field.type === "heading" ? (
            <p
              key={field.id}
              className="mt-1 border-b border-border pb-1 text-[9px] font-bold text-foreground"
            >
              {field.label}
            </p>
          ) : (
            <div key={field.id} className="flex flex-col gap-1">
              <span className="truncate text-[8px] font-medium text-muted-foreground">
                {field.label}
              </span>
              <Control field={field} />
            </div>
          )
        )}
      </div>
    </div>
  );
}

function Control({ field }: { field: Field }) {
  switch (field.type) {
    case "radio":
    case "checkbox":
      return (
        <div className="flex flex-col gap-1">
          {(field.options ?? ["Option"]).slice(0, 3).map((opt) => (
            <span key={opt} className="flex items-center gap-1.5">
              <span
                className={
                  "h-2 w-2 shrink-0 border border-input bg-background " +
                  (field.type === "radio" ? "rounded-full" : "rounded-[2px]")
                }
              />
              <span className="truncate text-[8px] text-foreground/70">{opt}</span>
            </span>
          ))}
        </div>
      );
    case "textarea":
      return <span className="block h-8 rounded border border-input bg-muted/40" />;
    case "signature":
      return (
        <span className="flex h-8 items-center justify-center rounded border border-dashed border-input text-[8px] text-muted-foreground">
          Sign here
        </span>
      );
    case "upload":
      return (
        <span className="flex h-6 items-center justify-center rounded border border-dashed border-input text-[8px] text-muted-foreground">
          Choose a file
        </span>
      );
    case "address":
      return (
        <span className="grid grid-cols-2 gap-1">
          <span className="col-span-2 h-3.5 rounded border border-input bg-muted/40" />
          <span className="h-3.5 rounded border border-input bg-muted/40" />
          <span className="h-3.5 rounded border border-input bg-muted/40" />
        </span>
      );
    default:
      return <span className="block h-3.5 rounded border border-input bg-muted/40" />;
  }
}
