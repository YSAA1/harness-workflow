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

## Backend Options

| Backend | Use When | Typical Artifacts |
| --- | --- | --- |
| `none` | Trivial one-off work where durable state would add noise | final response and git diff |
| `lightweight` | Medium task needing a small recovery pointer | short plan doc, `.harness/state.md`, or existing docs |
| `three-file` | Multi-step, high-risk, cross-session, or review-heavy work | `task_plan.md`, `progress.md`, `findings.md` |
| `feature-list` | Product work with many independent features | `.harness/features.json`, tasks file, issue tracker |
| `existing` | The repo already has credible task or decision tracking | issues, roadmap, PRD, project docs |

Three-file remains a strong rigorous backend, but it is not a synonym for workflow state.

## Selection Rules

- Prefer `none` for small direct fixes.
- Prefer `lightweight` when the task needs only scope and evidence.
- Prefer `three-file` when the work spans sessions or multiple agents, has meaningful risk, or needs detailed evidence and decisions.
- Prefer `feature-list` when multiple product features must move independently.
- Prefer `existing` when a project already has an authoritative issue tracker, roadmap, or internal task system.

Do not create a parallel recovery surface if an existing one can represent the required fields.

## Existing Harness Reconciliation

When a repo already has harness artifacts, Harness Builder must reconcile before installing:

| Artifact type | Check |
| --- | --- |
| `AGENTS.md` / `CLAUDE.md` | Is it a thin durable entry, or does it contain stale active work? |
| README / docs | Do setup, verification, architecture, and user-visible behavior match current files? |
| `.harness/` or state files | Can they answer objective, active slice, evidence, decisions, risks, and next actions? |
| scripts / CI | Are the documented verification commands real and current? |
| local skills/hooks/MCP/subagents | Are they still used, justified, and safe? |

Then classify each component:

- `keep`: current, useful, and already points to the selected source of truth.
- `patch`: useful but stale or missing a pointer.
- `archive/deprecate`: no longer authoritative but worth preserving for history.
- `reject/remove`: misleading, duplicate, or unsafe. Destructive removal still requires user approval.

Before writing, state the source-of-truth priority for conflicts. Example:

```text
Source-of-truth priority:
1. User-approved Spec / Plan for current task
2. Current git tree and validation scripts
3. Selected recovery surface
4. AGENTS.md durable rules
5. Older notes and stale generated artifacts
```

Do not merge an old active slice with a new request. Either close/archive the old slice, update it as the selected current slice, or ask the user which work is current.

## Drift Repair

When recovery artifacts conflict with code or git state:

1. Identify the conflicting sources.
2. Decide which source is newer and more authoritative.
3. Append a correction to the selected evidence log instead of rewriting history.
4. Update the execution contract only if phase, blocker, or next action changed.
5. Never put temporary active-slice status into `AGENTS.md`.

## Handoff Hygiene

Before pausing or closing a substantial batch, the selected recovery surface should answer:

- What is the current active slice?
- What was the last concrete action?
- Which files changed?
- Which checks passed, failed, were skipped, or are stale?
- What remains blocked or risky?
- What should the next agent read first and run first?

If any answer is unknown, record `unknown` with the reason. Do not invent certainty.
