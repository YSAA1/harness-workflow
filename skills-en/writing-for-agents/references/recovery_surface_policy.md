# Recovery surface policy
Choose the minimal scheme that can recover the current task: none, lightweight, harness, feature-list, or existing.
none creates no files; lightweight may rely on git and a short plan; harness may use .harness; feature-list/existing reuses the pre-existing tracker/docs. Non-harness backends are not forced to create .harness or uniformly migrate old files.
One authoritative entry per task/track. Independent tracks or work trees may be active simultaneously; a new task does not auto-complete/archive old tasks.
Recoverable information includes the goal, status, next step, key decisions, evidence, and real blockers. Fields may be distributed across existing reliable entries; every file repeating all fields is not required (the harness backend's state fixes six fields: Objective / Status / Primary artifact / Evidence / Next / Limits; a superset is drift).
Migrate only when the user authorizes it and the migration benefit is clear, keeping traceability and links. Factual updates do not change permissions or acceptance contracts.
Parallel tracks: a single working directory uses multiple active rows plus per-track file-ownership sharding; tracks do not write each other's files. True multi-session parallelism uses git worktrees (each on its own branch); the recovery surface is not co-written across worktrees, and at merge time the owning track reconciles.

## Lifecycle contract

- Who creates: a new task gets its recovery surface from `plan` (or reuses an existing tracker), one row per track; in a project with an existing recovery surface, `brainstorm` pre-registers this track's row starting from the first frontier round (once the Spec lands on disk, it points to the Spec), registering only without creating a surface; when the project has no recovery surface, hang a pointer in `AGENTS.md` carrying the minimal write-side discipline (the one-line flip-the-row-is-retirement rule + a pointer to the reachability liveness criterion).
- Who updates: the agent of the owning track updates that track's records on phase changes, key decisions, and hand-offs, and does not write other tracks' files; evidence goes to state, linked artifacts, or git.
- Who retires: flipping the row is retirement — whoever flips the row out of active (complete/abandoned/blocked/track switch) completes the four steps within the same commit: flip the row → lessons inheritance → delete this track's plan/Spec documents (including unapproved and abandoned ones) → flip state's Status in sync. Deletion precondition = the changes are already committed into the main tree and lessons inheritance is complete; in-degree guard = only delete documents whose only inbound edge comes from this retiring track, and for multiple inbound edges flip the pointer instead of deleting; ADRs are not deleted, add superseded-by at retirement.
- Document liveness criterion = reachability: alive ⟺ linked out by `.harness/` state files or referenced by durable entry points (AGENTS.md, root README); unreachable means orphan, disposed of at retirement or global reconciliation.

## lessons writing discipline

- Who first creates: any authorized first writer (cleanup, diagnose, etc.) creates it on first write; plan pre-creating an empty file is not required.
- Each entry is atomic and organized by concept (one pitfall per entry): trigger → pitfall → correct practice (→ traceability); generic insights without a trigger condition are not collected.
- Continuous revision: new evidence merges into existing entries rather than appending endlessly; entries are deleted once invalid, with no historical archive.
