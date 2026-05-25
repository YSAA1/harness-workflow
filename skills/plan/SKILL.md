---
name: plan
description: "用于把已批准 Spec 或足够明确的非平凡请求转成 Executable Plan。触发条件：需要 active slice、planning surface、验证路径、能力缺口或 commit unit。不要在需求/验证策略不清时使用；先回 brainstorm。项目工作面不清时转 harness-builder。"
---

# Executable Plan

`plan` 把已批准 Spec 或足够明确的请求转成 **Executable Plan**：范围、阶段、验证路径、验证能力、下一步和 commit unit 清楚到可以直接交给 `implement` 或 `verify`。

它不负责发散需求，也不替代 Spec review。它默认不创建三文件；planning surface 的选择规则见 `references/planning-surface-policy.md`。

## 路由快照

- **Use when**: Spec 或请求已经清楚，但还缺可执行阶段、active slice、验证路径或 commit unit。
- **Do not use when**: 需求、边界或验证策略还不清；任务只是单点小补丁。
- **Route to**: 计划可执行后转 `implement`；只需证明当前状态时转 `verify`；工作面缺口转 `harness-builder`。

## 目的

- 让新会话或另一个 agent 能从 artifact 恢复执行边界和证明方式。
- 防止范围在后续讨论中悄悄扩张。
- 在实现前暴露验证能力和 fallback evidence。
- 保持 WIP=1：计划只允许一个 current next/in-progress item。

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

1. 已批准 Spec：优先读取 `docs/specs/`、`docs/product-specs/`、`docs/design-docs/`、PRD 或用户指定文件。
2. 当前 planning surface：docs plan、issue、feature list、existing tracker、three-file backend 或 lightweight plan。
3. `AGENTS.md`：是否声明 recovery surface、验证入口和 protected paths。
4. 与请求直接相关的代码与 docs，确认 Spec 的可行性。
5. `git status --short` 与 `git log --oneline -10`：避免计划与已有改动相互踩。
6. 任何用户附上的需求文档、讨论纪要、issue 链接。

## 执行流程

### 第 1 步 — Spec Readiness Gate

确认输入能回答：做什么、不做什么、如何证明做对、哪些验证能力不足、验证路径现在是 `runnable` 还是 `blocked`。回答不了就回 `brainstorm`。

### 第 2 步 — Select Planning Surface

选择一个写入目标，优先沿用项目已声明的 surface。选择规则见 `references/planning-surface-policy.md`。

### 第 3 步 — Write The Executable Plan

写入 objective、active slice、non-goals、success criteria、verification path、verification status、required capabilities、fallback evidence、risks、next skill。完整字段见 `references/executable-plan-contract.md`。

如果任务是多阶段或需要里程碑提交，按 `references/commit-unit-protocol.md` 写 phase acceptance、commit units 和 `final_integration_claim`。

### 第 4 步 — Check Executability

每个阶段必须有具体动作和验证含义。不允许"继续优化"、"完善逻辑"这类不可恢复动作。若 verification path blocked 且无用户接受的 fallback，转 `harness-builder`。

### 第 5 步 — Stop At Planning Boundary

除非用户明确要求继续，否则产出计划后停止。给出下一步建议：`implement`、`verify`、`diagnose` 或 `harness-builder`。

## 输出格式

```text
EXECUTABLE PLAN WRITTEN

Planning surface: <docs plan | issue | feature-list | existing | three-file | lightweight>
Artifact: <path | issue | entry id | chat>
Spec source: <path | explicit small-task exception>
Active slice: <one sentence>
Success criteria: <falsifiable conditions>
Verification path status: <runnable | blocked>
Required capabilities: <list>
Fallback evidence: <none | accepted fallback>
Final integration claim: <none | claim>
Next skill: <implement | diagnose | harness-builder | verify>
Reason: <one sentence>
```

## Recommended next skill

Use this as a routing recommendation, not as permission to keep working after plan output unless the user asked to continue.

| Situation | Recommended next skill |
| --- | --- |
| Repo workbench, recovery surface, or verification entry is missing | `harness-builder` |
| Active slice is clear, verification path is runnable, and implementation is needed | `implement` |
| The plan starts from a failing command without root-cause evidence | `diagnose` |
| The plan is only a proof or release-readiness check | `verify` |
| Required verification capability is blocked and no fallback is accepted | `harness-builder` |

## 验收标准

- [ ] 已读取并引用用户批准的 Spec；若没有独立 Spec，已说明为什么该任务足够小且验证策略已明确。
- [ ] 已选择 planning surface 并说明原因。
- [ ] Executable Plan 含目标、active slice、non-goals、成功标准、验证路径、验证路径状态、所需能力、fallback、风险和下一步。
- [ ] 多阶段或多 commit unit 计划含 `final_integration_claim` 和 commit unit preconditions。
- [ ] 若 verification path blocked，已转 `harness-builder` 或记录用户接受的 fallback evidence。
- [ ] 恰好一个当前 item 是 in-progress 或 next。
- [ ] 没有默认创建第二套 recovery surface。
- [ ] 已显式给出下一步 skill，且除非用户要求继续，否则停在计划边界。

## 工件更新

- selected planning surface：本次重点产物。
- three-file backend：只有选中时更新 `task_plan.md`、`progress.md`、`findings.md`。
- `AGENTS.md`：不动；如需项目地图、验证入口或恢复指针，交给 `harness-builder` 或 `cleanup` 小幅同步。

## 按需读取

- `references/planning-surface-policy.md`：planning surface 选择和写入规则。
- `references/executable-plan-contract.md`：完整计划字段、输出形态和质量检查。
- `references/commit-unit-protocol.md`：phase acceptance、commit unit 和 final integration claim。
- `templates/README.md`：three-file 模板来源、许可证、本地改造说明。
- `templates/task_plan.md`、`templates/progress.md`、`templates/findings.md`：仅在 three-file backend 被选择时使用。
- 工作面初始化或 recovery surface 选择：`../harness-builder/SKILL.md`
