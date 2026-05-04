# agent-kit 中文说明

一个用于构建小型 AI Agent 项目的 TypeScript 起步仓库，内置 Claude、OpenAI 和 MCP 友好的示例。

[English README](./README.md) · [Examples](./examples/README.md)

## 特性

- TypeScript 项目骨架
- 可运行的 Claude / OpenAI / MCP CLI 示例
- 易于扩展的最小化目录结构

## 安装

```bash
git clone https://github.com/ue12233/agent-kit.git
cd agent-kit
npm install
```

## 使用

运行 starter 入口：

```bash
npm run dev
```

构建并运行产物：

```bash
npm run build
npm start
```

运行本地校验命令：

```bash
npm test
npm run check
```

运行 MCP 示例：

```bash
cp .env.example .env
npm run demo:claude
```

或者：

```bash
npm run demo:openai
```

更多说明见：[`examples/README.md`](./examples/README.md)

## 项目结构

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

## 技术栈

- TypeScript
- Node.js
- Anthropic SDK
- OpenAI SDK
- Model Context Protocol

## 路线图

- [x] 增加 MCP 示例
- [ ] 增加更多 provider adapter
- [ ] 增加 Prompt 组织示例
- [ ] 增加评测工作流示例

## License

MIT
