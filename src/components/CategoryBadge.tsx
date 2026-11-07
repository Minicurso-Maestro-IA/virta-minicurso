export interface CategoryBadgeProps {
  name?: string | null;
  color?: string | null;
}

/** Small colored pill showing a category, tinted with its own color. */
export function CategoryBadge({
  name,
  color,
}: CategoryBadgeProps) {
  if (!name || !name.trim()) {
    return null;
  }

  const padrao = "#71717a";
  const c = color?.trim() ? color : padrao;

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
      style={{ backgroundColor: `${c}1a`, background: `${c}1a`, color: c }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: c, background: c }}
      />
      {name}
    </span>
  );
}
