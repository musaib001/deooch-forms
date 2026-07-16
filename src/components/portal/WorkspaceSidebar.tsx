import Link from "next/link";
import {
  Archive,
  FileEdit,
  LayoutGrid,
  Star,
  Trash2,
  type LucideIcon,
} from "lucide-react";

export type ViewId = "all" | "drafts" | "favorites" | "archive" | "trash";

export const VIEWS: { id: ViewId; label: string; icon: LucideIcon }[] = [
  { id: "all", label: "All", icon: LayoutGrid },
  { id: "drafts", label: "Drafts", icon: FileEdit },
  { id: "favorites", label: "Favorites", icon: Star },
  { id: "archive", label: "Archive", icon: Archive },
  { id: "trash", label: "Trash", icon: Trash2 },
];

export function isViewId(value: string | undefined): value is ViewId {
  return VIEWS.some((v) => v.id === value);
}

export function WorkspaceSidebar({
  active,
  counts,
}: {
  active: ViewId;
  counts: Record<ViewId, number>;
}) {
  return (
    <nav aria-label="Workspace views" className="flex flex-col gap-0.5">
      <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        My Workspace
      </p>
      {VIEWS.map(({ id, label, icon: Icon }) => {
        const isActive = id === active;
        return (
          <Link
            key={id}
            href={id === "all" ? "/dashboard" : `/dashboard?view=${id}`}
            aria-current={isActive ? "page" : undefined}
            className={
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors " +
              (isActive
                ? "bg-brand-subtle text-brand"
                : "text-foreground hover:bg-muted")
            }
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden />
            <span className="flex-1 truncate">{label}</span>
            {counts[id] > 0 && (
              <span
                className={
                  "shrink-0 text-xs font-semibold tabular-nums " +
                  (isActive ? "text-brand" : "text-muted-foreground")
                }
              >
                {counts[id]}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
