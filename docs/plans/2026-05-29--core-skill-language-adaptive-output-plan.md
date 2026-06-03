# Executable Plan - 核心 Skill 语言自适应输出

> Status: verified
> Date: 2026-05-29
> Spec source: `docs/specs/2026-05-29--core-skill-language-adaptive-output.md`
> Branch: `feature/core-skill-language-adaptive-output`

## Objective

让 `brainstorm`、`plan`、`harness-builder` 在中文用户场景下输出中文为主的用户可见文本，同时保留协议 token、路径、命令、状态枚举和跨端识别稳定性，并用真实 `codex exec` smoke 验证。

## Active Slice

第一版只改核心输出面：三个核心 skill 的语言策略、Spec/Plan/Harness 模板、静态回归检查、skill-flow HTML 和真实 `codex exec` smoke。

## Non-goals

- 不扩展到所有 workflow skills。
- 不翻译所有英文 token、命令、路径、状态枚举、字段名或 skill 名。
- 不改 workflow lane、recovery surface 语义、默认 artifact 路径或用户级配置。
- 不批量翻译历史 `docs/prd/` 或旧计划文档。

## Success Criteria

- `brainstorm`、`plan`、`harness-builder` 都明确声明：用户可见文本跟随用户语言；协议 token 稳定优先。
- 中文用户场景下，`brainstorm` 中文 Spec 模板、`plan` 中文 three-file 模板、`harness-builder` Harness 模板和 checkpoint 文案不再使用明显英文-only 段落标题污染；非中文用户不被强制中文化。
- checker 能检查核心模板和核心 skill 的语言策略，避免明显英文模板标题回归。
- `docs/skill-flow-review/*.html` 已由生成脚本重新生成，并展示更新后的输出契约。
- 默认结构验证通过。
- 三个真实 `codex exec` 中文 smoke 在最后一次相关修改后运行，并有可审查输出证据。
- 未把本次临时状态写入 `AGENTS.md`。

## Verification Path

Verification path status: `runnable`

Required capabilities:

- Node.js，用于项目脚本。
- `codex exec`，用于真实中文 smoke。
- 本地 Git，用于分支、diff、commit 和证据边界。

Fallback evidence: `none` for final readiness. 如果 `codex exec` 因环境失败，只能记录 blocker / residual risk，不能替代为静态检查通过。

Final integration claim: 三个核心 skill 在仓库源码、生成审阅页、本地验证脚本和真实 `codex exec` 中文场景中表现一致：中文用户可见输出中文为主，协议 token 保持稳定。

## Work Items

### Phase 1 - Baseline And Branch

Status: `completed`

acceptance_criteria:

- 当前工作区状态已记录。
- Plan 已写入 `docs/plans/2026-05-29--core-skill-language-adaptive-output-plan.md`。
- 已从 `master` 创建特征分支 `feature/core-skill-language-adaptive-output`。
- 已记录核心英文污染基线。

verification_commands:

- `git status --short --branch`
- `git switch -c feature/core-skill-language-adaptive-output`
- `rg -n "Background|Goals|Non-goals|Verification Strategy|Success Criteria|Output contract|HARNESS EVIDENCE|EXECUTABLE PLAN|USER CHECKPOINT" skills/brainstorm skills/plan skills/harness-builder`

success_definition: 计划和分支边界明确，后续改动都发生在特征分支。

### Phase 2 - Language Contract And Templates

Status: `completed`

acceptance_criteria:

- 三个核心 `SKILL.md` 都写清语言自适应规则和协议稳定边界。
- `skills/brainstorm/templates/spec.zh-CN.md` 提供中文主标题，`skills/brainstorm/templates/spec.md` 保持英文/default。
- `skills/plan/templates/task_plan.zh-CN.md`、`progress.zh-CN.md`、`findings.zh-CN.md` 提供中文 three-file 模板；对应不带语言后缀的模板保持英文/default。
- `harness-builder` 直接相关模板和 checkpoint 文案中文化，必要英文 token 保留。

verification_commands:

- `rg -n "用户可见文本|跟随用户语言|协议 token|协议稳定" skills/brainstorm skills/plan skills/harness-builder`
- `rg -n "^## (Background|Goals|Non-goals|Users / Callers|Behavior Spec|Constraints|Chosen Approach|Rejected Options|Verification Strategy|Capability Gaps|Success Criteria|Residual Risks|Plan Handoff)$" skills/brainstorm/templates/spec.zh-CN.md`

success_definition: 核心模板不再把中文用户带回英文段落标题，且协议 token 边界清楚。

### Phase 3 - Checker And Generated HTML

Status: `completed`

acceptance_criteria:

- `scripts/check-plugin.mjs` 覆盖三核心 skill 的语言策略和核心模板英文标题回归检查。
- `scripts/generate-skill-flow-html.mjs` 能识别中文输出契约标题。
- `docs/skill-flow-review/*.html` 由生成脚本更新。

verification_commands:

- `node scripts/generate-skill-flow-html.mjs`
- `node scripts/check-plugin.mjs`

success_definition: 静态检查能防止明显回归，生成审阅页与新契约一致。

### Phase 4 - Structural Verification

Status: `completed`

acceptance_criteria:

- 默认结构验证全部通过。
- Cursor adapter dry-run 通过。

verification_commands:

- `node scripts/check-plugin.mjs`
- `node scripts/check-claude-code-install.mjs`
- `node scripts/check-cursor-install.mjs`
- `node scripts/install-cursor.mjs --target . --dry-run`

success_definition: 三端安装和结构面未被语言改造破坏。

### Phase 5 - Real Codex Exec Smoke

Status: `completed`

acceptance_criteria:

- 最后一次相关修改后运行三个真实 `codex exec` 中文 smoke。
- smoke 输出保存到 `docs/plans/2026-05-29--core-skill-language-adaptive-output-codex-smoke.md` 或等价可审查 artifact。
- 每个 smoke 都检查中文为主输出和协议 token 稳定性。

verification_commands:

- `codex exec --ephemeral -C /home/ssy/桌面/harness-workflow "<brainstorm 中文 smoke prompt>"`
- `codex exec --ephemeral -C /home/ssy/桌面/harness-workflow "<plan 中文 smoke prompt>"`
- `codex exec --ephemeral -C /home/ssy/桌面/harness-workflow "<harness-builder 中文 smoke prompt>"`

success_definition: 真实 agent 输出证明中文用户场景已改善；如失败，失败被记录且不声明 ready。

### Phase 6 - Review, Verify, Cleanup, Commit

Status: `verified`

acceptance_criteria:

- `review` 对照 Spec、Plan、diff、docs、entropy、risk，无 Critical blocker。
- `verify` 将所有成功标准映射到 fresh evidence。
- `cleanup` 对齐 docs、generated artifacts、recovery surface 和 git 状态。
- 按项目铁律提交中文 commit。

verification_commands:

- `git diff --stat`
- `git status --short --branch`
- review packet / `codex exec` reviewer command as selected by `review`
- final verification command set from Phase 4 and Phase 5

success_definition: 完整链路通过，commit 出现在特征分支，工作区无无关脏改。

## Commit Units

| Commit unit | Phases | scope | 提交前置条件 | commit message |
| --- | --- | --- | --- | --- |
| M1 | Phase 1-6 | Spec、Plan、skill、模板、checker、生成物、smoke 证据和 cleanup 文档 | review 无 Critical + verify PASS + cleanup complete | `优化核心 skill 语言自适应输出` |

## Verification Record

Verification: PASS

- claim_id: `core-skill-language-adaptive-output`
- claim: 三个核心 skill 在源码、生成审阅页、结构检查和真实 `codex exec` 中文场景中保持中文用户可见输出中文为主，并保留协议 token 稳定性。
- latest_change_ref: 当前 `feature/core-skill-language-adaptive-output` 工作树 diff。
- covered_paths:
  - `skills/brainstorm/`
  - `skills/plan/`
  - `skills/harness-builder/`
  - `plugins/harness-workflow/skills/`
  - `.cursor/skills/`
  - `docs/skill-flow-review/`
  - `scripts/check-plugin.mjs`
  - `docs/plans/2026-05-29--core-skill-language-adaptive-output-*-smoke.md`
- commands:
  - `node scripts/generate-skill-flow-html.mjs` -> pass
  - `node scripts/check-plugin.mjs` -> pass
  - `node scripts/check-claude-code-install.mjs` -> pass
  - `node scripts/check-cursor-install.mjs` -> pass
  - `node scripts/install-cursor.mjs --target . --dry-run` -> pass
  - `git diff --check` -> pass
  - `python3 scripts/validate_harness.py` in `skills/harness-builder` -> pass
  - Jinja locale smoke for `zh`, `zh-CN`, `zh-TW`, `zh-Hant`, `中文`, `简体中文`, `繁體中文`, `Chinese (Simplified)`, `en` -> pass
  - real `codex exec` brainstorm smoke -> pass
  - real `codex exec` plan smoke -> pass
  - real `codex exec` harness-builder smoke -> pass
  - smoke artifact placeholder scan on three real output files -> pass, no raw `<... label in user's language>` output
- skipped_high_value_checks: none
- unknowns: none for this slice
- commit_gate: eligible after cleanup
- ready: yes, route to `cleanup`

## Cleanup Record

Cleanup: complete

- README: ok, 本次未改变安装或用户入口命令。
- AGENTS.md: ok, 未写入临时状态或会话叙事。
- docs: updated, Spec / Plan / Review / Codex smoke evidence 均在 `docs/specs` 和 `docs/plans`。
- generated artifacts: regenerated, `node scripts/generate-skill-flow-html.mjs` 已重新生成 `docs/skill-flow-review/*.html`。
- recovery surface: updated, 本计划状态已从 implementation/review/verify 推进到 cleanup complete。
- sync surfaces:
  - `diff -qr skills plugins/harness-workflow/skills` -> pass
  - `diff -qr skills .cursor/skills` -> pass
- entropy cleanup:
  - removed: none
  - deferred: none
- residual risks: none known for this slice

## Known Risks / Blockers

- `codex exec` 可能受 auth、网络、sandbox、模型或 token 限制影响；失败不能用静态检查替代。
- 过度翻译可能破坏脚本匹配，因此状态 token 和机器字段必须保留或中英并列。
- `harness-builder` 模板很多，本轮只处理核心输出和直接相关模板，避免范围扩大。
- 生成物必须由 `node scripts/generate-skill-flow-html.mjs` 生成，不手改 HTML。

## Lightweight Harness

Source-of-truth priority:

1. 当前 git 状态和实际文件内容。
2. 本计划和 smoke evidence：`docs/plans/2026-05-29--core-skill-language-adaptive-output-plan.md`、`docs/plans/2026-05-29--core-skill-language-adaptive-output-codex-smoke.md`。
3. 已批准 Spec：`docs/specs/2026-05-29--core-skill-language-adaptive-output.md`。
4. `AGENTS.md`、README、方法契约和安装文档。

Recovery fields:

| Field | Current value |
| --- | --- |
| objective | 核心 skill 语言自适应输出改造 |
| active_slice | 更新三核心 skill、模板、checker、生成物和真实 smoke |
| non_goals | 不建第二套 `.harness`；不安装 hooks/MCP/subagents；不扩展到所有 workflow skills |
| success_criteria | 见本计划 `Success Criteria` |
| verification_path | 默认结构检查 + generated HTML + 真实 `codex exec` smoke |
| current_phase | Phase 6 - verified; next cleanup and commit |
| evidence_log | `docs/plans/2026-05-29--core-skill-language-adaptive-output-codex-smoke.md` |
| decisions | 使用现有 `docs/specs` / `docs/plans` 作为 lightweight recovery surface |
| rejected_options | `.harness`、hooks、MCP、init scaffold pack |
| risks | `codex exec` 环境限制；过度翻译破坏协议 token；harness-builder 模板面过大 |
| blockers | none currently |
| next_actions | cleanup -> 中文 commit |

Harness coverage:

| Coverage area | Decision | Handling |
| --- | --- | --- |
| Agent entry and project map | Required, satisfied | Keep `AGENTS.md` |
| Static docs and durable rules | Required, patched | Spec marked approved; this Plan carries task harness |
| Recovery surface | Required, patched | Existing `docs/specs` / `docs/plans`; no `.harness` |
| Verification entry | Required | Default scripts plus real `codex exec` smoke |
| Anti-entropy | Required | Checker and generated HTML catch language regression |
| Skill fit | Required, satisfied | Use existing workflow skills |
| Hook / MCP / subagent install | Rejected or deferred | No current coverage gap requires installation |

## Handoff

Next skill: `cleanup`

Reason: review 无 Critical，verify PASS，剩余工作是知识卫生、状态对齐和中文 milestone commit。
