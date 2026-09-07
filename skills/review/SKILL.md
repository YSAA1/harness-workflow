---
name: review
description: "审查 diff、方案或完成声明，检查正确性、风险和验收证据。支持 WIP 的有限范围审阅；简单改动可由 implement 自审，verify 为本技能别名。"
---

# Review and verification

把问题发现和完成声明的证据核对放在一次评审中。审阅范围来自用户请求；WIP 可报告 findings，不必先完成实现才能审阅。

## 流程

1. 明确审阅的 diff/版本、目标行为和所需验收。查看相关源码、测试、文档及已有证据，不以实现者的解释替代检查。
2. 按具体故障路径检查正确性、合同、边界和回归。重要风险需要深入调查；无需凑 findings 或固定审查轮数。
3. 当独立检查有价值且运行时允许时，使用有明确范围的只读 subagent；缺少 subagent 本身不是失败。若用户或项目明确要求独立审查，该条件未满足需如实标记。
4. 将必需标准映射到 pass / fail / unknown。fresh evidence 指证据仍适用于当前相关代码、配置和输入；未受后续变更影响的实际输出可复用，不因换技能或已有 commit 自动失效。
5. 只补缺失或失效的检查。冷复核按证据歧义和风险使用，不要求再委派一名代理重跑同样测试。
6. 判定具体完成声明：无未解决的阻断问题且必需标准全 pass 才可 ready。Critical/Important 的正确性、数据、权限或合同问题均需解决；非阻断建议单独列出。

## 边界

- 只要求 review 时不修改代码；用户已授权修复时，记录发现后可转 `implement` 修复，再复核受影响部分，无需重新索要授权。
- WIP、局部检查或缺环境时给出有限范围结果，不将 unknown 算通过。
- 低风险修改允许轻量自审完成。`verify` 只转到本技能一次，不形成 review → verify → review 循环。

## 输出

优先输出可行动 findings（严重度、位置、触发条件、影响），然后给验证、剩余缺口和结论。需要追踪时使用 REVIEW / VERIFICATION / READY，并注明审查方式为 self、subagent 或外部审阅及其范围；不强制空表。

## 按需读取

- 深入对抗审查：`references/adversarial-reviewer-prompt.md`、`references/attack-taxonomy.md`。
- 验收证据：`references/evidence-ladder.md`；证据解释有争议时读 `references/cold-verifier-prompt.md`。
- 对应风险存在时读 `references/cross-cutting-anti-patterns.md`、`references/premature-completion-patterns.md`；工具缺口见 `references/capability-recommendations.md`。

## Recommended next skill

- 已完成：按项目要求提交；仅有本次文档/恢复整理需求时用 `cleanup`，否则结束。
- 已授权修复：`implement`；未知根因：`diagnose`。
- 超出目标的建议作为后续事项，不自动开启新任务或 `harness-builder`。
