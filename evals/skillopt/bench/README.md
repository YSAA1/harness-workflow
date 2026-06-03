# Skill Bench Protocol

This directory defines the bench workflow used before any SkillOpt workflow-skill optimization.

Do not generate bench cases for multiple skills in one pass. Each skill gets its own discussion, goal agreement, case drafting, review, split, baseline, optimization, and adoption cycle.

## One-skill bench sequence

1. Pick exactly one target skill.
2. Discuss the skill's job, user pain, non-goals, and known failure modes.
3. Agree on target requirements before writing cases.
4. Draft bench cases for that skill only.
5. User reviews cases as approved, revise, or rejected.
6. Split only approved cases into train, validation, and test.
7. Measure baseline behavior against the approved bench.
8. Run SkillOpt only after baseline evidence exists.
9. Compare candidate behavior against baseline and held-out test cases.
10. Manually adopt only reviewed edits into canonical `SKILL.md`.

## Files

- `schema.json`: structure expected for a single skill bench session.
- `templates/skill-bench-session.json`: starting template for one skill discussion.
- `sessions/`: future approved or in-review per-skill bench sessions.

## Rule

The canary suites under `evals/skillopt/cases/` are lightweight regression checks. They are not sufficient as optimization benches and must not justify a `SKILL.md` optimization by themselves.
