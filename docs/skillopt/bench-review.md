# Skill Bench Protocol Review

Status: protocol draft for user review.

This is the new gate before any future SkillOpt optimization. The previous mistake was optimizing workflow skills against thin canary checks and directly generated case JSON. That is not sufficient.

The corrected process is one skill at a time:

```text
choose one skill
-> discuss its job, pain, non-goals, and failure modes
-> agree target requirements
-> draft bench cases
-> user reviews cases
-> split approved cases into train / val / test
-> measure baseline
-> run SkillOpt
-> compare candidate vs baseline
-> manually adopt reviewed edits
```

## What changed

The directly generated per-skill draft JSON files were removed. They were too shallow and could repeat the same mistake by turning weak examples into an optimization target.

Current bench files:

| File | Purpose |
| --- | --- |
| `evals/skillopt/bench/README.md` | Defines the one-skill bench process |
| `evals/skillopt/bench/schema.json` | Defines the structure for a single skill bench session |
| `evals/skillopt/bench/templates/skill-bench-session.json` | Template used after the skill discussion starts |
| `scripts/check-skill-bench.mjs` | Validates the protocol files and future session JSON |

## Current rule

No SkillOpt run should modify canonical workflow skills until:

1. One target skill is selected.
2. That skill's goals, non-goals, and failure modes are discussed with the user.
3. Bench cases are drafted from that discussion.
4. The user approves or revises the cases.
5. Approved cases are split into train/val/test.
6. Baseline skill behavior is measured.
7. Candidate behavior is compared against baseline.
8. A human review decides which candidate edits, if any, are manually adopted.

## Suggested first skill

Start with `harness-builder`.

Reason: the earlier bad optimization polluted `harness-builder` with SkillOpt meta-process text, which proves its target requirements were not defined clearly enough. The first discussion should define what `harness-builder` is supposed to do in real use and what it must never do.

## Validation

```bash
node scripts/check-skill-bench.mjs
```

This validates protocol structure and any future per-skill bench session JSON. It does not claim a bench is approved or sufficient.
