# Harness Builder Capability And AGENTS Maintenance Executable Plan

## Objective

把已批准的 `Harness Builder Capability And AGENTS Maintenance` Spec 转成可执行工作合同：让 `harness-builder` 明确每次审计 `AGENTS.md` 和 selected recovery surface，只在稳定仓库事实变化时 patch `AGENTS.md`，并把 Capability Discovery 从抽象能力名升级为证据绑定、可验证、默认 read-only 的推荐机制。

## Planning Surface

- Surface: `plan document`
- Artifact: `docs/plans/2026-05-26--harness-builder-capability-agents-maintenance-plan.md`
- Spec source: `docs/specs/2026-05-26--harness-builder-capability-agents-maintenance.md`
- Reason: `AGENTS.md` 声明 `docs/plans/` 是默认 Executable Plan 目录；本任务是多文件、多阶段、跨 root / packaged / Cursor 表面的非平凡改动，需要 durable plan，但不需要创建 three-file backend。

## Active Slice

更新 `harness-builder` 的 contract、policy、templates、validation 和 evals，使 `AGENTS.md` 维护边界与 Capability Discovery 推荐纪律变成可执行、可验证、三端同步的行为契约。

Current next item: **Phase 1 - Baseline And Drift Inventory**。

## Non-goals

- 不默认安装 MCP、hooks、skills、subagents、用户级配置或外部 marketplace。
- 不把 `AGENTS.md` 变成 session log、active plan、changelog 或 full knowledge base。
- 不新增 public workflow lane。
- 不重写已批准的 `harness-builder` 瘦身 Spec。
- 不用 web search 推断本地 repo facts。
- 不把 optional references/templates 重新升格为默认热路径。
- 不开始实现产品代码或 unrelated refactor。

## Success Criteria

- `harness-builder` 明确要求每次运行审计 `AGENTS.md` 和 selected recovery surface。
- `AGENTS.md` 只在 durable repo-level facts 变化时 patch；动态 task state 被路由到 selected recovery surface。
- Capability Discovery 推荐表包含 `repo_signal`、`source_evidence`、`freshness`、`trust_boundary`、`approval_needed`、`fallback`、`verification_probe` 和 `classification`。
- Recommendation-only 模式保持 read-only，不写 `.mcp.json`、hooks config、subagent files、project-local skills，也不进入 Pack Selection。
- Optional MCP/hooks/skills/subagents 默认 recommendation-only，安装必须有明确 approval boundary。
- Root canonical、`plugins/harness-workflow/skills/harness-builder/**`、`.cursor/skills/harness-builder/**` 语义同步。
- 相关验证命令 fresh pass，或具体 blocker 被记录且不声明 ready。
- 8 个 active workflow lanes 和 route-by-need 语义不变。

## Verification Path

Verification path status: `runnable`

Required capabilities:

- PowerShell-compatible local shell commands.
- Local Node for project validators and generated skill-flow HTML.
- Local Python for `skills/harness-builder/scripts/*.py` validation.
- Local git for diff, status, and milestone commit discipline.
- Targeted web search only if implementation needs current external capability facts for MCP/hooks/skills/subagents examples.

Fallback evidence:

- If web search is unavailable, mark external capability freshness as unknown and classify affected recommendations as `Deferred` unless local evidence is enough.
- If behavior evals cannot be automated, use static policy checks plus manual review of generated `docs/skill-flow-review/harness-builder.html`.

Final integration claim:

```text
harness-builder now audits AGENTS.md without turning it into runtime state, routes dynamic state to the selected recovery surface, and produces evidence-bound capability recommendations that remain read-only until explicitly approved.
```

## Work Items

### Phase 1 - Baseline And Drift Inventory

Purpose:
Establish fresh evidence before changing the contract, and avoid mixing unrelated working-tree changes.

Actions:

- Check `git status --short` and note pre-existing unrelated changes such as `.gitignore`, `.codex/`, and `revise_plan.md`.
- Read current root canonical harness-builder files:
  - `skills/harness-builder/SKILL.md`
  - `skills/harness-builder/references/project_map_policy.md`
  - `skills/harness-builder/references/capability_signal_policy.md`
  - `skills/harness-builder/templates/AGENTS.md.j2`
  - `skills/harness-builder/templates/state.md.j2`
  - `skills/harness-builder/templates/manifest.yaml.j2`
  - `skills/harness-builder/scripts/validate_harness.py`
  - `skills/harness-builder/evals/*.json`
- Compare root canonical with packaged and Cursor preview surfaces.
- Run the current narrow baseline validation from `skills/harness-builder`.

acceptance_criteria:

- Baseline notes identify current files, current validation state, and existing unrelated working-tree changes.
- No file edits are made before the implementation surface and drift risks are known.
- Current root / packaged / Cursor harness-builder drift is known before contract changes begin.

verification_commands:

```powershell
git status --short
git log --oneline -10
Set-Location skills\harness-builder
python scripts\validate_harness.py
Set-Location ..\..
node scripts\check-plugin.mjs
node scripts\check-cursor-install.mjs
```

success_definition:
Implementation starts from fresh repo evidence, not from the prior chat summary.

### Phase 2 - Contract And Policy Update

Purpose:
Make the two core behavior rules explicit in the canonical skill and policy references.

Actions:

- Update `skills/harness-builder/SKILL.md` to state:
  - audit `AGENTS.md` and selected recovery surface every run;
  - patch `AGENTS.md` only for durable repo-level facts;
  - route dynamic state to selected recovery surface;
  - run Capability Discovery only for uncovered or weak coverage rows;
  - recommendation-only requests stop at read-only report.
- Update `project_map_policy.md` with an `AGENTS.md maintenance rule`:
  - allowed durable facts;
  - disallowed dynamic state;
  - migration target for dynamic state.
- Update `capability_signal_policy.md` with:
  - external capability search rules;
  - source priority;
  - required shortlist fields;
  - recommendation-only default.
- Keep details in policy references rather than expanding the hot path.

acceptance_criteria:

- `AGENTS.md` audit/patch boundary is unambiguous.
- Capability Discovery cannot produce a recommendation without row binding, evidence, trust boundary, approval boundary, fallback, and verification probe.
- Recommendation-only mode has an explicit stop condition before Pack Selection.
- No new workflow lane is introduced.

verification_commands:

```powershell
rg -n "AGENTS.md maintenance|durable repo-level|selected recovery surface|Recommendation-only|source_evidence|trust_boundary|verification_probe" skills\harness-builder
node scripts\check-plugin.mjs
```

success_definition:
The canonical text now encodes the approved behavior rather than relying on reviewer memory.

### Phase 3 - Template And State Surface Alignment

Purpose:
Make generated harness artifacts match the contract: stable entry in `AGENTS.md`, dynamic state in selected recovery surface, optional assets not implied as installed.

Actions:

- Update `templates/AGENTS.md.j2`:
  - remove fixed full Harness map that implies `.harness/progress.md`, `.harness/session_handoff.md`, `.agents/skills/`, or `.codex/` always exist;
  - include selected recovery surface pointer;
  - include recovery read order;
  - include source-of-truth priority;
  - explicitly say dynamic task state does not live in `AGENTS.md`.
- Update `templates/state.md.j2`:
  - keep fields needed for active task, evidence, decisions, risks, known gaps, and next actions;
  - conditionally render coverage/pack/orchestration sections when selected.
- Update `templates/manifest.yaml.j2`:
  - represent selected assets and optional asset loading without implying optional capabilities are installed by default.
- Update `scripts/render_harness.py` only if needed to support selected asset gating.

acceptance_criteria:

- Generated `AGENTS.md` is a stable entry point, not a complete runtime-state dump.
- Selected recovery surface can carry dynamic state.
- Optional MCP/hooks/skills/subagents/Research Route/init_scaffold assets are not shown as default installed assets.

verification_commands:

```powershell
rg -n "Selected recovery surface|Dynamic task state does not live|Source-of-truth" skills\harness-builder\templates\AGENTS.md.j2
rg -n "selected_assets|asset_loading|optional|pack" skills\harness-builder\templates\manifest.yaml.j2 skills\harness-builder\scripts\render_harness.py
Set-Location skills\harness-builder
python scripts\validate_harness.py
Set-Location ..\..
```

success_definition:
Templates produce artifacts that separate stable instructions from recoverable dynamic state.

### Phase 4 - Validation And Eval Guardrails

Purpose:
Prevent regressions where the recommendation discipline becomes a virtual label again, or `AGENTS.md` becomes either stale or noisy.

Actions:

- Update `skills/harness-builder/scripts/validate_harness.py`:
  - keep core assets required;
  - require conditional assets only when referenced or selected;
  - check present optional assets for syntactic sanity;
  - preserve `scan_project.py` evidence signals.
- Update `scripts/check-plugin.mjs` if old token checks conflict with the slimmer contract.
- Add or update eval cases:
  - minimal harness does not default to optional capabilities;
  - recommendation-only automation stays read-only;
  - `AGENTS.md` active state repair moves dynamic state to selected recovery surface;
  - capability candidate without unique coverage row is rejected;
  - pack selection only follows approved coverage rows.
- Ensure eval wording covers trust boundary, approval boundary, fallback, and verification probe.

acceptance_criteria:

- Validation no longer forces optional templates into required preserved assets.
- Obsolete token checks do not block legitimate controller slimming.
- New eval cases cover both additions and reductions.
- Validation would fail on stale `AGENTS.md` runtime state or unbound capability recommendations if those patterns are encoded in fixtures/evals.

verification_commands:

```powershell
Set-Location skills\harness-builder
python scripts\validate_harness.py
Set-Location ..\..
node scripts\check-plugin.mjs
rg -n "automation-recommendation-only|agents-thin-active-state|coverage row|trust boundary|verification probe" skills\harness-builder\evals
```

success_definition:
Future edits are guarded by checks that target behavior boundaries instead of just preserving old wording.

### Phase 5 - Synchronize Distribution Surfaces And Docs

Purpose:
Keep Codex, packaged plugin, and Cursor preview behavior aligned after canonical changes.

Actions:

- Sync root canonical `skills/harness-builder/**` changes into:
  - `plugins/harness-workflow/skills/harness-builder/**`
  - `.cursor/skills/harness-builder/**`
- Update `.cursor/rules/**` only if public rule text changes.
- Update README / README.zh-CN / CONTEXT / `docs/harness-method-contract.md` only if public semantics need clarification.
- Regenerate `docs/skill-flow-review/**` if `SKILL.md` structure affects generated HTML.
- Confirm no unrelated `.gitignore`, `.codex/`, or `revise_plan.md` changes are staged unless explicitly included later.

acceptance_criteria:

- Root, packaged plugin, and Cursor preview surfaces express the same harness-builder behavior.
- Generated skill-flow review is current if required.
- Public docs do not contradict the new policy.
- Unrelated working-tree changes remain unstaged.

verification_commands:

```powershell
node scripts\generate-skill-flow-html.mjs
node scripts\check-plugin.mjs
node scripts\check-claude-code-install.mjs
node scripts\check-cursor-install.mjs
node scripts\install-cursor.mjs --target . --dry-run
git status --short
```

success_definition:
The plugin distribution surfaces are synchronized and validated with fresh local commands.

### Phase 6 - Review, Verify, And Milestone Commit

Purpose:
Close the implementation with fresh evidence and a clean, scoped commit.

Actions:

- Run review against the changed contract, templates, validators, evals, docs, and generated assets.
- Run the full verification command set.
- Inspect `git diff --stat` and targeted diffs.
- Stage only files belonging to this plan and the approved Spec/Plan artifacts.
- Commit with a clear Chinese message after review passes and verify passes.

acceptance_criteria:

- Review finds no Critical issue, or Critical issues are fixed before verification.
- Verification path has fresh pass evidence, or blockers are explicit and no ready claim is made.
- Commit contains only scoped files.
- Commit message is Chinese and references the milestone.

verification_commands:

```powershell
node scripts\check-plugin.mjs
node scripts\check-claude-code-install.mjs
node scripts\check-cursor-install.mjs
node scripts\install-cursor.mjs --target . --dry-run
git diff --stat
git status --short
```

success_definition:
The work reaches a verified state and is captured in a scoped milestone commit.

## Commit Units

### Commit Unit 1 - Contract And Policy

- scope: `skills/harness-builder/SKILL.md`, `references/project_map_policy.md`, `references/capability_signal_policy.md`, directly related docs if needed.
- corresponding phases: Phase 2.
- suggested message: `强化 harness-builder 维护与能力推荐契约`
- preconditions: review has no Critical issue for contract wording; targeted validation passes.

### Commit Unit 2 - Templates And State Gating

- scope: `templates/AGENTS.md.j2`, `templates/state.md.j2`, `templates/manifest.yaml.j2`, `scripts/render_harness.py` if changed.
- corresponding phases: Phase 3.
- suggested message: `收紧 AGENTS 模板与恢复面边界`
- preconditions: generated template semantics reviewed; `validate_harness.py` passes.

### Commit Unit 3 - Validation And Evals

- scope: `scripts/validate_harness.py`, `scripts/check-plugin.mjs`, `evals/*.json`.
- corresponding phases: Phase 4.
- suggested message: `补强 harness-builder 边界验证`
- preconditions: local validation passes and eval strings cover agreed negative cases.

### Commit Unit 4 - Distribution Sync And Final Verification

- scope: packaged plugin, Cursor preview, generated skill-flow HTML, public docs touched by this change.
- corresponding phases: Phase 5 and Phase 6.
- suggested message: `同步 harness-builder 三端表面`
- preconditions: full verification command set passes; unrelated files are unstaged.

## Known Risks / Blockers

- Existing working tree contains unrelated or pre-existing changes: `.gitignore`, `.codex/`, and `revise_plan.md`. Implementation must stage exact paths only.
- `scripts/check-plugin.mjs` currently contains token checks that may conflict with controller slimming; update checks in the same unit as contract wording changes.
- Optional asset validation can be weakened too far if "referenced optional" rules are vague; keep core/conditional/recommendation-only/explicit/pack categories concrete.
- Web search freshness can drift; if implementation needs examples from current MCP/hooks/skills ecosystem, use targeted official sources and record date/version.
- Generated docs may change after `generate-skill-flow-html`; inspect diffs before staging.

## Handoff

Next skill: `implement`

Reason:
The Spec is approved, the planning surface is written, verification path is runnable, and the active slice is clear.
