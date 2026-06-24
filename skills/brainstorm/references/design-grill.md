# Design Grill

Use during **Phase A2** of `brainstorm`, after the Clarification Coverage Gate passes (or when the user explicitly asks to grill / stress-test / `/grill-with-docs`).

Phase A1 fills coverage dimensions. Phase A2 is the **relentless interview**: walk the design tree, resolve dependencies between decisions one branch at a time, stress-test with concrete scenarios, sharpen domain language, and capture durable glossary or ADR material as it crystallises.

Read this together with `clarification-coverage.md` and `clarification-loop.md`. For glossary and ADR discipline, follow the same rules as domain modeling: challenge terms, update `CONTEXT.md` inline, offer ADRs only when all three ADR criteria are met.

## When To Run

| Situation | Phase A2 |
| --- | --- |
| Non-trivial feature, migration, architecture, or multi-session work | **Required** — at least two grill rounds before Phase B |
| User says grill, stress-test, `/grill-with-docs`, or "再深挖" | **Required** — continue until user waives or branches resolve |
| Single-point patch with no design branches | **Waivable** — user may waive in assumption batch |
| Coverage Gate still BLOCKED | **Forbidden** — finish Phase A1 first |

## Loop

Repeat until the Design Grill Gate passes:

1. Read latest user reply, coverage matrix, repo evidence, and `CONTEXT.md`.
2. If a question can be answered by exploring the codebase or docs, explore first and mark that branch `inferred` or `resolved` with source evidence instead of asking the user.
3. Pick the highest-priority unresolved **design branch** (not coverage dimension), preferring the branch that blocks the most downstream decisions.
4. Form a working recommendation before asking. Do not ask "what do you want?" when you can propose a defensible default.
5. Ask **exactly one** question that forces the user to accept, correct, or reject that recommendation. Include the recommended answer or 2–3 concrete options.
6. Include a **concrete stress scenario** unless the branch is pure terminology. The scenario should probe an edge case, failure mode, migration path, compatibility boundary, or user-visible trade-off.
7. If a term is resolved, update `CONTEXT.md` inline in the same turn (glossary only — no implementation detail).
8. If an ADR is warranted (hard to reverse, surprising without context, real trade-off), offer to create it under `docs/adr/` — do not batch ADR offers.
9. Stop and wait for the user reply. Do not enter Phase B in the same turn.

One message means one question. Multiple user replies means multiple grill iterations.

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

## Design Grill Gate

Phase A2 is complete only when all of the following are true:

1. Every tracked branch is `resolved`, `waived`, or `inferred` with no blocking branch left `unknown`.
2. At least two grill rounds occurred for non-trivial work, or the user explicitly waived Phase A2 in the assumption batch.
3. At least one non-trivial round tested a concrete stress scenario, or the user explicitly waived scenario grilling.
4. Every non-waived branch has a defensible recommendation accepted by the user, corrected by the user, or backed by repo evidence. Coverage labels alone do not count.
5. Any remaining `inferred` branches were presented in the assumption batch and the user confirmed or corrected them.
6. No unresolved terminology conflict remains between the emerging Spec and `CONTEXT.md`.
7. No remaining open question could be answered by reading local code or docs.
8. The current turn ends by waiting for user input, unless the gate passed and you are presenting the assumption batch or asking to enter Phase B.

## Question Shape

Prefer this shape for each Phase A2 turn:

```text
Design branch: <branch>
Working recommendation: <what I think we should do, based on the current evidence>
Stress scenario: <one concrete case that could break or distort the design>
Question: <one accept/correct/reject question>
```

## Same-Turn Forbidden Actions

While Phase A2 is active, do **not** in the same turn as a grill question: write Spec draft, call `plan`/`implement`/`verify`, or treat silence as approval.

## Phase A2 Anti-patterns

- Stopping after Coverage Gate with zero grill rounds on non-trivial work.
- Asking multiple grill questions in one message.
- Treating matrix completion as design completion.
- Asking the user for facts that the repo or docs can answer.
- Asking broad survey questions instead of challenging a concrete recommendation.
