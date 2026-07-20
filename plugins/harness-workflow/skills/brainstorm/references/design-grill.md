# Design Grill (craft)

Use during **Phase A** of `brainstorm` as the **question craft** inside the unified grill loop (`clarification-loop.md`). This is not a separate Phase A2.

Design Grill means: walk design dependencies one branch at a time, stress-test with concrete scenarios, sharpen domain language, and capture durable glossary or ADR material as it crystallises — in the **same** interview that updates the coverage ledger.

Read this together with `clarification-coverage.md` and `clarification-loop.md`. For glossary and ADR discipline, follow domain-modeling rules: challenge terms, update `CONTEXT.md` inline, offer ADRs only when all three ADR criteria are met.

## When Depth Is Required

| Situation | Grill depth |
| --- | --- |
| Non-trivial feature, migration, architecture, or multi-session work | **Required** — ≥2 rounds and ≥1 stress scenario (see Phase A Gate) |
| User says grill, stress-test, `/grill-with-docs`, or "再深挖" | **Required** — continue until user waives or branches resolve |
| Single-point patch with no design branches | **Waivable** — user may waive in assumption batch |

Framing gaps (Purpose / Scope still `unknown`) still go first per `clarification-loop.md` Priority — then use these branches instead of re-surveying Behavior.

## Per-Turn Craft

On each design-sensitive turn:

1. Prefer an unresolved **design branch** that blocks the most downstream decisions (see Branch Order).
2. If the question can be answered from codebase or docs, explore first and mark `inferred` / `resolved` with evidence.
3. Form a working recommendation before asking.
4. Ask **exactly one** accept/correct/reject question with the recommended answer or 2–3 concrete options.
5. Include a **concrete stress scenario** unless the branch is pure terminology. Probe an edge case, failure mode, migration path, compatibility boundary, or user-visible trade-off.
6. Update matching coverage ledger rows in the same turn (e.g. Actors → Users/callers; Happy path + Failure → Behavior).
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

If an answer resolves multiple branches, mark all of them `resolved` before choosing the next question.

## Question Shape

Prefer this shape for each design-sensitive turn:

```text
Design branch: <branch>
Working recommendation: <what I think we should do, based on the current evidence>
Stress scenario: <one concrete case that could break or distort the design>
Question: <one accept/correct/reject question>
```

For pure framing turns (Purpose / Scope still open), a shorter recommendation-backed question is enough; add a stress scenario once behavior or boundaries are in play.

## Domain and ADR (grill-with-docs style)

- **Challenge glossary conflicts** immediately when the user conflicts with `CONTEXT.md`.
- **Sharpen fuzzy language** by proposing a precise canonical term.
- **Discuss concrete scenarios** when relationships or boundaries are unclear.
- **Cross-reference code** when the user states how something works; surface contradictions.
- **Update `CONTEXT.md` inline** when a term is resolved — do not batch glossary writes.
- **Offer ADRs sparingly** — only when all three are true: hard to reverse; surprising without context; real trade-off with alternatives.

## Same-Turn Forbidden Actions

While Phase A is active, do **not** in the same turn as a grill question: write Spec draft, call `plan`/`implement`/`verify`, or treat silence as approval.

## Anti-patterns

- Splitting Phase A into "coverage survey" then "grill mode".
- Stopping after ledger labels look complete with zero stress rounds on non-trivial work.
- Asking multiple grill questions in one message.
- Asking the user for facts that the repo or docs can answer.
- Asking broad survey questions instead of challenging a concrete recommendation.
