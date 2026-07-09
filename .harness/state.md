# Harness State（Hot Index）

本文件是热恢复索引，不是追加式报告。

## Objective

把 `harness-builder` 写成三个 helper 的薄总控：可检查的 Helper routing、progressive disclosure、description 去竞争、文档/镜像/eval 一致。

## Active slice

无（task 007 实现与验证已完成；ready claim 留给 verify）。

## Current phase

implement complete — 等待 review/verify。

## Success criteria

- [x] harness-builder SKILL 以 route/Helper routing 为中心，每步有 completion criterion
- [x] 厚 gap 有 owner 表；controller 只修 verification/install/anti-entropy
- [x] references 有 context pointer；新增 `controller_discipline.md`
- [x] helper descriptions 不再抢跨面 bootstrap
- [x] 三端结构验证 PASS（`bash scripts/agent/check.sh`）
- [x] metric pack emitter 0 fail；skill flow HTML 已重生

## Verification evidence

- `bash scripts/agent/check.sh` → PASS（plugin / Claude / Cursor / dry-run）
- `node scripts/check-plugin-eval-metric-pack.mjs` → PASS
- `node scripts/generate-skill-flow-html.mjs` → 13 HTML files
- `node scripts/check-plugin.mjs` → PASS

## Next actions

- 可选：`review` → `verify` → milestone commit（需用户明确要求）
- 后续可再 prune harness-builder 内与 capability-recommender 重复的 automation_* 文件（当前标为 fallback，未删）

## Blocked tasks

- 004: plan skill 主文件瘦身（blocked）
