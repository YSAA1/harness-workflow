---
name: brainstorm
description: "当需求、边界、方案取舍、成功标准或验证策略还没收敛时使用。典型触发语：帮我想想、我有个想法但不确定、先讨论方案、这个架构怎么做、需求还没定、不要直接写代码、先落 Spec。必须在 plan 之前通过澄清、方案比较、验证策略设计和用户批准，写出独立 Spec 文档。只有当前 recovery surface 明确要求时，才把摘要写入对应 artifacts。"
---

# Spec 构思

`brainstorm` 把开放想法收敛成可被计划、实现和验证的 **Spec**。它不写生产代码，不创建业务实现，不生成具体实施计划。终点是用户批准过的规格文档，然后交给 `plan`。

默认 Spec 位置：`docs/specs/YYYY-MM-DD--<topic>.md`。如果项目已有 `docs/product-specs/`、`docs/design-docs/`、`specs/` 或 issue tracker 规范，沿用项目惯例。

## Persistence Note

先写独立 Spec。不要默认创建或写入三文件。只有项目已选择的 recovery surface 明确需要摘要、风险、拒绝方案或引用时，才把短摘要写到对应 evidence/decision artifact。

## 目的

本 skill 解决三个问题：

- 想法太早进入实现，导致边界、non-goals 和成功标准靠聊天记忆维持。
- agent 只问一个问题就收敛，实际没有确认用户、范围、约束、失败模式和验收信号。
- Spec 只描述要做什么，却没有设计验证流程，到了 `verify` 才发现没有可运行证据。

`brainstorm` 必须先把"要建什么"和"如何证明建对"一起说明白。`plan` 只负责把已批准 Spec 拆成 Executable Plan。

## 何时使用

### 触发信号

- 用户描述还停留在意图层面：「我想让它...」「我们要...」
- 用户明确说「先 brainstorm」「先讨论」「先落 Spec」「需求还没定」
- 多个方案都合理，需要比较取舍
- 成功标准、验收方式、测试/E2E/smoke 路径不清楚
- 现有 Spec 漂移，计划或实现已经无法回答"到底验什么"
- 任务包含 UI、架构、状态模型、外部工具、权限、安全或跨模块行为

### 不要使用

- 用户已经给出完整 Spec 且验证策略清楚：直接 `plan`
- 任务是可直接完成的小补丁：直接执行，并按当前 recovery surface 按需记录 evidence
- 用户明确只要快速事实回答、翻译、格式整理
- 已有 Spec 只需要拆实施阶段：不要在 brainstorm 里重新设计

### 路由规则

| 状态 | 下一步 |
| --- | --- |
| 需求、边界或验证策略未定 | **本 skill** |
| Spec 已写但用户未批准 | 继续本 skill |
| Spec 已批准 | `plan` |
| Spec 已批准、计划已写、项目工作面或 recovery surface 缺失 | `harness-builder` |
| 只是单点小改 | 退出 brainstorm |

## 先读取这些输入

1. 既有 Spec：`docs/specs/`、`docs/product-specs/`、`docs/design-docs/`、issue、PRD、README。
2. 已选择的 recovery surface：读取已接受规格、拒绝方案、残余风险，避免重走旧路。
3. 既有 Executable Plan：若存在，只作为当前上下文，不把旧 active slice 当成新 Spec。
4. `AGENTS.md`、README、相关代码和测试：确认项目惯例、验证命令和工作面限制。
5. `git status --short`、`git log --oneline -10`：确认是否已有未提交方向或近期设计趋势。
6. 用户给出的链接、截图、设计稿或外部约束。

## 执行流程

### 第 0 步 — 建立问题框架

先用不超过 5 句话复述项目现实和当前想法，然后判断是否需要拆分。多个独立子系统应拆成多个 Spec。

### 第 1 步 — 多轮澄清，不许一问收敛

每次只问一个问题，但不是只问一个问题。至少覆盖目的、范围、用户/调用者、行为、约束、成功标准、验证策略和能力缺口，除非材料已经明确回答。

### 第 2 步 — 设计验证流程

在提出实现方案前，先构建验证策略：baseline、自动化检查、smoke/E2E、负例、文档/状态验证、fresh evidence 要求，以及无法验证项。

### 第 3 步 — 比较 2-3 个方案

每个方案包含定位、关键取舍、失败模式和验证影响。即使只有一个方案合理，也要记录被拒绝的替代方案和拒绝理由。

### 第 4 步 — 分段呈现设计并获得确认

按目标和范围、行为与接口、状态/数据/架构边界、验证策略、非目标和残余风险分段确认。不要把用户沉默当批准。

### 第 5 步 — 写 Spec 文档

使用 `templates/spec.md`。Spec 必须覆盖背景、Goals、Non-goals、用户/调用者、行为规格、约束、方案选择、Verification strategy、Capability gaps、Success criteria、Residual risks 和 Plan handoff。

### 第 6 步 — Spec 自审

按 `references/spec-review-checklist.md` 自审并直接修复 TBD、TODO、空章节、互相矛盾、不可证伪成功标准和隐藏的 capability gap。

### 第 7 步 — 按需写 durable 摘要

如果当前 recovery surface 要求记录决策摘要，在对应 artifact 追加短摘要：Spec 路径、accepted goals/non-goals、关键约束、verification strategy、capability gaps、rejected options、residual risks。

不要为了 brainstorm 默认创建三文件，也不要把完整 Spec 塞进状态日志。

### 第 8 步 — 用户 review gate

最后必须停下来让用户审阅 Spec 文件：

```text
Spec written: <path>
Please review and approve or request changes before I create the implementation plan.
Next skill after approval: plan
```

用户批准前不要调用 `plan`，不要写 Executable Plan，不要实现。

## 输出格式

```text
BRAINSTORM SPEC READY

Spec: <docs/specs/YYYY-MM-DD--topic.md>
Question solved: <一句话>
Chosen approach: <一句话>
Verification strategy: <一句话>

Needs user review:
  - Approve -> plan
  - Request changes -> revise Spec and re-run self-review
  - Pause -> use the selected recovery surface only if needed
```

## Recommended next skill

These recommendations guide handoff; do not invoke the next skill automatically before the user approves the Spec.

| Situation | Recommended next skill |
| --- | --- |
| Spec approved and implementation needs planning | `plan` |
| User is explicitly designing or repairing the project harness | `harness-builder` |
| Spec exposes missing skills, MCP, hooks, or verification capability | `plan`, then `harness-builder` if the capability affects execution |
| User pauses before approval | selected recovery surface only |

## 常见反模式

- **只问一个问题就收敛。** 一条消息只问一个问题，不等于整个 brainstorm 只能问一个问题。
- **把 Spec 写进状态日志就结束。** 状态日志只是索引；Spec 必须有独立文档。
- **先选实现方案，后补验证。** 验证策略要参与方案取舍。
- **写成计划。** Spec 描述要建什么和如何证明；阶段、任务、commit unit 属于 `plan`。
- **跳过用户 review gate。** Spec 未批准前不要生成 Executable Plan。
- **遗漏 rejected options。** 后续 agent 会重新讨论旧路。
- **遗漏 capability gap。** 无法验证的内容必须早暴露。

## 验收标准

- [ ] 已读取项目现实、既有 Spec / plan / docs / 相关代码。
- [ ] 已通过澄清覆盖目的、范围、行为、约束、成功标准和验证策略。
- [ ] 已比较 2-3 个方案，或明确记录被拒绝替代方案。
- [ ] 已写独立 Spec 文档，默认位于 `docs/specs/YYYY-MM-DD--<topic>.md`。
- [ ] Spec 含 Verification strategy、Capability gaps、Success criteria、Plan handoff。
- [ ] 已按 `references/spec-review-checklist.md` 自审并修复问题。
- [ ] 如 recovery surface 要求，已追加 Spec 摘要和 rejected options。
- [ ] 已请求用户批准 Spec；未批准前没有调用 `plan` 或写实现代码。

## 工件更新

- `docs/specs/YYYY-MM-DD--<topic>.md`：本次重点产物。
- selected recovery surface：只在项目要求时追加 Spec 摘要、拒绝方案、风险、验证策略索引。
- Executable Plan：不在本 skill 中创建或改写；批准后交给 `plan`。

## 按需读取

- spec 模板：`templates/spec.md`
- spec 自审：`references/spec-review-checklist.md`
- 收敛后下一步：`../plan/SKILL.md`
- 如果发现需要先准备项目工作面：`../harness-builder/SKILL.md`
