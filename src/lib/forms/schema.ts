import { z } from "zod";

// `heading` is a display-only section title (no input, no answer). All other
// types collect a value.
export const FIELD_TYPES = [
  "text",
  "textarea",
  "email",
  "phone",
  "address",
  "number",
  "select",
  "radio",
  "checkbox",
  "date",
  "file",
  "upload",
  "heading",
] as const;

export type FieldType = (typeof FIELD_TYPES)[number];

export const INPUT_FIELD_TYPES = FIELD_TYPES.filter((t) => t !== "heading");

export const CHOICE_FIELD_TYPES: FieldType[] = ["select", "radio", "checkbox"];

export const FIELD_TYPE_LABELS: Record<FieldType, string> = {
  text: "Short text",
  textarea: "Long text",
  email: "Email",
  phone: "Phone",
  address: "Address",
  number: "Number",
  select: "Dropdown",
  radio: "Single choice",
  checkbox: "Multiple choice",
  date: "Date",
  file: "File link",
  upload: "File upload",
  heading: "Section heading",
};

export const fieldSchema = z.object({
  id: z.string(),
  type: z.enum(FIELD_TYPES),
  label: z.string().min(1),
  required: z.boolean().default(false),
  placeholder: z.string().optional(),
  helpText: z.string().optional(),
  options: z.array(z.string()).optional(),
  order: z.number(),
});

export type Field = z.infer<typeof fieldSchema>;

export const formStatusSchema = z.enum(["draft", "published", "closed"]);
export type FormStatus = z.infer<typeof formStatusSchema>;

export const createFormSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  fields: z.array(fieldSchema).default([]),
});

export const updateFormSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  fields: z.array(fieldSchema).optional(),
  status: formStatusSchema.optional(),
});

export function newFieldId() {
  return crypto.randomUUID();
}

export function isInputField(field: Field) {
  return field.type !== "heading";
}
