# Skill Bench Review Pool

This directory contains human-reviewable bench cases for workflow skill optimization.

These files are not SkillOpt training data yet. They are the review pool used to decide whether a skill optimization target is real, useful, and correctly scoped before any optimizer is allowed to change a canonical `SKILL.md`.

## Review contract

- A bench case must describe a realistic user prompt or project state.
- A bench case must state expected behavior and prohibited behavior.
- A bench case must score workflow behavior, not keyword presence.
- A bench case must stay in `review_pool` until the user approves it.
- Only approved bench cases may be converted into train/val/test data or CI gates.

## Current scope

The first review pool covers the four skills that were previously optimized too early:

- `harness-builder`
- `brainstorm`
- `plan`
- `implement`

The earlier canary suites under `evals/skillopt/cases/` remain lightweight regression checks. They are not sufficient as optimization benches.
