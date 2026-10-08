---
name: ship
description: "End-to-end delivery of an authorized, clearly scoped task: runs the three skills $implement, $review, $cleanup in sequence. When the plan has dependency edges and the harness supports background subagents and worktrees, it can deliver in parallel along the task graph. Not used when scope or acceptance is unclear or the root cause is unknown; adds no new gates or repeated confirmations."
---

# One delivery: $implement -> $review -> $cleanup

Carry an authorized task through modification, review, and close-out within one session. This skill only orchestrates ordering and abort conditions; each stage's protocol defers to the corresponding skill.

## Process

1. Confirm preconditions: scope and acceptance are clear, and the task is authorized to run the full course. Unclear scope routes to $brainstorm/$plan; unknown failure root cause routes to $diagnose, returning here to continue once resolved.
2. Run $implement: minimal changes + test-driven on agreed seams + targeted checks. Low-risk mechanical changes may proceed to close-out after self-review per its completion contract.
3. Substantive-risk changes (cross-module, permission/data boundaries, deployment, explicit user request) continue to $review: structural review + fresh evidence adjudication; Critical/Important findings go back to modification, with the affected parts re-verified.
4. Run $cleanup: tidy documents, code, and leftovers so the recovery surface forms a state the next session can continue from. When the task closes in this round, the retirement contract is included: within the same commit that flips this track's row out of active, complete flip the row → lessons inheritance → delete this track's documents (including unapproved/abandoned ones) → state sync.
5. Output a delivery summary: change overview, evidence and conclusions, close-out result, remaining items.

## Parallel mode

Trigger: the plan has dependency edges with ≥2 items ready at once, and the harness supports background subagents and git worktrees; otherwise use the sequential process above. This section replaces only how steps 2–3 execute; preconditions, cleanup, and sequencing discipline are unchanged; unlike the sequential path, parallel mode always runs one review (the merged output of several subagents does not qualify for the low-risk self-review exemption).

1. Create a single **integration branch**. Optionally first dispatch one exploration subagent that writes its code/doc research notes to a shared directory outside the repo, for later implementers to reuse.
2. The **frontier** is every item whose dependencies have all **merged into the integration branch**, computed from the branch itself, not from tracker blocked-by counts (those only drop when a blocker closes, so mid-run they are stale). Dispatch one background implementer subagent per frontier item, each in its own worktree and branch.
3. Dispatch through **context pointers** (plan path, item number, exploration-notes path, relevant commits), not pasted summaries. The dispatch prompt explicitly requires running `implement`, with behavior changes red-green via `tdd`: subagents do not inherit the disciplines loaded in this session.
4. Each implementer: before starting and before any edit, confirms its worktree is based on the integration branch (resetting onto it if not); before reporting done, merges the integration-branch tip into its own branch so landing it is a fast-forward. After each merge the orchestrator recomputes the frontier and immediately dispatches newly ready items.
5. Items whose verification depends on untracked material (gitignored fixtures, local databases, credentials) are verified in the main checkout (with the integration branch checked out): a worktree holds only what git tracks, and a test that silently skips there is not green.
6. **Run `review` once, after every item has merged** (a mid-run review reads unbuilt items as missing and triggers a fix-review loop). Send all findings to one fix subagent, then re-verify only the fixed points; do not start a second broad review.
7. **Only the orchestrator writes the recovery surface**: subagents deliver commits and a short report and never touch `.harness/` or other state files; after the review fixes, the integration branch fast-forwards into the main branch and the orchestrator runs cleanup from the main branch as usual (the retirement contract's "committed into the main tree" refers to the main branch); all worktrees are removed at the end.

Scope: this mode suits parallelism you can watch and steer within a session; for truly unattended batch execution, a deterministic script or CI loop is faster, cheaper, and more reliable.

## Sequencing discipline

- A later stage does not overturn a previous one without reason; when review finds something to change, redo only the affected parts.
- Do not skip cleanup to finish early, nor expand cleanup into a repo-wide tidy-up.
- Any stage hitting an authorization boundary or a trade-off that needs the user's decision: stop and explain; do not decide for the user.

## Recommended next skill

- Delivery complete: end.
- Unresolved findings or blocked: record and hand off along the corresponding lane.
