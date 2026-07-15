import { TokensTable } from "@/components/settings/TokensTable";

export default function TokensPage() {
  return (
    <div>
      <h1 className="mb-2 text-xl font-semibold">API Tokens</h1>
      <p className="mb-6 text-sm text-gray-500">
        Use a token to connect Claude or GPT to this workspace via MCP at{" "}
        <code>{`${process.env.NEXT_PUBLIC_APP_URL ?? ""}/api/mcp`}</code>.
      </p>
      <TokensTable />
    </div>
  );
}
