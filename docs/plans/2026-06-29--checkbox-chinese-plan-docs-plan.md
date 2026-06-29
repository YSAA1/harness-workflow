# 可打勾中文计划文档改造

> Status: verified
> Date: 2026-06-29
> Spec source: 当前用户请求
> Branch: `master`

## 目标

让 `plan` 产出的 Executable Plan 和 `harness-builder` 创建的计划/恢复类文档默认使用中文，并把计划进度表达改成可直接打勾的 Markdown checkbox 工作项。

## Active slice

更新 `plan` 契约、`harness-builder` 模板、项目文档、checker 和当前 `.harness` recovery，让默认计划文件具备 `- [ ]` / `- [x]` 状态表达，并保持三套 skill 分发表面一致。

## 非目标

- 不恢复 legacy root `task_plan.md` / `progress.md` / `findings.md` 模板。
- 不把协议 token、路径、命令、状态枚举或 skill 名全部翻译成中文。
- 不修改 workflow lane 数量、recovery surface 语义或默认 plan 路径。
- 不安装用户级配置、MCP、hooks 或外部插件。

## 成功标准

- `plan/SKILL.md` 明确要求 Executable Plan 使用 Markdown checkbox 工作项表达完成状态。
- `harness-builder` 用户可见模板在未指定语言时默认中文，显式非中文仍可走英文/default 分支。
- `state.md.j2` 的下一步默认是 checkbox 工作项，而不是单行普通文本。
- `README.md`、`README.zh-CN.md` 和 `docs/harness-method-contract.md` 描述新的 checkbox plan 契约。
- `scripts/check-plugin.mjs` 有静态回归检查覆盖 checkbox plan 契约、中文默认和三套 skill 同步。
- 当前 `.harness/work_index.md` active 行指向本计划文件，`.harness/state.md` 的下一步是 checkbox 清单。
- 默认结构验证和生成物检查通过。

## 验证路径

Verification path status: `runnable`

Required capabilities:

- Node.js，用于项目结构验证和生成脚本。
- 本地 shell，用于同步分发表面和运行 dry-run。
- Git，用于检查工作区和提交边界。

Fallback evidence: `none`

Final integration claim: plan / harness-builder / docs / checker / `.harness` / packaged skills / Cursor skills 都表达同一个契约：默认中文，计划进度用 Markdown checkbox 工作项表示。

## 工作项

- [x] 阶段 1：确认现状和风险
  - acceptance_criteria:
    - 已读取 `plan`、`harness-builder`、当前 `.harness`、checker 和相关 docs。
    - 已确认三套 skill 分发表面需要同步。
  - verification_commands:
    - `git status --short --branch`
    - `rg -n "docs/plans|Executable Plan|Next actions|default\\('en'\\)" skills docs README.md scripts .harness`
  - success_definition: 改动面和同步风险清楚，未开始无依据编辑。
- [x] 阶段 2：更新核心契约和模板
  - acceptance_criteria:
    - `plan/SKILL.md` 要求工作项使用 `- [ ]` / `- [x]`。
    - `harness-builder` 模板默认语言从英文改为中文，同时保留显式非中文分支。
    - `state.md.j2` 的下一步默认输出 checkbox 工作项。
  - verification_commands:
    - `rg -n "## 工作项|- \\[ \\]|- \\[x\\]|default\\('zh'\\)|checkbox 工作项" skills/plan skills/harness-builder/templates`
  - success_definition: 根目录 canonical skill 契约和模板表达新行为。
- [x] 阶段 3：更新 docs、checker 和当前 recovery
  - acceptance_criteria:
    - README 和方法契约说明 checkbox plan 行为。
    - `scripts/check-plugin.mjs` 检查默认中文和 checkbox 工作项契约。
    - `.harness/work_index.md` 指向本计划，`.harness/state.md` 使用 checkbox next actions。
  - verification_commands:
    - `node scripts/check-plugin.mjs`
  - success_definition: 静态检查能防止关键契约回退。
- [x] 阶段 4：同步分发表面并刷新生成物
  - acceptance_criteria:
    - `plugins/harness-workflow/skills` 与根目录 `skills` 一致。
    - `.cursor/skills` 与根目录 `skills` 一致。
    - skill-flow HTML 从生成脚本重建。
  - verification_commands:
    - `node scripts/generate-skill-flow-html.mjs`
    - `node scripts/check-plugin.mjs`
  - success_definition: 所有公开安装面看到同一套 skill 契约。
- [x] 阶段 5：结构验证和收口
  - acceptance_criteria:
    - 默认验证命令全部通过。
    - `git status` 只包含本次相关改动。
    - 未声明 ready；后续进入 review 或 verify。
  - verification_commands:
    - `node scripts/check-plugin.mjs`
    - `node scripts/check-claude-code-install.mjs`
    - `node scripts/check-cursor-install.mjs`
    - `node scripts/install-cursor.mjs --target . --dry-run`
    - `git status --short --branch`
  - success_definition: 改动可被项目现有检查接受，且范围清楚。

## Commit units

| Commit unit | Work items | scope | 提交前置条件 | commit message |
| --- | --- | --- | --- | --- |
| M1 | 阶段 1-5 | plan 契约、harness-builder 模板、docs、checker、recovery 和分发表面同步 | review 无 Critical + verify PASS | `默认中文并改造可打勾计划文件` |

## 已知风险 / Blockers

- checker 能证明契约在场，但不能完全证明未来 agent 每次都按 checkbox 写计划。
- 默认中文不能变成中文-only；显式英文和其他非中文用户仍要可用。

## Verification record

Verification: PASS

- claim_id: `checkbox-chinese-plan-docs`
- claim: plan / harness-builder / docs / checker / `.harness` / packaged skills / Cursor skills 都表达同一个契约：默认中文，计划进度用 Markdown checkbox 工作项表示。
- latest_change_ref: milestone commit for this change; exact hash from `git log -1 --oneline`.
- covered_paths:
  - `skills/plan/SKILL.md`
  - `skills/harness-builder/`
  - `plugins/harness-workflow/skills/`
  - `.cursor/skills/`
  - `README.md`
  - `README.zh-CN.md`
  - `docs/harness-method-contract.md`
  - `docs/skill-flow-review/`
  - `.harness/`
  - `scripts/check-plugin.mjs`
- commands:
  - `node scripts/generate-skill-flow-html.mjs` -> PASS
  - `node scripts/check-plugin.mjs` -> PASS
  - `node scripts/check-claude-code-install.mjs` -> PASS
  - `node scripts/check-cursor-install.mjs` -> PASS
  - `node scripts/install-cursor.mjs --target . --dry-run` -> PASS
  - `bash scripts/agent/check.sh` -> PASS
  - `git diff --check` -> PASS
  - `diff -qr skills/plan plugins/harness-workflow/skills/plan` -> PASS
  - `diff -qr skills/plan .cursor/skills/plan` -> PASS
  - `diff -qr skills/harness-builder plugins/harness-workflow/skills/harness-builder` -> PASS
  - `diff -qr skills/harness-builder .cursor/skills/harness-builder` -> PASS
- skipped_high_value_checks: none
- unknowns: future agent adherence can only be guarded by contract/checker, not fully proven now
- ready: yes

## Review record

Review: PASS

- isolated_reviewer_attempt: yes
- reviewer_attempts:
  - mechanism: `reviewer` subagent
    status: timed out after 300000 ms, then closed
    fallback_reason: tool did not return within the critical path
  - mechanism: packet fallback
    status: completed
    fallback_reason: isolated reviewer timed out
- findings:
  - Critical: none
  - Important: none
  - Minor: none
- phase_acceptance: all met
- commit_eligibility: eligible

## Commit record

- commit: final milestone commit; exact hash from `git log -1 --oneline`
- message: `默认中文并改造可打勾计划文件`
