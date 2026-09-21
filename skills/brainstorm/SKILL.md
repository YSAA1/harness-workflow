---
name: brainstorm
description: "用于把模糊需求收敛成用户批准的 Spec。触发：目标/边界/取舍/成功标准/验证策略未定，或用户说先讨论/grill/先落 Spec。已有完整 Spec 或小补丁时不用；批准后交给 plan。"
---

# Spec 构思（Frontier Grill）

收敛模糊想法 → 用户批准的 **Spec** → `plan`。不写生产代码，不写 Executable Plan。

Leading words: **frontier** · **design tree** · **shared understanding**

Canonical Spec：`docs/specs/YYYY-MM-DD--<topic>.md`（仅用户或 `AGENTS.md` 明示时可 override）。默认不写 `.harness/`。

用户可见语言跟随用户；协议 token（`BRAINSTORM …`、`Spec`、`Gate`、路径）可保留英文。

## 路由

- **Use**: 意图开放、标准或验证不清、要 grill。
- **Don't**: Spec 已批；单点小补丁；只要事实回答。
- **Next**: Spec 批准 → `plan`；工作面缺口 → `harness-builder`。

## 输入

`references/clarification-loop.md` + coverage/design-grill；既有 Spec/代码/`AGENTS.md`；`git status`；用户材料。

## 流程

### 1. Frontier grill

Gate 前不写 Spec。这是**一场 relentless interview**：维护设计树与 coverage 账本——Coverage 是进度账本，不是独立填表阶段。每轮只问会改变方案的未决 **frontier**（前置已定、彼此独立），可多问，每题带推荐答案；沿用已有明确需求、决策与授权，不设最少轮数。Facts 自查/子 agent；必要 Decisions 等人；偏好与取舍型决策不得 inferred 兜底，必须进 frontier。frontier 判空前按 Branch Order（`design-grill.md`）扫过设计分支、说明每支为何无需问——空 frontier 是扫出来的，不是推断掏空的。细节：`clarification-loop.md`。

完成：Grill Gate 过 + assumption batch（若有）+ 用户确认 **shared understanding**。

### 2. Spec

按 `references/spec-drafting.md`：验证策略 → 方案比较 → 写 Spec → 自审 → 求批准。未批准不 `plan`。

完成：独立 Spec 路径已给，等待批准。

## 硬规则

- 一条消息一个 frontier round；依赖题拆到后轮。
- 沉默 ≠ 批准；已有完整 brief 和明确起草授权可满足 shared understanding，不重复索要相同确认。

## 输出

```text
BRAINSTORM CLARIFICATION IN PROGRESS | BRAINSTORM SPEC READY
Spec: <path|n/a>
Coverage: <confirmed+waived>/8; Gate: BLOCKED|PASSED
Frontier: open|empty
Needs: frontier answers | shared understanding | approve Spec
Next after approval: plan
```

Frontier 提问形状见 `clarification-loop.md`（`❓` / `➡️`）。

## 验收

- [ ] Gate 过；purpose/scope/success/verification 非 unknown（或已豁免）
- [ ] Shared understanding 已确认；Spec 已求批

## 按需读取

- `references/clarification-loop.md` · `clarification-coverage.md` · `design-grill.md` · `spec-drafting.md` · `spec-review-checklist.md` · `templates/spec.md`
- 文中 `CONTEXT.md` 指目标项目根目录的领域词汇表（若存在），不是插件包文件；先按项目 `AGENTS.md` 找实际词汇来源，不存在不强制创建。

## Recommended next skill

| Situation | Next |
| --- | --- |
| Spec approved | `plan` |
| Workbench gap | `harness-builder` |
