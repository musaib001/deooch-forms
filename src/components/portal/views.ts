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
