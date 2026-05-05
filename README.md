# agent-kit

A TypeScript starter kit for building small AI agent projects with Claude, OpenAI, and MCP tools.

[中文说明](./README.zh-CN.md) · [Examples](./examples/README.md)

## Why this exists

Most agent experiments start as a quick script and become hard to ship: provider code is mixed with prompts, tool access is unclear, and the README does not explain how to reproduce the demo.

`agent-kit` gives you a small, readable baseline for public AI agent projects:

- a TypeScript/Node.js project that builds cleanly
- a provider-switchable Claude/OpenAI demo
- a real MCP filesystem example, not a mocked tool call
- CLI argument validation with useful errors
- tests for the demo's option parsing and prompt generation
- launch-friendly documentation you can extend as your agent grows

## Features

- **Claude and OpenAI support** — choose the provider with `--provider`, `AI_PROVIDER`, or the npm shortcut scripts.
- **MCP filesystem integration** — reads files through `@modelcontextprotocol/server-filesystem` over stdio.
- **Custom model question** — use `--question` to ask the model anything about the file loaded through MCP.
- **Safe file scoping** — `--file` must stay inside `--mcp-root`, which helps avoid accidental path traversal.
- **Typed CLI example** — `parseOptions`, provider selection, prompt creation, and error handling are testable TypeScript functions.
- **Simple verification flow** — `npm test` and `npm run check` are enough to validate the starter.

## Requirements

- Node.js 20+
- npm
- An Anthropic API key for Claude mode, or an OpenAI API key for OpenAI mode

## Installation

```bash
git clone https://github.com/ue12233/agent-kit.git
cd agent-kit
npm install
```

## Quick start

Run the starter entrypoint:

```bash
npm run dev
```

Build and run the compiled output:

```bash
npm run build
npm start
```

Run tests and type checking:

```bash
npm test
npm run typecheck
npm run check
```

`npm run typecheck` validates every TypeScript source and test without writing files. `npm run check` runs type checking and then builds publishable JavaScript into `dist/`.

## Environment setup

Create a local `.env` file:

```bash
cp .env.example .env
```

Fill in the provider key you want to use:

```env
ANTHROPIC_API_KEY=your_anthropic_key
OPENAI_API_KEY=your_openai_key
AI_PROVIDER=claude
CLAUDE_MODEL=claude-opus-4-6
OPENAI_MODEL=gpt-4.1-mini
MCP_ROOT_DIR=.
```

Only one provider key is required if you only run one mode.

## Run the MCP demo

Use the provider configured in `.env`:

```bash
npm run demo
```

Run Claude explicitly:

```bash
npm run demo:claude
```

Run OpenAI explicitly:

```bash
npm run demo:openai
```

Ask a custom question about a file:

```bash
npm run demo -- --provider claude --file README.md --mcp-root . --question "Explain the setup steps for a new contributor"
```

Inline flag values work too:

```bash
npm run demo -- --provider=openai --file=README.md --mcp-root=. --question="List three ways to improve this repo"
```

## CLI options

```txt
--provider <claude|openai>  Choose which model provider to call
--file <path>               Choose which file to read through MCP
--mcp-root <path>           Set the filesystem MCP root directory
--question <text>           Customize the question sent to the model
--help                      Show the help message
```

Defaults:

- `--provider`: `AI_PROVIDER`, then `claude`
- `--file`: `README.md`
- `--mcp-root`: `MCP_ROOT_DIR`, then the current repository
- `--question`: a short repository-review prompt

## What happens in the demo

1. The CLI parses and validates the flags.
2. It starts the filesystem MCP server with `npx -y @modelcontextprotocol/server-filesystem`.
3. It reads the target file through the MCP tool `read_text_file`.
4. It builds a prompt from your `--question` and the file contents.
5. It calls Claude or OpenAI.
6. It prints the model response in the terminal.

## Project structure

```txt
agent-kit/
├─ assets/
│  └─ demo-preview.svg
├─ examples/
│  ├─ README.md
│  ├─ claude-openai-mcp.test.ts
│  └─ claude-openai-mcp.ts
├─ src/
│  ├─ index.test.ts
│  └─ index.ts
├─ templates/
├─ .env.example
├─ .gitignore
├─ package.json
├─ tsconfig.json
├─ tsconfig.build.json
├─ README.md
└─ README.zh-CN.md
```

## Scripts

- `npm run dev` — run the starter entrypoint from `src/index.ts`
- `npm run build` — compile TypeScript into `dist/`
- `npm start` — run the compiled starter entrypoint
- `npm run demo` — run the MCP/provider demo
- `npm run demo:claude` — run the demo with Claude
- `npm run demo:openai` — run the demo with OpenAI
- `npm test` — run the Node test suite through `tsx --test`
- `npm run check` — run the TypeScript build check

## Common issues

- `demo failed: Missing ANTHROPIC_API_KEY.` — add `ANTHROPIC_API_KEY` to `.env`, or run OpenAI mode.
- `demo failed: Missing OPENAI_API_KEY.` — add `OPENAI_API_KEY` to `.env`, or run Claude mode.
- `demo failed: Unknown option: --foo.` — run `npm run demo -- --help` and check the flag name.
- `demo failed: Unexpected positional argument: README.md.` — pass paths with `--file README.md`.
- `demo failed: Target file must stay inside the MCP root.` — set `--mcp-root` to a parent directory of the target file.
- `npx not found` — install Node.js/npm or make sure npm is on your shell PATH.

## Extending the starter

Good next additions:

- add a provider adapter interface under `src/providers/`
- move prompt templates into `templates/`
- add more MCP servers under `examples/`
- add structured JSON output for agent responses
- add evaluation fixtures for regression testing prompts

## Roadmap

- [x] Add MCP example
- [x] Add custom question support for the demo
- [ ] Add more provider adapters
- [ ] Add prompt organization examples
- [ ] Add evaluation workflow examples

## License

MIT
