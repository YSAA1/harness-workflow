---
name: implement
description: "用于在一个 scoped active slice 上做最小代码或文档改动。触发条件：用户请求/Spec/Executable Plan 已清楚，工作面和验证路径足够明确。不要在需求、active slice、根因或工作面不清时使用；局部检查只是反馈，ready 只能交给 verify。"
---

# 带证据执行

`implement` 是 scoped work 的实现入口。它在三件事上严格：**WIP=1 一次只推进一个 slice**、**按风险选择验证强度**、**修改行为时同步相关 docs 和 selected recovery surface**。

## 路由快照

- **Use when**: 恰好一个 active slice 可以开始改文件，且验证入口足够清楚。
- **Do not use when**: 需求不清、计划不清、失败根因不清、或项目工作面缺失。
- **Route to**: 稳定后转 `review` 或小改直接转 `verify`；失败根因不清转 `diagnose`；范围漂移转 `plan`。

## 目的

- 当前 active slice 没拿到证据前，不开新 slice。
- 修代码就同步命令、文档或 recovery surface，否则下次会话恢复会失真。
- 验证强度按风险匹配，不机械要求覆盖率。
- 本 lane 可以跑局部检查，但不能声明 ready；ready claim 只能由 `verify` 证明。
- 失败了不靠猜，转 `diagnose`。

## 何时使用

### 触发信号

- 用户请求、Spec 或 Executable Plan 能解析出恰好一个 active slice。
- 项目入口、验证命令和 protected paths 足够清楚。
- 用户说「实现」「写代码」「修这个 bug」「让测试过」「让它跑起来」。
- 已经在循环中且当前 slice 还未 verified。

### 不要使用

- 需求或成功标准不清：先 `brainstorm`。
- active slice 或 planning surface 不清：先 `plan`。
- 项目工作面、验证入口或 recovery surface 不清：先 `harness-builder`。
- 失败已经发生且根因不清：转 `diagnose`。
- 用户其实在问「应该怎么做」：转 `brainstorm`。

### 路由规则

| 状态 | 下一步 |
| --- | --- |
| 实现失败、根因不清 | `diagnose` |
| 当前 slice 稳定，需评审 | `review` |
| 准备声明 ready | `verify` |
| 范围变模糊 | `plan` 或 `brainstorm` |
| 工作面不清 | `harness-builder` |
| 验证路径 blocked | `harness-builder` 或回 `plan` 记录 fallback |

## 先读取这些输入

1. 用户请求、Spec 或 Executable Plan：确认 active slice、non-goals、success criteria、verification path、verification path status 和 required capabilities。
2. selected recovery surface：读取上次进度、决策、风险和 blockers；没有就轻量执行，不强制创建。
3. 与 active slice 直接相关的源代码、测试、配置和 docs。
4. `AGENTS.md` 和 README：确认项目规则、验证命令和 protected paths。
5. `git status --short`：避免和未提交改动相互覆盖。

## 执行纪律

### WIP=1 的硬规则

- 当前 slice 未 verified 或 blocked 前，不允许扩大改动范围。
- 顺手清理只允许发生在当前 slice 相关路径上；跨 slice 清理记录为 deferred cleanup。
- 发现必须扩大范围时，停下，回 `plan` 或问用户是否扩展 active slice。

### TDD 循环

经典 RED -> GREEN -> REFACTOR 是默认骨架，但强度匹配风险：

| 风险 | 推荐验证强度 |
| --- | --- |
| 局部纯逻辑 | unit 或 focused check |
| API / 状态 / 配置边界 | integration 或 targeted regression |
| UI / 多步骤用户路径 | smoke 或 E2E |
| auth / payment / trust boundary | review + 更强验证 + security lane |
| 大规模重构 | 行为对照 + diff 审视 |

详细决策见 `references/verification-intensity.md`。

### Commit Discipline

当 Executable Plan 定义了 commit unit 时：
- 不在 review/verify 之前做正式 milestone commit
- 实现过程中的中间保存不算正式里程碑
- commit scope 对应 plan 中定义的 commit unit

当没有 Executable Plan 或任务是直接修 bug 时：
- 按项目惯例或用户指示提交
- 仍建议在提交前至少跑过相关验证

## 执行流程

### 第 1 步 — 重新对账 active slice

实现前确认 active slice、non-goals 和验证路径仍然成立。若不成立，回 `plan`。

### 第 2 步 — 选定本次最小步

把 active slice 切成一个能在一次 RED -> GREEN 内完成的最小步。

### 第 3 步 — 写测试或最小可执行检查

按风险选验证强度。结果应该是失败的或当前缺失的；如果一开始就过，确认它是否真的覆盖目标行为。

这些检查是 implementation feedback，不是 final ready proof。即使全绿，也要转 `verify` 做独立 ready claim。

### 第 4 步 — 最小实现

写最少的代码让检查通过。不要顺便做无关 refactor。

### 第 5 步 — 跑相邻验证

运行同模块或相邻边界的检查；必要时跑 build、typecheck、lint 或 smoke。

### 第 6 步 — 重构

只在绿灯下重构。每次 refactor 后再跑相关检查。

### 第 7 步 — 同步 docs 与 recovery surface

用户可见行为、命令、配置、API、环境变量或验证入口变化时，更新 README/docs。只有 selected recovery surface 要求时记录进度、决策或风险。

### 第 8 步 — 决定下一步

稳定后转 `review`；低风险小改动可直接转 `verify`。如果一个明确假设循环仍无法解释失败，或错误信号不稳定，转 `diagnose`。

## 输出契约

```text
IMPLEMENT: STEP_DONE|BLOCKED|ROUTE_BACK

Active slice: <一句话>
This step: <一句话>
Risk tier: <unit|integration|smoke|E2E|security>
Evidence:
  - <command -> result>
Ready claim: not made; route to verify
Docs synced: yes|no|n/a
Recovery surface updated: yes|no|n/a
Files changed:
  - ...
Commit unit: <none | id | not eligible yet>
Next: <repeat|review|verify|diagnose|plan>
```

Use the shared workflow glossary terms; local checks here are
implementation feedback, not a ready verdict.

## Recommended next skill

Pick the next lane from current evidence instead of defaulting to more implementation.

| Situation | Recommended next skill |
| --- | --- |
| Same active slice still has scoped work left | `implement` |
| Meaningful code or docs changed and local checks are stable | `review` |
| Tiny low-risk change is complete and review would add little signal | `verify` |
| A clear hypothesis loop fails, errors change, or root cause is unclear | `diagnose` |
| Scope, success criteria, or active slice no longer matches reality | `plan` |

## 常见反模式

- **顺手清理无关代码。** 那是 scope creep；写到 deferred cleanup。
- **跳测试直接改源码。** 即使是 1 行修复，也至少留一个 reproduction 案例；写不出就转 `diagnose`。
- **改命令但不改 README。** 下一次冷启动会迷路。
- **机械追求覆盖率。** 风险低的代码不需要厚测试；风险高的代码只看百分比也不够。
- **把本地绿灯当 ready。** 本地检查只是实现反馈；ready 交给 `verify`。
- **假设循环失败还接着试。** 转 `diagnose`。
- **未经验证就提交里程碑。** 当 plan 定义了 commit unit 时，正式 commit 应在 review + verify 之后。

## 验收标准

- [ ] active slice 仍是唯一当前工作且未越界。
- [ ] 测试或等价 focused check 覆盖本步行为。
- [ ] 改完后检查为绿，且相邻验证未 regress。
- [ ] 未在 `implement` 中声明 ready；已路由到 `review` 或 `verify`。
- [ ] 文档和 selected recovery surface 已按需同步。
- [ ] 下一步 skill 已显式标注。

## 工件更新

- 源代码 + tests：当前最小步。
- README/docs：命令、配置、API 或用户可见行为改变时同步。
- selected recovery surface：仅在项目要求时记录 evidence、decisions、risks 或 blockers。

## 按需读取

- `references/verification-intensity.md`：验证强度的细化决策树。
- 失败诊断：`../diagnose/SKILL.md`
- 准备声明 ready：`../verify/SKILL.md`
- 阶段评审：`../review/SKILL.md`
