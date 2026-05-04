# agent-kit

A TypeScript starter for building small AI agent projects with Claude, OpenAI, and MCP-friendly examples.

[中文说明](./README.zh-CN.md) · [Examples](./examples/README.md)

## Features

- TypeScript starter structure
- Runnable CLI example for Claude / OpenAI / MCP
- Minimal project layout that is easy to extend

## Installation

```bash
git clone https://github.com/ue12233/agent-kit.git
cd agent-kit
npm install
```

## Usage

Run the starter entrypoint:

```bash
npm run dev
```

Build and run the compiled output:

```bash
npm run build
npm start
```

Run the local verification commands:

```bash
npm test
npm run check
```

Run the MCP example:

```bash
cp .env.example .env
npm run demo:claude
```

Or:

```bash
npm run demo:openai
```

More details: [`examples/README.md`](./examples/README.md)

## Project structure

```txt
agent-kit/
├─ assets/
│  └─ demo-preview.svg
├─ examples/
│  ├─ README.md
│  └─ claude-openai-mcp.ts
├─ src/
│  └─ index.ts
├─ templates/
├─ .env.example
├─ .gitignore
├─ package.json
├─ tsconfig.json
├─ README.md
└─ README.zh-CN.md
```

## Tech stack

- TypeScript
- Node.js
- Anthropic SDK
- OpenAI SDK
- Model Context Protocol

## Roadmap

- [x] Add MCP example
- [ ] Add more provider adapters
- [ ] Add prompt organization examples
- [ ] Add evaluation workflow examples

## License

MIT
