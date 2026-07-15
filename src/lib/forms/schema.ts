import { z } from "zod";

export const FIELD_TYPES = [
  "text",
  "textarea",
  "email",
  "number",
  "select",
  "radio",
  "checkbox",
  "date",
  "file",
] as const;

export type FieldType = (typeof FIELD_TYPES)[number];

export const fieldSchema = z.object({
  id: z.string(),
  type: z.enum(FIELD_TYPES),
  label: z.string().min(1),
  required: z.boolean().default(false),
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
