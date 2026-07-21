"use client";

import { FORM_THEMES } from "@/lib/forms/themes";

/**
 * Palette picker. Each swatch is an "A" drawn in the theme's own card, brand,
 * and page colours, so it previews the actual combination rather than a single
 * flat hue. Shared by the builder inspector and the public template preview.
 */
export function ThemeSwatches({
  value,
  onChange,
  size = "md",
}: {
  value: string;
  onChange: (slug: string) => void;
  size?: "sm" | "md";
}) {
  const box = size === "sm" ? "h-8 w-8 text-sm" : "h-10 w-10 text-base";

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {FORM_THEMES.map((t) => {
        const active = value === t.slug;
        return (
          <button
            key={t.slug}
            type="button"
            title={t.name}
            aria-label={t.name}
            aria-pressed={active}
            onClick={() => onChange(t.slug)}
            style={{
              background: t.vars.card,
              color: t.vars.brand,
              borderColor: active ? t.vars.brand : t.vars.page,
            }}
            className={
              "flex shrink-0 items-center justify-center rounded-lg border-[3px] font-bold transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
              box +
              (active ? " scale-105 shadow-md" : "")
            }
          >
            A
          </button>
        );
      })}
    </div>
  );
}
