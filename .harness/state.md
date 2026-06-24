# Harness State（Hot Index）

本文件是热恢复索引，不是追加式报告。

## Objective

强化 workflow skills 文档纪律：brainstorm Phase A2 Design Grill（非平凡强制）、统一 `.harness/` recovery、Work Index 必填；本仓库 dogfood，并降低 `harness-builder` 默认路径重量。

## Active slice

修复用户审阅担忧：`harness-builder` 默认 Quick repair / Full recommendation 分流；legacy root three-file 模板降级为迁移参考；三端 skills、Cursor 面和 skill-flow 生成物同步。

## Current phase

review → verify → commit

## Success criteria

- `skills/`、`CONTEXT.md`、`AGENTS.md`、`docs/harness-method-contract.md` 语义一致，无 three-file backend 作为主路径
- `harness-builder` 小修默认不展开 Capability Recommendation / Research Route，除非用户请求或 repo evidence 需要
- `.harness/recovery_policy.md`、`work_index.md`、`state.md` 存在且可读
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

- `skills/plan/templates/` 仍保留 legacy root three-file 内容，但已标记为 migration reference；不作为新工作入口
- 历史 docs/plans / docs/prd 仍含 three-file 用语（冷档案，不阻塞当前 slice）
