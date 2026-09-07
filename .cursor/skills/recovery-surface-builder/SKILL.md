---
name: recovery-surface-builder
description: "创建或修复跨会话恢复入口，或从既有状态恢复任务。优先现有 tracker/plan；短任务无需新文件，单纯读取状态不默认触发写入。"
---

# Recovery Surface Builder

这是恢复状态的 Helper Skill。让后续会话找到任务目标、当前轨道、下一步、证据和未解决问题，避免重复探索。

## Backend

| Backend | 使用方式 |
| --- | --- |
| none | 短任务无需持久状态 |
| lightweight | git diff 加可选简短计划即可 |
| harness | 项目需要独立恢复记录时使用 `.harness/` |
| feature-list | 复用已有功能清单或 issue board |
| existing | 复用现有 plan、tracker 或恢复文档 |

backend-neutral：none 不要求字段文件；其他方案只需在已有入口找到必要信息，不为满足目录模板制造副本。每个任务/轨道有一个权威入口，独立轨道可同时 active。

## 流程

1. 检查项目已有恢复入口和本次用户目标。旧任务状态不能覆盖当前明确指令；只读 catch-up 先报告，不默认改文件。
2. 选最小 backend，说明各必要字段的位置。已有正常工作方案保持原状；无 active 行可按当前明确任务建立记录，不自动关闭别的轨道。
3. 审计请求只给建议；已授权建立/修复则直接编辑相关文件。只有迁移会丢信息、影响其他任务或超出授权时询问。
4. 记录目标、状态、下一步、有效证据链接、重要决定和 blocker。按阶段、关键决定和交接更新，不按工具调用次数或每次读写更新。
5. 检查链接和字段可恢复性，说明验证范围。结构通过不等于业务行为验收通过。

## 按需参考

- backend / 字段：`references/recovery_surface_policy.md`、`references/recovery_policy.md`。
- 事实与指令边界：`references/source_of_truth_tiers.md`。
- 状态保鲜：`references/living_docs_discipline.md`、`references/anti_entropy.md`、`references/planning_with_files_adaptation.md`。
- 验证：`references/verification_policy.md`；`templates/` 只在选择 harness backend 时按需实例化。

## Recommended next skill

恢复完成后继续原任务；确需计划用 `plan`，复杂审阅用 `review`；窄指令修复用 `agent-instructions-maintainer`。不因恢复记录缺失自动升级为全工作台改造。
