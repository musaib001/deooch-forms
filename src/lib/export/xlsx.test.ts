import { describe, it, expect } from "vitest";
import ExcelJS from "exceljs";
import { buildSubmissionsWorkbook } from "./xlsx";
import type { Field } from "@/lib/forms/schema";

const fields: Field[] = [
  { id: "s1", type: "heading", label: "Section", required: false, order: 0 },
  { id: "name", type: "text", label: "Name", required: true, order: 1 },
  {
    id: "dept",
    type: "checkbox",
    label: "Departments",
    required: false,
    order: 2,
    options: ["Pharmacy", "Nursing"],
  },
];

const submissions = [
  {
    answers: { name: "Ada", dept: ["Pharmacy", "Nursing"] },
    submitted_at: "2026-07-15T10:00:00Z",
  },
];

async function readBack(buffer: ArrayBuffer) {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(buffer);
  const sheet = wb.worksheets[0];
  return sheet;
}

describe("buildSubmissionsWorkbook", () => {
  it("produces a non-empty workbook buffer", async () => {
    const buffer = await buildSubmissionsWorkbook("My Form", fields, submissions);
    expect(buffer.byteLength).toBeGreaterThan(0);
  });

  it("uses field labels as headers and excludes heading fields", async () => {
    const buffer = await buildSubmissionsWorkbook("My Form", fields, submissions);
    const sheet = await readBack(buffer);
    const headers = (sheet.getRow(1).values as unknown[]).filter(Boolean);

    expect(headers).toContain("Name");
    expect(headers).toContain("Departments");
    expect(headers).toContain("Submitted At");
    expect(headers).not.toContain("Section");
  });

  it("joins checkbox arrays with a comma", async () => {
    const buffer = await buildSubmissionsWorkbook("My Form", fields, submissions);
    const sheet = await readBack(buffer);
    const row = sheet.getRow(2).values as unknown[];

    expect(row).toContain("Ada");
    expect(row).toContain("Pharmacy, Nursing");
  });
});
