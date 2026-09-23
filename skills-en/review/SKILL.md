---
name: review
description: "Review diffs, proposals, or completion claims, checking correctness, risk, and acceptance evidence. Supports limited-scope review of WIP; simple changes can be self-reviewed by implement, and verify is an alias of this skill."
---

# Review and verification

Combine problem discovery and the evidence checking of completion claims into a single review. The review scope comes from the user's request; WIP can be reported as findings — implementation does not have to be finished before review.

## Process

1. Clarify the diff/version under review, the target behavior, and the required acceptance. Examine the relevant source code, tests, documentation, and existing evidence; do not substitute the implementer's explanation for inspection.
2. Check correctness, contracts, boundaries, and regressions along concrete failure paths. Important risks warrant deep investigation; there is no need to pad findings or run a fixed number of review rounds.
3. When independent inspection adds value and the runtime allows it, use a read-only subagent with a clear scope; the absence of a subagent is not itself a failure. If the user or the project explicitly requires independent review, honestly flag it when that condition is unmet. When the environment has external delegation skills such as cli-delegate, a read-only independent re-check across model CLIs is allowed; its result is a claim, and the evidence still returns to the main tree for re-verification.
4. Map the required criteria to pass / fail / unknown. fresh evidence means the evidence still applies to the current relevant code, configuration, and inputs; actual outputs unaffected by subsequent changes can be reused, and do not automatically expire because the skill changed or a commit already exists. A completion claim counts as evidence only via the actual output of runnable checks; implementer paraphrase or verbal assertion does not count.
5. Only fill in missing or invalidated checks. Use cold re-verification according to evidence ambiguity and risk; do not require delegating another agent to re-run the same tests.
6. Judge the specific completion claim: ready is possible only when there are no unresolved blocking issues and all required criteria pass. Critical/Important correctness, data, permission, or contract issues must all be resolved; list non-blocking suggestions separately. Do not delete or alter tests or acceptance scripts in order to pass; if the acceptance contract genuinely must change, get the user's consent first.
7. Persist findings (conditionally): all findings handled on the spot → do not persist to disk. If there are findings pending across sessions and the project has a recovery surface → write to this track's state surface: state.md Evidence records the findings list (number/location/severity) and the ready verdict, and Next records the pending fixes; when findings are numerous or need independent tracking, persist to `docs/reviews/YYYY-MM-DD--<topic>-review.md`, linked from this track's row or from state. Projects without a recovery surface keep in-session handoff and create no new state files.

## Boundaries

- When only review is requested, do not modify code; when the user has authorized fixes, record the findings (persist to the state surface per Process step 7 if they cross sessions), then you may switch to `implement` to fix and re-review the affected parts, without re-requesting authorization.
- For WIP, partial checks, or missing environments, give a limited-scope result; do not count unknown as passing.
- Low-risk changes may be completed with a lightweight self-review. `verify` redirects to this skill only once; it does not form a review → verify → review loop.

## Output

Present findings in two separate sections (do not merge or reorder): "Correctness and Risks" (actionable findings: severity, location, trigger condition, impact) and "Acceptance Evidence" (the pass/fail/unknown mapping of required criteria); then give the remaining gaps and the conclusion. When the repo has not documented acceptance criteria, still review the correctness axis by general defect categories (boundary, contract, regression, data/permissions); do not skip it as "no criteria". Use REVIEW / VERIFICATION / READY when tracking is needed, and note whether the review method was self, subagent, or external review, along with its scope; empty tables are not forced. REVIEW / VERIFICATION / READY are session tokens and do not replace the persistence layer — findings pending across sessions are persisted per Process step 7.

## Read on demand

- Deep adversarial review: `references/adversarial-reviewer-prompt.md`, `references/attack-taxonomy.md`.
- Acceptance evidence: `references/evidence-ladder.md`; when evidence interpretation is disputed, read `references/cold-verifier-prompt.md`.
- Read `references/cross-cutting-anti-patterns.md` and `references/premature-completion-patterns.md` when the corresponding risks exist; for tool gaps see `references/capability-recommendations.md`.

## Recommended next skill

- Completed: commit per project requirements; if only this session's documentation/recovery cleanup is needed, use `cleanup`; otherwise end.
- Fixes authorized: `implement`; unknown root cause: `diagnose`.
- Suggestions beyond the goal go into follow-ups; do not automatically open a new task or `harness-builder`.
