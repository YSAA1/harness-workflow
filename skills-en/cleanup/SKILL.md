---
name: cleanup
description: "Tidy the documents, code, generated artifacts, temporary files, and recovery state affected by this task; supports completion, blockage, or handoff. Ends with zero modifications when checks show no drift; does not expand into repo-wide cleanup."
---

# Knowledge Cleanup

Align this task's records with the actual outcome. Completion, blockage, abandonment, and handoff can all be tidied up; recording unfinished work does not require ready first.

## Process

1. Identify this task/track and its authoritative entry; with no persistent task record, inspect the current diff directly. Multiple independent tracks can be active at the same time; do not modify other tracks to force a single work surface.
2. Check only the README, instructions, interface docs, generated artifacts, and existing recovery records affected by this change. Widen the scope only when evidence shows cross-document drift or the user asks for a full tidy-up.
3. Clean up code leftovers introduced by this task: dead code, unused imports and dependencies, superseded old implementations, orphan scripts, and stale generated artifacts. Deletion is decided by reference evidence; after deleting, run targeted checks to confirm behavior is unchanged. Cleanup that would change behavior routes to the `implement` fix path instead of being treated as pure tidying.
4. Task closure (complete/abandoned/blocked/track switch) follows the four retirement steps of the retirement contract, completed within one commit: flip the row out of active → lessons inheritance (distill the non-obvious lessons of this track's plan/Spec first, including unapproved/abandoned ones) → delete this track's plan/Spec documents, including unapproved and abandoned ones (git history is the archive) → state sync (keep the last snapshot; Status flips with the row). Precondition for deletion = changes already committed to the main tree and lessons inheritance done; in-degree guard = only delete documents whose sole inbound edge comes from this retiring track; for multi-edge documents flip the pointer instead of deleting; contents of existing archive directories (docs/archive/ and the like) always go to needs-review for human adjudication, never into the deletable bucket; ADRs are never deleted, add superseded-by. The liveness criterion for documents = reachability (referenced by recovery-surface state files or persistent entries). Untracked files do not go through deletion; the disposition outlet = add a commit or add a .gitignore entry, one of the two. Non-harness backends (tracker/existing/feature-list, etc.) use a degraded mapping: flipping the row = flipping the tracker's native status to the corresponding terminal state; for the remaining steps, when the corresponding artifact (lessons, plan/Spec documents, state) is absent, that step is skipped — the retirement discipline does not wholly lapse because of missing artifacts. The four steps apply per artifact: no plan/Spec document for this track → the deletion step is empty; no non-obvious lessons with trigger conditions → the lessons-inheritance step records "no additions"; the row-flip and state-sync steps are never skipped in any circumstance.
5. Clean up scratch created by this task that no longer serves a purpose. Keep and explain files of unknown ownership or still in use; do not delete just because they are untracked, dated old, or temporarily named.
6. Generated artifacts are updated through existing generators and rebuilt only when inputs change. With no differences, finish with zero modifications. Newly hit pitfalls this time (environment, process, dependencies) are written per the lessons format into the lessons of the project recovery surface; if the project is a harness backend and the lessons file does not exist, create it on first write (three-part format: trigger → pitfall → correct practice), deleting stale entries as encountered.
7. Report the task status, modifications/archiving, kept items, and the recovery entry. Must not present cleanup completion as the original task being complete.

## Read on demand

- Stale plans: `references/doc-shelves.md`.
- Temporary-file ownership: `references/entropy-checklist.md`.
- Handoff: `references/handoff-hygiene.md`.
- Domain risks: `../review/references/cross-cutting-anti-patterns.md` (skip this reference when review is not installed; follow this file's process and evidence rules).

## Recommended next skill

- Tidy-up done: end.
- Authorized behavior changes remain: `implement`; unknown failures: `diagnose`.
- User explicitly requests repo-wide Python dead-code cleanup: `remove-deadcode-py`; for other ecosystems use the corresponding tool directly (knip for JS/TS, Go `deadcode`, cargo-machete for Rust).
- User explicitly requests repo-wide reconciliation/inventory/big cleanup, or cross-document drift is found, or the user asks for a full tidy-up: `sweep`.
- New work beyond the task: record as follow-up items; do not execute automatically.
