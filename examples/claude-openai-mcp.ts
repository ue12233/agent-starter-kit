import "dotenv/config";

import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { fileURLToPath } from "node:url";
import path from "node:path";

const DEFAULT_README_PATH = path.resolve(process.cwd(), "README.md");
const DEFAULT_MCP_ROOT = process.env.MCP_ROOT_DIR || process.cwd();
const DEFAULT_OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";
const DEFAULT_CLAUDE_MODEL = process.env.CLAUDE_MODEL || "claude-opus-4-6";

type Provider = "claude" | "openai";

interface DemoOptions {
  provider: Provider;
  targetFile: string;
  mcpRoot: string;
}

function parseProvider(argv: string[]): Provider {
  const providerFlag = argv.find((arg) => arg.startsWith("--provider"));
  const providerValue = providerFlag?.includes("=")
    ? providerFlag.split("=")[1]
    : argv[argv.indexOf("--provider") + 1];
  const envProvider = process.env.AI_PROVIDER;
  const value = (providerValue || envProvider || "claude").toLowerCase();

  if (value !== "claude" && value !== "openai") {
    throw new Error(`Unsupported provider: ${value}. Use 'claude' or 'openai'.`);
  }

  return value;
}

function collectText(content: Array<{ type: string; text?: string }>): string {
  return content
    .filter((block) => block.type === "text" && typeof block.text === "string")
    .map((block) => block.text)
    .join("\n")
    .trim();
}

async function readFileViaMcp(targetFile: string, mcpRoot: string): Promise<string> {
  const client = new Client({ name: "ai-agent-starter-demo", version: "0.2.0" });
  const transport = new StdioClientTransport({
    command: process.platform === "win32" ? "npx.cmd" : "npx",
    args: ["-y", "@modelcontextprotocol/server-filesystem", mcpRoot],
  });

  await client.connect(transport);

  try {
    const result = await client.callTool({
      name: "read_text_file",
      arguments: { path: targetFile },
    });

    if (result.isError) {
      throw new Error(`MCP tool returned an error while reading ${targetFile}.`);
    }

    const text = collectText(result.content as Array<{ type: string; text?: string }>);
    if (!text) {
      throw new Error(`MCP returned no text for ${targetFile}.`);
    }

    return text;
  } finally {
    await client.close();
  }
}

async function summarizeWithClaude(fileContents: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("Missing ANTHROPIC_API_KEY.");
  }

  const client = new Anthropic({ apiKey });
  const response = await client.messages.create({
    model: DEFAULT_CLAUDE_MODEL,
    max_tokens: 1200,
    thinking: { type: "adaptive" },
    output_config: { effort: "high" },
    messages: [
      {
        role: "user",
        content: `You are reviewing a public GitHub starter repository README. Based on the content below, produce:\n1. a one-sentence positioning summary\n2. three reasons this repo feels useful to developers\n3. two concrete next-step ideas to increase stars\n\nREADME:\n\n${fileContents}`,
      },
    ],
  });

  return response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n")
    .trim();
}

async function summarizeWithOpenAI(fileContents: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY.");
  }

  const client = new OpenAI({ apiKey });
  const response = await client.responses.create({
    model: DEFAULT_OPENAI_MODEL,
    instructions:
      "You are reviewing a public GitHub starter repository README. Return a concise summary with one positioning sentence, three reasons it feels useful to developers, and two next-step ideas to increase stars.",
    input: fileContents,
  });

  return response.output_text.trim();
}

function parseOptions(argv: string[]): DemoOptions {
  return {
    provider: parseProvider(argv),
    targetFile: DEFAULT_README_PATH,
    mcpRoot: DEFAULT_MCP_ROOT,
  };
}

async function main(): Promise<void> {
  const options = parseOptions(process.argv.slice(2));

  console.log(`provider: ${options.provider}`);
  console.log(`mcp root: ${options.mcpRoot}`);
  console.log(`target file: ${options.targetFile}`);

  const fileContents = await readFileViaMcp(options.targetFile, options.mcpRoot);
  console.log(`mcp: loaded ${path.basename(options.targetFile)} via filesystem MCP`);

  const summary =
    options.provider === "claude"
      ? await summarizeWithClaude(fileContents)
      : await summarizeWithOpenAI(fileContents);

  console.log("\n--- model output ---\n");
  console.log(summary);
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`demo failed: ${message}`);
  process.exitCode = 1;
});
