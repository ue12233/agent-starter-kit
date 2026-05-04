# ai-agent-starter 中文说明

> 一个面向 AI Agent 产品的开源 TypeScript 起步仓库，目标是让你能更快地 fork、演示、扩展并发布。

[English README](./README.md) · [Examples](./examples/README.md)

![License](https://img.shields.io/badge/license-MIT-black.svg)
![TypeScript](https://img.shields.io/badge/built%20with-TypeScript-3178C6.svg)
![Claude](https://img.shields.io/badge/Claude-Opus%204.6-7C3AED)
![OpenAI](https://img.shields.io/badge/OpenAI-ready-10A37F)
![MCP](https://img.shields.io/badge/MCP-filesystem%20demo-0EA5E9)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

如果你想做一个**容易理解、容易演示、容易 fork、还能继续长成真实 AI 产品**的仓库，这个项目就是一个合适起点。

## 这个仓库有什么不一样

- **不只是 README 好看** —— 现在已经带了一个真正能跑的 Claude / OpenAI / MCP 示例。
- **体量小，理解快** —— 一个 starter，加一个可运行示例，没有额外框架负担。
- **天然适合公开发布** —— 文档、演示路径和目录结构都按“适合传播”来设计。

## 效果预览

![ai-agent-starter demo preview](./assets/demo-preview.svg)

这个最小 CLI 示例会通过真实的文件系统 MCP server 读取 `README.md`，然后交给 Claude 或 OpenAI，从“项目发布审阅者”的视角做总结。

## 快速演示

```bash
cp .env.example .env
npm install
npm run demo:claude
```

切换到 OpenAI：

```bash
npm run demo:openai
```

更多说明见：[`examples/README.md`](./examples/README.md)

## 项目定位

很多 AI starter 仓库都有两个常见问题：

- 过于玩具，难以继续做成真实产品
- 过于臃肿，十分钟都看不明白

`ai-agent-starter` 想解决的正是这个中间地带：

- 足够轻，方便快速启动
- 足够清晰，方便公开展示
- 足够规范，方便后续扩展
- 对 Agent、MCP、Prompt、Eval、部署场景友好

## 为什么适合公开做项目

这个仓库从一开始就按“适合公开展示和持续增长”的思路来设计：

- **定位清楚**：不是随便的 demo，而是可复用的 agent 产品骨架
- **易于 fork**：结构简单，上手成本低
- **贴近热点**：覆盖 Agent workflow、MCP、Prompt、Eval、部署等当前 AI 开发常见需求
- **适合持续迭代**：后面可以不断加示例、模板和接入层

## 当前包含内容

目前 `v0.2` 提供：

- TypeScript 项目骨架
- 最小可运行 starter 入口
- 一个真实的 `Claude / OpenAI / MCP` CLI 示例
- `examples/` 示例目录
- `templates/` 模板目录
- 面向公开发布优化过的 README

你可以在这个基础上继续添加：

- 模型提供商接入（Claude / OpenAI / 本地模型）
- 更多 MCP 集成示例
- Prompt 管理方式
- Eval/Benchmark 流程
- 部署模版

## 项目结构

```txt
ai-agent-starter/
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

## 快速开始

```bash
git clone https://github.com/ue12233/ai-agent-starter.git
cd ai-agent-starter
npm install
npm run dev
```

构建并运行：

```bash
npm run build
npm start
```

## 技术栈

- TypeScript
- Node.js
- tsx
- Anthropic SDK
- OpenAI SDK
- Model Context Protocol（文件系统示例）

## 适合谁用

- 想做 AI 工具的独立开发者
- 想快速验证 agent 产品方向的开发者
- 想搭内部 copilot 或自动化助手的团队
- 想运营一个更容易获得 star 的公开 AI 仓库的人

## 这个示例证明了什么

- 这个仓库可以调用真实 MCP server，而不是 mock 文件访问
- 这个仓库可以在 Claude 和 OpenAI 之间复用同一套高层流程
- 这个 starter 虽然轻，但已经具备继续长成真实项目的基础

## 后续路线图

### 近期

- [ ] 增加 Claude / OpenAI 风格 provider adapter
- [x] 增加 MCP 集成示例
- [ ] 增加 Prompt 组织方案
- [ ] 增加 Eval 工作流示例
- [ ] 增加部署说明（如 Vercel / Node runtime）

### 中期

- [ ] 增加 agent memory 模式
- [ ] 增加 tracing / logging 默认方案
- [ ] 增加多 agent workflow 示例
- [ ] 增加 benchmark/demo 数据集
- [ ] 按场景提供 starter template

## 如果目标是冲高 star

建议优先做这几件事：

1. 持续优化 README
2. 补一个真正能展示价值的示例
3. 加 GIF / 截图 / 演示视频
4. 提供清晰的 contribution 入口
5. 保持持续更新频率

## 贡献

欢迎 PR 和想法。

适合作为首批贡献的内容：

- 新的示例
- MCP 接入
- provider adapter
- eval 模板
- 演示与发布优化

## License

MIT
