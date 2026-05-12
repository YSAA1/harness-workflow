# State Backends

## none

Use for trivial one-off tasks. Do not create state files.

## lightweight

Use for medium tasks. Keep only a concise execution contract and evidence log. This may be a shortened `task_plan.md` plus `progress.md`, or `.harness/state.md` plus `.harness/progress.md`.

## three-file

Default rigorous backend:

- `task_plan.md`
- `progress.md`
- `findings.md`

Use for multi-step, high-risk, cross-session, or review-heavy work.

## feature-list

Use when there are multiple independent features or product work items. Typical files:

- `.harness/features.json`
- `.harness/tasks.yaml`
- issue tracker entries

Each feature should include behavior, status, verification command, and next action.

## existing

Use when the project already has a credible state system: issues, PROJECT.md, roadmap, task tracker, or internal docs. Record the mapping instead of duplicating state.
