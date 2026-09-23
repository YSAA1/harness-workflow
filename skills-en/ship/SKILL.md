---
name: ship
description: "End-to-end delivery of an authorized, clearly scoped task: runs implement, review, cleanup in sequence. Not used when scope or acceptance is unclear or the root cause is unknown; adds no new gates or repeated confirmations."
---

# One delivery: implement -> review -> cleanup

Carry an authorized task through modification, review, and close-out within one session. This skill only orchestrates ordering and abort conditions; each stage's protocol defers to the corresponding skill.

## Process

1. Confirm preconditions: scope and acceptance are clear, and the task is authorized to run the full course. Unclear scope routes to `brainstorm`/`plan`; unknown failure root cause routes to `diagnose`, returning here to continue once resolved.
2. Run `implement`: minimal changes + test-driven on agreed seams + targeted checks. Low-risk mechanical changes may proceed to close-out after self-review per its completion contract.
3. Substantive-risk changes (cross-module, permission/data boundaries, deployment, explicit user request) continue to `review`: structural review + fresh evidence adjudication; Critical/Important findings go back to modification, with the affected parts re-verified.
4. Run `cleanup`: tidy documents, code, and leftovers so the recovery surface forms a state the next session can continue from. When the task closes in this round, the retirement contract is included: within the same commit that flips this track's row out of active, complete flip the row → lessons inheritance → delete this track's documents (including unapproved/abandoned ones) → state sync.
5. Output a delivery summary: change overview, evidence and conclusions, close-out result, remaining items.

## Sequencing discipline

- A later stage does not overturn a previous one without reason; when review finds something to change, redo only the affected parts.
- Do not skip cleanup to finish early, nor expand cleanup into a repo-wide tidy-up.
- Any stage hitting an authorization boundary or a trade-off that needs the user's decision: stop and explain; do not decide for the user.

## Recommended next skill

- Delivery complete: end.
- Unresolved findings or blocked: record and hand off along the corresponding lane.
