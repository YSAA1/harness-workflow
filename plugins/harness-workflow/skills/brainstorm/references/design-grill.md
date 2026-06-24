# Design Grill

Use during **Phase A2** of `brainstorm`, after the Clarification Coverage Gate passes (or when the user explicitly asks to grill / stress-test / `/grill-with-docs`).

Phase A1 fills coverage dimensions. Phase A2 walks the **design tree**: resolve dependencies between decisions one branch at a time, stress-test with concrete scenarios, sharpen domain language, and capture durable glossary or ADR material as it crystallises.

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
2. Pick the highest-priority unresolved **design branch** (not coverage dimension).
3. Ask **exactly one** question about that branch. Include a recommended answer or 2–3 concrete options when helpful.
4. Optionally invent a **concrete scenario** that probes an edge case or boundary between concepts.
5. If a term is resolved, update `CONTEXT.md` inline in the same turn (glossary only — no implementation detail).
6. If an ADR is warranted (hard to reverse, surprising without context, real trade-off), offer to create it under `docs/adr/` — do not batch ADR offers.
7. Stop and wait for the user reply. Do not enter Phase B in the same turn.

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
3. Any remaining `inferred` branches were presented in the assumption batch and the user confirmed or corrected them.
4. No unresolved terminology conflict remains between the emerging Spec and `CONTEXT.md`.
5. The current turn ends by waiting for user input, unless the gate passed and you are presenting the assumption batch or asking to enter Phase B.

## Same-Turn Forbidden Actions

While Phase A2 is active, do **not** in the same turn as a grill question: write Spec draft, call `plan`/`implement`/`verify`, or treat silence as approval.

## Phase A2 Anti-patterns

- Stopping after Coverage Gate with zero grill rounds on non-trivial work.
- Asking multiple grill questions in one message.
- Treating matrix completion as design completion.
