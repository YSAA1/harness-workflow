# Harness State（Hot Index）

本文件是热恢复索引，不是追加式报告。

## Objective

（全部完成）对 `review`、`verify`、`cleanup` 三个 workflow skill 做针对性优化。

## Active slice

无（task 006 已完成并 milestone committed）。

## Current phase

complete — 8/8 阶段完成，commit `92edf15`。

## Success criteria

- [x] review 产出的 verify_handoff_cases 在 verify 的流程中有显式消费步骤。
- [x] verify 的 Capability Recommendation 逻辑简化为"记录缺口 → route to harness-builder"。
- [x] review 隔离机制三端通用化（Codex / Claude Code / Cursor 各有明确路径）。
- [x] verify 增加 Cold Verification Pass（Agent team dispatch）。
- [x] review 的 adversarial pass 增加了攻击假设分类法。
- [x] verify 的 evidence ladder 增加了常见改动类型的阶梯组合推荐。
- [x] cleanup 增加了 deferred cleanup registry 机制。
- [x] 跨 skill 共享反模式已提取为独立参考文件。
- [x] 三端结构验证通过（29/29 PASS）。
- [x] Skill flow HTML 重新生成通过。

## Verification evidence

- `bash scripts/agent/check.sh` → 29/29 PASS
- `node scripts/generate-skill-flow-html.mjs` → 13 HTML files generated
- Milestone commit: `92edf15`

## Next actions

等待新任务。

## Blocked tasks

- 004: plan skill 主文件瘦身（blocked）
