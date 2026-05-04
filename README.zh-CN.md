# agent-kit 中文说明

一个用于构建小型 AI Agent 项目的 TypeScript 起步仓库，内置 Claude、OpenAI 和 MCP 工具调用示例。

[English README](./README.md) · [Examples](./examples/README.md)

## 这个项目解决什么问题

很多 Agent 项目一开始只是一个脚本，后面会慢慢变得难维护：模型调用、Prompt、工具调用和说明文档混在一起，新人也很难复现 demo。

`agent-kit` 提供一个小而清晰的起点：

- 能正常构建的 TypeScript/Node.js 项目
- 可在 Claude 和 OpenAI 之间切换的 demo
- 真实 MCP filesystem 调用，不是 mock
- 带参数校验的 CLI 示例
- 覆盖参数解析和 Prompt 生成的测试
- 适合公开仓库展示和继续扩展的 README

## 特性

- **支持 Claude 和 OpenAI**：可通过 `--provider`、`AI_PROVIDER` 或 npm shortcut 选择 provider。
- **集成 MCP filesystem**：通过 stdio 启动 `@modelcontextprotocol/server-filesystem` 并读取文件。
- **支持自定义问题**：用 `--question` 对 MCP 读取到的文件内容提出任意问题。
- **文件范围保护**：`--file` 必须位于 `--mcp-root` 内，避免误读根目录外文件。
- **可测试的 TypeScript CLI**：参数解析、provider 选择、Prompt 构造都有测试覆盖。
- **简单校验流程**：`npm test` 和 `npm run check` 即可验证项目状态。

## 环境要求

- Node.js 20+
- npm
- Claude 模式需要 Anthropic API key；OpenAI 模式需要 OpenAI API key

## 安装

```bash
git clone https://github.com/ue12233/agent-kit.git
cd agent-kit
npm install
```

## 快速开始

运行 starter 入口：

```bash
npm run dev
```

构建并运行编译产物：

```bash
npm run build
npm start
```

运行测试和类型检查：

```bash
npm test
npm run check
```

## 配置环境变量

创建本地 `.env`：

```bash
cp .env.example .env
```

填写你要使用的 provider key：

```env
ANTHROPIC_API_KEY=your_anthropic_key
OPENAI_API_KEY=your_openai_key
AI_PROVIDER=claude
CLAUDE_MODEL=claude-opus-4-6
OPENAI_MODEL=gpt-4.1-mini
MCP_ROOT_DIR=.
```

如果只跑其中一个 provider，只需要填对应 key。

## 运行 MCP demo

使用 `.env` 中配置的 provider：

```bash
npm run demo
```

显式运行 Claude：

```bash
npm run demo:claude
```

显式运行 OpenAI：

```bash
npm run demo:openai
```

对某个文件提出自定义问题：

```bash
npm run demo -- --provider claude --file README.md --mcp-root . --question "给新贡献者解释安装步骤"
```

也支持 inline flag：

```bash
npm run demo -- --provider=openai --file=README.md --mcp-root=. --question="列出这个仓库三个改进方向"
```

## CLI 参数

```txt
--provider <claude|openai>  选择模型 provider
--file <path>               选择要通过 MCP 读取的文件
--mcp-root <path>           设置 filesystem MCP 的根目录
--question <text>           自定义发送给模型的问题
--help                      显示帮助信息
```

默认值：

- `--provider`：优先读 `AI_PROVIDER`，否则为 `claude`
- `--file`：默认 `README.md`
- `--mcp-root`：优先读 `MCP_ROOT_DIR`，否则为当前仓库
- `--question`：默认使用一个仓库 review 问题

## demo 执行流程

1. CLI 解析并校验参数。
2. 通过 `npx -y @modelcontextprotocol/server-filesystem` 启动 filesystem MCP server。
3. 使用 MCP 工具 `read_text_file` 读取目标文件。
4. 把 `--question` 和文件内容组合成 Prompt。
5. 调用 Claude 或 OpenAI。
6. 在终端打印模型输出。

## 项目结构

```txt
agent-kit/
├─ assets/
│  └─ demo-preview.svg
├─ examples/
│  ├─ README.md
│  ├─ claude-openai-mcp.test.ts
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

## npm scripts

- `npm run dev`：运行 `src/index.ts`
- `npm run build`：编译 TypeScript 到 `dist/`
- `npm start`：运行编译后的入口
- `npm run demo`：运行 MCP/provider demo
- `npm run demo:claude`：用 Claude 运行 demo
- `npm run demo:openai`：用 OpenAI 运行 demo
- `npm test`：通过 `tsx --test` 运行测试
- `npm run check`：运行 TypeScript 构建检查

## 常见问题

- `demo failed: Missing ANTHROPIC_API_KEY.`：在 `.env` 添加 `ANTHROPIC_API_KEY`，或切到 OpenAI 模式。
- `demo failed: Missing OPENAI_API_KEY.`：在 `.env` 添加 `OPENAI_API_KEY`，或切到 Claude 模式。
- `demo failed: Unknown option: --foo.`：运行 `npm run demo -- --help` 检查参数名。
- `demo failed: Unexpected positional argument: README.md.`：路径要写成 `--file README.md`。
- `demo failed: Target file must stay inside the MCP root.`：把 `--mcp-root` 设置成目标文件的父目录。
- `npx not found`：安装 Node.js/npm，或确认 npm 已在 PATH 中。

## 后续扩展建议

- 在 `src/providers/` 下增加 provider adapter interface
- 把 Prompt 模板移到 `templates/`
- 在 `examples/` 下增加更多 MCP server 示例
- 为 Agent 输出增加结构化 JSON
- 为 Prompt 回归测试增加评测 fixtures

## 路线图

- [x] 增加 MCP 示例
- [x] 增加 demo 自定义问题支持
- [ ] 增加更多 provider adapter
- [ ] 增加 Prompt 组织示例
- [ ] 增加评测工作流示例

## License

MIT
