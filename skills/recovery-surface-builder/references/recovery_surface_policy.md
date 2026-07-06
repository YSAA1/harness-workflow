# Recovery Surface Policy

Harness Builder owns project-level recovery surface design. Other workflow skills may use a selected recovery surface, but they should not require a dedicated state lane before doing useful work.

**Recovery Policy** (`references/recovery_policy.md`) is the session entry contract. **Work Index** (`references/source_of_truth_tiers.md`) is the task registry (**Required** whenever recovery is not `none`). **`AGENTS.md` must not index the current task** — it points to Recovery Policy and Work Index only.

All project-local recovery artifacts live under **`.harness/`**. Do not create root-level `task_plan.md`, `progress.md`, or `findings.md`.

## Session Entry

Agents on tracked work must follow Recovery Policy session start (see `recovery_policy.md`):

1. `AGENTS.md` (T1)
2. `.harness/recovery_policy.md`
3. `.harness/work_index.md` → open the `active` row primary artifact
4. `.harness/state.md` (hot index)
5. Dynamic git / verification probe

If Work Index and hot index disagree on the active task, reconcile before editing.

## Field Model

Every durable recovery surface should make these fields discoverable when the task needs them:

| Field | Meaning | Typical `.harness/` location |
| --- | --- | --- |
| `objective` | Current goal or user-facing outcome | `state.md` + linked plan/Spec |
| `active_slice` | The one piece of work in progress | `state.md` |
| `non_goals` | Work explicitly outside this slice | `state.md` or Executable Plan |
| `success_criteria` | Evidence needed before calling the slice done | `state.md` or Executable Plan |
| `verification_path` | Commands, checks, smoke paths, or manual evidence | `state.md` |
| `current_phase` | Current phase or status | `state.md` |
| `evidence_log` | Fresh commands, results, and limits | `progress.md` or cold log links from `state.md` |
| `decisions` | Accepted decisions and reasons | `decisions.md` or `docs/adr/` |
| `rejected_options` | Paths intentionally not taken | `decisions.md` |
| `risks` | Known residual risks or capability gaps | `state.md` |
| `blockers` | External decisions or missing capabilities | `state.md` |
| `next_actions` | The next concrete recovery step | `state.md` |

Executable Plan artifacts default to `docs/plans/` (T4). `.harness/` holds **runtime recovery**, not the canonical plan document.

## `.harness/` Layout

| File | Role |
| --- | --- |
| `recovery_policy.md` | Session entry, field map, update triggers (**Required** when recovery ≠ `none`) |
| `work_index.md` | Task registry with one `active` row (**Required** when recovery ≠ `none`) |
| `state.md` | Hot index — rewrite in place |
| `progress.md` | Evidence log — append or link from hot index |
| `decisions.md` | Decisions and rejected options |
| `manifest.yaml` | Optional harness manifest |

Templates: `templates/recovery_policy.md.j2`, `templates/work_index.md.j2`, `templates/state.md.j2`, `templates/progress.md.j2`, `templates/decisions.md.j2`.

## Hot Surface Budget

Hot recovery docs are bounded indexes, not append-only reports. Keep
`AGENTS.md`, `.harness/state.md`, `.harness/work_index.md`, and handoff notes
small enough for the next agent to read first.
For complex tasks, replace or roll up old progress into the current state,
decisions, residual risks, and links to cold evidence.

Append-only detail belongs in cold logs, archived plans under `docs/plans/`,
research notes, benchmark outputs, or issue/PR history. Status, check, and
selftest scripts are views: they may validate anchors and print
source-of-truth pointers, but they must not copy active slices, evidence logs,
probe inventories, or long conclusions.

## Backend Options

| Backend | Use When | Typical Artifacts |
| --- | --- | --- |
| `none` | Trivial one-off work where durable state would add noise | final response and git diff |
| `lightweight` | Medium task needing minimal recovery | `.harness/recovery_policy.md`, `.harness/work_index.md`, `.harness/state.md` |
| `harness` | Multi-step, cross-session, or review-heavy work | full `.harness/` layout above |
| `feature-list` | Product work with many independent features | `.harness/features.json`, `.harness/work_index.md`, issue tracker |
| `existing` | Credible external task tracking already exists | Recovery Policy pointer to issues/roadmap + `.harness/work_index.md` sync |

Prefer `harness` over ad hoc root-level state files. Legacy root `task_plan.md` / `progress.md` / `findings.md` should be reconciled into `.harness/` or archived.

## Existing Harness Reconciliation

When a repo already has harness artifacts, Harness Builder must reconcile before installing and classify each component as keep, patch, archive/deprecate, or reject/remove. Before writing, state the source-of-truth priority (`source_of_truth_tiers.md`). **Remove stale task pointers from `AGENTS.md`.** Migrate legacy root state files into `.harness/`. Do not merge an old active slice with a new request. When starting a new task, update Work Index — do not rewrite `AGENTS.md`.

## Drift Repair

When recovery artifacts conflict with code or git state, identify the conflicting sources, apply tier priority, append a correction to the evidence log, rewrite the hot index, and never put temporary active-slice status into `AGENTS.md`.
