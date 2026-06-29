# Harness State（Hot Index）

本文件是热恢复索引，不是追加式报告。

## Objective

按 `$write-a-skill` 与 `$skill-creator` 原则瘦身 `plan` skill 的 `SKILL.md`，降低热路径 token 成本，同时保留 Executable Plan、默认中文、checkbox 工作项、验证路径和 recovery sync 契约。

## Active slice

将 `skills/plan/SKILL.md` 从 251 行压缩到约 150 行，保留性能关键的 Planning Surface、blocked verification、commit unit、反模式和 checkbox 契约，并同步 `plugins/harness-workflow/skills/plan` 与 `.cursor/skills/plan`，刷新 skill-flow HTML。

## Non-goals

- 不改变 `plan` 的触发边界、默认 artifact 路径或 recovery surface 语义。
- 不新增 reference 文件、脚本或模板。
- 不恢复 legacy root three-file plan 模板。
- 不改其他 workflow skills。

## Current phase

verified; pending commit

## Success criteria

- `skills/plan/SKILL.md` 明显少于原 251 行，保留 YAML frontmatter、清晰 description 和 `## Recommended next skill`。
- 保留 checker 需要的稳定 token：`Executable Plan`、`Verification path status`、`Required capabilities`、`Fallback evidence`、`final_integration_claim`、checkbox 工作项和 `Next skill`。
- 保留默认中文、Planning Surface、`.harness` runtime sync、commit unit 和 plan boundary 规则。
- 三套表面同步：root skills、packaged plugin、Cursor skills。
- `docs/skill-flow-review/*.html` 由生成脚本刷新。
- 默认结构验证通过。

## Verification path

```bash
node scripts/check-plugin.mjs
node scripts/check-claude-code-install.mjs
node scripts/check-cursor-install.mjs
node scripts/install-cursor.mjs --target . --dry-run
node scripts/generate-skill-flow-html.mjs
bash scripts/agent/check.sh
git diff --check
```

## Next actions

- [x] 读取 `$write-a-skill` 与 `$skill-creator`
- [x] 精简 `skills/plan/SKILL.md`
- [x] 同步 packaged plugin 与 Cursor skill
- [x] 刷新 skill-flow HTML
- [x] 运行结构验证
- [ ] commit

## Risks

- 过度瘦身可能丢掉隐性执行纪律；已用 checker token 和结构验证覆盖核心契约。
- 当前目标不是极限压缩；后续新增内容应优先替换冗余或拆 reference，避免再次回到 200+ 行。
