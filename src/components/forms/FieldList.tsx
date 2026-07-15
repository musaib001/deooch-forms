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

  function addField() {
    onChange([
      ...fields,
      {
        id: newFieldId(),
        type: "text",
        label: "",
        required: false,
        order: fields.length,
      },
    ]);
  }

  return (
    <div className="flex flex-col gap-3">
      {fields.map((field, i) => (
        <FieldEditor
          key={field.id}
          field={field}
          onChange={(f) => update(i, f)}
          onRemove={() => remove(i)}
          onMoveUp={() => move(i, -1)}
          onMoveDown={() => move(i, 1)}
        />
      ))}
      <button
        type="button"
        onClick={addField}
        className="self-start rounded border px-3 py-1 text-sm hover:bg-gray-50"
      >
        + Add field
      </button>
    </div>
  );
}
