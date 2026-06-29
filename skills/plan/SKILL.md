---
name: plan
description: "用于把已批准 Spec 或足够明确的非平凡请求转成 Executable Plan。触发条件：需要 active slice、planning surface、验证路径、能力缺口或 commit unit。不要在需求/验证策略不清时使用；先回 brainstorm。项目工作面不清时转 harness-builder。"
---

# Executable Plan

把已批准 Spec 或足够明确的非平凡请求转成可恢复、可验证、可交给下一 lane 的 **Executable Plan**。默认写入 `docs/plans/YYYY-MM-DD--<topic>-plan.md`；`.harness/` 只做 runtime recovery sync，不是 Planning Surface。

## 语言策略

- 用户可见文本跟随用户语言；未指定语言时默认中文。
- 协议稳定优先；协议 token 如 `EXECUTABLE PLAN WRITTEN`、`Executable Plan`、`Verification path status`、`runnable | blocked`、`final_integration_claim`、skill 名、路径和命令可保留英文。
- 不创建 root `task_plan.md` / `progress.md` / `findings.md`；旧 root files 只作为迁移输入。

## 路由快照

- **Use when**: Spec 或请求清楚，但缺 active slice、work items、验证路径、能力缺口或 commit unit。
- **Do not use when**: 目标、边界、non-goals、success criteria 或验证策略不清；先 `brainstorm`。单点小补丁可直接执行。
- **Route to**: 可实现转 `implement`；只证明转 `verify`；失败根因不明转 `diagnose`；工作面或验证能力缺口转 `harness-builder`。

## 目的

- 把计划从聊天迁移到仓库 artifact，让压缩或新会话后仍能恢复边界、checkbox 进度和证明方式。
- 让多 agent / 多 session 能回答"现在做到哪、下一步是什么、如何证明完成"。
- 在计划阶段暴露验证能力、fallback 和 commit gate，避免做完后才发现无法证明。

## 先读取这些输入

1. Spec 或用户请求；PRD、issue、design docs 默认只是上下文。
2. `AGENTS.md`、当前 recovery surface、验证入口、protected paths、现有 planning surface。
3. 相关代码/docs/config/tests、`git status --short`、近期 log、用户附上的需求文档。

## Planning Surface

优先沿用项目已声明的 surface；没有明确声明时默认 docs plan。

| Surface | Use when |
| --- | --- |
| docs plan | 默认写入 `docs/plans/YYYY-MM-DD--<topic>-plan.md` |
| issue | 团队用 issue tracker 跟踪 work items |
| feature-list | 多功能产品需要多个独立状态 |
| existing system | 项目已有可信 roadmap / tracker |

`.harness/` 是运行时 recovery，不是 Planning Surface。tracked work 写入 plan artifact 后，才同步 `.harness/work_index.md`、`.harness/state.md`、`.harness/progress.md` 或 `.harness/decisions.md`。

## 执行流程

1. **Readiness gate**: 确认能回答做什么、不做什么、如何证明、验证路径是 `runnable` 还是 `blocked`；否则回 `brainstorm`。
2. **Select surface**: 优先 docs plan；issue、feature-list、existing system 只在用户指定或项目惯例明确时使用。不要把 `.harness/` 当 Planning Surface。
3. **Write plan**: 写清 Objective、Active slice、Non-goals、Success criteria、Verification path、Verification path status、Required capabilities、Fallback evidence、Final integration claim、checkbox 工作项、Commit units、Known risks / blockers、Next skill。
4. **Sync recovery**: tracked work 更新 `.harness/work_index.md` active row 与 `.harness/state.md`；证据进 `progress.md`，决策进 `decisions.md`。
5. **Stop**: 除非用户明确要求继续，否则写完计划后停在 `plan` 边界。

如果唯一有意义的 verification path 是 `blocked`，不要直接路由到 `implement`，除非同时写明用户接受的 fallback evidence；否则转 `harness-builder` 修复验证能力。

## Plan Shape

稳定字段：

- Objective; Active slice; Non-goals; Success criteria
- Verification path; Verification path status: `runnable | blocked`
- Required capabilities; Fallback evidence; Final integration claim / `final_integration_claim`
- `## 工作项` / `## Work Items`; Commit units; Known risks / blockers
- Next skill: `<implement | diagnose | harness-builder | verify>`

工作项必须是 Markdown checkbox 工作项：

```markdown
## 工作项

- [ ] 阶段 1：<名称>（当前）
  - acceptance_criteria: <可证伪条件>
  - verification_commands: `<命令>`
  - success_definition: <一句话成功定义>
- [ ] 阶段 2：<名称>（下一步）
  - acceptance_criteria: <可证伪条件>
  - verification_commands: `<命令>`
  - success_definition: <一句话成功定义>
- [x] 阶段 0：<已完成基线>
  - acceptance_criteria: <已满足条件>
  - verification_commands: `<已运行或可复跑命令>`
  - success_definition: <一句话成功定义>
```

状态只由 `- [ ]` / `- [x]` 表达；不要用 `Status: completed` 作为主状态。恰好一个未完成工作项可标注 `（当前）` 或 `（下一步）`。

## Commit Unit Protocol

Commit unit 是计划产物，不是强制流程。定义 commit unit 时：

1. 每个 unit 绑定一个或多个 work items。
2. 每个 unit 写清 scope 和提交前置条件：实现完成 + review 无 Critical + verify PASS。
3. commit message 应能映射到对应阶段或 unit。
4. 提交后同步 selected recovery surface 的阶段状态。

没有 plan 或任务简单到不需要 commit unit 时，`implement` / `review` / `verify` 正常工作，提交时机按用户要求或项目惯例。

## 输出契约

```text
EXECUTABLE PLAN WRITTEN
Planning surface: <docs plan | issue | feature-list | existing>
Artifact: <docs/plans/YYYY-MM-DD--topic-plan.md | explicit override | n/a>
Runtime recovery sync: <none | .harness | existing system>
Spec source: <path | explicit small-task exception>; Active slice: <一句话>
Success criteria: <可证伪条件>; Verification path status: <runnable | blocked>
Required capabilities: <list>; Fallback evidence: <none | accepted fallback>
Final integration claim: <none | claim>
Next skill: <implement | diagnose | harness-builder | verify>
Reason: <一句话>
```

## Recommended next skill

| Situation | Recommended next skill |
| --- | --- |
| Active slice 清楚、验证路径 runnable、需要实现 | `implement` |
| 只需要证明当前状态或发布就绪 | `verify` |
| 从失败命令开始且 root cause 不明 | `diagnose` |
| 工作面、recovery surface、验证入口或能力缺口阻塞 | `harness-builder` |

## 常见反模式

- **用 plan 补问需求。** goals、non-goals 或 verification strategy 不清楚时回 `brainstorm`。
- **把运行时状态写到仓库根。** 使用 `.harness/`，不要创建 root `task_plan.md` / `progress.md` / `findings.md`。
- **把 `.harness/` 当 Planning Surface。** `.harness/` 只记录 runtime sync。
- **多个工作项同时标注当前。** 只能有一个未完成项标注 `（当前）` 或 `（下一步）`。
- **写成愿望清单。** 每个 item 必须可执行、可验证、可恢复。
- **忘了 final integration claim。** 多阶段或多 commit unit 工作必须有 `final_integration_claim`。
- **用文本状态替代 checkbox。** 状态必须用 `- [ ]` / `- [x]`，不要用 `Status: completed` 作为主状态。

## 验收标准

- [ ] 已读 Spec / 用户请求、repo 证据、git 状态和 recovery surface。
- [ ] 已选 planning surface，且没有把 `.harness/` 当 canonical plan。
- [ ] Plan 含目标、active slice、non-goals、成功标准、验证路径、验证路径状态、所需能力、fallback、checkbox 工作项、风险、下一步。
- [ ] 每个 checkbox 工作项含 acceptance_criteria、verification_commands、success_definition，且只有一个未完成项标注当前/下一步。
- [ ] 多阶段或多 commit unit 含 `final_integration_claim`；blocked verification path 已转 `harness-builder` 或记录 accepted fallback。
- [ ] tracked work 已同步 `.harness/work_index.md` 与 `.harness/state.md`。
- [ ] 已显式给出下一步 skill，并停在计划边界。

## 工件更新

- selected planning surface：默认 `docs/plans/YYYY-MM-DD--<topic>-plan.md`。
- `.harness/`：tracked work 同步 `work_index.md`、`state.md`；证据写 `progress.md`；决策写 `decisions.md`。
- `AGENTS.md`：不写当前任务状态；结构缺口交给 `harness-builder` 或 `cleanup`。
