---
name: brainstorm
description: "用于澄清影响目标、范围或验收的设计取舍，或用户明确要求讨论、grill、Spec。普通实现选择、事实查询和已明确的小任务不用。"
---

# 需求与 Spec

把开放需求变成可执行的设计决定。先利用用户材料、现有规格和代码回答事实问题；只问答案会改变结果的未定取舍。

## 流程

1. 说明当前理解、关键未知和可验证的成功标准。已有答案不重复询问。
2. 独立问题可一起问；依赖前一答案的问题留到下一轮。普通选择给出推荐和理由，允许用户修正。
3. 可以先写标注假设的 draft Spec，让用户审阅具体结果。默认沿用项目规格入口，无惯例时用 `docs/specs/YYYY-MM-DD--<topic>.md`。
4. 对尚未批准、会改变目标或引入高成本/不可逆操作的取舍，执行依赖步骤前取得明确答复。沉默不是批准。
5. 用户只要求讨论或计划时交付后结束；用户已授权实现且关键取舍已定时继续，不再单独索要 shared understanding 和 Spec 两次确认。

## 深度与产物

- 小问题可在对话中收敛，不强制建 Spec、设计树或覆盖率表。
- 明确要求 grill 或复杂设计时读 `references/design-grill.md`、`references/clarification-loop.md`；覆盖维度见 `references/clarification-coverage.md`，仅用于发现遗漏，不要求凑满八项。
- 写 Spec 时按需用 `references/spec-drafting.md`、`references/spec-review-checklist.md` 和 `templates/spec.md` / `templates/spec.zh-CN.md`。
- 报告决定、未定项、Spec 路径（若有）和下一步；不要求固定口号、图标或计分格式。

## Recommended next skill

- 需要多阶段执行顺序：`plan`。
- 已明确且已授权的小任务：`implement`。
- 只讨论：交付结论后结束。工作台缺口确实阻塞时才用 `harness-builder`。
