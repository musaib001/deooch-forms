// The deoochform mark: a solid D with the F knocked out as two bars, which
// double as form rows. Keep this path in sync with app/icon.svg + apple-icon.svg.
// The tile gradient comes from --logo-gradient so re-theming happens in one place.
export function BrandMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <span
      className={`flex items-center justify-center rounded-lg bg-[image:var(--logo-gradient)] text-logo-foreground ${className}`}
    >
      <svg
        // Cropped to the glyph's bounding box so the tile controls the padding.
        viewBox="8 8 30 32"
        className="h-[62%] w-[62%]"
        fill="currentColor"
        aria-hidden
      >
        <path
          fillRule="evenodd"
          d="M11 9h11a15 15 0 0 1 0 30H11a2 2 0 0 1-2-2V11a2 2 0 0 1 2-2Zm5.5 8.5h16a1.75 1.75 0 0 1 0 3.5h-16a1.75 1.75 0 0 1 0-3.5Zm0 9.5h10a1.75 1.75 0 0 1 0 3.5h-10a1.75 1.75 0 0 1 0-3.5Z"
        />
      </svg>
    </span>
  );
}
