---
name: writing-for-agents
description: "维护 agent 跨会话读取的文件：AGENTS.md/CLAUDE.md/Cursor rules 等持久指令的审计与修订、.harness 恢复面（work_index/state/lessons）的修复与迁移、skills 本身的写作纪律。触发：用户要求更新、审计或修复这些文件，或修改 skill 行为。"
---

# Writing for Agents

写并维护 agent 消费的任何面：skills、`AGENTS.md` / `CLAUDE.md` / Cursor rules、指针到达的文档、恢复/状态面。包装不同，写作纪律不变——让 agent 每次运行走同样的过程，而不是产出同样的结果。

日常任务流（brainstorm/plan/ship）不经过本 skill：`plan` 负责建档，本 skill 负责修档案系统。

核心写作纪律（context pointers、两种负载、信息层级、完成判据、leading words、pruning）见 `references/writing-core.md`；写 skill 的 invocation 选择与 router 规则见 `references/skill-mechanics.md`。修改本 skill 族任何文档前先读对应 reference。

## 维护持久指令

1. 发现指定范围内实际生效的文件，区分全局、项目、子目录及生成镜像；Codex 全局入口 `$CODEX_HOME/AGENTS.md`（默认 `~/.codex`），Claude Code 与 Cursor 用各自发现机制。
2. 将规则与当前代码、配置、运行入口和用户授权对照，区分过时事实、冲突、重复、过宽触发和仍有价值的约束；质量维度、更新规则与可选大纲见 `references/instructions-maintenance.md`。
3. 以具体位置、后果和建议报告问题。只要求审计时只读；已授权时完成范围内删除、合并、迁移和修订，关键合同取舍询问，不重复确认已授权修改。
4. 事实证据说明系统现在如何工作，用户/项目合同说明应该如何工作；不一致时报告，不用现有 bug 覆盖目标合同。

## 维护恢复/状态面

1. 检查项目已有恢复入口和本次目标；旧任务状态不覆盖当前指令，只读 catch-up 先报告，不默认写文件。
2. 按 `references/recovery_surface_policy.md` 选最小 backend（none / lightweight / harness / feature-list / existing）；每个任务/轨道一个权威入口，独立轨道可同时 active。新任务的 harness 最小面（work_index + state）由 `plan` 内联建立；补充文件模板在 `../harness-builder/templates/`（work_index/state/lessons），按需实例化。
3. 记录目标、状态、下一步、证据链接和 blocker；按阶段、关键决定和交接更新，不按工具调用次数更新（见 `references/planning_with_files_adaptation.md`）。lessons 读写：开工先读（若存在）；cleanup 收尾与 diagnose 根因确认后落笔；每条带触发条件，失效即删，不设历史归档。
4. 结构可恢复性检查通过不等于业务验收通过；迁移只在授权且收益明确时做，保留追溯和链接。

## Recommended next skill

- 窄修改已验证：结束。
- 多类工作台改造：`harness-builder`；用户要求独立审阅：`review`。
