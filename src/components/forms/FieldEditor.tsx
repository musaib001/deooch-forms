"use client";

import {
  CHOICE_FIELD_TYPES,
  FIELD_TYPES,
  FIELD_TYPE_LABELS,
  type Field,
} from "@/lib/forms/schema";
import { OptionsEditor } from "./OptionsEditor";

const smallInput =
  "w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground outline-none transition-[border-color,box-shadow] duration-100 placeholder:text-muted-foreground/70 focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-ring/40";

const iconButton =
  "flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40";

export function FieldEditor({
  field,
  index,
  total,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  field: Field;
  index: number;
  total: number;
  onChange: (field: Field) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const isChoice = CHOICE_FIELD_TYPES.includes(field.type);
  const isHeading = field.type === "heading";

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1 space-y-2.5">
          <input
            className={smallInput + " font-medium"}
            placeholder={isHeading ? "Section heading" : "Field label"}
            value={field.label}
            onChange={(e) => onChange({ ...field, label: e.target.value })}
          />

          {!isHeading && (
            <div className="flex flex-wrap items-center gap-2">
              <select
                className={smallInput + " w-auto"}
                value={field.type}
                onChange={(e) =>
                  onChange({ ...field, type: e.target.value as Field["type"] })
                }
              >
                {FIELD_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {FIELD_TYPE_LABELS[t]}
                  </option>
                ))}
              </select>
              <label className="flex select-none items-center gap-1.5 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded accent-brand"
                  checked={field.required}
                  onChange={(e) =>
                    onChange({ ...field, required: e.target.checked })
                  }
                />
                Required
              </label>
            </div>
          )}

          {isHeading && (
            <select
              className={smallInput + " w-auto"}
              value={field.type}
              onChange={(e) =>
                onChange({ ...field, type: e.target.value as Field["type"] })
              }
            >
              {FIELD_TYPES.map((t) => (
                <option key={t} value={t}>
                  {FIELD_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          )}

          {!isHeading && (
            <input
              className={smallInput}
              placeholder="Placeholder (optional)"
              value={field.placeholder ?? ""}
              onChange={(e) =>
                onChange({ ...field, placeholder: e.target.value })
              }
            />
          )}

          {!isHeading && (
            <input
              className={smallInput}
              placeholder="Help text shown under the field (optional)"
              value={field.helpText ?? ""}
              onChange={(e) => onChange({ ...field, helpText: e.target.value })}
            />
          )}

          {isChoice && (
            <OptionsEditor
              type={field.type}
              options={field.options ?? []}
              onChange={(options) => onChange({ ...field, options })}
            />
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            aria-label="Move field up"
            className={iconButton}
          >
            ↑
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === total - 1}
            aria-label="Move field down"
            className={iconButton}
          >
            ↓
          </button>
          <button
            type="button"
            onClick={onRemove}
            aria-label="Remove field"
            className={
              iconButton + " hover:border-destructive/40 hover:text-destructive"
            }
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
