"use client";

import { FIELD_TYPES, type Field } from "@/lib/forms/schema";

const CHOICE_TYPES: Field["type"][] = ["select", "radio", "checkbox"];

export function FieldEditor({
  field,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  field: Field;
  onChange: (field: Field) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const isChoiceType = CHOICE_TYPES.includes(field.type);

  return (
    <div className="flex flex-col gap-2 rounded border p-3">
      <div className="flex items-center gap-2">
        <input
          className="flex-1 rounded border px-2 py-1"
          placeholder="Field label"
          value={field.label}
          onChange={(e) => onChange({ ...field, label: e.target.value })}
        />
        <select
          className="rounded border px-2 py-1"
          value={field.type}
          onChange={(e) =>
            onChange({ ...field, type: e.target.value as Field["type"] })
          }
        >
          {FIELD_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-1 text-sm">
          <input
            type="checkbox"
            checked={field.required}
            onChange={(e) => onChange({ ...field, required: e.target.checked })}
          />
          Required
        </label>
        <button type="button" onClick={onMoveUp} className="px-1 text-sm">
          ↑
        </button>
        <button type="button" onClick={onMoveDown} className="px-1 text-sm">
          ↓
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="px-1 text-sm text-red-600"
        >
          Remove
        </button>
      </div>
      {isChoiceType && (
        <input
          className="rounded border px-2 py-1 text-sm"
          placeholder="Options, comma separated"
          value={(field.options ?? []).join(", ")}
          onChange={(e) =>
            onChange({
              ...field,
              options: e.target.value
                .split(",")
                .map((o) => o.trim())
                .filter(Boolean),
            })
          }
        />
      )}
    </div>
  );
}
