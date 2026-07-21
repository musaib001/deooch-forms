// Preset palettes for the public form. Each theme is stored on the form as its
// slug and expanded to CSS custom properties at render time, so the whole
// renderer keeps using bg-brand / text-foreground and inherits the theme for
// free.
//
// ponytail: presets only, no custom colour picker. Every combination here is
// hand-checked for contrast; a free-form picker would need a runtime contrast
// guard to keep labels readable. Add one when someone actually asks.
export type FormTheme = {
  slug: string;
  name: string;
  vars: {
    /** The surround behind the form card. Saturated on most themes. */
    page: string;
    /** Text sitting directly on `page`, outside the card. */
    pageForeground: string;
    background: string;
    foreground: string;
    card: string;
    muted: string;
    mutedForeground: string;
    border: string;
    brand: string;
    brandHover: string;
    brandForeground: string;
    brandSubtle: string;
  };
};

export const FORM_THEMES: FormTheme[] = [
  {
    slug: "default",
    name: "Default",
    vars: {
      page: "#f7f6f4",
      pageForeground: "#78716c",
      background: "#f7f6f4",
      foreground: "#1c1917",
      card: "#ffffff",
      muted: "#f5f5f4",
      mutedForeground: "#78716c",
      border: "#e7e5e4",
      brand: "#4f46e5",
      brandHover: "#4338ca",
      brandForeground: "#ffffff",
      brandSubtle: "#eef0ff",
    },
  },
  {
    slug: "midnight",
    name: "Midnight",
    vars: {
      page: "#0f172a",
      pageForeground: "#94a3b8",
      background: "#0f172a",
      foreground: "#f1f5f9",
      card: "#1e293b",
      muted: "#334155",
      mutedForeground: "#cbd5e1",
      border: "#334155",
      brand: "#60a5fa",
      brandHover: "#93c5fd",
      brandForeground: "#0f172a",
      brandSubtle: "#1d3a5f",
    },
  },
  {
    slug: "royal",
    name: "Royal",
    vars: {
      page: "#2f55b3",
      pageForeground: "#dbe4f7",
      background: "#f5f8fe",
      foreground: "#16213f",
      card: "#ffffff",
      muted: "#eef3fc",
      mutedForeground: "#5f7196",
      border: "#d8e2f4",
      brand: "#2f55b3",
      brandHover: "#26478f",
      brandForeground: "#ffffff",
      brandSubtle: "#dbe4f7",
    },
  },
  {
    slug: "forest",
    name: "Forest",
    vars: {
      page: "#166534",
      pageForeground: "#bbf7d0",
      background: "#f0fdf4",
      foreground: "#14251a",
      card: "#ffffff",
      muted: "#f1f8f3",
      mutedForeground: "#5c7266",
      border: "#d5e8dc",
      brand: "#16a34a",
      brandHover: "#15803d",
      brandForeground: "#ffffff",
      brandSubtle: "#dcfce7",
    },
  },
  {
    slug: "ocean",
    name: "Ocean",
    vars: {
      page: "#0e7490",
      pageForeground: "#cffafe",
      background: "#f0f9fb",
      foreground: "#102a33",
      card: "#ffffff",
      muted: "#eef7fa",
      mutedForeground: "#5b7684",
      border: "#d4e8ee",
      brand: "#0891b2",
      brandHover: "#0e7490",
      brandForeground: "#ffffff",
      brandSubtle: "#cffafe",
    },
  },
  {
    slug: "sunset",
    name: "Sunset",
    vars: {
      page: "#c2410c",
      pageForeground: "#ffedd5",
      background: "#fff8f3",
      foreground: "#2c1810",
      card: "#ffffff",
      muted: "#fdf3ec",
      mutedForeground: "#8a6a58",
      border: "#f2ded0",
      brand: "#ea580c",
      brandHover: "#c2410c",
      brandForeground: "#ffffff",
      brandSubtle: "#ffedd5",
    },
  },
  {
    slug: "rose",
    name: "Rose",
    vars: {
      page: "#be123c",
      pageForeground: "#ffe4e6",
      background: "#fff5f7",
      foreground: "#2b1119",
      card: "#ffffff",
      muted: "#fdeff2",
      mutedForeground: "#8a6470",
      border: "#f6dbe2",
      brand: "#e11d48",
      brandHover: "#be123c",
      brandForeground: "#ffffff",
      brandSubtle: "#ffe4e6",
    },
  },
  {
    slug: "plum",
    name: "Plum",
    vars: {
      page: "#5b21b6",
      pageForeground: "#ddd6fe",
      background: "#faf7ff",
      foreground: "#241633",
      card: "#ffffff",
      muted: "#f5f0fd",
      mutedForeground: "#75688a",
      border: "#e7dcf7",
      brand: "#7c3aed",
      brandHover: "#6d28d9",
      brandForeground: "#ffffff",
      brandSubtle: "#ede9fe",
    },
  },
  {
    slug: "slate",
    name: "Slate",
    vars: {
      page: "#334155",
      pageForeground: "#cbd5e1",
      background: "#f8fafc",
      foreground: "#0f172a",
      card: "#ffffff",
      muted: "#f1f5f9",
      mutedForeground: "#64748b",
      border: "#e2e8f0",
      brand: "#475569",
      brandHover: "#334155",
      brandForeground: "#ffffff",
      brandSubtle: "#e2e8f0",
    },
  },
  {
    slug: "ink",
    name: "Ink",
    vars: {
      page: "#111827",
      pageForeground: "#9ca3af",
      background: "#111827",
      foreground: "#f9fafb",
      card: "#1f2937",
      muted: "#374151",
      mutedForeground: "#d1d5db",
      border: "#374151",
      brand: "#fbbf24",
      brandHover: "#fcd34d",
      brandForeground: "#111827",
      brandSubtle: "#3f3418",
    },
  },
];

export const DEFAULT_THEME = FORM_THEMES[0];

export function themeBySlug(slug: string | null | undefined) {
  return FORM_THEMES.find((t) => t.slug === slug) ?? DEFAULT_THEME;
}

/** Inline style overriding the globals.css palette for one form's subtree. */
export function themeStyle(slug: string | null | undefined): React.CSSProperties {
  const { vars } = themeBySlug(slug);
  return {
    "--background": vars.background,
    "--foreground": vars.foreground,
    "--card": vars.card,
    "--muted": vars.muted,
    "--muted-foreground": vars.mutedForeground,
    "--border": vars.border,
    "--input": vars.border,
    "--ring": vars.brand,
    "--brand": vars.brand,
    "--brand-hover": vars.brandHover,
    "--brand-foreground": vars.brandForeground,
    "--brand-subtle": vars.brandSubtle,
    "--page-foreground": vars.pageForeground,
    backgroundColor: vars.page,
  } as React.CSSProperties;
}
