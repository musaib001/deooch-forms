"use client";

import { useState } from "react";
import { PublicFormRenderer } from "@/components/forms/PublicFormRenderer";
import { ThemeSwatches } from "@/components/forms/ThemeSwatches";
import { DEFAULT_THEME } from "@/lib/forms/themes";
import type { FormTemplate } from "@/lib/forms/templates";

// The swatch row is pinned under a scrollable preview: picking a palette
// re-themes the real renderer in place, so visitors see the actual form rather
// than a mockup of it.
export function TemplatePreview({ template }: { template: FormTemplate }) {
  const [theme, setTheme] = useState(template.theme ?? DEFAULT_THEME.slug);

  return (
    <div className="overflow-hidden rounded-2xl border border-border shadow-sm">
      <div className="max-h-[75vh] overflow-y-auto">
        <PublicFormRenderer
          formId="template-preview"
          slug={template.slug}
          title={template.name}
          description={template.description}
          fields={template.fields}
          theme={theme}
          preview
        />
      </div>
      <div className="border-t border-border bg-muted px-4 py-3">
        <ThemeSwatches value={theme} onChange={setTheme} />
      </div>
    </div>
  );
}
