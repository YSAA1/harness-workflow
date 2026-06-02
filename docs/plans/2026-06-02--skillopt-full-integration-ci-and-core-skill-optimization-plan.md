# Executable Plan - SkillOpt full integration, CI, and core skill optimization

> 状态：in_progress
> Owner: user / agent
> Date: 2026-06-02
> Branch: `feature/skillopt-skill-eval-mvp`
> Spec source: `docs/specs/2026-06-02--skillopt-full-integration-ci-and-core-skill-optimization.md`

## Objective

完整接入 `microsoft/SkillOpt` 本体，建立本机真实优化 + GitHub CI 无 secret 门禁 + 四个核心 workflow skills 受控优化的闭环。

## Active slice

当前唯一 active slice：确认并实现 SkillOpt 本体 pinned external clone 接入和最小本机 smoke；下一步才进入无 secret CI gate、eval 扩充和正式 skill 优化。

## Non-goals

- 不 vendoring 全量 SkillOpt 源码。
- 不在 GitHub CI 跑在线优化或使用 API secret。
- 不自动 merge PR。
- 不让 SkillOpt 输出无审查覆盖正式 skill。
- 不优化 `review / verify / cleanup / find-skills`。
- 不新增用户级 hooks、MCP 或全局配置。

## Success criteria

- 本仓库有固定 SkillOpt clone/pin 机制和本地运行入口。
- 本机能调用 SkillOpt 本体完成最小真实 run，并产出 SkillOpt artifacts。
- GitHub CI 真实跑通无 secret 门禁。
- eval 覆盖 `harness-builder / brainstorm / plan / implement`。
- 四个正式 `SKILL.md` 有针对性优化改动，并通过 eval、项目检查和生成物同步。
- 分支已 push，PR 已开，GitHub Actions 绿灯。

## Verification path

Verification path status: `runnable-with-capability-check`

Core local commands:

```bash
node scripts/run-skillopt-eval.mjs --skill harness-builder --skill-file skills/harness-builder/SKILL.md --suite canary
node scripts/run-skillopt-eval.mjs --skill brainstorm --skill-file skills/brainstorm/SKILL.md --suite canary
node scripts/run-skillopt-eval.mjs --skill plan --skill-file skills/plan/SKILL.md --suite canary
node scripts/run-skillopt-eval.mjs --skill implement --skill-file skills/implement/SKILL.md --suite canary
node scripts/check-skillopt-eval.mjs docs/skillopt/runs/latest/summary.json
node scripts/generate-skill-flow-html.mjs
node scripts/check-plugin.mjs
node scripts/check-claude-code-install.mjs
node scripts/check-cursor-install.mjs
node scripts/install-cursor.mjs --target . --dry-run
```

SkillOpt capability commands:

```bash
node scripts/prepare-skillopt.mjs
node scripts/prepare-skillopt.mjs --check
node scripts/prepare-skillopt.mjs --install
node scripts/run-skillopt-smoke.mjs
```

The minimum bar is that a local command invokes SkillOpt's own Python entrypoint and writes SkillOpt smoke artifacts under `.skillopt/`.

GitHub evidence:

```bash
git push -u origin feature/skillopt-skill-eval-mvp
gh pr create ...
gh run list ...
gh run view ...
```

## Required capabilities

- Python 3.10+ and editable install for SkillOpt.
- Network access to clone `microsoft/SkillOpt`.
- Local Codex CLI for no-API-key path smoke, if upstream supports it.
- Optional local API backend or local vLLM/Qwen if Codex CLI cannot serve as optimizer.
- GitHub CLI auth and remote permissions for push/PR/Actions evidence.

## Fallback evidence

- If no-API-key optimizer is unsupported upstream, fallback is accepted only as a documented capability gap plus a SkillOpt import/entrypoint smoke. The final claim must not say online optimization completed without a valid optimizer backend.
- If GitHub Actions cannot run because of remote permissions, record blocker and do not claim CI completion.

## Final integration claim

The branch contains a complete, non-vendored SkillOpt integration surface for this plugin, with local real SkillOpt execution, CI regression gates, expanded skill evals, optimized core skill docs, and real GitHub Actions evidence.

## Work items

### 1. Confirm upstream SkillOpt capabilities and pin strategy

Status: completed

Acceptance criteria:

- Upstream SkillOpt is cloned or inspected at a specific commit.
- The implementation knows whether `codex_exec` can be used as optimizer, target, or only execution harness.
- Pin metadata is recorded in repo-owned config or script.
- No full upstream source is committed.

Verification commands:

```bash
git ls-remote https://github.com/microsoft/SkillOpt.git HEAD
python --version
```

Success definition: SkillOpt entrypoints and backend constraints are evidence-backed before writing adapter code.

Evidence:

- `git ls-remote https://github.com/microsoft/SkillOpt.git HEAD` -> `25da7cb2ddc26eb67eb6cb386915f269d7ee42cf`
- `/tmp/skillopt-inspect` read-only inspection found `scripts/train.py`, `skillopt/model/codex_backend.py`, `skillopt/model/codex_harness.py`, and `skillopt/model/backend_config.py`.
- Upstream `backend_config.py` supports `codex_exec` as target backend, but optimizer backends are limited to `openai_chat`, `claude_chat`, `qwen_chat`, and `minimax_chat`.
- Pin metadata recorded in `evals/skillopt/source.json`.

### 2. Add SkillOpt local integration scripts and smoke

Status: completed

Acceptance criteria:

- Repo has scripts for preparing the pinned SkillOpt checkout.
- Repo has a local smoke command that invokes SkillOpt's Python entrypoint.
- Local run artifacts are ignored unless explicitly summarized.
- Documentation explains no-API-key and fallback backend behavior.

Verification commands:

```bash
node scripts/prepare-skillopt.mjs --check
node scripts/run-skillopt-smoke.mjs
git status --short
```

Success definition: a future agent can run a SkillOpt smoke without vendoring upstream source.

Evidence:

- `node scripts/prepare-skillopt.mjs` -> pinned checkout at `.skillopt/SkillOpt`
- `node scripts/prepare-skillopt.mjs --check` -> PASS
- `node scripts/prepare-skillopt.mjs --install` -> installed SkillOpt into `.skillopt/venv`
- `node scripts/run-skillopt-smoke.mjs` -> PASS, summary written to `.skillopt/smoke/latest/summary.json`
- Smoke result: `target_backend=codex_exec`, `optimizer_codex_exec=unsupported`, `train_entrypoint_help=true`

### 3. Add GitHub CI no-secret gate

Status: completed

Acceptance criteria:

- `.github/workflows/skillopt-evals.yml` exists.
- CI runs deterministic skill evals and existing plugin/install checks.
- CI does not require API secrets and does not run online optimization.
- Workflow can be triggered by PR and manually.

Verification commands:

```bash
node scripts/check-plugin.mjs
node scripts/check-claude-code-install.mjs
node scripts/check-cursor-install.mjs
node scripts/install-cursor.mjs --target . --dry-run
```

Success definition: local commands mirror the CI gate and are safe for PRs.

Evidence:

- `.github/workflows/skillopt-evals.yml` added with `pull_request` and `workflow_dispatch` triggers.
- Workflow runs deterministic evals for `harness-builder`, `brainstorm`, `plan`, and `implement`.
- Workflow runs existing plugin/install checks and does not reference secrets or online optimization commands.

### 4. Expand deterministic eval coverage

Status: completed

Acceptance criteria:

- Canary suites exist for `harness-builder / brainstorm / plan / implement`.
- Runner can score all four skills.
- Checker catches hard failures.

Verification commands:

```bash
node scripts/run-skillopt-eval.mjs --skill harness-builder --skill-file skills/harness-builder/SKILL.md --suite canary
node scripts/run-skillopt-eval.mjs --skill brainstorm --skill-file skills/brainstorm/SKILL.md --suite canary
node scripts/run-skillopt-eval.mjs --skill plan --skill-file skills/plan/SKILL.md --suite canary
node scripts/run-skillopt-eval.mjs --skill implement --skill-file skills/implement/SKILL.md --suite canary
```

Success definition: four core skills have runnable canary gates.

Evidence:

- `evals/skillopt/cases/harness-builder/canary.json` -> `15/15`
- `evals/skillopt/cases/brainstorm/canary.json` -> `14/14`
- `evals/skillopt/cases/plan/canary.json` -> `23/23`
- `evals/skillopt/cases/implement/canary.json` -> `14/14`
- Each suite passed `node scripts/check-skillopt-eval.mjs docs/skillopt/runs/latest/summary.json` when run sequentially.

### 5. Run SkillOpt and transplant reviewed improvements

Status: completed

Acceptance criteria:

- Local SkillOpt run produces real SkillOpt artifacts or records a capability blocker.
- Four formal `SKILL.md` files receive scoped, reviewed improvements.
- Skill flow HTML is regenerated.
- Deterministic evals pass after the changes.

Verification commands:

```bash
node scripts/generate-skill-flow-html.mjs
node scripts/check-plugin.mjs
node scripts/run-skillopt-eval.mjs --skill plan --skill-file skills/plan/SKILL.md --suite canary
```

Success definition: optimized skill docs remain compatible with the plugin and eval gates.

Evidence:

- Added repo-owned SkillOpt harness adapter under `evals/skillopt/harnessworkflow/`.
- Added optimization splits under `evals/skillopt/optimization/{harness-builder,brainstorm,plan,implement}/`.
- `node scripts/install-skillopt-harness.mjs` -> installed adapter into `.skillopt/SkillOpt`.
- `node scripts/run-skillopt-train.mjs --skill harness-builder` -> SkillOpt run accepted step 1; baseline test hard `0.0000`, best test hard `1.0000`; best skill at `.skillopt/outputs/harness-builder/best_skill.md`.
- `node scripts/run-skillopt-train.mjs --skill brainstorm` -> SkillOpt run accepted step 1; baseline test hard `0.0000`, best test hard `1.0000`; best skill at `.skillopt/outputs/brainstorm/best_skill.md`.
- `node scripts/run-skillopt-train.mjs --skill plan` -> SkillOpt run accepted step 1; baseline test hard `0.0000`, best test hard `1.0000`; best skill at `.skillopt/outputs/plan/best_skill.md`.
- `node scripts/run-skillopt-train.mjs --skill implement` -> SkillOpt run accepted step 1; baseline test hard `0.0000`, best test hard `1.0000`; best skill at `.skillopt/outputs/implement/best_skill.md`.
- Formal `skills/{harness-builder,brainstorm,plan,implement}/SKILL.md` were manually transplanted from the accepted `best_skill.md` outputs.
- `diff -q skills/<skill>/SKILL.md .skillopt/outputs/<skill>/best_skill.md` -> no differences for all four optimized skills.
- Root skills were synchronized to `plugins/harness-workflow/skills/` and `.cursor/skills/`.
- `node scripts/generate-skill-flow-html.mjs` -> generated 9 HTML files.
- Four deterministic canary evals passed after transplant: `harness-builder 15/15`, `brainstorm 14/14`, `plan 23/23`, `implement 14/14`.

### 6. Final verification, push, PR, and Actions evidence

Status: completed

Acceptance criteria:

- All local checks pass.
- Branch is pushed to origin.
- PR exists.
- GitHub Actions run is green or blocker is diagnosed.
- Plan artifact records final evidence.

Verification commands:

```bash
node scripts/check-plugin.mjs
node scripts/check-claude-code-install.mjs
node scripts/check-cursor-install.mjs
node scripts/install-cursor.mjs --target . --dry-run
git status --short --branch
gh pr create ...
gh run list ...
```

Success definition: local and remote evidence support the final integration claim.

Evidence:

- Final local deterministic evals passed: `harness-builder 15/15`, `brainstorm 14/14`, `plan 23/23`, `implement 14/14`.
- Final local structure checks passed: `node scripts/check-plugin.mjs`, `node scripts/check-claude-code-install.mjs`, `node scripts/check-cursor-install.mjs`, `node scripts/install-cursor.mjs --target . --dry-run`, and `bash scripts/agent/check.sh`.
- SkillOpt smoke passed against pinned checkout `25da7cb2ddc26eb67eb6cb386915f269d7ee42cf`.
- Branch pushed: `origin/feature/skillopt-skill-eval-mvp`.
- PR opened: https://github.com/YSAA1/harness-workflow/pull/10
- GitHub Actions passed on 2026-06-02T06:02Z: `Plugin checks` and `Deterministic SkillOpt evals`.

## Commit units

| Unit | Scope | Phases | Precondition |
| --- | --- | --- | --- |
| U1 | Spec and plan | 1 | Spec and executable plan written |
| U2 | SkillOpt pin, scripts, smoke | 1-2 | completed; ready for review and commit |
| U3 | CI workflow and eval expansion | 3-4 | completed; ready for review and commit |
| U4 | Formal skill optimization | 5 | completed; ready for review and commit |
| U5 | Final verification and PR evidence | 6 | completed; PR opened and GitHub Actions passed |

## Known risks / blockers

- `codex_exec` may not support optimizer role; if so, API key or local vLLM is required for real online optimization.
- SkillOpt training could be slow or costly; use smallest truthful smoke first.
- Eval cases can overfit wording; combine deterministic gate with human review.
- GitHub Actions may fail due to remote permissions or missing dependencies; diagnose before claiming ready.

## Handoff to next skill

Next skill: `review`

Reason: implementation, local verification, push, PR creation, and GitHub Actions evidence are complete; the remaining step is user review of the optimized skill changes.
