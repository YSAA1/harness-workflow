# PRD：Cursor 安装与识别 workflow

## 背景

用户要求 `harness-workflow` 支持 Cursor。Cursor 和 Codex / Claude Code 的差异最大：Cursor 的公开稳定入口主要是 project rules，通常位于 `.cursor/rules`，也支持 `AGENTS.md` 作为简单 agent instructions。Cursor rules 是可复用、可作用域化的 prompt context，不是完整 plugin runtime。

本 PRD 负责 Cursor 线。核心策略是 **把 canonical workflow skill 内容转换为 Cursor project rules，而不是声称 Cursor 会安装 Codex plugin**。成功标准是 Cursor 能识别到 rules，且 rules 不丢失核心 workflow 信息。

## 官方依据

- Cursor Project Rules 存放在 `.cursor/rules`，可版本控制并作用于代码库。
- Cursor Rules 提供 persistent reusable context，控制 Agent / Inline Edit 行为。
- Cursor 支持 `AGENTS.md` 作为更简单的 agent instructions，但推荐用 Project Rules 获得更结构化控制。
- Legacy `.cursorrules` 仍支持但已不推荐作为主路径。

## 问题陈述

当前仓库没有 `.cursor/rules`，Cursor 用户 clone 后只能读普通 Markdown，不会获得三端适配意义上的 workflow 入口。由于 Cursor 没有和 Codex plugin manifest 等价的 runtime，本线必须明确降级为 rules-based workflow adapter，并提供可验证的识别面。

## 目标

- 新增 `.cursor/rules`，让 Cursor 用户 clone 后能识别 Harness Workflow rules。
- 从 canonical `skills/` 转换 8 个 workflow 的核心触发条件、执行纪律、输出物、验证标准。
- 明确 Cursor 线不是 plugin install，而是 project rules install。
- 新增 `docs/install/cursor.md`，说明安装、识别、更新和限制。
- 新增验证脚本或扩展 check，确认 Cursor rules 存在且覆盖全部 8 个 workflow。
- 避免把完整 `SKILL.md` 机械塞进一个巨大 rule，保持 Cursor 上下文可读。

## 非目标

- 不使用 legacy `.cursorrules` 作为主路径。
- 不声称 Cursor 会读取 `.codex-plugin/plugin.json`。
- 不新增 Cursor MCP、extensions 或用户设置。
- 不改变 canonical `skills/` 内容。
- 不把 Cursor rules 当成和 Codex/Claude skills 完全等价的执行环境。

## Canonical 内容保留要求

Cursor rules 必须保留这些语义：

- 8 个 workflow lanes 的名称和用途。
- 每个 workflow 的触发条件。
- 每个 workflow 的核心步骤。
- 每个 workflow 的交付物和 done 标准。
- recovery surface 是语义 contract，three-file 是可选 backend。
- fresh evidence 是 ready claim 的必要条件。
- WIP=1 scoped implementation。
- Knowledge Cleanup 防止 README/AGENTS/docs/generated artifacts 漂移。
- Capability Discovery 需要按任务价值发现 skills/MCP/hooks，而不是盲目安装能力。

允许压缩：

- 长 references 可以通过链接指向 `skills/<skill>/references/` 或 docs。
- Cursor rules 可以按 workflow 拆分，而不是复制所有支持文件。
- 不适用于 Cursor 的 Codex/Claude invocation syntax 可以替换成自然语言触发规则。

## 用户故事

1. 作为 Cursor 用户，我 clone 仓库后能看到 `.cursor/rules`。
2. 作为 Cursor 用户，我在 Cursor Agent 中处理需求时，rules 能提示我选择 brainstorm/plan/implement/diagnose/review/verify/cleanup/harness-builder。
3. 作为 Cursor 用户，我能理解 Cursor 版本是 rules adapter，不是 plugin runtime。
4. 作为 Cursor 用户，我能从 docs/install/cursor.md 知道如何确认 rules 被识别。
5. 作为维护者，我能运行脚本确认 `.cursor/rules` 覆盖 8 个 workflow。
6. 作为维护者，我能确认 Cursor rules 没有丢失核心 workflow 信息。

## 文件改动范围

Cursor worker 只负责以下范围：

- `.cursor/rules/**`
- 可新增 `scripts/check-cursor-install.mjs`
- `docs/install/cursor.md`
- `README.md` / `README.zh-CN.md` 中 Cursor 相关片段

如需读取 canonical source，可读：

- `skills/**`
- `docs/harness-method-contract.md`
- `AGENTS.md`
- `CONTEXT.md`

不要修改：

- `.codex-plugin/plugin.json`
- `.claude/**`
- canonical `skills/**`
- Claude Code 专属 docs

## 实现方案

### 1. Rule 拆分

推荐 `.cursor/rules` 结构：

- `harness-workflow-overview.mdc`：总路由、三端差异、recovery surface、fresh evidence。
- `harness-builder.mdc`
- `brainstorm.mdc`
- `plan.mdc`
- `implement.mdc`
- `diagnose.mdc`
- `review.mdc`
- `verify.mdc`
- `cleanup.mdc`

如果 Cursor 当前 rule metadata 要求不同扩展名，worker 应按官方当前格式调整，并在最终说明中解释。

### 2. Rule 内容要求

每个 workflow rule 至少包含：

- `description` 或等价 metadata。
- When to use。
- Inputs。
- Procedure。
- Outputs。
- Verification / done criteria。
- Notes pointing back to canonical skill file。

总览 rule 必须包含：

- Cursor is rules adapter。
- Codex and Claude Code have skill/plugin runtimes; Cursor uses persistent project context.
- Three-file backend optional。
- No default hooks/MCP/user config。

### 3. Cursor 安装文档

新增 `docs/install/cursor.md`，至少包含：

- clone 仓库后 `.cursor/rules` 自动作为 project rules 被 Cursor 读取。
- 如何在 Cursor 设置或 rules UI 中确认 Project Rules。
- 如何用测试 prompt 验证：例如“Use Harness Workflow to plan a scoped implementation”。
- 说明 `AGENTS.md` 是简单 fallback，`.cursor/rules` 是主路径。
- 更新/卸载：删除或更新 `.cursor/rules`。
- 三端差异表。

### 4. 识别验证

新增或扩展脚本：

- 确认 `.cursor/rules` 目录存在。
- 确认每个 active workflow 有对应 rule。
- 确认 rule 文本包含核心 token：Spec、Executable Plan、fresh evidence、Knowledge Cleanup、recovery surface、WIP=1、Capability Discovery。
- 确认 docs/install/cursor.md 不声称 Cursor 会安装 Codex plugin。
- 如无法从命令行启动 Cursor 验证 UI recognition，脚本应输出 manual recognition steps。

## 验收标准

- `.cursor/rules` 存在并覆盖 8 个 workflow。
- Cursor install docs 存在，明确 Project Rules 是主路径。
- 验证脚本能证明 rules 结构、覆盖和核心信息完整。
- README 中 Cursor 片段准确说明 Cursor 是 rules adapter。
- 不存在 legacy `.cursorrules` 主路径。
- 没有修改 Codex manifest、Claude Code 适配或 canonical skills。

## Worker 执行要求

- 创建独立 worktree：`../harness-workflow-cursor`。
- 分支名建议：`agent/cursor-install-workflow`。
- 只在本 PRD 的文件范围内修改。
- 完成后运行最窄验证命令。
- 最终回复列出修改文件、验证命令、Cursor live recognition 是否完成。

