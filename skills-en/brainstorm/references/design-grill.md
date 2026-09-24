# Design Grill (craft)

Use during `brainstorm` clarification as the **question craft** inside the frontier grill loop (`clarification-loop.md`). This is not a separate phase.

Design Grill means: walk design dependencies branch by branch, stress-test with concrete scenarios, sharpen domain language, and capture durable glossary or ADR material as it crystallises — in the **same** interview that updates the coverage ledger.

Read this together with `clarification-coverage.md` and `clarification-loop.md`. `CONTEXT.md` refers to the target project's existing domain glossary, not a plugin file. Writing terminology and ADRs follows the current task's authorization; pure discussion can simply be recorded in the reply.

## When Depth Is Required

| Situation | Grill depth |
| --- | --- |
| Non-trivial feature, migration, architecture, or multi-session work | Test designs and scenarios against unresolved risks; no fixed number of questioning rounds required (see Grill Gate) |
| User says grill, stress-test, or "dig deeper" | **Required** — continue until user waives or branches resolve |
| Single-point patch with no design branches | **Waivable** — user may waive in assumption batch |

Framing gaps (Purpose / Scope still `unknown`) still go first per `clarification-loop.md` Priority — then use these branches instead of re-surveying Behavior.

## Per-Round Craft

For each frontier round:

1. Prefer unresolved **design branches** that block the most downstream decisions (see Branch Order), limited to questions whose prerequisites are settled.
2. If a question can be answered from codebase or docs, explore first (or dispatch a sub-agent) and record the finding in the matching coverage row — `inferred` with source, or `confirmed` when the repo demonstrates it.
3. Form a working recommendation before asking each frontier question.
4. Ask the whole frontier in one message; number questions; each item is accept/correct/reject (or choose among 2–3 concrete options) with a recommended answer.
5. Include a **concrete stress scenario** on design-sensitive questions unless the branch is pure terminology.
6. Update matching coverage ledger rows in the same round.
7. When terminology is settled and the task includes documentation, update the target project's existing glossary (terminology only); otherwise record it in the reply.
8. If an ADR is warranted, offer to create it under `docs/adr/` immediately — do not batch ADR offers. ADRs are limited to irreversible architecture decisions; process and environment pitfalls go into the lessons of the project recovery surface (if there is no recovery surface, write nothing and do not imply creating one).

## Branch Order

Walk branches in this order, skipping branches already settled — coverage row `confirmed` or `waived`, or carrying a sourced factual note:

1. **Actors and boundaries** — who does what, where system boundaries sit
2. **Happy path** — primary flow end-to-end
3. **Failure and edge cases** — errors, partial success, rollback, idempotency
4. **Data and state** — what is stored, who owns it, lifecycle
5. **Interfaces and contracts** — APIs, events, file formats, compatibility
6. **Non-functional constraints** — security, performance, observability, migration
7. **Verification hooks** — how each branch would be proven or falsified
8. **Rejected alternatives** — paths intentionally not taken and why

If one answer settles multiple branches, note it in each matching coverage row's Source/note before choosing the next frontier — no second status vocabulary. Emptiness declarations carry the one-line-per-branch reconciliation per the Grill Gate (see `clarification-loop.md`).

## Question Shape

The question shape has a single source: the Output section of `SKILL.md` — every question carries its `Design branch` line, design-sensitive items add a `Stress scenario` line; this file keeps no second template. Craft: pure framing items (Purpose / Scope still open) may omit the anchor lines; add the stress scenario as soon as behavior or boundaries come into play.

## Domain and ADR

- **Challenge glossary conflicts** immediately when the user conflicts with `CONTEXT.md`.
- **Sharpen fuzzy language** by proposing a precise canonical term.
- **Discuss concrete scenarios** when relationships or boundaries are unclear.
- **Cross-reference code** when the user states how something works; surface contradictions.
- **Update the target project glossary per authorization**; do not auto-create documents merely because terminology was discussed.
- **Offer ADRs sparingly** — only when all three are true: hard to reverse; surprising without context; real trade-off with alternatives.

## Same-Turn Forbidden Actions

While a frontier round is open, do **not** in the same turn: write Spec draft, call `plan`/`implement`/`review`, or treat silence as approval.

## Anti-patterns

- Splitting clarification into "coverage survey" then "grill mode".
- Stopping when all labels are filled while substantive design risks remain unchecked, or repeating settled conclusions to pad the round count.
- Putting dependent questions in the same frontier round.
- Asking the user for facts that the repo or docs can answer.
- Asking broad survey questions instead of challenging a concrete recommendation.
- Host-product or host-CLI name-dropping as protocol.
