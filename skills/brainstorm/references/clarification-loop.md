# Clarification Loop

Use during **Phase A** only. Read this together with `clarification-coverage.md` and `design-grill.md` at the start of every `brainstorm` session.

Phase A has two sub-phases:

- **Phase A1 — Coverage Matrix** (`clarification-coverage.md`): fill the eight coverage dimensions.
- **Phase A2 — Design Grill** (`design-grill.md`): walk the design tree after A1 gate passes. **Mandatory for non-trivial work.**

## Phase A1 Loop

Repeat until the Clarification Gate passes:

1. Read the latest user message, repo evidence, and existing specs or plans.
2. Update the Clarification Coverage matrix.
3. Pick the highest-priority unresolved dimension using the question order below.
4. Ask **exactly one** question about that dimension.
5. Optionally include a recommended answer or 2-3 concrete options to reduce user effort.
6. Stop and wait for the user reply. Do not enter Phase B in the same turn.

## Question Order

1. Purpose → 2. Scope / non-goals → 3. Users / callers → 4. Behavior → 5. Constraints → 6. Success criteria → 7. Verification strategy → 8. Capability gaps

## Entering Phase A2

After Clarification Gate passes and assumption batch is confirmed, start Design Grill unless Phase A2 was explicitly waived for a trivial slice.

## Entering Phase B

Enter Phase B only after: Clarification Gate passes; Design Grill Gate passes or Phase A2 waived; assumption batch confirmed.

Then proceed with `spec-drafting.md`.

## Phase A Anti-patterns

- Skipping Phase A2 on non-trivial work because the matrix is complete.
- One question total then converging.
- Multiple questions in one message.
