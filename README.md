# Harness Workflow

Harness Workflow 是一套本地 Codex plugin，用于把 Learn Harness Engineering 的思想落成日常项目可执行的 workflow。

这版做了两个结构性调整：

1. **`bootstrap` 直接替换为 harness-builder v3**：它负责项目级 harness 的 evidence-first brainstorm、Harness Hypothesis、AGENTS.md/project map/iron laws/check/state/skills/hooks/subagents/MCP policy 设计与安装。
2. **新增 `state-contract`**：三文件不再是所有 skill 的硬前提，而是 rigorous tracked workflow 的默认 state backend。

## 什么时候使用

- 需求、边界或验证策略还不清楚：用 `brainstorm` 先落独立 spec。
- 需要判断是否创建三文件、轻量状态、feature-list 或复用已有状态系统：用 `state-contract`。
- spec 已批准，需要执行合同：用 `plan`。默认 backend 仍是 `task_plan.md` / `progress.md` / `findings.md`。
- 项目入口、验证、恢复、项目地图、AGENTS.md、技能、hooks、subagents 或 MCP policy 不清楚：用 `bootstrap`。
- 已进入实现：用 `implement`。
- 测试、构建或运行失败：用 `diagnose`。
- 重要改动后、阶段切换前：用 `review`。
- 准备声称完成前：用 `verify`。
- 恢复用 `resume`，暂停/交接用 `save-session`，真正收尾/关闭 batch 用 `cleanup`。

简单问答、一行改动、翻译、小范围格式调整不需要进入 tracked workflow。

## Workflow state contract

本插件现在依赖抽象的 workflow state contract，而不是把所有 skill 绑死到三文件。

默认 backend 仍是三文件：

- `task_plan.md`：当前执行合同，保持短而可执行。
- `progress.md`：追加式进度和验证证据日志。
- `findings.md`：需求、已接受规格、拒绝方案、风险、引用和根因。

可选 backend：

- `none`：简单一次性任务。
- `lightweight`：中等任务，只需要范围合同和关键证据。
- `three-file`：默认 rigorous tracked workflow。
- `feature-list`：多功能产品型项目。
- `existing`：复用项目已有 issue/docs/PROJECT.md 状态系统。

其他 skill 应读取 workflow state 的字段：`active_slice`、`non_goals`、`success_criteria`、`verification_path`、`evidence_log`、`decisions`、`risks`、`blockers`、`next_actions`。默认三文件只是这些字段的实现。

## Skill 分层

**Harness / setup**:

- `bootstrap`：项目级 harness builder；替换旧 bootstrap。
- `state-contract`：选择、创建、修复或解释 workflow state backend。

**Spec and planning**:

- `brainstorm`：需求、边界、取舍或验证策略还没收敛时使用；默认写 `docs/specs/YYYY-MM-DD--<topic>.md`。
- `plan`：把已批准 spec 或明确请求变成执行合同；默认创建/维护三文件 backend。

**Execution loop**:

- `implement`：围绕唯一 active slice 小步执行。
- `diagnose`：失败时先复现、定位根因、再修复。
- `review`：对照 spec、证据、docs 和 entropy 做结构性评审。
- `verify`：ready 声明前跑 fresh evidence。
- `cleanup`：验证后关闭、阻塞、放弃或重新打开 batch。
- `save-session` / `resume`：保存和恢复 tracked work，使用当前 state backend。

## Method Contract

核心 contract：

| Contract | 含义 | 主要承载面 |
| --- | --- | --- |
| C1 Harness-first diagnosis | 失败先诊断任务、上下文、工具、状态、验证或生命周期 | `diagnose` |
| C2 Repository as truth | 仓库工件是真相，聊天不是唯一事实来源 | workflow state |
| C3 Thin instruction surface | `AGENTS.md` 保持薄入口 | `bootstrap` / `cleanup` |
| C4 Workbench before implementation | 非平凡实现前先确认入口、状态、验证和恢复路径 | `bootstrap` |
| C5 Scope discipline | 默认 WIP=1，一个 active slice 到验证或阻塞为止 | `plan`、`implement` |
| C6 Evidence before completion | 没有 fresh evidence 不声称完成 | `review`、`verify` |
| C7 Observability and capability fit | 验证能力不足时配置 required capability，推荐 optional capability | `bootstrap`、`verify` |
| C8 Documentation freshness | 代码、命令、验证路径变化时同步文档和状态 | `implement` / `review` / `cleanup` |
| C9 Entropy control and clean state | 收尾时降低项目熵，清理误导状态 | `save-session` / `cleanup` |
| C10 State backend decoupling | skills 依赖 state contract，不依赖固定文件布局 | `state-contract` |

详细说明见 [docs/harness-method-contract.md](docs/harness-method-contract.md)。

## Bootstrap

`bootstrap` 已直接替换为 harness-builder v3。它先做 evidence-first、gap-driven brainstorm，形成 Harness Hypothesis，再设计 Harness Plan。

它关注：

- `AGENTS.md`：项目概览、项目地图、项目铁律、harness map、快速开始、必读文档、protected paths、Definition of Done。
- `scripts/agent/check.sh`：快速验证入口。
- `docs/agent/*`：项目上下文、workflow、verification、risk docs。
- `.harness/*`：manifest、decisions、state、progress、handoff、skill inventory、research notes。
- `.agents/skills/*`：项目级高频/高风险流程。
- `.codex/*`：Codex 专属 hooks、subagents、config。

旧 bootstrap 内容已保存在 `skills/bootstrap/references/legacy-bootstrap/`，仅作为历史参考。

## 验证

从插件目录运行：

```bash
node scripts/check-plugin.mjs
```

该检查覆盖插件结构、manifest、必需 skill、state-contract、bootstrap replacement、三文件模板、无默认 hooks/MCP、Method Contract 覆盖和关键 workflow 纪律。
