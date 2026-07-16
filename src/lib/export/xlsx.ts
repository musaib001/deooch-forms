import ExcelJS from "exceljs";
import type { Field } from "@/lib/forms/schema";
import { isInputField } from "@/lib/forms/schema";
import { formatAddress } from "@/lib/forms/address";

type Submission = {
  answers: Record<string, string | string[]>;
  submitted_at: string;
};

// Address slots are positional and often partly blank, so a plain join emits
// empty segments ("1 Main St, , Berlin, , 10115, "). formatAddress drops them.
function formatAnswer(field: Field, value: string | string[] | undefined) {
  if (field.type === "address") return formatAddress(value);
  if (Array.isArray(value)) return value.join(", ");
  return value ?? "";
}

// ponytail: buffered write is fine at v1 submission volumes; switch to
// ExcelJS's stream.xlsx.WorkbookWriter if a form's export starts timing out.
export async function buildSubmissionsWorkbook(
  formTitle: string,
  fields: Field[],
  submissions: Submission[]
) {
  const orderedFields = [...fields]
    .filter(isInputField)
    .sort((a, b) => a.order - b.order);

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(formTitle.slice(0, 31) || "Submissions");

  sheet.columns = [
    ...orderedFields.map((field) => ({ header: field.label, key: field.id })),
    { header: "Submitted At", key: "submittedAt" },
  ];

  for (const submission of submissions) {
    sheet.addRow({
      ...Object.fromEntries(
        orderedFields.map((field) => [
          field.id,
          formatAnswer(field, submission.answers[field.id]),
        ])
      ),
      submittedAt: new Date(submission.submitted_at).toLocaleString(),
    });
  }

  return workbook.xlsx.writeBuffer();
}
