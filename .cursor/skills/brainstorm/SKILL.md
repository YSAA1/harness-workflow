---
name: brainstorm
description: "用于把模糊需求收敛成用户批准过的 Spec。触发条件：目标、边界、方案取舍、成功标准或验证策略还没收敛，或用户说先讨论/先落 Spec。不要在已有完整 Spec、直接小补丁或只需事实回答时使用；Spec 批准后交给 plan。"
---

# Spec 构思

把开放想法收敛成用户批准过的 **Spec**，再交给 `plan`。不写生产代码，不写 Executable Plan。

Canonical Spec path: `docs/specs/YYYY-MM-DD--<topic>.md`。不要因为仓库存在 `docs/prd/`、root `plan.md`、issue、design docs 或其他任务系统就改写默认位置。只有当前用户明确指定路径，或 `AGENTS.md` 明确声明 canonical Spec surface 时，才允许 override，并在输出中说明 override reason。不要默认写三文件；recovery surface 只在项目要求时收短摘要。

## 语言策略

- 用户可见文本跟随用户语言；中文用户场景下，澄清问题、Coverage 说明、Spec 标题和模板提示默认使用中文。
- 协议稳定优先：协议 token 如 `BRAINSTORM CLARIFICATION IN PROGRESS`、`BRAINSTORM SPEC READY`、`Spec`、`Gate`、路径、skill 名和状态枚举可保留英文，必要时用中文标签补充解释。
- 不把“使用中文”硬编码为全局规则；英文用户或其他语言用户按其主要输入语言输出。
- 输出契约中的 `<... label in user's language>` 是占位说明，实际回复时必须替换成用户语言标签，不要原样输出。

## 目的

- 防止模糊想法过早进入计划或实现。
- 在选择方案前先把验证策略说清楚。
- 通过独立 Spec 留下 goals、non-goals、方案取舍、成功标准和 plan handoff。

## 路由快照

- **Use when**: 目标、边界、取舍、成功标准或验证路径不清，且需要先收敛 Spec。
- **Do not use when**: Spec 已批准、任务是单点小改、或用户只要事实回答。
- **Route to**: Spec 批准后转 `plan`；若发现项目工作面缺口，转 `harness-builder`。

## 何时使用

### 触发信号

- 意图仍开放，方案需要取舍。
- 成功标准、约束、non-goals 或验证路径不清。
- 用户说先 brainstorm、先讨论、先落 Spec、需求还没定、不要直接写代码。

### 不要使用

- 已有完整 Spec 且验证清楚：转 `plan`。
- 任务是单点小补丁：直接做并按需记录 evidence。
- 用户只要事实回答、翻译或格式整理。

### 路由规则

| 状态 | 下一步 |
| --- | --- |
| 需求、边界或验证策略未定 | **本 skill** |
| Spec 已写但未批准 | 继续本 skill |
| Spec 已批准 | `plan` |
| Spec 已批准且工作面/recovery surface 缺失 | `harness-builder` |
| 单点小改 | 退出 brainstorm |

## 先读取这些输入

1. `references/clarification-loop.md` 和 `references/clarification-coverage.md`。
2. 既有 Spec、PRD、issue、plan、README、`AGENTS.md`、相关代码与测试。
3. selected recovery surface、`git status --short`、`git log --oneline -10`。
4. 用户给出的链接、截图、设计稿或外部约束。

## 执行流程

### 第 1 步 — Phase A Clarification

Gate 通过前禁止写 Spec。复述问题，维护 Coverage Matrix，每轮只问一个最高优先级问题并等待用户回复。Gate 通过后，对所有 `inferred` 项做 assumption batch 确认。

### 第 2 步 — Phase B Spec Drafting

Gate 与 assumption batch 完成后，按 `references/spec-drafting.md` 执行：先验证策略 → 比方案 → 写 Spec → 自审 → 请求用户批准。

## 输出契约

```text
BRAINSTORM CLARIFICATION IN PROGRESS | BRAINSTORM SPEC READY

<Spec path label in user's language> / Spec: <docs/specs/YYYY-MM-DD--topic.md or explicit override | n/a>
<Coverage label in user's language> / Coverage: <confirmed+waived>/<8>; Gate: <BLOCKED|PASSED>
<Chosen approach label in user's language> / Chosen approach: <一句话 or n/a>
<Verification strategy label in user's language> / Verification strategy: <一句话 or pending>
<Needs user review label in user's language> / Needs user review: <question|approve Spec before plan>
<Next skill after approval label in user's language> / Next skill after approval: plan
```

## 硬规则

- 一条消息一个问题；整个 Phase A 要多轮。
- 不把推断当确认；不把沉默当批准。
- Spec 未批准前，不 `plan`、不写 Executable Plan、不实现。

## 验收标准

- [ ] Clarification Gate 通过；purpose、scope、success criteria、verification strategy 非 `unknown`
- [ ] 至少等待过一次用户回复，或用户提供了无 blocking 歧义的完整 brief
- [ ] 独立 Spec 已写、已自审、已请求用户批准

## 工件更新

- `docs/specs/YYYY-MM-DD--<topic>.md`：Phase B 的独立 Spec。
- Do not write Spec to `docs/prd/` unless the current user explicitly names that exact path or `AGENTS.md` declares it as the canonical Spec surface.
- selected recovery surface：只在项目要求时写短摘要、拒绝方案、风险和验证策略索引。
- Executable Plan：不在本 skill 中创建；Spec 批准后交给 `plan`。

## Recommended next skill

Handoff details: `references/spec-drafting.md`. Do not invoke the next skill before Spec approval.

| Situation | Next skill |
| --- | --- |
| Spec approved | `plan` |
| Harness or recovery surface gap | `harness-builder` |

## 按需读取

- Phase A：`references/clarification-loop.md`、`references/clarification-coverage.md`
- Phase B：`references/spec-drafting.md`
- 自审：`references/spec-review-checklist.md`
- 模板：`templates/spec.md`
- 下一步：`../plan/SKILL.md`；工作面缺口：`../harness-builder/SKILL.md`
- 共享语言：`../../CONTEXT.md`（必读；使用其词汇写 Spec；引入新概念词时在 Phase B 当场补入 CONTEXT.md）

## Spec freeze discipline

- If an approved Spec or Executable Plan already exists and the user asks to continue execution, do not reopen brainstorming unless the target, scope, success criteria, or verification strategy has materially changed.
- In that case, route to the next planned lane and preserve the existing Spec as the source of truth.
