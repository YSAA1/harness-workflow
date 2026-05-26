# Spec - Harness Builder Capability And AGENTS Maintenance

> Status: user-approved
> Owner: user / agent
> Date: 2026-05-26
> Source request: 用户审核 `revise_plan.md` 后确认：`harness-builder` 需要保留加法和减法；Capability Discovery 要给出真正可安装、可验证、按需推荐的 MCP/hooks/skills/subagents 建议；每次调用应审计 `AGENTS.md`，但只有稳定事实变化才 patch，动态状态进入 selected recovery surface。

## Background

已有 `docs/specs/2026-05-26--harness-builder-slimming.md` 覆盖了 `harness-builder` 瘦身和资产降噪方向，但当前 `revise_plan.md` 进一步暴露了两个需要单独固化的边界：

- Capability Discovery 过去有正确原则，但实际使用时容易停留在 "skills/hooks/MCP/subagents recommendation" 这个虚名，没有强制搜索、证据、信任边界和验证探针。
- `AGENTS.md` 应该是稳定入口，不是一次性任务日志；但如果只强调 "薄入口"，又容易走向创建后不再维护，最后成为死文档。

本 Spec 明确补充：`harness-builder` 每次运行都要审计 `AGENTS.md` 和 selected recovery surface；只在 durable repo-level facts 改变时 patch `AGENTS.md`；当前任务动态状态、session notes、active slice、临时结论进入 selected recovery surface。Capability Discovery 必须把推荐绑定到 coverage row、repo signal、外部证据、风险和验证方式，用户只要求推荐时保持 read-only。

## Goals

- 让 Capability Discovery 从抽象能力名变成证据绑定的推荐报告。
- 对 MCP/hooks/skills/subagents/external research 推荐强制记录 source evidence、freshness、trust boundary、approval boundary 和 verification probe。
- 明确推荐请求默认 read-only：不写 `.mcp.json`，不写 hooks 配置，不创建 subagents，不创建 project-local skills，不进入 Pack Selection。
- 让 `harness-builder` 每次审计 `AGENTS.md` 是否仍反映当前稳定仓库事实。
- 只在稳定事实变化时 patch `AGENTS.md`，动态状态进入 selected recovery surface。
- 保留 `harness-builder` 的 route-by-need 模型，不把它变成所有任务的强制前置步骤。
- 保持 root canonical、packaged plugin、Cursor preview 三端表面一致。
- 更新验证脚本和 evals，防止能力推荐退回虚名、`AGENTS.md` 变成死文档或运行态日志。

## Non-goals

- 不默认安装 MCP、hooks、skills、subagents 或用户级配置。
- 不把 `AGENTS.md` 改成 session log、changelog、active plan 或 full knowledge base。
- 不创建新的 public workflow lane。
- 不重写已批准的瘦身 Spec；本 Spec 是补充和收敛。
- 不用 web search 猜本地 repo facts；本地事实必须来自当前工作树证据。
- 不把所有 optional references/templates 重新升格为默认热路径。
- 不在本 Spec 阶段写 implementation plan 或修改 production skill 代码。

## Users / Callers

- 维护 `harness-workflow` 的 agent：用本 Spec 约束后续 plan 和 implementation。
- 调用 `harness-builder` 的 Codex / Claude Code / Cursor 使用者：得到更实际的能力推荐和更可靠的 `AGENTS.md` 维护行为。
- 后续接手仓库的 agent：通过薄 `AGENTS.md` 和 selected recovery surface 恢复当前状态。

## Behavior Spec

### Happy Path

- 用户请求 `harness-builder` 审计、初始化、修复项目工作台或推荐 MCP/hooks/skills/subagents。
- agent 先收集 repo evidence：`AGENTS.md` / `CLAUDE.md`、README、docs、scripts、tests、CI、git state、已有 `.harness/`、`.agents/skills/`、`.codex/`、`.claude/`、`.cursor/`、plugin packaging surfaces。
- agent 审计 `AGENTS.md`：
  - 是否包含项目概览、项目地图、稳定铁律、protected paths、required reading、verification entry、selected recovery surface pointer、source-of-truth priority。
  - 是否包含 current active slice、临时 plan、session summary、debug notes、one-off review conclusions、长 automation catalog、未批准 hooks/MCP/subagents、Research Route runtime state。
- 如果 `AGENTS.md` 缺少或错误表达稳定事实，提出 patch。
- 如果发现动态状态，应移动或记录到 selected recovery surface，不写进 `AGENTS.md`。
- agent 构建 Coverage Matrix。只有 uncovered 或 weak coverage row 才触发 Capability Discovery。
- Capability Discovery 对每个候选输出短推荐表，至少包含：
  - `repo_signal`
  - `source_evidence`
  - `freshness`
  - `candidate`
  - `coverage_row`
  - `why`
  - `install_surface`
  - `trust_boundary`
  - `approval_needed`
  - `risk_cost`
  - `fallback`
  - `verification_probe`
  - `classification`
- 如果用户只要求分析或推荐，输出 recommendation report 后停止，不写文件、不进入 Pack Selection。
- 如果用户明确批准安装，后续 plan 再把推荐转成 install phases 和 fresh verification。

### Edge Cases

- 如果本地 docs、CLI、测试或手动步骤已经能满足 coverage row，拒绝更重的 MCP/hooks/subagent。
- 如果 MCP 或 hook 需要 secrets、写权限或用户级配置，默认 `Deferred` 或 `Rejected`，直到用户批准 trust boundary 和 install surface。
- 如果 capability 只是 "可能有用"，但不能绑定唯一 coverage row，必须 `Rejected`。
- 如果 `AGENTS.md` 里已有过期动态状态，不能直接删除后丢失上下文；应先选择或确认 selected recovery surface，并记录迁移/归档位置。
- 如果 selected recovery surface 不存在或不能承载 active state、evidence、decisions、risks、next actions，应由 `harness-builder` 设计或修复它。
- 如果 `AGENTS.md` 的稳定事实与 README、docs、git state 或 manifest 冲突，应先声明 source-of-truth priority，再 patch。
- 如果修改 `skills/harness-builder/SKILL.md` 使现有 validator token 失效，必须同步更新 `scripts/check-plugin.mjs` 的验证逻辑。
- 如果 root canonical 修改后没有同步 `plugins/harness-workflow/skills/harness-builder/**` 和 `.cursor/skills/harness-builder/**`，验证必须失败。

### Interfaces / State

Primary files:

- `skills/harness-builder/SKILL.md`
- `skills/harness-builder/references/project_map_policy.md`
- `skills/harness-builder/references/capability_signal_policy.md`
- `skills/harness-builder/references/recovery_surface_policy.md`
- `skills/harness-builder/references/install_policy.md`
- `skills/harness-builder/templates/AGENTS.md.j2`
- `skills/harness-builder/templates/state.md.j2`
- `skills/harness-builder/templates/manifest.yaml.j2`
- `skills/harness-builder/scripts/validate_harness.py`
- `skills/harness-builder/scripts/render_harness.py`
- `skills/harness-builder/evals/evals.json`
- `skills/harness-builder/evals/pack_integration_evals.json`

Synchronization surfaces:

- `plugins/harness-workflow/skills/harness-builder/**`
- `.cursor/skills/harness-builder/**`
- `.cursor/rules/**` if rule text changes
- `docs/skill-flow-review/**` if generated skill flow changes

Project-level semantics:

- `AGENTS.md` contains stable entry rules and recovery pointer.
- selected recovery surface contains active work, evidence, decisions, risks, next actions, and migrated dynamic state.
- Capability Discovery outputs recommendation reports unless installation is explicitly approved.

## Constraints

- Current repo is on Windows PowerShell; plan commands must avoid Linux-only `/tmp`, `find . -maxdepth`, and raw `grep` unless a compatible shell is explicitly used.
- Project instructions require milestone commits with clear Chinese commit messages.
- Current `git status --short` includes unrelated or pre-existing changes (`.gitignore`, `.codex/`, `revise_plan.md`); implementation must avoid staging unrelated work.
- The repo has no generic `npm test`; validation must use the documented project commands.
- Web search is allowed only for current external capability facts; local repo facts must come from local files and commands.
- `AGENTS.md` remains thin and stable; it is not the selected recovery surface itself.
- Recommendation-only requests remain read-only even if the recommendation looks obvious.
- Optional assets stay optional unless referenced, selected, or approved.

## Chosen Approach

Use a **stable-entry plus dynamic-recovery model**:

- `AGENTS.md` is audited every `harness-builder` run.
- `AGENTS.md` is patched only when durable repo-level facts change.
- Dynamic task state is written to or migrated into the selected recovery surface.
- Capability Discovery runs only after Coverage Matrix exposes a real gap.
- Every capability recommendation is evidence-bound and includes trust, approval, risk, fallback, and verification fields.
- Recommendation-only mode stops at a read-only report.
- Optional references/templates are kept but loaded/rendered only when the related row is selected.
- Validation and evals protect the new boundaries across root, packaged plugin, and Cursor preview surfaces.

This fits the existing route-by-need workflow model while fixing the two practical failures: vague recommendations and stale `AGENTS.md`.

## Rejected Options

- Patch `AGENTS.md` on every invocation regardless of content: rejected because it turns the stable entry point into noisy runtime state and creates merge churn.
- Never patch `AGENTS.md` after creation: rejected because the entry point becomes stale and stops reflecting durable project facts.
- Install useful-looking MCP/hooks/skills/subagents by default: rejected because it violates coverage-row binding, trust boundaries, and user approval.
- Use web search broadly for local repo understanding: rejected because it can hallucinate or stale-read local facts; local facts must come from the working tree.
- Keep `validate_harness.py` requiring every optional asset as preserved required: rejected because it forces optional capabilities back into the hot path.
- Remove optional capability assets entirely: rejected because Research Route, MCP, hooks, skills, subagents, and packs remain useful when explicitly selected.

## Verification Strategy

### Baseline Evidence

Before implementation, collect:

- `git status --short`
- current `skills/harness-builder/SKILL.md`
- current `skills/harness-builder/references/project_map_policy.md`
- current `skills/harness-builder/references/capability_signal_policy.md`
- current `skills/harness-builder/templates/AGENTS.md.j2`
- current `skills/harness-builder/scripts/validate_harness.py`
- current root / packaged / Cursor preview harness-builder file parity
- current `python scripts\validate_harness.py` result from `skills\harness-builder`

### Automated Checks

Run after implementation:

```powershell
Set-Location skills\harness-builder
python scripts\validate_harness.py
Set-Location ..\..
node scripts\generate-skill-flow-html.mjs
node scripts\check-plugin.mjs
node scripts\check-claude-code-install.mjs
node scripts\check-cursor-install.mjs
node scripts\install-cursor.mjs --target . --dry-run
```

If generated flow files change, inspect `docs/skill-flow-review/harness-builder.html` or its diff.

### Smoke / E2E Checks

- Minimal harness prompt: confirms `harness-builder` audits `AGENTS.md`, selects recovery surface, defines verification, emits USER CHECKPOINT, and does not default to MCP/hooks/subagents/skills/Research Route/init_scaffold.
- Recommendation-only prompt: confirms it stays read-only, uses repo signals and targeted external capability lookup only when needed, binds candidates to coverage rows, and does not write files.
- AGENTS repair prompt: confirms dynamic state is moved to selected recovery surface and stable facts remain in `AGENTS.md`.
- Capability install approval prompt: confirms installation proceeds only after explicit approval and phase verification is defined.

### Negative / Boundary Checks

- A candidate without a unique coverage row must be rejected.
- A write-capable or secret-bearing MCP must not be `Required` without explicit approval.
- `AGENTS.md` must not contain current active slice, session summary, debug notes, one-off conclusion, or full automation catalog.
- `state.md` or selected recovery surface must not duplicate stable rules already owned by `AGENTS.md`.
- `check-plugin.mjs` must not pass by obsolete token checks after `SKILL.md` is slimmed.
- `.cursor/skills/harness-builder/**` and `plugins/harness-workflow/skills/harness-builder/**` must not drift from root canonical behavior.

### Documentation / State Checks

- README / README.zh-CN / CONTEXT / docs/harness-method-contract.md need updates only if public semantics change.
- `project_map_policy.md` must define the `AGENTS.md` maintenance rule.
- `capability_signal_policy.md` must define external capability search and recommendation-only default.
- `AGENTS.md.j2` must include selected recovery surface pointer and source-of-truth priority, without fixed full harness map.
- `manifest.yaml.j2` should represent selected assets without implying optional assets are installed by default.

### Fresh Evidence Required Before Completion

- Fresh validation command outputs from the automated checks above.
- `git status --short` showing only expected changed files.
- Evidence that root canonical, packaged plugin, and Cursor preview surfaces are synchronized.
- Diff evidence that `AGENTS.md` dynamic-state prohibition and recovery pointer exist.
- Diff evidence that capability recommendations include source, freshness, trust, approval, fallback, and verification fields.

## Capability Gaps

- Live ecosystem facts for MCP/hooks/skills/subagents can drift; targeted web search or official docs lookup is needed when external behavior affects recommendation quality.
- The current repo checks are partly token-based; they may need adjustment to verify behavior contracts instead of preserved old wording.
- There may not be an automated evaluator that fully simulates skill invocation. Evals and smoke prompts can reduce risk but may still need manual review.
- Moving dynamic state out of `AGENTS.md` requires knowing or creating the selected recovery surface; if missing, implementation must repair that first.

Fallbacks:

- If web search is unavailable, mark freshness as unknown and classify external recommendations as Deferred unless local evidence is sufficient.
- If full behavior evals are unavailable, use static policy checks plus manual review of generated skill-flow HTML.
- If selected recovery surface is unclear, stop at Harness Plan / USER CHECKPOINT instead of patching `AGENTS.md`.

## Success Criteria

- `harness-builder` instructions require every run to audit `AGENTS.md` and selected recovery surface.
- `AGENTS.md` patching is limited to durable repo-level facts.
- Dynamic task state is explicitly routed to selected recovery surface.
- Capability Discovery recommendations include evidence, freshness, trust boundary, approval boundary, fallback, verification probe, and classification.
- Recommendation-only mode is read-only and stops before Pack Selection.
- Optional MCP/hooks/skills/subagents remain recommendation-only by default and installation requires explicit approval.
- Root canonical, packaged plugin, and Cursor preview surfaces are synchronized.
- Validation commands pass with fresh evidence.
- Existing route-by-need workflow and 8 active workflow lanes remain intact.

## Residual Risks

- The phrase "stable repo-level facts" may still need examples during implementation. Mitigation: include explicit allow/deny lists in `project_map_policy.md` and eval prompts.
- More fields in Capability Discovery may make reports verbose. Mitigation: require short rows and limit candidates to 1-2 per relevant capability category.
- Token-based checks may lag behind wording changes. Mitigation: update validation scripts in the same commit that changes the skill contract.
- If dynamic state migration is implemented too aggressively, useful context could be lost. Mitigation: preserve migrated content in selected recovery surface before removing it from `AGENTS.md`.

## Plan Handoff

- Active slice: Update `harness-builder` contract and policies so `AGENTS.md` maintenance and Capability Discovery recommendation discipline are explicit, then synchronize and verify all distribution surfaces.
- Suggested next skill: plan
- Planning notes: Split work into contract/policy, templates/state, validation/evals, synchronization/docs, and final verification. Keep installation behavior recommendation-only unless user approval is explicit.
- Suggested milestones: contract and policy update; template and render gating update; validation and eval update; packaged/Cursor sync and docs; final verification and Chinese commit.
- Per-milestone acceptance hints: each milestone should have a narrow diff, targeted validation, and no unrelated staging.
