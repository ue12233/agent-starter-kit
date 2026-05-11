# agent-kit 中文说明

`agent-kit` 是一个面向 Agent 构建者的简洁导航：把 Agent 框架、Skill、MCP Server 和常用工具放在一个清晰的目录里，同时保留可运行的 TypeScript + Claude/OpenAI + MCP 示例。

[导航页面](./docs/index.html) | [English README](./README.md) | [MCP 示例](./examples/README.md)

## 项目定位

这个仓库不再只是一个 starter 说明页，而是一个 Agent 资源导航和可运行示例的组合：

- `docs/` 提供可直接打开或发布到 GitHub Pages 的静态导航页
- `src/index.ts` 导出 Agent 导航数据模型
- `examples/` 保留真实 filesystem MCP 调用示例
- README 作为仓库首页，快速说明分类、运行方式和扩展方向
- 测试和构建脚本用于验证 TypeScript 入口与 demo

## 导航分类

| 分类 | 适合解决什么问题 | 示例资源 |
| --- | --- | --- |
| Agent Frameworks | 选择 Agent 编排和运行层 | OpenAI Agents SDK、LangGraph、Vercel AI SDK Agents、CrewAI |
| Agent Skills | 封装可复用流程和提示词说明 | Agent Skills Standard、Skills Specification、Claude Code Skills、Prompt Engineering Guide |
| MCP Servers | 连接文件、API、仓库和实时上下文 | MCP 官方文档、示例 Server、TypeScript SDK、Smithery |
| Builder Tools | 补齐编码、沙箱、浏览器自动化和实践配方 | OpenAI Cookbook、Claude Code、E2B Sandbox、Browser Use |

打开静态导航页：

```bash
start docs/index.html
```

也可以用任意静态服务器托管仓库，然后访问 `/docs/`。

## 环境要求

- Node.js 20+
- npm
- Claude 模式需要 Anthropic API key，OpenAI 模式需要 OpenAI API key

## 安装

```bash
git clone https://github.com/ue12233/agent-kit.git
cd agent-kit
npm install
```

## 验证项目

```bash
npm test
npm run typecheck
npm run check
```

`npm run check` 会先做 TypeScript 类型检查，再把可发布的 JavaScript 构建到 `dist/`。

## 使用 TypeScript 导航数据

根包会导出导航数据和筛选函数：

```ts
import { getResourcesByKind, navigationSections } from "agent-kit";

const mcpResources = getResourcesByKind("mcp");
console.log(navigationSections.length, mcpResources.map((resource) => resource.name));
```

运行入口：

```bash
npm run dev
```

## 运行 MCP demo

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

使用 `.env` 中的 provider 运行：

```bash
npm run demo
```

显式选择 provider：

```bash
npm run demo:claude
npm run demo:openai
```

对某个文件提出自定义问题：

```bash
npm run demo -- --provider claude --file README.md --mcp-root . --question "给新的 Agent 构建者解释这个仓库"
```

## CLI 参数

```txt
--provider <claude|openai>  选择模型 provider
--file <path>               选择要通过 MCP 读取的文件
--mcp-root <path>           设置 filesystem MCP 的根目录
--question <text>           自定义发送给模型的问题
--help                      显示帮助信息
```

## 项目结构

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

## 常见 demo 问题

- `demo failed: Missing ANTHROPIC_API_KEY.` 在 `.env` 中添加 `ANTHROPIC_API_KEY`，或切到 OpenAI 模式。
- `demo failed: Missing OPENAI_API_KEY.` 在 `.env` 中添加 `OPENAI_API_KEY`，或切到 Claude 模式。
- `demo failed: Unknown option: --foo.` 运行 `npm run demo -- --help` 检查参数名。
- `demo failed: Target file must stay inside the MCP root.` 把 `--mcp-root` 设置成目标文件的父目录。
- `npx not found` 安装 Node.js/npm，或确认 npm 已在 PATH 中。

## 路线图

- [x] 增加 MCP 示例
- [x] 增加 demo 自定义问题支持
- [x] 增加 Agent 导航数据和静态页面
- [ ] 增加更多 MCP Server 说明和可复制配置片段
- [ ] 在 `templates/` 下增加 Skill 模板
- [ ] 增加评测工作流示例

## License

MIT
