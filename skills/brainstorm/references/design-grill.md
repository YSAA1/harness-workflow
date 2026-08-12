# Design Grill (craft)

Use during `brainstorm` clarification as the **question craft** inside the frontier grill loop (`clarification-loop.md`). This is not a separate phase.

Design Grill means: walk design dependencies branch by branch, stress-test with concrete scenarios, sharpen domain language, and capture durable glossary or ADR material as it crystallises — in the **same** interview that updates the coverage ledger.

Read this together with `clarification-coverage.md` and `clarification-loop.md`. For glossary and ADR discipline, follow domain-modeling rules: challenge terms, update `CONTEXT.md` inline, offer ADRs only when all three ADR criteria are met.

## When Depth Is Required

| Situation | Grill depth |
| --- | --- |
| Non-trivial feature, migration, architecture, or multi-session work | **Required** — ≥2 frontier rounds and ≥1 stress scenario (see Grill Gate) |
| User says grill, stress-test, or "再深挖" | **Required** — continue until user waives or branches resolve |
| Single-point patch with no design branches | **Waivable** — user may waive in assumption batch |

Framing gaps (Purpose / Scope still `unknown`) still go first per `clarification-loop.md` Priority — then use these branches instead of re-surveying Behavior.

## Per-Round Craft

For each frontier round:

1. Prefer unresolved **design branches** that block the most downstream decisions (see Branch Order), limited to questions whose prerequisites are settled.
2. If a question can be answered from codebase or docs, explore first (or dispatch a sub-agent) and mark `inferred` / `resolved` with evidence.
3. Form a working recommendation before asking each frontier question.
4. Ask the whole frontier in one message; number questions; each item is accept/correct/reject (or choose among 2–3 concrete options) with a recommended answer.
5. Include a **concrete stress scenario** on design-sensitive questions unless the branch is pure terminology.
6. Update matching coverage ledger rows in the same round.
7. If a term is resolved, update `CONTEXT.md` inline (glossary only — no implementation detail).
8. If an ADR is warranted, offer to create it under `docs/adr/` immediately — do not batch ADR offers.

## Branch Order

Walk branches in this order, skipping branches already `resolved` or `waived`:

1. **Actors and boundaries** — who does what, where system boundaries sit
2. **Happy path** — primary flow end-to-end
3. **Failure and edge cases** — errors, partial success, rollback, idempotency
4. **Data and state** — what is stored, who owns it, lifecycle
5. **Interfaces and contracts** — APIs, events, file formats, compatibility
6. **Non-functional constraints** — security, performance, observability, migration
7. **Verification hooks** — how each branch would be proven or falsified
8. **Rejected alternatives** — paths intentionally not taken and why

If an answer resolves multiple branches, mark all of them `resolved` before choosing the next frontier.

## Question Shape

Prefer this shape for each design-sensitive frontier item:

```text
❓ **Qn** - **<title>**: <body>

Design branch: <branch>
Stress scenario: <one concrete case>
➡️ <recommended answer>
```

For pure framing items (Purpose / Scope still open), a shorter recommendation-backed question is enough; add a stress scenario once behavior or boundaries are in play.

## Domain and ADR

- **Challenge glossary conflicts** immediately when the user conflicts with `CONTEXT.md`.
- **Sharpen fuzzy language** by proposing a precise canonical term.
- **Discuss concrete scenarios** when relationships or boundaries are unclear.
- **Cross-reference code** when the user states how something works; surface contradictions.
- **Update `CONTEXT.md` inline** when a term is resolved — do not batch glossary writes.
- **Offer ADRs sparingly** — only when all three are true: hard to reverse; surprising without context; real trade-off with alternatives.

## Same-Turn Forbidden Actions

While a frontier round is open, do **not** in the same turn: write Spec draft, call `plan`/`implement`/`review`, or treat silence as approval.

## Anti-patterns

- Splitting clarification into "coverage survey" then "grill mode".
- Stopping after ledger labels look complete with zero stress rounds on non-trivial work.
- Putting dependent questions in the same frontier round.
- Asking the user for facts that the repo or docs can answer.
- Asking broad survey questions instead of challenging a concrete recommendation.
- Host-product or host-CLI name-dropping as protocol.
