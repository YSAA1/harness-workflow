# Grill Loop (Frontier)

Use for `brainstorm` clarification. Read with `clarification-coverage.md` and `design-grill.md` at session start.

This is **one** relentless interview — not a survey then a second grill, and not a named Phase A/B ceremony. Coverage is a **progress ledger**. Question craft lives in `design-grill.md`. Aligns with frontier grilling: design tree → frontier rounds → shared understanding → Spec.

## Roles of the three references

| File | Role |
| --- | --- |
| This file | Frontier loop, priority, and Grill Gate |
| `clarification-coverage.md` | Eight-dimension ledger + assumption batch + turn output shape |
| `design-grill.md` | Question craft: branches, stress scenarios, domain/ADR |

## Unified Loop

Repeat until the Grill Gate passes:

1. Read the latest user message, repo evidence, existing specs/plans, and `CONTEXT.md`.
2. Update the Clarification Coverage ledger (`clarification-coverage.md`).
3. If a gap can be closed by exploring the codebase or docs, explore first (or dispatch a sub-agent) and mark that item `inferred` or `confirmed` with source evidence instead of asking. Do not block the whole round on background lookups — only questions that depend on unsettled facts wait.
4. Recompute the **frontier**: every open decision whose prerequisites are already settled. Do **not** put two questions in the same round if one answer should change the other.
5. For each frontier question, form a working recommendation before asking. Use craft in `design-grill.md`. Design-sensitive items include a concrete stress scenario.
6. Ask the **whole frontier in one message**. Number questions. Prefer this shape per question:

```text
❓ **Q1** - **<title>**: <body; options if useful>

➡️ <recommended answer>
```

7. If a term is resolved, update `CONTEXT.md` inline in the same turn (glossary only). If an ADR is warranted, offer it immediately — do not batch.
8. Stop and wait for the user's answers to the round. Do not draft Spec in the same turn as an open frontier.

One message means one frontier round. Dependent questions belong to later rounds.

Opt-out: if the user asks for one question at a time, ask the frontier sequentially while still tracking the same tree.

## Priority

When choosing which unsettled decisions enter the frontier first, prefer this order. Skipping ahead is allowed only when earlier items are already `confirmed`, `waived`, or solidly `inferred` with evidence.

1. **Purpose** — if `unknown`
2. **Scope / non-goals** — if `unknown`
3. **Design branches** that still block behavior — walk with `design-grill.md` Branch Order
4. **Success criteria** — if still `unknown` after enough behavior is settled
5. **Verification strategy** — if still `unknown`
6. **Capability gaps** — if still `unknown` or unexamined
7. Remaining open design branches (failure/edge, data/state, interfaces, NFR, rejected alternatives)

Do **not** fill Behavior/Constraints as a flat survey and later re-ask the same content as design branches.

## Depth Scaling

| Situation | Depth |
| --- | --- |
| Non-trivial feature, migration, architecture, or multi-session work | Required: ≥2 frontier rounds and ≥1 concrete stress scenario before Spec (unless user waives) |
| User says grill, stress-test, or "再深挖" | Continue until branches resolve or user waives |
| Single-point patch with no design branches | Shallow: ledger can fill quickly; design branches and scenarios may be waived in the assumption batch |

Same loop in all cases — complexity changes depth, not protocol.

## Grill Gate

Clarification is complete only when all of the following are true:

1. Every coverage dimension is `confirmed` or `waived`, or `inferred` with no blocking dimension left `unknown`.
2. Purpose, scope, success criteria, and verification strategy are not `unknown`.
3. For non-trivial work: no blocking design branch left `unknown`; at least two frontier rounds occurred; at least one round used a concrete stress scenario — or the user explicitly waived depth in the assumption batch.
4. Every non-waived design-sensitive answer has a defensible recommendation accepted by the user, corrected by the user, or backed by repo evidence.
5. Any remaining `inferred` items were presented in an assumption batch and the user confirmed or corrected them.
6. No unresolved terminology conflict remains between the emerging Spec and `CONTEXT.md`.
7. No remaining open question could be answered by reading local code or docs.
8. At least one of: the user replied at least once after the initial framing, or the user provided a comprehensive brief with no blocking ambiguity.
9. The **frontier is empty**, and the user has confirmed **shared understanding** (explicit confirm — silence is not approval).
10. The current turn ends by waiting for user input, unless the gate passed and you are presenting the assumption batch, confirming shared understanding, or asking to draft Spec.

## Entering Spec Drafting

Enter Spec drafting only after: Grill Gate passes; assumption batch confirmed (if any `inferred` remain); shared understanding confirmed.

Then proceed with `spec-drafting.md`.

## Anti-patterns

- Running a coverage survey first, then switching into a second "grill mode".
- Treating matrix completion as design completion on non-trivial work.
- One shallow round then converging.
- Asking dependent questions in the same frontier round.
- Dumping an unordered questionnaire with no recommendations.
- Asking the user for facts that the repo or docs can answer.
- Acting or writing Spec before shared understanding is confirmed.
- Naming host products or host-specific CLIs as interview protocol.
