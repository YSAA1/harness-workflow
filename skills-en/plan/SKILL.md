---
name: plan
description: "For multi-stage tasks, tasks with complex dependencies, or tasks that need cross-session recovery, form an executable plan and, when the project has no recovery surface, establish a minimal recovery surface (work_index + state + AGENTS pointer). When the user only wants a plan, deliver it and stop; when execution is already authorized, continue after planning. Not mandatory for small patches."
---

# Executable Plan

The plan states what to do, in what order, and how the result is accepted. It reuses the user request, the approved Spec, issues, and existing project records; it does not require creating another set of requirement materials.

## Process

1. Determine the goal, scope, acceptance, and dependencies from existing evidence. Ask only about unresolved trade-offs that affect the outcome; decide routine implementation choices yourself and state any necessary assumptions.
2. Prefer updating the project's existing planning surface; when there is no convention and a persistent plan is genuinely needed, use `docs/plans/YYYY-MM-DD--<topic>-plan.md`. Short tasks may use a conversational plan; when the change can be described in one sentence and has no cross-file dependencies, do not persist a plan file to disk.
3. Write the goal, scope, executable work items, verification approach, and important dependencies or risks. For multi-stage tasks, write the final overall acceptance criterion (`final_integration_claim`); passing each step does not substitute for overall success.
4. Markdown work items use checkboxes; issues or an existing tracker keep their native status. Mark the current item per track. In multi-item plans write dependencies as edges: each item carries `depends: #N` (or "none"), making the plan a task graph: an item whose prerequisites are all done can start, and `ship`'s parallel mode dispatches from it. Slicing rules:
   - **Vertical slices**: each item cuts through every layer it needs, is verifiable on its own, and fits in one fresh context window; any needed prefactoring goes first (make the change easy, then make the easy change).
   - **Repo-wide mechanical changes** (a rename, a retyped shared symbol that breaks many call sites at once) are not forced into vertical slices; sequence them as **expand–contract**: add the new form without breaking the old → migrate call sites in batches sized by blast radius (one item per batch, each depending on the expand) → delete the old form (depending on every migrate batch).
   - **Shared files**: when two items would edit the same shared file (a config registry, a message catalogue, a shared type), add an edge so they run in sequence, or fix the exact names each adds in the plan up front.
5. Recovery surface: the project already has a recovery surface (`.harness/`, a tracker, etc.) → sync this track's entry as needed (when `brainstorm` has already registered this track, keep using that row instead of creating a new one; repoint the primary artifact to this plan file; the approved Spec stays reachable via its outgoing link in `state.md`), replace the old plan's status only when the same track explicitly switches plans, and do not close other tracks. The project has no recovery surface and this task genuinely needs cross-session recovery → establish a minimal recovery surface and attach a one-line pointer in the project's `AGENTS.md` (read order: lessons (if any) → work_index active row → state); the pointer line also carries the minimal write-side discipline: a one-sentence flip-the-row-(out-of-active)-means-retirement rule (when the row is flipped out of active, complete within the same commit: flip the row → lessons inheritance → delete this track's plan/Spec documents, including unapproved and abandoned ones (delete only those whose sole inbound reference is from this track; with multiple inbound edges, flip the pointer instead of deleting) → state sync) + a pointer to the liveness criterion (a document is alive ⟺ it is referenced by a recovery-surface status file or a persistent entry):
   - `.harness/work_index.md`: header ID/title/Status/Primary artifact/Last verified + this task's active row (primary artifact points to this plan file); maintenance rules: do not delete historical rows, update the old entry when the same track switches plans, flipping the row out of active means retirement.
   - `.harness/state.md`: the six fields Objective / Status / Primary artifact / Evidence / Next / Limits.
   Short tasks still use a conversational plan, zero files; reusing the project's existing tracker takes precedence, and `.harness/` is not forced. For genuinely parallel multi-session work use git worktrees (one branch each); the recovery surface is not co-written across worktrees, and at merge time the owning track reconciles. When multiple tracks are active at once: the state snapshot represents the track advanced most recently (switching tracks rewrites the Objective header), and an older track's progress is governed by its work_index row + primary artifact.
6. When the user only asked for a plan, deliver it and stop. When implementation is already authorized, keep executing the steps that can advance; writing a plan is not a new approval gate.

## Verification and commits

- When verification is blocked, record the gap, the available evidence, and the claims that cannot be made; continue with work that does not depend on the gap. Do not automatically turn a temporarily missing tool into a task to rebuild the workbench.
- Do not pass substitute checks off as the original acceptance; changing the agreed acceptance criteria requires user consent.
- A commit unit may be used for meaningful milestones and is not a required item of every plan. Commits must satisfy the project's conventions and the relevant verification; when the project has no commit convention, the closing fallback follows the `implement` completion conditions (by default, land one commit). `verify` is an alias of `review`, not a second round of checking.
- Do not force filling in acceptance_criteria, verification_commands, and success_definition for every item; clear actions and success conditions are enough.

## Recommended next skill

- Plan abandoned or rejected: in the same commit, flip the row out of active as `abandoned` and run the four retirement steps (delete this track's plan/Spec documents, including unapproved and abandoned ones) → stop.
- Already authorized and changes needed: `implement`; root cause unknown: `diagnose`.
- The user asks for a review, or the changes need deep inspection: `review`.
- Only when a real workbench gap needs fixing: `harness-builder`; plan-only request: stop.
