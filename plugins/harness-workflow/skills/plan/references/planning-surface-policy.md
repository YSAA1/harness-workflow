# Planning Surface Policy

Use this reference when `plan` needs to choose where the execution contract should live.

## Principle

`plan` writes to the selected planning surface. It does not default every task into three files.

Choose the lightest surface that can preserve the current task's execution contract:

- objective
- active slice
- non-goals
- success criteria
- verification path and status
- required capabilities
- current next item
- risks or blockers
- handoff to the next skill

## Surface Matrix

| Surface | Use when |
| --- | --- |
| plan document | Documentation-heavy project, PRD in docs, or user asked for a doc plan. |
| issue | Team already tracks work in issues and the issue body is the source of truth. |
| feature-list entry | Product-style project tracks many independent features. |
| existing system | A trusted local roadmap, project board, or task system already exists. |
| three-file backend | Cross-session, high-risk, multi-agent, or user explicitly requests it. |
| lightweight chat plan | Task is non-trivial enough to plan, but durable state would add noise. |

## Rules

- Prefer existing project conventions over creating a new surface.
- Do not create a second recovery surface if the existing one can represent the required fields.
- If no durable state is needed, output a light plan and state why.
- If missing recovery or verification structure blocks future execution, route to `harness-builder`.
- `AGENTS.md` is not a planning surface; keep it as stable project guidance.

## Writing The Artifact

- docs plan: write to `docs/plans/` or the project-specific plan path.
- issue: write a publishable issue body or update the issue body.
- feature-list: update exactly the target feature entry.
- existing system: follow the local schema; do not duplicate state elsewhere.
- three-file backend: use `templates/task_plan.md`, `templates/progress.md`, and `templates/findings.md`.

## Blocked Verification Path

If the only meaningful verification path is `blocked`, the plan cannot route straight to `implement` unless it records a user-accepted fallback evidence path.

Otherwise route to `harness-builder` to repair verification capability.
