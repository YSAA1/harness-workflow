# Living Docs Discipline

Harness docs rot when agents treat them as write-once artifacts. This policy defines **when** to update **which** doc so knowledge stays alive through execution, not only at bootstrap.

## Doc Classes

| Class | Role | Living rule |
| --- | --- | --- |
| **Entry** | `AGENTS.md` | Update only via harness-builder or cleanup; never session narrative |
| **Policy** | `.harness/recovery_policy.md`, source-of-truth tiers | Update when recovery model changes |
| **Index** | `.harness/work_index.md`, feature list | Update at task start, status change, task close (**Required**) |
| **Hot** | `.harness/state.md` | Rewrite in place each meaningful progress step |
| **Evidence** | `.harness/progress.md` | Append or link; roll up via hot index when long |
| **Decisions** | `.harness/decisions.md`, `docs/adr/` | Update when terms or irreversible decisions resolve |
| **Plans** | `docs/plans/`, `docs/specs/` | Update at plan/spec revisions (T4) |
| **Generated** | skill-flow HTML, codegen | Regenerate from script only |

## Update Triggers By Workflow Skill

| Skill | Must update | Must not update |
| --- | --- | --- |
| `brainstorm` | `CONTEXT.md` terms; optional ADR | `AGENTS.md`; default no `.harness/` runtime write |
| `plan` | T4 plan artifact; `.harness/work_index.md` row; `.harness/state.md` when tracked | T1 with task-specific pointer |
| `implement` | `.harness/state.md`, `.harness/progress.md` | append-only hot novels |
| `verify` | evidence pointers in `.harness/progress.md` / `state.md` | ready claims in T1 |
| `cleanup` | T1 thin pointers; Work Index status; roll hot → links | delete uncertain cold logs without ask |
| `harness-builder` | T1 tiers, `.harness/recovery_policy.md`, `.harness/work_index.md` | current task state in T1 |

## Anti–Dead-Doc Signals

- `.harness/state.md` older than active git work on that task
- `AGENTS.md` mentions a specific plan/Spec not listed as `active` in Work Index
- Root-level legacy `task_plan.md` / `progress.md` / `findings.md` still present alongside `.harness/`
- Multiple files claim different `active_slice` values

## Roll-Up Pattern

When a hot `.harness/` file exceeds ~80 lines:

1. Rewrite body: objective, active slice, phase, last evidence, risks, next, cold links.
2. Archive superseded narrative under `docs/plans/` with date prefix.
3. One-line note in `.harness/progress.md`.

## Integration With Cleanup

`cleanup` compares T1–T6 per `source_of_truth_tiers.md`. Structural gaps → `harness-builder`; scope drift → `plan`.
