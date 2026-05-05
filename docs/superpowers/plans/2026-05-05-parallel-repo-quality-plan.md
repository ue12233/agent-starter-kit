# Parallel Repository Quality Implementation Plan

**目标：** 用两台 Oracle 节点各 10 个 Claude Code tmux 窗口，对 GitHub 账号 ue12233 的仓库做有边界的并行质量改进，并把每个有效改动验证、commit、push 到对应仓库。

**架构：** 144.24.22.130 作为主执行节点，优先处理 agent-kit 并承接较新的公开仓库；161.153.117.125 作为独立 review/补充执行节点，先同步 GitHub 最新代码，再处理其余仓库。每个窗口只拿一个明确任务，禁止跨仓库自由发挥；任务完成必须写 log、跑验证、给出 commit 或明确 no-op 原因。

**技术栈：** Claude Code 2.1.126、tmux、gh CLI、git、Node/TypeScript、Python/Django/通用仓库探测脚本。

---

## 仓库清单

- `ue12233/agent-kit`：公开，当前最新 commit `08cec4f`，TypeScript/Node 项目。
- `ue12233/chatgpt2api`：公开，需先探测语言、测试命令和风险点。
- `ue12233/MoonTVPlus`：公开，需先探测语言、测试命令和风险点。
- `ue12233/traffic-management-system`：私有，需先探测语言、测试命令和风险点。
- `ue12233/Urban-Public-Transport-Intelligent-Travel-System`：私有，需先探测语言、测试命令和风险点。
- `ue12233/djangoweb`：公开，预期 Django/Python，需先探测测试命令和配置。

## 全局规则

1. 每个 tmux 窗口只处理一个任务，不跨仓库修改。
2. 任何窗口禁止直接 `git push --force`。
3. 允许普通 `git push origin main`，前提是该窗口：
   - `git status --short` 清楚；
   - 已运行可用测试/类型/构建命令；
   - 已写 `/home/ubuntu/cc-work/logs/<session>.log`；
   - commit message 简洁说明实际变更。
4. 如果仓库无测试或依赖缺失，窗口只能做低风险修复：README 命令修正、明显配置错误、缺失 ignore、脚本 glob/路径 bug；并在 log 中说明无法验证的原因。
5. 每个窗口完成后必须输出四项：changed files、commands run、result、commit hash/no-op reason。

## 节点分工

### 144.24.22.130 主执行节点，10 个窗口

- `cc144-01-agentkit-review`：复查 `agent-kit` 最新 main，寻找遗漏 bug；如果无问题写 no-op log。
- `cc144-02-chatgpt2api-bootstrap`：clone/sync `chatgpt2api`，探测依赖、测试、启动命令，修 README 或脚本中明显不一致。
- `cc144-03-chatgpt2api-tests`：在 `chatgpt2api` 增补最小 smoke/test 或配置修复，仅限可验证改动。
- `cc144-04-moontvplus-bootstrap`：clone/sync `MoonTVPlus`，探测 package/build/test，修明显脚本或文档问题。
- `cc144-05-moontvplus-quality`：针对 `MoonTVPlus` 做 lint/type/build 相关低风险修复。
- `cc144-06-djangoweb-bootstrap`：clone/sync `djangoweb`，探测 Django 配置、requirements、manage.py 命令。
- `cc144-07-djangoweb-tests`：为 `djangoweb` 做最小 Django check/test 可运行性修复。
- `cc144-08-agentkit-docs`：只看 `agent-kit` 文档和 package 发布配置，修文档/包入口不一致。
- `cc144-09-global-repo-audit`：只读审计 6 个仓库，输出优先级报告，不改代码。
- `cc144-10-integration-summary`：等待其他窗口 log，汇总 commit/no-op 状态，不改代码。

### 161.153.117.125 独立执行/复核节点，10 个窗口

- `cc161-01-agentkit-independent-review`：先 reset 到 GitHub 最新 `agent-kit`，独立 review 已 push 的 `08cec4f`，不改除非发现真 bug。
- `cc161-02-traffic-bootstrap`：clone/sync `traffic-management-system`，探测语言、依赖、测试命令。
- `cc161-03-traffic-quality`：对 `traffic-management-system` 做低风险可验证修复。
- `cc161-04-urban-bootstrap`：clone/sync `Urban-Public-Transport-Intelligent-Travel-System`，探测语言、依赖、测试命令。
- `cc161-05-urban-quality`：对 Urban 项目做低风险可验证修复。
- `cc161-06-chatgpt2api-review`：复核 144 对 `chatgpt2api` 的改动或独立 no-op 审计。
- `cc161-07-moontvplus-review`：复核 144 对 `MoonTVPlus` 的改动或独立 no-op 审计。
- `cc161-08-djangoweb-review`：复核 144 对 `djangoweb` 的改动或独立 no-op 审计。
- `cc161-09-private-repo-security`：只读检查两个私有仓库是否有 secrets、危险配置、硬编码凭据；不打印敏感值。
- `cc161-10-final-review`：读取所有 log，给出最终质量门结论，不改代码。

## 执行模板

每个窗口使用以下模式：

```bash
mkdir -p /home/ubuntu/cc-work/repos /home/ubuntu/cc-work/logs
cd /home/ubuntu/cc-work/repos
if [ ! -d <repo>/.git ]; then gh repo clone ue12233/<repo> <repo>; fi
cd <repo>
git fetch origin
git checkout main
git reset --hard origin/main
claude -p "<窗口任务说明。遵守全局规则。完成后写 /home/ubuntu/cc-work/logs/<session>.log。>" \
  --model claude-opus-4-6 \
  --allowedTools "Read,Edit,Write,Bash" \
  --max-turns 18 \
  --fallback-model haiku \
  --output-format text \
  > /home/ubuntu/cc-work/logs/<session>.raw.log 2>&1
```

## 验证门

每个有代码改动的窗口至少运行以下可用命令之一：

- Node：`npm test`、`npm run test`、`npm run check`、`npm run build`、`npm run lint`，按 package.json 存在项选择。
- Python/Django：`python -m pytest`、`python manage.py check`、`python manage.py test`，按项目存在项选择。
- 通用：`git diff --check`、`git status --short`。

## 完成定义

- 所有 20 个 tmux 窗口已启动，并能看到对应 log 路径。
- 每个窗口最终有 `.log` 或 `.raw.log`。
- 有实际修复的仓库已 commit/push；没有修复的窗口有 no-op 原因。
- 最终汇总列出每个仓库的最新 commit、验证命令、风险点和后续建议。
