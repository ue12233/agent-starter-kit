import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";

import { buildPrompt, formatUsage, parseOptions, parseProvider, type Provider } from "./claude-openai-mcp.js";

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

function withEnvProvider(value: string | undefined, callback: () => void): void {
  const previousProvider = process.env.AI_PROVIDER;

  if (value === undefined) {
    delete process.env.AI_PROVIDER;
  } else {
    process.env.AI_PROVIDER = value;
  }

  try {
    callback();
  } finally {
    if (previousProvider === undefined) {
      delete process.env.AI_PROVIDER;
    } else {
      process.env.AI_PROVIDER = previousProvider;
    }
  }
}

test("parseProvider defaults to claude", () => {
  withEnvProvider(undefined, () => {
    assert.equal(parseProvider([]), "claude");
  });
});

test("parseProvider reads AI_PROVIDER when no flag is passed", () => {
  withEnvProvider("openai", () => {
    assert.equal(parseProvider([]), "openai");
  });
});

test("parseProvider lets explicit flags override AI_PROVIDER", () => {
  withEnvProvider("openai", () => {
    assert.equal(parseProvider(["--provider", "claude"]), "claude");
  });
});

test("Provider type accepts only supported providers", () => {
  const providers = ["claude", "openai"] satisfies Provider[];

  assert.deepEqual(providers, ["claude", "openai"]);
});

test("parseOptions reads provider, file, and mcp root flags", () => {
  const options = parseOptions([
    "--provider",
    "openai",
    "--file",
    "README.md",
    "--mcp-root",
    repoRoot,
  ]);

  assert.deepEqual(options, {
    provider: "openai",
    targetFile: path.join(repoRoot, "README.md"),
    mcpRoot: repoRoot,
    question:
      "Produce a one-sentence positioning summary, three reasons this repo feels useful to developers, and two concrete next-step ideas to increase stars.",
  });
});

test("parseOptions reads custom question flag", () => {
  const options = parseOptions([
    "--provider",
    "openai",
    "--file",
    "README.md",
    "--mcp-root",
    repoRoot,
    "--question",
    "List three setup risks",
  ]);

  assert.equal(options.question, "List three setup risks");
});

test("parseOptions reads inline flag values", () => {
  const options = parseOptions([
    "--provider=openai",
    `--file=${path.join(repoRoot, "README.md")}`,
    `--mcp-root=${repoRoot}`,
  ]);

  assert.deepEqual(options, {
    provider: "openai",
    targetFile: path.join(repoRoot, "README.md"),
    mcpRoot: repoRoot,
    question:
      "Produce a one-sentence positioning summary, three reasons this repo feels useful to developers, and two concrete next-step ideas to increase stars.",
  });
});

test("parseOptions rejects the MCP root itself as a target file", () => {
  assert.throws(
    () => parseOptions(["--file", repoRoot, "--mcp-root", repoRoot]),
    /Target file must stay inside the MCP root/,
  );
});

test("parseOptions rejects a target file outside the MCP root", () => {
  assert.throws(
    () => parseOptions(["--file", "../README.md", "--mcp-root", "examples"]),
    /Target file must stay inside the MCP root/,
  );
});

test("parseOptions rejects unsupported providers", () => {
  assert.throws(
    () => parseOptions(["--provider", "bogus"]),
    /Unsupported provider: bogus/,
  );
});

test("parseOptions rejects unknown flags", () => {
  assert.throws(
    () => parseOptions(["--bogus"]),
    /Unknown option: --bogus/,
  );

  assert.throws(
    () => parseOptions(["--bogus=value"]),
    /Unknown option: --bogus/,
  );
});

test("parseOptions rejects unexpected positional arguments", () => {
  assert.throws(
    () => parseOptions(["README.md"]),
    /Unexpected positional argument: README\.md/,
  );
});

test("parseOptions rejects unknown short flags", () => {
  assert.throws(
    () => parseOptions(["-x"]),
    /Unknown option: -x/,
  );
});

test("parseOptions rejects empty inline flag values", () => {
  assert.throws(
    () => parseOptions(["--provider="]),
    /Missing value for --provider/,
  );

  assert.throws(
    () => parseOptions(["--file="]),
    /Missing value for --file/,
  );
});

test("parseOptions rejects flags where values are required", () => {
  assert.throws(
    () => parseOptions(["--provider", "--bogus"]),
    /Unknown option: --bogus/,
  );

  assert.throws(
    () => parseOptions(["--question"]),
    /Missing value for --question/,
  );
});

test("formatUsage documents supported flags", () => {
  const usage = formatUsage();

  assert.match(usage, /--provider <claude\|openai>/);
  assert.match(usage, /--file <path>/);
  assert.match(usage, /--mcp-root <path>/);
  assert.match(usage, /--question <text>/);
  assert.match(usage, /--help/);
});

test("buildPrompt includes the file contents and custom question", () => {
  const prompt = buildPrompt("Explain the installation steps", "# Demo\n\nRun npm install.");

  assert.match(prompt, /Explain the installation steps/);
  assert.match(prompt, /# Demo/);
  assert.match(prompt, /Run npm install\./);
});
