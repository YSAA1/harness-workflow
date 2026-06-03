# SkillOpt integration

This document explains how to use `microsoft/SkillOpt` ideas safely in this repository.

## What SkillOpt does

SkillOpt treats a Markdown skill document as trainable state. A target agent runs tasks with the current skill, each rollout is scored, and an optimizer model proposes bounded text edits. A candidate skill is accepted only when validation score improves. The output of a run is a `best_skill.md` artifact plus history and per-step evidence.

For `harness-workflow`, that means SkillOpt is not a replacement for workflow discipline. It is a candidate generator for better skill instructions.

## Current MVP

The current repository MVP is deterministic and local:

```bash
node scripts/run-skillopt-eval.mjs --skill plan --skill-file skills/plan/SKILL.md --suite canary
node scripts/check-skillopt-eval.mjs docs/skillopt/runs/latest/summary.json
```

This scores a candidate skill document against `evals/skillopt/cases/plan/canary.json`. It does not call `codex exec`, Claude Code, or SkillOpt's Python trainer yet. The goal is to make the score surface stable before adding online trajectories.

## Pinned SkillOpt checkout

This repo integrates the upstream `microsoft/SkillOpt` project through a pinned external checkout, not by vendoring the upstream source. The pin is recorded in `evals/skillopt/source.json`.

Prepare or verify the local checkout:

```bash
node scripts/prepare-skillopt.mjs
node scripts/prepare-skillopt.mjs --check
```

Install SkillOpt into the ignored local virtualenv when the Python dependencies are not already available:

```bash
node scripts/prepare-skillopt.mjs --install
```

Run the local SkillOpt smoke:

```bash
node scripts/run-skillopt-smoke.mjs
```

The checkout, virtualenv, and smoke summaries live under `.skillopt/`, which is ignored by git. The smoke invokes SkillOpt's own Python training entrypoint in help mode and verifies the upstream backend boundary.

At the pinned commit, `codex_exec` is supported as a target execution backend, not as an optimizer backend. That means Codex CLI alone can prove the target harness path, but a real optimization run still needs a supported optimizer backend: `openai_chat`, `claude_chat`, `qwen_chat`, or `minimax_chat`. A no-API-key real optimization path therefore requires a local compatible backend such as `qwen_chat`; otherwise use a configured API backend on the local machine.

## How to evaluate a future `best_skill.md`

If a SkillOpt run produces `outputs/.../best_skill.md`, evaluate it before transplanting anything into the canonical skill:

```bash
node scripts/run-skillopt-eval.mjs \
  --skill plan \
  --skill-file skills/plan/SKILL.md \
  --suite canary \
  --out docs/skillopt/runs/baseline

node scripts/run-skillopt-eval.mjs \
  --skill plan \
  --skill-file outputs/.../best_skill.md \
  --suite canary \
  --out docs/skillopt/runs/candidate

node scripts/check-skillopt-eval.mjs \
  docs/skillopt/runs/candidate/summary.json \
  --baseline docs/skillopt/runs/baseline/summary.json \
  --min-improvement 0
```

Passing this check only means the candidate did not regress the deterministic canary suite. It does not authorize replacing `skills/plan/SKILL.md`.

## Controlled branch workflow

Use a dedicated branch:

```bash
git switch -c feature/skillopt-<skill>-experiment
```

Allowed experiment files:

- `evals/skillopt/**`
- `scripts/run-skillopt-eval.mjs`
- `scripts/check-skillopt-eval.mjs`
- `scripts/prepare-skillopt.mjs`
- `scripts/run-skillopt-smoke.mjs`
- `.github/workflows/skillopt-evals.yml`
- `docs/integrations/skillopt.md`
- compact reports under `docs/skillopt/` when explicitly needed

Candidate patches may inspect:

- `skills/<skill>/SKILL.md`
- `skills/<skill>/references/**`
- `skills/<skill>/templates/**`

Candidate patches must not directly edit:

- `AGENTS.md`
- `.codex-plugin/**`
- `.claude-plugin/**`
- `.cursor-plugin/**`
- `plugins/**`
- user-level config, hooks, MCP config, or secrets

## Hard gates

Before any candidate text is manually transplanted into a canonical skill, run:

```bash
node scripts/run-skillopt-eval.mjs --skill harness-builder --skill-file skills/harness-builder/SKILL.md --suite canary
node scripts/check-skillopt-eval.mjs docs/skillopt/runs/latest/summary.json
node scripts/run-skillopt-eval.mjs --skill brainstorm --skill-file skills/brainstorm/SKILL.md --suite canary
node scripts/check-skillopt-eval.mjs docs/skillopt/runs/latest/summary.json
node scripts/run-skillopt-eval.mjs --skill plan --skill-file <candidate-skill.md> --suite canary
node scripts/check-skillopt-eval.mjs docs/skillopt/runs/latest/summary.json
node scripts/run-skillopt-eval.mjs --skill implement --skill-file skills/implement/SKILL.md --suite canary
node scripts/check-skillopt-eval.mjs docs/skillopt/runs/latest/summary.json
node scripts/check-plugin.mjs
node scripts/check-claude-code-install.mjs
node scripts/check-cursor-install.mjs
node scripts/install-cursor.mjs --target . --dry-run
```

Future online trajectory suites should also keep a holdout split. SkillOpt may optimize against train and validation cases, but final review must check holdout cases that were not used to tune the skill.

## No-auto-merge rule

SkillOpt output is a proposed patch source, not the source of truth. The safe path is:

```text
best_skill.md -> compare report -> manual transplant -> review -> verify -> cleanup -> commit
```

Do not automatically merge `best_skill.md` into `skills/plan/SKILL.md`. Do not let a judge-only score override deterministic hard gates.
