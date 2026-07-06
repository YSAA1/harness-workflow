# Harness State（Hot Index）

本文件是热恢复索引，不是追加式报告。

## Objective

对 `review`、`verify`、`cleanup` 三个 workflow skill 做针对性优化：修复 review→verify 的 handoff case 协议断裂、简化 verify 的 capability recommendation 职责越界、三端通用化 review 隔离机制、为 verify 增加 Cold Verification Pass、增加 review 对抗式攻击分类法、增强 verify evidence ladder 场景映射、引入 cleanup deferred cleanup registry、提取跨 skill 共享反模式。

## Active slice

阶段 2（当前）：Review 隔离机制三端通用化。

## Non-goals

- 不改动 `brainstorm`、`plan`、`implement`、`diagnose`、`harness-builder` 或辅助 skill。
- 不改动 `.harness/` recovery surface 的字段语义。
- 不改动 `docs/harness-method-contract.md` 的 C6/C8/C9 核心契约。
- 不改动三端 plugin manifest 或 marketplace catalog。
- 不引入新的 workflow lane 或 helper skill。

## Current phase

阶段 2：Review 隔离机制三端通用化

## Success criteria

- [x] review 产出的 verify_handoff_cases 在 verify 的流程中有显式消费步骤。
- [x] verify 的 Capability Recommendation 逻辑简化为"记录缺口 → route to harness-builder"。
- [ ] review 隔离机制三端通用化（Codex / Claude Code / Cursor 各有明确路径）。
- [ ] verify 增加 Cold Verification Pass（三端隔离验证子步骤）。
- [ ] review 的 adversarial pass 增加了攻击假设分类法。
- [ ] verify 的 evidence ladder 增加了常见改动类型的阶梯组合推荐。
- [ ] cleanup 增加了 deferred cleanup registry 机制。
- [ ] 跨 skill 共享反模式已提取为独立参考文件。
- [ ] 三端结构验证通过。
- [ ] Skill flow HTML 重新生成通过。

## Verification evidence

- 阶段 1: `node scripts/check-plugin.mjs` → PASS（10/10）
- `grep -n "handoff" skills/verify/SKILL.md` → 确认 handoff cases 在第 1.5 步被消费
- `grep -n "Capability" skills/verify/SKILL.md` → 确认改为 Capability Gap Recording，不再做完整推荐

## Next actions

- [x] 阶段 1：修复 review→verify handoff case 协议断裂 + verify Capability Recommendation 简化
- [ ] 阶段 2：Review 隔离机制三端通用化（当前）
- [ ] 阶段 3：Verify Cold Verification Pass
- [ ] 阶段 4：新建 review 攻击假设分类法 reference
- [ ] 阶段 5：增强 verify evidence ladder 场景映射
- [ ] 阶段 6：增加 cleanup deferred cleanup registry
- [ ] 阶段 7：提取跨 skill 共享反模式
- [ ] 阶段 8：生成物刷新 + 全量验证 + milestone commits

## Risks

- Cold Verification Pass 依赖三端各自的子进程/子 agent 能力，需在 reference 文件中明确各端的隔离等级（强/中/弱）。
- review 隔离机制三端化以"增加 Claude Code / Cursor 路径 + 统一 fallback 规则"为主，不删除现有 Codex 路径。
