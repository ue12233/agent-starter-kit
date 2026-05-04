# Examples

## claude-openai-mcp.ts

This example proves three things in one flow:

1. the repository can talk to a real model provider
2. the repository can talk to a real MCP server
3. the same prompt path can be reused across providers

### What it does

- starts the local filesystem MCP server through `npx`
- reads `README.md` through the MCP tool `read_text_file`
- sends that README content to either Claude or OpenAI
- prints a structured summary in the terminal

### Setup

Copy `.env.example` to `.env` and fill in at least one provider key:

```bash
cp .env.example .env
```

Required environment variables:

- `ANTHROPIC_API_KEY` for Claude mode
- `OPENAI_API_KEY` for OpenAI mode
- `AI_PROVIDER=claude|openai` (optional if you pass a flag)
- `MCP_ROOT_DIR` (optional, defaults to the current repository)

### Run

Use the default provider from `.env`:

```bash
npm run demo
```

Show the available flags:

```bash
npm run demo -- --help
```

Run Claude explicitly:

```bash
npm run demo:claude
```

Run OpenAI explicitly:

```bash
npm run demo:openai
```

You can also point the demo at a different file or MCP root:

```bash
npm run demo -- --provider claude --file README.md --mcp-root .
```

### What this demo proves

- the MCP path is real, not mocked
- provider switching is simple
- this starter can grow into a real integration repo without much extra setup

### Common issues

- `demo failed: Missing ANTHROPIC_API_KEY.`
  - add your Anthropic API key to `.env`
- `demo failed: Missing OPENAI_API_KEY.`
  - add your OpenAI API key to `.env`
- `demo failed: MCP tool returned an error...`
  - ensure `MCP_ROOT_DIR` includes the repository path
- `npx` not found
  - make sure Node.js and npm are installed and available in your shell
