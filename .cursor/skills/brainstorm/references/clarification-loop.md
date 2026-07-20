# Grill Loop (Phase A)

Use during **Phase A** only. Read this together with `clarification-coverage.md` and `design-grill.md` at the start of every `brainstorm` session.

Phase A is **one** relentless interview — not a survey then a second grill. Coverage is a **progress ledger**; grill craft (recommendation, stress scenario, domain/ADR) is how every turn asks. Inspired by `/grill-with-docs`: sharpen the design in one session; write glossary/ADR as decisions crystallise.

## Roles of the three references

| File | Role |
| --- | --- |
| This file | Single Phase A loop, priority, and Phase A Gate |
| `clarification-coverage.md` | Eight-dimension ledger + assumption batch + turn output shape |
| `design-grill.md` | Question craft: branches, stress scenarios, domain/ADR — not a sub-phase |

## Unified Loop

Repeat until the Phase A Gate passes:

1. Read the latest user message, repo evidence, existing specs/plans, and `CONTEXT.md`.
2. Update the Clarification Coverage ledger (`clarification-coverage.md`).
3. If a gap can be closed by exploring the codebase or docs, explore first and mark that item `inferred` or `confirmed` with source evidence instead of asking.
4. Pick the highest-priority open work using **Priority** below (framing gaps and design branches share one queue).
5. Form a working recommendation before asking. Do not ask "what do you want?" when you can propose a defensible default. Use the question craft in `design-grill.md`.
6. Ask **exactly one** accept/correct/reject question. When the topic is design-sensitive, include one concrete stress scenario.
7. If a term is resolved, update `CONTEXT.md` inline in the same turn (glossary only). If an ADR is warranted, offer it immediately — do not batch.
8. Stop and wait for the user reply. Do not enter Phase B in the same turn as a grill question.

One message means one question. Multiple user replies means multiple grill iterations.

## Priority

Pick the first unmet item in this order. Skipping ahead is allowed only when earlier items are already `confirmed`, `waived`, or solidly `inferred` with evidence.

1. **Purpose** (ledger) — if `unknown`
2. **Scope / non-goals** (ledger) — if `unknown`
3. **Design branches** that still block behavior — walk with `design-grill.md` Branch Order; each answer should also advance ledger dimensions (Users, Behavior, Constraints, etc.)
4. **Success criteria** (ledger) — if still `unknown` after enough behavior is settled
5. **Verification strategy** (ledger) — if still `unknown`
6. **Capability gaps** (ledger) — if still `unknown` or unexamined
7. Remaining open design branches (failure/edge, data/state, interfaces, NFR, rejected alternatives)

Do **not** fill Behavior/Constraints as a flat survey and later re-ask the same content as design branches. One settled design branch should update the matching ledger rows in the same turn.

## Depth Scaling

| Situation | Depth |
| --- | --- |
| Non-trivial feature, migration, architecture, or multi-session work | Required: ≥2 grill rounds and ≥1 concrete stress scenario before Phase B (unless user waives) |
| User says grill, stress-test, `/grill-with-docs`, or "再深挖" | Continue until branches resolve or user waives |
| Single-point patch with no design branches | Shallow: ledger can fill quickly; design branches and scenarios may be waived in the assumption batch |

Same loop in all cases — complexity changes depth, not protocol.

## Phase A Gate

Phase A is complete only when all of the following are true:

1. Every coverage dimension is `confirmed` or `waived`, or `inferred` with no blocking dimension left `unknown`.
2. Purpose, scope, success criteria, and verification strategy are not `unknown`.
3. For non-trivial work: no blocking design branch left `unknown`; at least two grill rounds occurred; at least one round used a concrete stress scenario — or the user explicitly waived depth in the assumption batch.
4. Every non-waived design-sensitive answer has a defensible recommendation accepted by the user, corrected by the user, or backed by repo evidence. Coverage labels alone do not count as design completion.
5. Any remaining `inferred` items were presented in an assumption batch and the user confirmed or corrected them.
6. No unresolved terminology conflict remains between the emerging Spec and `CONTEXT.md`.
7. No remaining open question could be answered by reading local code or docs.
8. At least one of: the user replied at least once after the initial framing, or the user provided a comprehensive brief with no blocking ambiguity.
9. The current turn ends by waiting for user input, unless the gate passed and you are presenting the assumption batch or asking to enter Phase B.

## Entering Phase B

Enter Phase B only after: Phase A Gate passes; assumption batch confirmed (if any `inferred` remain).

Then proceed with `spec-drafting.md`.

## Phase A Anti-patterns

- Running a coverage survey first, then switching into a second "grill mode".
- Treating matrix completion as design completion on non-trivial work.
- One question total then converging.
- Multiple questions in one message.
- Asking the user for facts that the repo or docs can answer.
- Asking broad survey questions instead of challenging a concrete recommendation when the topic is design-sensitive.
