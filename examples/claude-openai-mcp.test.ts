import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";

import { formatUsage, parseOptions, parseProvider } from "./claude-openai-mcp.js";

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

test("parseProvider defaults to claude", () => {
  const previousProvider = process.env.AI_PROVIDER;
  delete process.env.AI_PROVIDER;

  try {
    assert.equal(parseProvider([]), "claude");
  } finally {
    if (previousProvider === undefined) {
      delete process.env.AI_PROVIDER;
    } else {
      process.env.AI_PROVIDER = previousProvider;
    }
  }
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
  });
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
  });
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
});

test("formatUsage documents supported flags", () => {
  const usage = formatUsage();

  assert.match(usage, /--provider <claude\|openai>/);
  assert.match(usage, /--file <path>/);
  assert.match(usage, /--mcp-root <path>/);
  assert.match(usage, /--help/);
});
