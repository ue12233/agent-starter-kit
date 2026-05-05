import "dotenv/config";

import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import path from "node:path";
import { pathToFileURL } from "node:url";

const DEFAULT_README_PATH = path.resolve(process.cwd(), "README.md");
const DEFAULT_MCP_ROOT = process.env.MCP_ROOT_DIR || process.cwd();
const DEFAULT_OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";
const DEFAULT_CLAUDE_MODEL = process.env.CLAUDE_MODEL || "claude-opus-4-6";
const DEFAULT_QUESTION =
  "Produce a one-sentence positioning summary, three reasons this repo feels useful to developers, and two concrete next-step ideas to increase stars.";
const USAGE = `Usage: npm run demo -- [options]

Options:
  --provider <claude|openai>  Choose which model provider to call
  --file <path>               Choose which file to read through MCP
  --mcp-root <path>           Set the filesystem MCP root directory
  --question <text>           Customize the question sent to the model
  --help                      Show this help message`;

const KNOWN_FLAGS = new Set(["--provider", "--file", "--mcp-root", "--question", "--help", "-h"]);
const FLAGS_WITH_VALUES = new Set(["--provider", "--file", "--mcp-root", "--question"]);

export type Provider = "claude" | "openai";

type TextBlock = {
  type: "text";
  text: string;
};

export interface DemoOptions {
  provider: Provider;
  targetFile: string;
  mcpRoot: string;
  question: string;
}

function hasFlag(argv: readonly string[], flag: string): boolean {
  return argv.includes(flag);
}

function readOption(argv: readonly string[], flag: string): string | undefined {
  const inlinePrefix = `${flag}=`;
  const inlineOption = argv.find((arg) => arg.startsWith(inlinePrefix));
  if (inlineOption !== undefined) {
    const inlineValue = inlineOption.slice(inlinePrefix.length);
    if (!inlineValue) {
      throw new Error(`Missing value for ${flag}.`);
    }

    return inlineValue;
  }

  const optionIndex = argv.indexOf(flag);
  if (optionIndex === -1) {
    return undefined;
  }

  const value = argv[optionIndex + 1];
  if (!value || value.startsWith("-")) {
    throw new Error(`Missing value for ${flag}.`);
  }

  return value;
}

function validateArguments(argv: readonly string[]): void {
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (!arg.startsWith("-")) {
      throw new Error(`Unexpected positional argument: ${arg}.`);
    }

    if (!arg.startsWith("--")) {
      if (arg !== "-h") {
        throw new Error(`Unknown option: ${arg}. Use --help to see supported flags.`);
      }
      continue;
    }

    const [flag, inlineValue] = arg.split("=", 2);
    if (!KNOWN_FLAGS.has(flag)) {
      throw new Error(`Unknown option: ${flag}. Use --help to see supported flags.`);
    }

    if (FLAGS_WITH_VALUES.has(flag) && inlineValue === undefined) {
      const value = argv[index + 1];
      if (value && !value.startsWith("-")) {
        index += 1;
      }
    }
  }
}

export function formatUsage(): string {
  return USAGE;
}

export function parseProvider(argv: readonly string[]): Provider {
  const providerValue = readOption(argv, "--provider");
  const envProvider = process.env.AI_PROVIDER;
  const value = (providerValue || envProvider || "claude").toLowerCase();

  if (value !== "claude" && value !== "openai") {
    throw new Error(`Unsupported provider: ${value}. Use 'claude' or 'openai'.`);
  }

  return value;
}

function ensurePathInsideRoot(targetFile: string, mcpRoot: string): void {
  const relativePath = path.relative(mcpRoot, targetFile);
  if (!relativePath || relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    throw new Error(
      `Target file must stay inside the MCP root. Received file '${targetFile}' with root '${mcpRoot}'.`,
    );
  }
}

function isTextBlock(block: unknown): block is TextBlock {
  return (
    typeof block === "object" &&
    block !== null &&
    "type" in block &&
    block.type === "text" &&
    "text" in block &&
    typeof block.text === "string"
  );
}

function collectText(content: unknown): string {
  if (!Array.isArray(content)) {
    return "";
  }

  return content.filter(isTextBlock).map((block) => block.text).join("\n").trim();
}

async function readFileViaMcp(targetFile: string, mcpRoot: string): Promise<string> {
  const client = new Client({ name: "agent-kit-demo", version: "0.2.1" });
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

    const text = collectText(result.content);
    if (!text) {
      throw new Error(`MCP returned no text for ${targetFile}.`);
    }

    return text;
  } finally {
    await client.close();
  }
}

export function buildPrompt(question: string, fileContents: string): string {
  return `You are reviewing a public GitHub starter repository file. Answer the user's question based only on the file content below.

Question:
${question}

File content:

${fileContents}`;
}

async function summarizeWithClaude(fileContents: string, question: string): Promise<string> {
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
        content: buildPrompt(question, fileContents),
      },
    ],
  });

  return response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n")
    .trim();
}

async function summarizeWithOpenAI(fileContents: string, question: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY.");
  }

  const client = new OpenAI({ apiKey });
  const response = await client.responses.create({
    model: DEFAULT_OPENAI_MODEL,
    instructions:
      "You are reviewing a public GitHub starter repository file. Answer the user's question based only on the provided file content.",
    input: buildPrompt(question, fileContents),
  });

  return response.output_text.trim();
}

export function parseOptions(argv: readonly string[]): DemoOptions {
  validateArguments(argv);

  const targetFile = path.resolve(readOption(argv, "--file") || DEFAULT_README_PATH);
  const mcpRoot = path.resolve(readOption(argv, "--mcp-root") || DEFAULT_MCP_ROOT);
  const question = readOption(argv, "--question") || DEFAULT_QUESTION;

  ensurePathInsideRoot(targetFile, mcpRoot);

  return {
    provider: parseProvider(argv),
    targetFile,
    mcpRoot,
    question,
  };
}

export async function main(argv: readonly string[] = process.argv.slice(2)): Promise<void> {
  if (hasFlag(argv, "--help") || hasFlag(argv, "-h")) {
    console.log(formatUsage());
    return;
  }

  const options = parseOptions(argv);

  console.log(`provider: ${options.provider}`);
  console.log(`mcp root: ${options.mcpRoot}`);
  console.log(`target file: ${options.targetFile}`);
  console.log(`question: ${options.question.length} characters`);

  const fileContents = await readFileViaMcp(options.targetFile, options.mcpRoot);
  console.log(`mcp: loaded ${path.basename(options.targetFile)} via filesystem MCP`);

  const summary =
    options.provider === "claude"
      ? await summarizeWithClaude(fileContents, options.question)
      : await summarizeWithOpenAI(fileContents, options.question);

  console.log("\n--- model output ---\n");
  console.log(summary);
}

const isMain = process.argv[1]
  ? import.meta.url === pathToFileURL(process.argv[1]).href
  : false;

if (isMain) {
  main().catch((error) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`demo failed: ${message}`);
    process.exitCode = 1;
  });
}
