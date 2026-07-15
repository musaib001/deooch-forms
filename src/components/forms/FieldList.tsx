"use client";

import { newFieldId, type Field } from "@/lib/forms/schema";
import { FieldEditor } from "./FieldEditor";

export function FieldList({
  fields,
  onChange,
}: {
  fields: Field[];
  onChange: (fields: Field[]) => void;
}) {
  function update(index: number, field: Field) {
    const next = [...fields];
    next[index] = field;
    onChange(next);
  }

  function remove(index: number) {
    onChange(
      fields.filter((_, i) => i !== index).map((f, i) => ({ ...f, order: i }))
    );
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= fields.length) return;
    const next = [...fields];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next.map((f, i) => ({ ...f, order: i })));
  }

  function add(type: Field["type"]) {
    onChange([
      ...fields,
      {
        id: newFieldId(),
        type,
        label: "",
        required: false,
        order: fields.length,
      },
    ]);
  }

  return (
    <div className="flex flex-col gap-3">
      {fields.length === 0 && (
        <div className="rounded-xl border border-dashed border-border bg-card/50 px-4 py-8 text-center text-sm text-muted-foreground">
          No fields yet. Add your first field below.
        </div>
      )}

      {fields.map((field, i) => (
        <FieldEditor
          key={field.id}
          field={field}
          index={i}
          total={fields.length}
          onChange={(f) => update(i, f)}
          onRemove={() => remove(i)}
          onMoveUp={() => move(i, -1)}
          onMoveDown={() => move(i, 1)}
        />
      ))}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => add("text")}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          + Add field
        </button>
        <button
          type="button"
          onClick={() => add("heading")}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-medium text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          + Add section heading
        </button>
      </div>
    </div>
  );
}
