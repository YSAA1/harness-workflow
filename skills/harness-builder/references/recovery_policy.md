# Recovery Policy

Harness Builder must produce or repair a **Recovery Policy** for every non-`none` recovery surface. The policy is the **session entry contract**: how a fresh or interrupted agent reconstructs context without chat history.

The Recovery Policy is durable rules and pointers — not current task state.

## Required Artifacts (recovery ≠ `none`)

| Artifact | Location | Required |
| --- | --- | --- |
| Recovery Policy | `.harness/recovery_policy.md` | **Yes** |
| Work Index | `.harness/work_index.md` | **Yes** |
| Hot index | `.harness/state.md` | Recommended |
| Evidence log | `.harness/progress.md` | When multi-session evidence needed |
| Decisions | `.harness/decisions.md` | When irreversible choices exist |

Use templates under `templates/` when creating from scratch.

## What The Policy Must Answer

| Section | Content |
| --- | --- |
| Session start | Ordered read list: `AGENTS.md` → Recovery Policy → Work Index → active artifact → `.harness/state.md` |
| Active work pointer | Primary artifact path from Work Index `active` row — never duplicated in `AGENTS.md` |
| Work index | Task registry (see `source_of_truth_tiers.md`) |
| Field map | Which `.harness/` file holds each recovery field |
| Update triggers | When to rewrite hot docs, append evidence, record decisions, commit milestones |
| Stale signals | How to detect drift (git vs `.harness/`, conflicting actives) |
| Handoff minimum | What `cleanup` must verify before closure |

## Session Start Ritual

Every agent session on tracked work should follow:

1. Read `AGENTS.md` — project map, iron laws, verification entry, source-of-truth tiers only.
2. Read `.harness/recovery_policy.md` — field map and read order.
3. Read `.harness/work_index.md` — identify the `active` task.
4. Open the active row **primary artifact** (Spec or Executable Plan under `docs/`).
5. Read `.harness/state.md` — hot index for runtime slice, phase, next, risks.
6. Probe dynamic context — `git status`, recent log, verification — before editing.

If Work Index has no `active` row or conflicting actives without declared parallelism, stop and reconcile via `cleanup` or user confirmation.

## Multi-Task Projects

- `AGENTS.md` points to `.harness/work_index.md`, not to a specific plan or Spec.
- Work Index columns: id, title, status (`active` \| `blocked` \| `complete` \| `abandoned`), primary artifact, last verified.
- New task: add a row, set one `active`, complete/archive the previous active — **do not edit `AGENTS.md` task links**.
- Specs and Plans stay under `docs/specs/` and `docs/plans/`; the index links to them.

## Milestone And Decision Recording

| Event | Write to | Do not write to |
| --- | --- | --- |
| New task | `.harness/work_index.md` | `AGENTS.md` |
| Slice progress | `.harness/state.md` (rewrite) | append-only novel in hot index |
| Command evidence | `.harness/progress.md` | `AGENTS.md` |
| Irreversible trade-off | `docs/adr/` or `.harness/decisions.md` | chat only |
| Verify PASS | evidence + milestone commit | — |
| Task complete | Work Index status + `cleanup` | stale active pointer |

## Living Vs Dead Docs

See `living_docs_discipline.md`. Hot `.harness/` files are bounded indexes; cold detail lives under `docs/plans/`, archived logs, or issue history.

## Drift Repair

1. List conflicting sources with paths and dates.
2. Apply tiers from `AGENTS.md` (`source_of_truth_tiers.md`).
3. Prefer fresh git-verified evidence.
4. Rewrite hot index; append correction to progress log.
5. Work Index vs `state.md` conflict is **blocking** until reconciled.

## Binding To Recommendation Matrix

Recovery Policy and Work Index are **Required** whenever recovery surface is not `none`.
