# Harness State（Hot Index）

本文件是热恢复索引，不是追加式报告。

## Objective

SSY-1：优化工作流的三个阶段 — brainstorm（Phase A 统一 Grill）、review/verify（协议修复 + Cold Verification）、cleanup（deferred registry）。三个阶段均已实现并验证。

## Active slice

无（SSY-1 三个阶段全部 complete；本 run 做收尾验证与恢复面同步）。

## Current phase

complete — SSY-1 收尾；后续新工作走新 issue / 新任务。

## Success criteria（SSY-1）

- [x] brainstorm Phase A 统一为一场 relentless Grill（D-002）；非平凡强制 ≥2 轮 + ≥1 stress scenario
- [x] review 产出的 `verify_handoff_cases` 在 verify 有显式消费步骤，不静默丢弃
- [x] verify Capability Recommendation 简化为记录缺口 → route to harness-builder
- [x] review 隔离机制三端通用化（Codex / Claude Code / Cursor）+ 风险分级 fallback（不再按 diff 大小）
- [x] verify Cold Verification Pass：中高风险改动隔离验证；`cold-verifier-prompt.md` 存在
- [x] review 攻击假设分类法（`attack-taxonomy.md`：边界/时序/身份/契约/数据）
- [x] verify evidence ladder 场景映射表（按改动类型给最低/推荐阶梯）
- [x] cleanup deferred cleanup registry + `entropy-checklist.md` 记录格式
- [x] 跨 skill 共享反模式提取（`cross-cutting-anti-patterns.md`），三端 SKILL 引用一致

## Verification evidence

- live workdir `bash scripts/agent/check.sh` → 唯一 FAIL 是运行时 `.claude/skills` 污染（Multica runtime 注入，非项目缺陷）
- clean checkout（`git archive HEAD`）：`check-plugin.mjs`、`check-claude-code-install.mjs`、`check-cursor-install.mjs`、`install-cursor.mjs --dry-run`、`check-plugin-eval-metric-pack.mjs` 全 PASS
- `node scripts/generate-skill-flow-html.mjs` → Generated 13 HTML files，与 HEAD 无 diff（HTML 与 skill 一致）
- git HEAD 仅含项目改动；CLAUDE.md 的 Multica runtime block 与 `.claude/`、`.multica/`、`.agent_context/` 为运行时文件，未提交

## Next actions

- 无阻塞项。可选后续：prune harness-builder 内与 capability-recommender 重复的 automation_* 文件（当前标为 fallback，未删）

## Blocked tasks

- 004: plan skill 主文件瘦身（blocked）
