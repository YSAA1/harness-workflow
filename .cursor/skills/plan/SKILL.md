---
name: plan
description: "当已批准 Spec 或足够明确的用户请求需要变成可执行工作合同时使用。产物是 Executable Plan，而不是默认创建三文件。计划应写入已选择的 planning surface：docs plan、issue、feature-list、既有项目系统或 three-file backend。需求、边界或验证策略不清楚时先用 brainstorm；项目工作面不清楚时用 harness-builder。"
---

# Executable Plan

`plan` 把已批准 Spec 或足够明确的请求转成 **Executable Plan**：范围、阶段、验证路径、下一步和 commit unit 清楚到可以直接交给 `implement`。

它不负责发散需求，也不替代 Spec review。它默认不创建三文件；只有当前项目 recovery surface 已选择 three-file backend，或用户明确要求三文件时，才使用 `templates/` 下的 three-file 模板。

## 目的

这个 skill 解决"计划只活在聊天里"的问题，同时避免把所有项目强绑到同一种状态文件。

- agent 被压缩或新会话开启后，仍能从项目 artifact 恢复执行边界。
- 多人/多 agent 协作时，能回答"现在做到哪、下一步是什么"。
- 范围不会在追加讨论中悄悄扩张。

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
| 已知失败正在发生 | `diagnose` |
| 需求或验证策略不清 | `brainstorm` |
| 仅小补丁 | 直接执行并按需记录 evidence |

## 先读取这些输入

1. 已批准 Spec：优先读取 `docs/specs/`、`docs/product-specs/`、`docs/design-docs/`、PRD 或用户指定文件。
2. 当前 planning surface：docs plan、issue、feature list、existing tracker 或 three-file backend。
3. `AGENTS.md`：是否声明 recovery surface、验证入口和 protected paths。
4. 与请求直接相关的代码与 docs，确认 Spec 的可行性。
5. `git status --short` 与 `git log --oneline -10`：避免计划与已有改动相互踩。
6. 任何用户附上的需求文档、讨论纪要、issue 链接。

## Planning Surface

选择一个写入目标，优先沿用项目已经声明的 surface：

| Surface | Use when |
| --- | --- |
| plan document | 文档型项目或 PRD 已在 docs 下 |
| issue | 团队用 issue tracker 跟踪 work items |
| feature-list entry | 多功能产品型项目需要多个独立状态 |
| existing system | 项目已有可信任务或 roadmap 系统 |
| three-file backend | 跨会话、高风险、多 agent 或用户明确要求 |

Three-file 模板仍保留在 `templates/`，但只是 backend 选项，不是 `plan` 的身份。

## 执行流程

### 第 -1 步 — Spec readiness gate

确认输入能回答：做什么、不做什么、如何证明做对、哪些验证能力不足。回答不了就回 `brainstorm`。

### 第 0 步 — 选择或确认 planning surface

如果项目已经声明 recovery surface，写入该 surface。若没有声明且任务不需要 durable state，可以输出轻量 plan 并停下。若缺口影响后续恢复，转 `harness-builder`。

### 第 1 步 — 写 Executable Plan

计划必须包含：

- Objective
- Active slice
- Non-goals
- Success criteria
- Verification path
- 3-7 个阶段或 work items
- 当前唯一 in-progress/next item
- Commit units
- Known risks / blockers
- Handoff to next skill

### 第 2 步 — 写入选定 artifact

- docs plan：写到 `docs/plans/` 或项目指定路径。
- issue：写成可发布 issue 或更新 issue body。
- feature-list：更新对应 feature entry。
- existing system：按项目惯例更新，不复制第二套状态。
- three-file backend：使用 `templates/task_plan.md`、`templates/progress.md`、`templates/findings.md`。

### 第 3 步 — 检查可执行性

每个阶段必须有具体动作和验证含义。不允许"继续优化"、"完善逻辑"这类不可恢复动作。

### 第 4 步 — 停在计划边界

除非用户明确要求继续，否则产出计划后停止。给出下一步建议：`implement`、`diagnose` 或 `harness-builder`。

## 输出格式

```text
EXECUTABLE PLAN WRITTEN

Planning surface: <docs plan | issue | feature-list | existing | three-file>
Artifact: <path | issue | entry id>
Spec source: <path | explicit small-task exception>
Active slice: <一句话>
Success criteria: <可证伪条件>
Next skill: <implement | diagnose | harness-builder>
Reason: <一句话>
```

## Recommended next skill

Use this as a routing recommendation, not as permission to keep working after plan output unless the user asked to continue.

| Situation | Recommended next skill |
| --- | --- |
| Repo workbench, recovery surface, or verification entry is missing | `harness-builder` |
| Active slice is clear and the workbench is adequate | `implement` |
| The plan starts from a failing command without root-cause evidence | `diagnose` |
| The plan is only a proof or release-readiness check | `verify` |

## 常见反模式

- **用 plan 补问需求。** 如果 goals、non-goals 或 verification strategy 不清楚，回 `brainstorm`。
- **把所有计划都变成三文件。** Three-file 是 backend，不是默认身份。
- **多个阶段同时 in_progress。** 这会让 active slice 失效。
- **写成愿望清单。** 每个 item 必须可执行、可验证、可恢复。
- **忘了 hand off。** 不指明下一步 skill，会让 agent 默认继续在 planning lane 里磨。

## 验收标准

- [ ] 已读取并引用用户批准的 Spec；若没有独立 Spec，已说明为什么该任务足够小且验证策略已明确。
- [ ] 已选择 planning surface 并说明原因。
- [ ] Executable Plan 含目标、active slice、non-goals、成功标准、验证路径、阶段、风险、下一步。
- [ ] 恰好一个当前 item 是 in-progress 或 next。
- [ ] 没有默认创建第二套 recovery surface。
- [ ] 如使用 three-file backend，模板取自 `templates/`。
- [ ] 已显式给出下一步 skill，且除非用户要求继续，否则停在计划边界。

## 工件更新

- selected planning surface：本次重点产物。
- three-file backend：只有选中时更新 `task_plan.md`、`progress.md`、`findings.md`。
- `AGENTS.md`：不动；如需项目地图、验证入口或恢复指针，交给 `harness-builder` 或 `cleanup` 小幅同步。

## 按需读取

- `templates/README.md`：three-file 模板来源、许可证、本地改造说明。
- `templates/task_plan.md`、`templates/progress.md`、`templates/findings.md`：仅在 three-file backend 被选择时使用。
- 工作面初始化或 recovery surface 选择：`../harness-builder/SKILL.md`
