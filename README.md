# agent-kit

A concise navigation hub for agent builders: agent frameworks, reusable skills, MCP servers, and practical tools in one clean directory.

[Navigation site](./docs/index.html) | [中文说明](./README.zh-CN.md) | [MCP demo](./examples/README.md)

## What this is

`agent-kit` is being shaped as a practical starting page for people building agents. It keeps the repo simple:

- a clean resource directory for agents, skills, MCP, and tools
- a static navigation page under `docs/` that can be opened directly or published with GitHub Pages
- a TypeScript data model for the curated resource list
- a runnable Claude/OpenAI demo that reads files through a real filesystem MCP server
- tests and build scripts so the examples stay verifiable

## Navigation categories

| Category | Use it for | Included examples |
| --- | --- | --- |
| Agent Frameworks | Choosing the orchestration/runtime layer | OpenAI Agents SDK, LangGraph, Vercel AI SDK Agents, CrewAI |
| Agent Skills | Packaging repeatable workflows and instructions | Agent Skills Standard, Skills Specification, Claude Code Skills, Prompt Engineering Guide |
| MCP Servers | Connecting agents to files, APIs, repos, and live context | MCP docs, example servers, TypeScript SDK, Smithery |
| Builder Tools | Filling gaps around coding, execution, browser work, and recipes | OpenAI Cookbook, Claude Code, E2B Sandbox, Browser Use |

Open the static site locally:

```bash
start docs/index.html
```

Or serve the repository with any static server and visit `/docs/`.

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

## Verify the project

```bash
npm test
npm run typecheck
npm run check
```

`npm run check` runs TypeScript type checking and then builds publishable JavaScript into `dist/`.

## Use the TypeScript navigation data

The root package exports the same navigation model used by the README concept:

```ts
import { getResourcesByKind, navigationSections } from "agent-kit";

const mcpResources = getResourcesByKind("mcp");
console.log(navigationSections.length, mcpResources.map((resource) => resource.name));
```

Run the starter entrypoint:

```bash
npm run dev
```

## Run the MCP demo

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

Run the demo with the provider configured in `.env`:

```bash
npm run demo
```

Run a specific provider:

```bash
npm run demo:claude
npm run demo:openai
```

Ask a custom question about a file:

```bash
npm run demo -- --provider claude --file README.md --mcp-root . --question "Explain this repo to a new agent builder"
```

## CLI options

```txt
--provider <claude|openai>  Choose which model provider to call
--file <path>               Choose which file to read through MCP
--mcp-root <path>           Set the filesystem MCP root directory
--question <text>           Customize the question sent to the model
--help                      Show the help message
```

## Project structure

```txt
agent-kit/
  assets/
  docs/
    index.html
    styles.css
    app.js
  examples/
    README.md
    claude-openai-mcp.ts
    claude-openai-mcp.test.ts
  src/
    index.ts
    index.test.ts
  .env.example
  package.json
  README.md
  README.zh-CN.md
```

## Common demo issues

- `demo failed: Missing ANTHROPIC_API_KEY.` Add `ANTHROPIC_API_KEY` to `.env`, or run OpenAI mode.
- `demo failed: Missing OPENAI_API_KEY.` Add `OPENAI_API_KEY` to `.env`, or run Claude mode.
- `demo failed: Unknown option: --foo.` Run `npm run demo -- --help` and check the flag name.
- `demo failed: Target file must stay inside the MCP root.` Set `--mcp-root` to a parent directory of the target file.
- `npx not found` Install Node.js/npm or make sure npm is on your shell PATH.

## Roadmap

- [x] Add MCP example
- [x] Add custom question support for the demo
- [x] Add agent navigation data and static docs page
- [ ] Add more MCP server notes and copyable setup snippets
- [ ] Add skill templates under `templates/`
- [ ] Add evaluation workflow examples

## License

MIT
