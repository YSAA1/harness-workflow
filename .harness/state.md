# Harness State（Hot Index）

本文件是热恢复索引，不是追加式报告。

## Objective

强化 `brainstorm` Phase A2 Design Grill：参考 `grill-me` / `grilling` 的 relentless interview 风格，让非平凡需求在进入 Spec 前经过更强的单问追问、推荐答案和具体压力场景。

## Active slice

增强 `brainstorm` Phase A2：收紧 `design-grill.md`，补齐主 skill 和 Cursor rule 引用，并加入检查防止退回软 gate。

## Current phase

verify → commit

## Success criteria

- `skills/brainstorm/references/design-grill.md` 明确要求 relentless interview、working recommendation、stress scenario 和 repo-first answering
- `skills/brainstorm/SKILL.md` 与 Cursor rule 都把 `design-grill.md` 列为 Phase A 必读
- `scripts/check-plugin.mjs` 能防止 Design Grill 关键纪律退化
- `node scripts/check-plugin.mjs`、`node scripts/check-claude-code-install.mjs`、`node scripts/check-cursor-install.mjs`、`node scripts/install-cursor.mjs --target . --dry-run`、`bash scripts/agent/check.sh` PASS

## Verification path

```bash
node scripts/check-plugin.mjs
node scripts/check-claude-code-install.mjs
node scripts/check-cursor-install.mjs
node scripts/install-cursor.mjs --target . --dry-run
bash scripts/agent/check.sh
```

## Next actions

- 提交中文 milestone commit

## Risks

- A2 变强可能拉长 brainstorm；仍保留“一条消息一个问题”和 trivial slice waiver，避免把小补丁流程化
