import type { Field } from "@/lib/forms/schema";

type Submission = {
  id: string;
  answers: Record<string, string | string[]>;
  submitted_at: string;
};

function formatAnswer(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value.join(", ");
  return value ?? "";
}

export function SubmissionsTable({
  fields,
  submissions,
}: {
  fields: Field[];
  submissions: Submission[];
}) {
  const orderedFields = [...fields].sort((a, b) => a.order - b.order);

  if (!submissions.length) {
    return <p className="text-gray-500">No submissions yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b text-gray-500">
            {orderedFields.map((field) => (
              <th key={field.id} className="py-2 pr-4">
                {field.label}
              </th>
            ))}
            <th className="py-2 pr-4">Submitted at</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission) => (
            <tr key={submission.id} className="border-b">
              {orderedFields.map((field) => (
                <td key={field.id} className="py-2 pr-4">
                  {formatAnswer(submission.answers[field.id])}
                </td>
              ))}
              <td className="py-2 pr-4">
                {new Date(submission.submitted_at).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
