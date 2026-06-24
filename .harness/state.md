# Harness State（Hot Index）

本文件是热恢复索引，不是追加式报告。

## Objective

强化 workflow skills 文档纪律：brainstorm Phase A2 Design Grill（非平凡强制）、统一 `.harness/` recovery、Work Index 必填；本仓库 dogfood 并验证。

## Active slice

按用户四项决定落地 skill 协议 + 本仓库 `.harness/` 实例 + 跑 `check-plugin` / `check-cursor-install`。

## Current phase

implement → verify

## Success criteria

- `skills/`、`CONTEXT.md`、`AGENTS.md` 语义一致，无 three-file backend 作为主路径
- `.harness/recovery_policy.md`、`work_index.md`、`state.md` 存在且可读
- `node scripts/check-plugin.mjs` 与 `node scripts/check-cursor-install.mjs` PASS

## Verification path

```bash
node scripts/check-plugin.mjs
node scripts/check-cursor-install.mjs
node scripts/install-cursor.mjs --target . --dry-run
```

## Next actions

- 同步 `plugins/`、`.cursor/`、`rules/`
- 更新 `docs/harness-method-contract.md`、`README` 摘要

## Risks

- 历史 docs/plans 仍含 three-file 用语（冷档案，不阻塞当前 slice）
