---
name: plan
description: "用于把已批准 Spec 或足够明确的非平凡请求转成 Executable Plan。触发条件：需要 active slice、planning surface、验证路径、能力缺口或 commit unit。不要在需求/验证策略不清时使用；先回 brainstorm。项目工作面不清时转 harness-builder。"
---

# Executable Plan

`plan` 把已批准 Spec 或足够明确的请求转成 **Executable Plan**：范围、阶段、验证路径、验证能力、下一步和 commit unit 清楚到可以直接交给 `implement` 或 `verify`。

它不负责发散需求，也不替代 Spec review。Executable Plan 默认写入 `docs/plans/`；运行时 recovery 同步到 `.harness/`（见 `../harness-builder/references/recovery_surface_policy.md`），不在仓库根创建 legacy 状态文件。

## 语言策略

- 用户可见文本跟随用户语言；中文用户场景下，计划说明、阶段标题、验收说明、风险和下一步默认使用中文。
- 协议稳定优先：协议 token 如 `EXECUTABLE PLAN WRITTEN`、`Executable Plan`、`Verification path status`、`runnable | blocked`、`final_integration_claim`、skill 名、路径和命令可保留英文，必要时使用中文标签 + 英文 token。
- 不把 Plan 模板硬编码为中文-only；中文用户使用 `templates/task_plan.zh-CN.md`，英文或其他非中文用户使用 `templates/task_plan.md` 作为 default，并按用户语言翻译人类可见说明。
- 输出契约中的 `<... label in user's language>` 是占位说明，实际回复时必须替换成用户语言标签，不要原样输出。

## 路由快照

- **Use when**: Spec 或请求已经清楚，但还缺可执行阶段、active slice、验证路径或 commit unit。
- **Do not use when**: 需求、边界或验证策略还不清；任务只是单点小补丁。
- **Route to**: 计划可执行后转 `implement`；只需证明当前状态时转 `verify`；工作面缺口转 `harness-builder`。

## 目的

这个 skill 解决"计划只活在聊天里"的问题，同时避免把所有项目强绑到同一种状态文件。

- agent 被压缩或新会话开启后，仍能从项目 artifact 恢复执行边界和证明方式。
- 多人/多 agent 协作时，能回答"现在做到哪、下一步是什么"。
- 范围不会在追加讨论中悄悄扩张。
- 验证能力在计划阶段暴露，避免做完后才发现无法证明。

## 何时使用

### 触发信号

- `brainstorm` 写出并经用户批准的 Spec，需要变成可执行计划。
- 用户给出明确请求且任务非平凡：多步、多文件、跨边界或需要验证。
- 既有 Executable Plan 过期：active slice 名不副实、blocker 已变、next 不可执行。
- planning surface 中有真相但执行合同没同步。
- 用户说「写计划」「列阶段」「拆任务」「定义 active slice」「写 commit unit」。

### 不要使用

- 需求、边界或验证策略仍模糊：先 `brainstorm`。
- 任务是单点改动，计划 artifact 反而是噪声。
- 既有 Executable Plan 仍真实、active slice 与 next 一致。

### 路由规则

| 状态 | 下一步 |
| --- | --- |
| Spec 明确，需要计划 artifact | **本 skill** |
| 项目工作面或 recovery surface 不清楚 | `harness-builder` |
| 计划写好且可以实现 | `implement` |
| 计划只需要证明当前状态或发布就绪 | `verify` |
| 已知失败正在发生 | `diagnose` |
| 需求或验证策略不清 | `brainstorm` |
| 仅小补丁 | 直接执行并按需记录 evidence |

## 先读取这些输入

1. 已批准 Spec：默认从 `docs/specs/` 或用户明确指定的 Spec 路径读取。PRD、issue、design docs 是上下文，不是默认 Spec source，除非当前用户或 `AGENTS.md` 明确指定。
2. 当前 planning surface：默认使用 `docs/plans/YYYY-MM-DD--<topic>-plan.md`；只有当前用户明确指定路径，或 `AGENTS.md` 明确声明 canonical Plan surface 时，才允许 override。
3. `AGENTS.md`：是否声明 recovery surface、验证入口和 protected paths。
4. 与请求直接相关的代码与 docs，确认 Spec 的可行性。
5. `git status --short` 与 `git log --oneline -10`：避免计划与已有改动相互踩。
6. 任何用户附上的需求文档、讨论纪要、issue 链接。

## Planning Surface

选择一个写入目标，优先沿用项目已经声明的 surface：

| Surface | Use when |
| --- | --- |
| plan document | 默认写入 `docs/plans/YYYY-MM-DD--<topic>-plan.md` |
| issue | 团队用 issue tracker 跟踪 work items |
| feature-list entry | 多功能产品型项目需要多个独立状态 |
| existing system | 项目已有可信任务或 roadmap 系统 |
| `.harness/` sync | 跨会话执行中同步 `.harness/state.md`、`.harness/work_index.md`；证据与决策写入 `.harness/progress.md`、`.harness/decisions.md` |

`.harness/` 是运行时 recovery，不是 Executable Plan 的默认写入面。模板见 `../harness-builder/templates/`。

## 执行流程

### 第 -1 步 — Spec readiness gate

确认输入能回答：做什么、不做什么、如何证明做对、哪些验证能力不足、验证路径现在是 `runnable` 还是 `blocked`。回答不了就回 `brainstorm`。

### 第 0 步 — 选择或确认 planning surface

默认 planning artifact 是 `docs/plans/YYYY-MM-DD--<topic>-plan.md`。不要因为 issue、feature-list 或 `.harness/` 存在就改写默认位置。Override 仅在当前用户明确指定路径，或 `AGENTS.md` 明确声明 canonical Plan surface 时允许。若 `.harness/` 缺失且任务需要 tracked recovery，转 `harness-builder`。

### 第 1 步 — 写 Executable Plan

计划必须包含：

- Objective
- Active slice
- Non-goals
- Success criteria
- Verification path
- Verification path status: `runnable | blocked`
- Required capabilities
- Fallback evidence if full verification is unavailable
- `final_integration_claim` for multi-stage or multi-commit work
- 3-7 个阶段或 work items
- 当前唯一 in-progress/next item
- Commit units
- Known risks / blockers
- Handoff to next skill

每个阶段必须包含结构化验收块：

- `acceptance_criteria`：可证伪的完成条件
- `verification_commands`：验证命令列表
- `success_definition`：一句话成功定义

每个 commit unit 必须包含：

- scope：提交范围
- 对应阶段：绑定哪些阶段
- 提交前置条件：review 无 Critical + verify PASS

如果唯一有意义的 verification path 是 `blocked`，计划不能直接路由到 `implement`，除非同时写明用户接受的 fallback evidence。否则转 `harness-builder` 修复验证能力。

### 第 2 步 — 写入选定 artifact

- docs plan：写到 `docs/plans/YYYY-MM-DD--<topic>-plan.md`，除非存在 explicit override。
- issue：写成可发布 issue 或更新 issue body。
- feature-list：更新对应 feature entry。
- existing system：按项目惯例更新，不复制第二套状态。
- `.harness/` sync：更新 `.harness/work_index.md`（新任务时）；重写 `.harness/state.md` 的 active slice、phase、next；按需追加 `.harness/progress.md`、`.harness/decisions.md`。

### 第 3 步 — 检查可执行性

每个阶段必须有具体动作和验证含义。不允许"继续优化"、"完善逻辑"这类不可恢复动作。

### 第 4 步 — 停在计划边界

除非用户明确要求继续，否则产出计划后停止。给出下一步建议：`implement`、`verify`、`diagnose` 或 `harness-builder`。

## Commit Unit Protocol

Commit unit 定义何时可以提交一个里程碑。这是计划产物，不是强制流程。

当 plan 定义了 commit unit 时：
1. 每个 commit unit 绑定一个或多个阶段
2. 提交前置条件：该 scope 的实现完成 + review 无 Critical + verify PASS
3. commit message 应引用阶段名称
4. 提交后更新 recovery surface 的阶段状态

当没有 plan 或任务简单到不需要 commit unit 时：
- implement / review / verify 正常工作，不依赖 commit unit 定义
- 提交时机由用户或项目惯例决定

## 输出契约

```text
EXECUTABLE PLAN WRITTEN

<Planning surface label in user's language> / Planning surface: <docs plan | issue | feature-list | existing | .harness sync>
<Artifact label in user's language> / Artifact: <docs/plans/YYYY-MM-DD--topic-plan.md | explicit override | n/a>
<Spec source label in user's language> / Spec source: <path | explicit small-task exception>
<Active slice label in user's language> / Active slice: <一句话>
<Success criteria label in user's language> / Success criteria: <可证伪条件>
<Verification path status label in user's language> / Verification path status: <runnable | blocked>
<Required capabilities label in user's language> / Required capabilities: <list>
<Fallback evidence label in user's language> / Fallback evidence: <none | accepted fallback>
<Final integration claim label in user's language> / Final integration claim: <none | claim>
<Next skill label in user's language> / Next skill: <implement | diagnose | harness-builder | verify>
<Reason label in user's language> / Reason: <一句话>
```

## Recommended next skill

Use this as a routing recommendation, not as permission to keep working after plan output unless the user asked to continue.

| Situation | Recommended next skill |
| --- | --- |
| Repo workbench, recovery surface, or verification entry is missing | `harness-builder` |
| Active slice is clear, verification path is runnable, and implementation is needed | `implement` |
| The plan starts from a failing command without root-cause evidence | `diagnose` |
| The plan is only a proof or release-readiness check | `verify` |
| The required verification capability is blocked and no fallback is accepted | `harness-builder` |

## 常见反模式

- **用 plan 补问需求。** 如果 goals、non-goals 或 verification strategy 不清楚，回 `brainstorm`。
- **把运行时状态写到仓库根。** 使用 `.harness/`，不要创建 root `task_plan.md` / `progress.md` / `findings.md`。
- **把 plan 写进 `docs/prd/`。** Do not write plans to `docs/prd/` unless the current user explicitly names that exact path or `AGENTS.md` declares it as the canonical Plan surface.
- **多个阶段同时 in_progress。** 这会让 active slice 失效。
- **写成愿望清单。** 每个 item 必须可执行、可验证、可恢复。
- **验证能力最后才发现。** `verification_path_status` 必须在计划阶段写清楚。
- **多阶段只验局部。** 多 commit unit 必须有 `final_integration_claim`。
- **忘了 hand off。** 不指明下一步 skill，会让 agent 默认继续在 planning lane 里磨。
- **阶段验收标准模糊。** acceptance_criteria 必须可证伪，不允许 "完成优化"、"基本实现"。
- **Commit unit 无验证绑定。** 每个 commit unit 必须关联 review + verify 前置条件。

## 验收标准

- [ ] 已读取并引用用户批准的 Spec；若没有独立 Spec，已说明为什么该任务足够小且验证策略已明确。
- [ ] 已选择 planning surface 并说明原因。
- [ ] Executable Plan 含目标、active slice、non-goals、成功标准、验证路径、验证路径状态、所需能力、fallback、阶段、风险、下一步。
- [ ] 多阶段或多 commit unit 计划含 `final_integration_claim`。
- [ ] 若 verification path blocked，已转 `harness-builder` 或记录用户接受的 fallback evidence。
- [ ] 恰好一个当前 item 是 in-progress 或 next。
- [ ] 没有默认创建第二套 recovery surface。
- [ ] 如项目使用 tracked recovery，`.harness/work_index.md` 与 `state.md` 已同步。
- [ ] 每个阶段含 acceptance_criteria、verification_commands 和 success_definition。
- [ ] 多阶段计划定义了 commit unit 及其提交前置条件。
- [ ] 已显式给出下一步 skill，且除非用户要求继续，否则停在计划边界。

## 工件更新

- selected planning surface：本次重点产物；默认是 `docs/plans/YYYY-MM-DD--<topic>-plan.md`。
- `.harness/`：tracked 任务时同步 `work_index.md`、`state.md`；证据 → `progress.md`；决策 → `decisions.md`。
- `AGENTS.md`：不动；项目地图或 recovery 结构缺口交给 `harness-builder` 或 `cleanup`。

## 按需读取

- `.harness/` 字段与布局：`../harness-builder/references/recovery_surface_policy.md`
- 工作面初始化：`../harness-builder/SKILL.md`
- `templates/` 下的 legacy plan 模板仅用于迁移参考；新工作使用 `../harness-builder/templates/`。
