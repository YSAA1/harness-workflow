---
name: sweep
description: "On-demand repo-wide reconciliation (not a task close-out): recovery-surface detection → inline reconciliation checklist → six-bucket classification → mechanical items auto-fixed, ambiguous items listed with evidence for human adjudication → four retirement steps → report. Triggers: sweep, take stock, big cleanup, project reconciliation (盘点, 大扫除, 项目对账)."
---

# Sweep

Repo-wide reconciliation: bring task artifacts, recovery-surface state, and repository leftovers into a single ledger. Detection relies on the checklist, conviction relies on evidence, and ambiguous items go to human adjudication.

This skill is the on-demand entry for low-frequency global reconciliation; it does not do task close-out (close-out goes to `cleanup`). It complements the retirement contract (the AGENTS.md write-side discipline): when leak-plugging at the source operates normally, this skill most often ends with zero modifications. The target project has no health-check script gate — the inline reconciliation checklist in this file is the equivalent compensation, relying on no script outside the repository.

## Process

1. **Probe the recovery surface (measured, not assumed)**: inventory the actual file set of `.harness/` (commonly the three files, but heterogeneous forms such as decisions/progress also occur). Present → root set = outbound links of all state files + persistent entries (AGENTS.md, root README, docs/README-like files). No `.harness/`, or the project uses a tracker/existing backend → degrade to scanning only task-artifact orphans and untracked leftovers, explicitly declaring "the `.harness` state surface is missing" (for tracker/existing the recovery surface is the tracker itself, which is not a case of missing), and do not fabricate state criteria (a third-party project may never have created `.harness`). When state is unparseable, skip the state-contradiction check and say so; do not draw orphan conclusions.
2. **Reconciliation checklist (the manual version sharing the same criteria as the recovery-surface lint of the harness-workflow method repo; runs in target projects that lack the script)**:
   - State contradictions: whether state's Status matches the corresponding work_index row; whether the track pointed to by state is registered.
   - Existence: whether the primary artifact of an active/blocked row exists (in the file system or within the trees registered by `git worktree list`; a hit in either counts as existing).
   - Reachability: for each task artifact (plans/specs/reports), `grep -F` its basename across all files in the root set; zero mentions = orphan candidate; basename matching guards against bare-filename false positives.
   - untracked (unique to sweep, not checked by the lint): listed via `git status --porcelain`, already-ignored entries removed via `git check-ignore -v`, grouped by directory/theme.
3. **Six-bucket classification**:
   - **① Task-artifact orphans**: convict tracked ones via triple-evidence conviction — zero mentions in the root set + `git log --follow` origin tracing + same-directory cross-references; spec/plan paired artifacts (shared slug) are adjudicated as a group, preventing deleting a spec while leaving its plan; reports-type items with "zero references + README declared non-authoritative" can be charged directly. Self-registered-deliverable guard: research logs (header carries Track self-registration, terminal state written) and review reports (landed in `docs/reviews/`, header carries an ownership declaration) are self-registered deliverables — zero references does not convict them directly; after triple-evidence conviction they are downgraded to needs-review for human adjudication, never auto-deleted.
   - **② Zombie blocked rows**: not only literally blocked — paused / awaiting-user-confirmation / blocked-by-policy and other equivalent forms are all filed, listing the freeze starting point and duration.
   - **③ Half-flipped rows**: any row whose status conflicts with actual progress/timeline qualifies; no online verification needed. Two forms: an active/blocked row superseded by a later task but not flipped (e.g., the GPU/directory the old row occupied has been taken over by a new task); a row already flipped to complete but with the four retirement steps unfinished — the plan/Spec derivative documents it links out to still remain under docs/ (a dead pointer on a complete row is the normal state of an already-retired row; the artifact being a live file does not count either).
   - **④ untracked leftovers**: never deleted; only list evidence + an either/or outlet (add a commit or add a .gitignore entry); directories with tracked precedent (e.g., artifacts/) default to commit candidates; directories containing registered worktrees are listed separately as high-risk — `git worktree remove` must happen before any disposition can be discussed; never directly ignore/delete.
   - **⑤ Archive directories** (docs/archive/ and the like): only inventoried and marked; their contents always go to needs-review for human adjudication, never into the deletable bucket.
   - **⑥ Recovery-surface files overstepping their remit**: state exceeding its snapshot role, decisions/lessons double bookkeeping → distill into lessons then truncate/merge; genealogy-style entries compressed into a single lineage table; among multiple copies of the same rule, keep only the one in lessons.
4. **Disposition**: mechanical items (flipping status, deleting convicted orphans) are fixed automatically; ambiguous items (abandoned vs paused, where unfinished items go) list evidence for user adjudication — no adjudication, no deletion (conservative stop).
5. **Four retirement steps** (same as the AGENTS.md write-side discipline, completed within one commit; historical complete-but-not-retired residue found in ③ is likewise made up): flip the row → lessons inheritance (distill first) → delete this track's plan/Spec documents, including unapproved and abandoned ones (precondition = already committed to the main tree and lessons inheritance done; in-degree guard = only delete documents whose sole inbound edge comes from this retiring track; for multi-edge documents flip the pointer instead of deleting; ADRs are never deleted, add superseded-by) → state syncs by flipping Status.
6. **Report**: with no drift, end with zero modifications.

## False-positive guards (lessons from practice)

- Absence from the main tree ≠ convictable: the primary artifact may live inside a registered worktree; orphan judgment goes by "zero mentions in referencing sources", not by "file missing".
- References to external paths such as /tmp rot but do not all perish; do not convict mechanically — treat them only as one dimension of evidence.
- Full-path exact matching misjudges bare-filename references as orphans (the file is actually referenced by relative path); slug matching lets spec/plan pairs sharing a slug pass each other — basename matching is right on both ends.

## Report format

- **Handled**: item + action + evidence summary.
- **needs-review**: reason (equivalent zombie form / half-flipped row / high-risk worktree / archive directory).
- **Kept**: guard-hit items (multi in-degree, tracked precedent, active references).
- **Next-round candidates**: suspects newly exposed after this round's disposition (e.g., cascading orphans, the piling-up row count of historical complete rows).

## Recommended next skill

- Reconciliation done: `cleanup` closes out this track; newly hit pitfalls are written down per the lessons format.
- What is found is a behavior bug rather than record drift: `diagnose`.

## Do not

- Do not delete untracked files (the only outlets are adding a commit or adding a .gitignore entry).
- Do not touch archive-directory contents or ADRs; do not do task close-out (that belongs to `cleanup`).
- Do not pursue clearing everything in one pass; split large repositories across multiple sessions.
