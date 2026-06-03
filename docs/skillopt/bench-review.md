# Skill Bench Review

Status: draft for user review.

This is the new gate before any future SkillOpt optimization. The previous mistake was optimizing workflow skills against thin canary checks instead of a real bench. These bench cases must be reviewed before they are converted into train/val/test data or used to justify changes to canonical `SKILL.md` files.

## What to review

Review whether each case represents a real workflow failure or an important expected behavior:

- Is the prompt realistic?
- Is the expected behavior what you want the skill to do?
- Is the prohibited behavior actually wrong?
- Are the scoring dimensions useful, or are they easy to game?
- Should the case be approved, revised, or rejected?

## Draft bench files

| Skill | File | Cases | Main target |
| --- | --- | ---: | --- |
| `harness-builder` | `evals/skillopt/bench/harness-builder.json` | 4 | Build or repair project harness without generic capability sprawl or SkillOpt meta-process pollution |
| `brainstorm` | `evals/skillopt/bench/brainstorm.json` | 3 | Clarify unclear requirements, but avoid reopening approved scope |
| `plan` | `evals/skillopt/bench/plan.json` | 3 | Make bench-first executable plans and resume existing plans |
| `implement` | `evals/skillopt/bench/implement.json` | 3 | Execute active slices to evidence/commit/PR while correcting course when target changes |

## Current rule

No SkillOpt run should modify canonical workflow skills until:

1. Bench cases are reviewed.
2. Approved cases are split into train/val/test.
3. Baseline skill behavior is measured against the approved bench.
4. Candidate behavior is compared against baseline.
5. A human review decides which candidate edits, if any, are manually adopted.

## Validation

```bash
node scripts/check-skill-bench.mjs
```

This only validates bench structure. It does not claim the bench is approved or sufficient.
