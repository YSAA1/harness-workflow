---
name: brainstorm
description: "用于把模糊需求收敛成用户批准的 Spec。触发：目标/边界/取舍/成功标准/验证策略未定，或用户说先讨论/grill/先落 Spec。已有完整 Spec 或小补丁时不用；批准后交给 plan。"
---

# Spec 构思（Frontier Grill）

收敛模糊想法 → 用户批准的 **Spec** → `plan`。不写生产代码，不写 Executable Plan。

Leading words: **frontier** · **design tree** · **shared understanding**

Canonical Spec：`docs/specs/YYYY-MM-DD--<topic>.md`（仅用户或 `AGENTS.md` 明示时可 override）。默认不写 `.harness/`；唯一例外：项目已有 `.harness/` 恢复面时执行「落盘即登记」（见流程步骤 1–2）。

用户可见语言跟随用户；协议 token（`BRAINSTORM …`、`Spec`、`Gate`、路径）可保留英文。

## 路由

- **Use**: 意图开放、标准或验证不清、要 grill。
- **Don't**: Spec 已批；单点小补丁；只要事实回答。
- **Next**: Spec 批准 → `plan`；工作面缺口 →（Spec 批准后或用户明示）`harness-builder`。

## 输入

步骤 1 必读：`references/clarification-loop.md` + `clarification-coverage.md` + `design-grill.md`；既有 Spec/代码/`AGENTS.md`；`git status`；用户材料。

## 流程

### 1. Frontier grill

Gate 前不写 Spec。这是**一场 relentless interview**：每轮把全部未决 **frontier** 决策（会改变方案、前置已定、彼此独立）一次性编号提出，每题带 `➡️` 推荐答案，设计敏感题附一条具体压力场景（分支顺序见 `design-grill.md`）。事实缺口先自查仓库/文档；偏好、取舍、验证力度、范围边界不得 inferred 兜底，必须进 frontier。判空判据：每个设计分支要么用户已答或显式豁免，要么是仓库可证事实（记来源）——常识默认、业界惯例、可延后不构成免问。沿用已有明确需求、决策与授权，不设最少轮数。细节：`clarification-loop.md`。

完成：Grill Gate 过 + assumption batch（若有，仅事实推断）+ shared understanding 已覆盖（完整 brief 与起草授权，或单次确认）。

恢复面接续（仅项目已有 `.harness/` 时）：第一轮 frontier 发出后，为本轨道在 work_index 登记行——Status `active`、Primary artifact 填 `（Spec 未落盘：<预定 Spec 路径>）`；每轮 grill 结束顺手把该行 Last verified 格更新为「日期 · 已定 n/m · 未决题号」。断会话后新会话按行内进度续问，不从头重问；无恢复面项目跳过本段，维持零文件。

### 2. Spec

按 `references/spec-drafting.md`：验证策略 → 方案比较 → 写 Spec → 自审 → 求批准。未批准不 `plan`。Spec 落盘的同一动作里，把本轨道 work_index 行的 Primary artifact 翻转为实际 Spec 路径（grill 阶段未登记者此时补登记；无恢复面项目不登记，批准后由 `plan` 接管建档）。未批准 Spec 因该行出链而非孤儿。

完成：独立 Spec 路径已给，等待批准。

## 硬规则

- 存在未决偏好/取舍时，用户可见的第一条消息必须是编号 frontier 问题；禁止只发 Coverage 计分板或 assumption batch 代替提问。
- 一条消息一个 frontier round；依赖题拆到后轮，独立题同轮发出。
- 沉默 ≠ 批准；shared understanding 由完整 brief 与明确起草授权覆盖，否则单问一次，不重复索要相同确认。

## 输出

回合模板唯一源在此：frontier 问题打头，Coverage 压成一行（账本是进度笔记，不是交付物）。

```text
BRAINSTORM CLARIFICATION IN PROGRESS
❓ Q1 - <title>: <body; options if useful>
➡️ <recommended answer>
❓ Q2 - <title>: <body>
➡️ <recommended answer>
Coverage: <confirmed+waived>/8; Gate: BLOCKED; Frontier: open
Needs: frontier answers | shared understanding
```

Gate 过后切换为：

```text
BRAINSTORM SPEC READY
Spec: <path>; Gate: PASSED; Frontier: empty
Needs: approve Spec
Next after approval: plan
```

中文用户同一结构，标签可中文化，`❓` / `➡️` 与状态 token 保留。

## 验收

- [ ] Gate 过；purpose/scope/success/verification 为 confirmed 或 waived，不以 inferred 过闸
- [ ] 存在未决取舍时 Frontier 为 open 且本轮有编号问题
- [ ] Shared understanding 已覆盖；Spec 已求批
- [ ] 有恢复面项目：Spec 落盘时本轨道 work_index 行已指向该 Spec（项目确无恢复面则免）

## 按需读取

- 步骤 2 起：`references/spec-drafting.md` · `spec-review-checklist.md` · `templates/spec.md`
- 文中 `CONTEXT.md` 指目标项目根目录的领域词汇表（若存在），不是插件包文件；先按项目 `AGENTS.md` 找实际词汇来源，不存在不强制创建。

## Recommended next skill

| Situation | Next |
| --- | --- |
| Spec approved | `plan` |
| Spec rejected / 讨论放弃（含 grill 中止） | 同 commit 翻行 `abandoned` 走退休四步（删未批准 Spec；无恢复面或 grill 中止时无件可删）→ 结束 |
| Workbench gap（批准后或用户明示） | `harness-builder` |
