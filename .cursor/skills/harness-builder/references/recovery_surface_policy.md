# Recovery Surface Policy

Harness Builder owns project-level recovery surface design. Other workflow skills may use a selected recovery surface, but they should not require a dedicated state lane before doing useful work.

## Field Model

Every durable recovery surface should make these fields discoverable when the task needs them:

| Field | Meaning |
| --- | --- |
| `objective` | Current goal or user-facing outcome |
| `active_slice` | The one piece of work in progress |
| `non_goals` | Work explicitly outside this slice |
| `success_criteria` | Evidence needed before calling the slice done |
| `verification_path` | Commands, checks, smoke paths, or manual evidence |
| `current_phase` | Current phase or status |
| `evidence_log` | Fresh commands, results, and limits |
| `decisions` | Accepted decisions and reasons |
| `rejected_options` | Paths intentionally not taken |
| `risks` | Known residual risks or capability gaps |
| `blockers` | External decisions or missing capabilities |
| `next_actions` | The next concrete recovery step |

## Hot Surface Budget

Hot recovery docs are bounded indexes, not append-only reports. Keep
`AGENTS.md`, `.harness/state.md`, `task_plan.md`, `progress.md`,
`findings.md`, and handoff notes small enough for the next agent to read first.
For complex tasks, replace or roll up old progress into the current state,
decisions, residual risks, and links to cold evidence.

Append-only detail belongs in cold logs, archived research notes, benchmark
outputs, or issue/PR history. Status, check, and selftest scripts are views:
they may validate anchors and print source-of-truth pointers, but they must not
copy active slices, evidence logs, probe inventories, or long conclusions.

## Backend Options

| Backend | Use When | Typical Artifacts |
| --- | --- | --- |
| `none` | Trivial one-off work where durable state would add noise | final response and git diff |
| `lightweight` | Medium task needing a small recovery pointer | short plan doc, `.harness/state.md`, or existing docs |
| `three-file` | Multi-step, high-risk, cross-session, or review-heavy work | `task_plan.md`, `progress.md`, `findings.md` |
| `feature-list` | Product work with many independent features | `.harness/features.json`, tasks file, issue tracker |
| `existing` | The repo already has credible task or decision tracking | issues, roadmap, PRD, project docs |

Three-file remains a strong rigorous backend, but it is not a synonym for workflow state.

## Existing Harness Reconciliation

When a repo already has harness artifacts, Harness Builder must reconcile before installing and classify each component as keep, patch, archive/deprecate, or reject/remove. Before writing, state the source-of-truth priority for conflicts. Do not merge an old active slice with a new request.

## Drift Repair

When recovery artifacts conflict with code or git state, identify the conflicting sources, decide which source is newer and more authoritative, append a correction to the selected evidence log, and never put temporary active-slice status into `AGENTS.md`.
