---
name: state-contract
description: "当 workflow 需要选择、创建、修复或解释状态后端时使用。典型触发语：状态协议、三文件、state backend、workflow state、task_plan/progress/findings、恢复面、feature list、轻量状态、不要把三文件绑死。其他 skill 需要 active slice、success criteria、evidence、decisions、handoff 时，应依赖本 skill 定义的 state contract，而不是直接假设某个文件布局。"
---

# Workflow State Contract

本 skill 把“状态文件”从各个 workflow skill 里解耦出来。核心原则：

> 其他 skill 依赖的是 **workflow state contract**，不是某三个具体文件。

默认 backend 仍然是三文件：

- `task_plan.md`：执行合同、active slice、non-goals、success criteria、verification path、phase/next/blocker。
- `progress.md`：追加式 evidence log、命令、结果、文件、下一步。
- `findings.md`：accepted spec、决策、拒绝方案、风险、root cause、capability gaps。

三文件是 rigorous tracked workflow 的默认实现，不是所有任务的强制前提。

## 目的

降低 workflow skills 之间的耦合，同时保留三文件带来的可恢复、可验证、可审计能力。

本 skill 解决这些问题：

- 简单任务被迫创建三文件，增加噪声。
- `implement`、`review`、`verify` 等 skill 把 `task_plan.md` 写成硬依赖，导致没有三文件时能力打折。
- 老项目已有 issue tracker、PROJECT.md、features.yaml 或 `.harness/` 状态时，被强行套三文件。
- 三文件漂移时，没人负责判断是修复、降级、升级，还是切换 backend。

## 何时使用

### 触发信号

- 用户说「三文件是不是太绑死」「降低耦合」「state backend」「状态协议」。
- 非平凡任务需要 tracked workflow，但当前没有明确状态来源。
- `task_plan.md` / `progress.md` / `findings.md` 缺失、漂移、互相矛盾。
- 项目已有自己的状态系统，需要映射到 workflow fields。
- `resume` 无法判断当前 active slice。
- `plan` 要创建或重写三文件。
- 产品型项目需要 feature/task list，而不是单 active slice。

### 不要使用

- 一次性问答、翻译、单点小补丁。
- 当前 state backend 已清晰，active slice / evidence / decisions 都能读到。
- 用户只要求 brainstorm spec，不需要进入 tracked workflow。

### 路由规则

| 状态 | 下一步 |
| --- | --- |
| 需求未收敛 | `brainstorm` |
| 需要选择或修复状态后端 | **本 skill** |
| 后端选定，需要写执行计划 | `plan` |
| active slice 已明确 | `implement` |
| 状态互相矛盾且需要恢复 | `resume` + 本 skill |
| 状态过期但无需新计划 | `cleanup` 或 `save-session` |

## 先读取这些输入

1. `AGENTS.md`：看是否声明 workflow state backend。
2. `.harness/manifest.yaml` / `.harness/state.md` / `.harness/progress.md` / `.harness/session_handoff.md`，如果存在。
3. `task_plan.md`、`progress.md`、`findings.md`，如果存在。
4. 项目已有状态来源：issue、PROJECT.md、features.json、tasks.yaml、roadmap、docs/progress。
5. `git status --short`：判断状态是否和 dirty worktree 对得上。
6. 当前用户请求：判断任务是否值得 tracked state。

## State Fields

所有 backend 都应尽量提供这些字段：

| Field | 含义 | 默认三文件来源 |
| --- | --- | --- |
| `objective` | 当前目标 | `task_plan.md` |
| `active_slice` | 当前唯一执行切片 | `task_plan.md` 范围合同 |
| `non_goals` | 本轮不做什么 | `task_plan.md` |
| `success_criteria` | 完成标准 | `task_plan.md` / spec |
| `verification_path` | 验证命令或路径 | `task_plan.md` / `progress.md` |
| `current_phase` | 当前阶段 | `task_plan.md` |
| `evidence_log` | 命令与结果 | `progress.md` |
| `decisions` | 技术决策 | `findings.md` |
| `rejected_options` | 拒绝方案 | `findings.md` |
| `risks` | 风险与残余问题 | `findings.md` |
| `blockers` | 阻塞项 | `task_plan.md` / `findings.md` |
| `next_actions` | 下一步 | `task_plan.md` / `progress.md` |

详细 backend 选择见 `references/backends.md`。

## 执行流程

### 第 1 步 — 判断是否需要 tracked state

不所有任务都需要状态文件。

- 小任务：可以 `none` 或 inline。
- 中等任务：可以 lightweight tracked state。
- 多步骤、跨 session、高风险任务：用 three-file backend。
- 多功能产品型项目：考虑 feature-list backend。
- 老项目已有状态系统：考虑 existing backend。

### 第 2 步 — 选择 backend

选择一个：

| Backend | 用途 |
| --- | --- |
| `none` | 简单一次性任务，不创建状态文件 |
| `lightweight` | 只需要范围合同 + 关键证据 |
| `three-file` | 默认 rigorous tracked workflow |
| `feature-list` | 多功能、多状态、产品型项目 |
| `existing` | 复用项目已有 issue/docs 状态系统 |

### 第 3 步 — 声明映射

把选择写到合适位置：

- 项目级：`AGENTS.md` 的 Workflow State / Harness map。
- harness 级：`.harness/manifest.yaml` 或 `.harness/state.md`。
- 任务级：`task_plan.md` 或项目既有 task source。

### 第 4 步 — 创建或修复状态

如果选择 `three-file`，使用 `plan/templates/` 中的 canonical 模板。

如果选择 `feature-list`，至少记录：

- feature id
- behavior
- verification command
- status
- owner / next action

如果选择 `existing`，记录现有来源和字段映射，不要复制一套并行状态。

### 第 5 步 — 给其他 skill 一个读写约定

输出当前 backend：

```text
Workflow state backend: three-file
Read active slice from: task_plan.md / 范围合同
Append evidence to: progress.md
Record decisions and root causes in: findings.md
```

其他 skill 应引用这个约定，而不是重新发明状态路径。

## 常见反模式

- **把三文件删掉。** 三文件仍是 rigorous tracked workflow 的强默认值。
- **把三文件绑死到所有 skill。** 简单任务和已有状态系统不应被强套。
- **创建第二套 handoff。** 如果已有 backend 能恢复，就写回现有 backend。
- **在 AGENTS.md 写当前 active slice。** AGENTS.md 只写状态入口，不写临时状态。
- **状态 backend 不声明。** 不声明就会导致 resume/review/verify 各自猜。

## 验收标准

- [ ] 当前任务是否需要 tracked state 已判断。
- [ ] state backend 已选择并说明原因。
- [ ] 必要字段能从 backend 中读到，或缺口已记录。
- [ ] 其他 skill 知道 active slice、evidence、decisions 分别读写哪里。
- [ ] 没有创建和现有状态冲突的第二套恢复面。

## 工件更新

- `AGENTS.md`：只写 backend 入口和恢复指针，不写临时状态。
- `.harness/manifest.yaml` / `.harness/state.md`：记录 backend 选择。
- `task_plan.md` / `progress.md` / `findings.md`：three-file backend 的默认工件。
- 项目既有 issue/docs/features：existing 或 feature-list backend 的工件。

## 参考文件

- `references/backends.md`
- `references/state-fields.md`
