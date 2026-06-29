# Harness State（Hot Index）

本文件是热恢复索引，不是追加式报告。

## Objective

让 `plan` 产出的 Executable Plan 和 `harness-builder` 创建的计划/恢复类文档默认使用中文，并把计划进度表达改成可直接打勾的 Markdown checkbox 工作项。

## Active slice

更新 `plan` 契约、`harness-builder` 模板、项目文档、checker 和当前 `.harness` recovery，让默认计划文件具备 `- [ ]` / `- [x]` 状态表达，并保持三套 skill 分发表面一致。

## Non-goals

- 不恢复 legacy root `task_plan.md` / `progress.md` / `findings.md` 模板。
- 不把协议 token、路径、命令、状态枚举或 skill 名全部翻译成中文。
- 不修改 workflow lane 数量、recovery surface 语义或默认 plan 路径。
- 不安装用户级配置、MCP、hooks 或外部插件。

## Current phase

verified and committed

## Success criteria

- `plan/SKILL.md` 明确要求 Executable Plan 使用 Markdown checkbox 工作项表达完成状态。
- `harness-builder` 用户可见模板在未指定语言时默认中文，显式非中文仍可走英文/default 分支。
- `state.md.j2` 的下一步默认是 checkbox 工作项，而不是单行普通文本。
- `README.md`、`README.zh-CN.md` 和 `docs/harness-method-contract.md` 描述新的 checkbox plan 契约。
- `scripts/check-plugin.mjs` 有静态回归检查覆盖 checkbox plan 契约、中文默认和三套 skill 同步。
- 当前 `.harness/work_index.md` active 行指向本计划文件，`.harness/state.md` 的下一步是 checkbox 清单。
- 默认结构验证和生成物检查通过。

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

- [x] 确认现状和风险
- [x] 更新核心契约和模板
- [x] 更新 docs、checker 和当前 recovery
- [x] 同步分发表面并刷新生成物
- [x] 结构验证和收口

## Risks

- checker 能证明契约在场，但不能完全证明未来 agent 每次都按 checkbox 写计划。
- 默认中文不能变成中文-only；显式英文和其他非中文用户仍要可用。
