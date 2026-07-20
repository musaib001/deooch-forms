import { beforeAll, describe, expect, it } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";

// createAdminClient() runs at server construction; a fake URL/key is enough
// because listing tools never issues a query.
beforeAll(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL ??= "https://stub.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY ??= "stub-key";
});

const READ_ONLY = ["get_form", "list_forms", "list_submissions", "get_submission"];
const WRITES = ["create_form", "update_form"];

async function listTools() {
  const { createMcpServer } = await import("./server");
  const server = createMcpServer({
    id: "u1",
    email: "a@b.co",
    role: "owner",
    plan: "free",
  });
  const client = new Client({ name: "test", version: "0" });
  const [clientSide, serverSide] = InMemoryTransport.createLinkedPair();
  await Promise.all([server.connect(serverSide), client.connect(clientSide)]);
  return (await client.listTools()).tools;
}

describe("mcp server descriptors", () => {
  // The ChatGPT and Claude directories both reject servers whose tools are
  // missing titles, annotations, or output schemas. Catch that before review.
  it("gives every tool a title, description, and output schema", async () => {
    const tools = await listTools();
    expect(tools.map((t) => t.name).sort()).toEqual(
      [...READ_ONLY, ...WRITES].sort()
    );
    for (const tool of tools) {
      expect(tool.title, `${tool.name} title`).toBeTruthy();
      expect(tool.description, `${tool.name} description`).toBeTruthy();
      expect(tool.outputSchema, `${tool.name} outputSchema`).toBeDefined();
      expect(tool.annotations?.openWorldHint, `${tool.name} openWorldHint`).toBe(
        false
      );
    }
  });

  it("marks reads read-only and writes not", async () => {
    const tools = await listTools();
    for (const tool of tools) {
      expect(tool.annotations?.readOnlyHint, `${tool.name} readOnlyHint`).toBe(
        READ_ONLY.includes(tool.name)
      );
    }
  });
});
