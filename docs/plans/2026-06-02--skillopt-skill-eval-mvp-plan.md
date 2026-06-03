# Executable Plan - SkillOpt skill eval MVP

> 状态：verified
> Owner: user / agent
> Date: 2026-06-02
> Branch: `feature/skillopt-skill-eval-mvp`
> Source request: 用户希望参考 `microsoft/SkillOpt`，开分支对 `harness-workflow` 的 workflow skills 做受控优化；要求先制定 `harness-workflow:plan`，再按计划执行，并注意及时提交。

## Objective

为本仓库建立一个 **SkillOpt-compatible 的 skill eval MVP**：把 `harness-workflow` 的 workflow skill 行为转成可执行、可评分、可对比的 benchmark surface，使后续可以安全评估或试验 SkillOpt 生成的 `best_skill.md`，但不在第一版自动覆盖正式 `skills/*/SKILL.md`。

## Active slice

第一版只做 `plan` skill 的最小可运行评估闭环：case 数据、评分 schema、确定性 runner、候选 skill 对比报告和文档说明。

## Non-goals

- 不直接安装或 vendoring `microsoft/SkillOpt` 到本仓库。
- 不让 SkillOpt 自动覆盖 `skills/plan/SKILL.md` 或任何正式 workflow skill。
- 不一次优化 `brainstorm`、`plan`、`harness-builder` 三个 skill。
- 不把 LLM judge 作为唯一评分来源。
- 不新增用户级 hooks、MCP、全局配置或 secrets。
- 不在第一版接 GitHub Actions online eval 或自动 PR 自进化。

## Success criteria

- 仓库内存在 `evals/skillopt/` 评估面，能表达 `plan` skill 的 train / val / test case。
- 存在可运行脚本，能对 seed skill 或候选 skill 运行确定性评分并输出 JSON / Markdown 报告。
- 报告能比较 `skills/plan/SKILL.md` 与候选 `best_skill.md` 风格文件的分数和失败项。
- 文档解释 SkillOpt 原理、如何使用本 MVP、为何不直接覆盖正式 skill。
- 默认项目验证命令通过：`node scripts/check-plugin.mjs`、`node scripts/check-claude-code-install.mjs`、`node scripts/check-cursor-install.mjs`、`node scripts/install-cursor.mjs --target . --dry-run`。
- 新增 runner 至少通过一个本地 smoke：对 `skills/plan/SKILL.md` 跑 `plan` canary cases 并产出报告。

## Verification path

Verification path status: `runnable`

Commands:

```bash
node scripts/run-skillopt-eval.mjs --skill plan --skill-file skills/plan/SKILL.md --suite canary
node scripts/check-skillopt-eval.mjs docs/skillopt/runs/latest/summary.json
node scripts/check-plugin.mjs
node scripts/check-claude-code-install.mjs
node scripts/check-cursor-install.mjs
node scripts/install-cursor.mjs --target . --dry-run
```

Fallback evidence: none for final readiness. If the new runner cannot execute locally, record the blocker and do not claim this MVP ready.

Final integration claim: the repository contains a working, deterministic SkillOpt-compatible evaluation surface for `plan` skill candidates, while preserving existing plugin / Claude / Cursor install surfaces.

## Required capabilities

- Node.js scripts for deterministic scoring and report generation.
- JSON case data and JSON summary artifacts.
- Existing repository verification scripts.
- Optional future capability: true SkillOpt Python env adapter or CI online runner, deferred until MVP proves scoring usefulness.

## Work items

### 1. Define SkillOpt-compatible case surface

Status: completed

Acceptance criteria:

- `evals/skillopt/cases/plan/canary.json` exists.
- Cases include train / val / test intent or equivalent split metadata.
- Each case records prompt, required tokens, forbidden tokens, forbidden paths, language expectation, and scoring notes.

Verification commands:

```bash
node scripts/run-skillopt-eval.mjs --skill plan --skill-file skills/plan/SKILL.md --suite canary
```

Success definition: runner can load all cases and produce a score for each item.

### 2. Implement deterministic runner and checker

Status: completed

Acceptance criteria:

- `scripts/run-skillopt-eval.mjs` accepts `--skill`, `--skill-file`, `--suite`, and writes `docs/skillopt/runs/<timestamp>/summary.json` plus `report.md`.
- `scripts/check-skillopt-eval.mjs` fails on hard regressions and passes on the baseline seed skill.
- `docs/skillopt/runs/latest` points to or mirrors the latest run in a predictable way.

Verification commands:

```bash
node scripts/run-skillopt-eval.mjs --skill plan --skill-file skills/plan/SKILL.md --suite canary
node scripts/check-skillopt-eval.mjs docs/skillopt/runs/latest/summary.json
```

Success definition: baseline `skills/plan/SKILL.md` passes the canary suite with no hard failures.

### 3. Add candidate comparison protocol

Status: completed

Acceptance criteria:

- Runner can compare baseline and candidate skill files, or checker can read two summaries.
- Documentation explains how future SkillOpt `outputs/.../best_skill.md` should be evaluated before any manual transplant.

Verification commands:

```bash
node scripts/run-skillopt-eval.mjs --skill plan --skill-file skills/plan/SKILL.md --suite canary --out docs/skillopt/runs/baseline
node scripts/check-skillopt-eval.mjs docs/skillopt/runs/baseline/summary.json
```

Success definition: a future `best_skill.md` has a clear, safe evaluation path without overwriting `skills/plan/SKILL.md`.

### 4. Document controlled SkillOpt usage

Status: completed

Acceptance criteria:

- `docs/integrations/skillopt.md` explains SkillOpt concepts in this repo's terms.
- The doc states the allowed branch workflow, file allowlist, hard gates, holdout cases, and no-auto-merge rule.
- README or integration index is updated only if needed and without overstating production readiness.

Verification commands:

```bash
rg -n "SkillOpt|best_skill|no-auto|holdout|skills/plan/SKILL.md" docs/integrations/skillopt.md
```

Success definition: a future agent can understand how to run an optimization experiment safely.

### 5. Run project checks and commit

Status: completed

Acceptance criteria:

- New eval smoke passes.
- Existing plugin / install checks pass.
- `git status --short` shows only intended files before commit.
- Commit message is Chinese and scoped to this MVP.

Verification commands:

```bash
node scripts/run-skillopt-eval.mjs --skill plan --skill-file skills/plan/SKILL.md --suite canary
node scripts/check-skillopt-eval.mjs docs/skillopt/runs/latest/summary.json
node scripts/check-plugin.mjs
node scripts/check-claude-code-install.mjs
node scripts/check-cursor-install.mjs
node scripts/install-cursor.mjs --target . --dry-run
git status --short
```

Success definition: one committed milestone exists on `feature/skillopt-skill-eval-mvp` with runnable evidence.

## Commit units

| Unit | Scope | Phases | Precondition |
| --- | --- | --- | --- |
| U1 | plan artifact | planning | plan file written and reviewed for executable scope |
| U2 | eval MVP scripts/data/docs | work items 1-4 | local eval smoke passes |
| U3 | final verification cleanup | work item 5 | project checks pass and no unrelated files included |

Current commits:

- `9ec7a28 规划 SkillOpt skill eval MVP`
- `6ba9630 实现 SkillOpt skill eval MVP`

Final verification evidence:

- `node scripts/run-skillopt-eval.mjs --skill plan --skill-file skills/plan/SKILL.md --suite canary` -> `23/23`
- `node scripts/check-skillopt-eval.mjs docs/skillopt/runs/latest/summary.json` -> PASS
- `node scripts/check-skillopt-eval.mjs docs/skillopt/runs/candidate/summary.json --baseline docs/skillopt/runs/baseline/summary.json --min-improvement 0` -> PASS
- `node scripts/check-plugin.mjs` -> PASS; info only: Codex CLI not detected in this shell
- `node scripts/check-claude-code-install.mjs` -> PASS
- `node scripts/check-cursor-install.mjs` -> PASS
- `node scripts/install-cursor.mjs --target . --dry-run` -> PASS

## Known risks / blockers

- SkillOpt's real training loop expects a benchmark adapter; this MVP may only provide deterministic local evaluation, not full `scripts/train.py` integration.
- `codex exec` online trajectories are costlier and more variable; first version intentionally avoids them.
- If scoring rules are too loose, optimized skill candidates may overfit wording instead of workflow behavior.
- Generated run artifacts can create repository noise; only compact summary/report should be committed unless explicitly needed.

## Handoff to next skill

Next skill: `implement`

Reason: active slice is scoped, verification path is runnable, and the repository workbench already declares relevant validation commands.
