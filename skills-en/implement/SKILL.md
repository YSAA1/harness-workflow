---
name: implement
description: "Execute well-scoped code, configuration, or documentation changes; behavior changes are test-driven by default (red first, then green). Verify according to risk and complete the authorized work; use diagnose for complex unknown failures, and clarify first when important design trade-offs are undecided."
---

# Scoped implementation

The user request, project specs, a plan, or review findings can directly provide the execution scope; an already-authorized fix loop-back from review is picked up from this lane's status-surface records (outgoing links in state/work_index), without relying on the user to restate it and without asking for authorization again. Behavior changes are test-driven by default, red then green on pre-agreed seams; there is no need to round out the full process artifacts for routine changes.

## Process

1. Read the relevant entries, source code, tests, and git diffs to determine the target behavior and the necessary verification; protect unrelated user changes.
2. Determine the test seams: a seam is a public boundary for observing behavior, not an implementation interior. When the seams are unclear, agree on them with the user first, or adopt the acceptance surface recorded in the approved Spec/plan; read the `tdd` skill for the details.
3. Execute behavior changes under `tdd` discipline: write the failing test first (red), then the implementation that makes exactly it pass (green), one vertical slice at a time; do not pre-write future tests or add speculative features. Documentation and low-risk configuration are not mechanically required to have a failing test written first.
4. Verification cadence: typecheck runs often, single test files run often, the full suite runs once at the close. When new changes affect verified paths, re-run the corresponding checks; evidence that is already produced and still applicable can be reused — do not re-run it just because the skill changed.
5. Refactoring is not inside the red-green loop: structural convergence after the behavior turns green is identified by `review` and tidied separately once authorized, not mixed into the same round as making the tests green.
6. Update affected user documentation and existing recovery records; documents with no changes need no modification, and do not create duplicate status files. Long tasks do not wait for the close: when new evidence, ruled-out hypotheses, or key decisions appear, write them immediately into this lane's state Evidence (new evidence) / Next (continuation point) rows, and not into other lanes' files (state is a singular snapshot: when switching lanes in a multi-lane project, rewrite the Objective header first — see plan's multi-lane rules); after sustained exploration, re-read the current plan/task entry as needed to prevent goal drift.
7. Close out per the completion conditions below, or continue with already-authorized follow-up steps. Ask only when substantially expanding the scope, changing the acceptance, or hitting an authorization boundary.

## Completion conditions

- Low-risk, clearly scoped changes can be completed directly after self-review and the relevant checks, and committed as the project requires; when the project has no commit convention, a verified set of complete changes lands one commit by default (message in the project's language) and is not left hanging uncommitted on the grounds of "no requirement"; this is not limited to single-line changes.
- For complex behavior, multi-module contracts, permission/data boundaries, or when the user requests a review, use `review` for deeper assessment. `verify` is just an alias of the same entry point; do not serially append another round.
- When a required acceptance fails or is unknown, do not claim the corresponding capability ready; independent parts may be completed, with the remaining gap reported specifically.
- Use `diagnose` when the root cause is unknown and investigation is needed; a clear localized error can be fixed directly, without pausing just to switch skills.
- For verification intensity, see `references/verification-intensity.md`.

## Output

State the changes, the verification (including key test evidence), outstanding issues, and whether a commit was made. When tracking is needed, record the worktree/configuration/inputs the evidence corresponds to; simple tasks are not forced to fill in a blank form.

## Recommended next skill

- Simple task verified: stop, or continue with the user's already-authorized next step.
- Deep inspection needed: `review`; unknown failure: `diagnose`.
- This task's documentation or recovery status needs tidying: `cleanup`; a substantial scope change needs dependencies re-sequenced: `plan`.
