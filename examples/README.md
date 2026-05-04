# Examples

## claude-openai-mcp.ts

This example proves three things in one flow:

1. the repository can talk to a real model provider
2. the repository can talk to a real MCP server
3. the same file-reading and prompt path can be reused across providers

### What it does

- starts the local filesystem MCP server through `npx`
- reads a target file through the MCP tool `read_text_file`
- combines that file with a default or custom `--question`
- sends the prompt to either Claude or OpenAI
- prints the model response in the terminal

### Setup

Copy `.env.example` to `.env` and fill in at least one provider key:

```bash
cp .env.example .env
```

Environment variables:

- `ANTHROPIC_API_KEY` for Claude mode
- `OPENAI_API_KEY` for OpenAI mode
- `AI_PROVIDER=claude|openai` (optional if you pass `--provider`)
- `CLAUDE_MODEL` (optional, defaults to `claude-opus-4-6`)
- `OPENAI_MODEL` (optional, defaults to `gpt-4.1-mini`)
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

Point the demo at a different file or MCP root:

```bash
npm run demo -- --provider claude --file README.md --mcp-root .
```

Ask a custom question:

```bash
npm run demo -- --provider openai --file README.md --mcp-root . --question "List three onboarding improvements"
```

Inline flag values are also supported:

```bash
npm run demo -- --provider=openai --file=README.md --mcp-root=. --question="Summarize this for a GitHub visitor"
```

### CLI reference

```txt
--provider <claude|openai>  Choose which model provider to call
--file <path>               Choose which file to read through MCP
--mcp-root <path>           Set the filesystem MCP root directory
--question <text>           Customize the question sent to the model
--help                      Show the help message
```

### Argument validation

- unknown flags fail fast with `Unknown option: ...`
- positional arguments are rejected
- empty inline values like `--file=` are rejected
- `--file` must stay inside `--mcp-root`

### What this demo proves

- the MCP path is real, not mocked
- provider switching is simple
- prompts can be customized from the CLI
- this starter can grow into a real integration repo without much extra setup

### Common issues

- `demo failed: Missing ANTHROPIC_API_KEY.`
  - add your Anthropic API key to `.env`, or run OpenAI mode
- `demo failed: Missing OPENAI_API_KEY.`
  - add your OpenAI API key to `.env`, or run Claude mode
- `demo failed: Unknown option: --foo. Use --help to see supported flags.`
  - check the flag name or run `npm run demo -- --help`
- `demo failed: Unexpected positional argument: README.md.`
  - pass file paths with `--file <path>` or `--file=<path>`
- `demo failed: Target file must stay inside the MCP root...`
  - set `--mcp-root` to a parent directory of the file
- `demo failed: MCP tool returned an error...`
  - ensure `MCP_ROOT_DIR` includes the target file path
- `npx` not found
  - make sure Node.js and npm are installed and available in your shell
