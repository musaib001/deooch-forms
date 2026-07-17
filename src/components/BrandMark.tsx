// The deoochform mark: a checked form/checklist glyph on the brand tile.
// currentColor drives the glyph so it inherits brand-foreground on the tile.
export function BrandMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <span
      className={`flex items-center justify-center rounded-lg bg-brand text-brand-foreground ${className}`}
    >
      <svg
        viewBox="0 0 32 32"
        className="h-[60%] w-[60%]"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M7 11l1.9 1.9L12.5 9.3" />
        <path d="M16.5 11.5H25" />
        <path d="M7 20l1.9 1.9L12.5 18.3" />
        <path d="M16.5 20.5H25" />
      </svg>
    </span>
  );
}
