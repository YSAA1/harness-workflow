# Clarification Loop

Use during **Phase A** only. Read this together with `clarification-coverage.md` at the start of every `brainstorm` session.

## Loop

Repeat until the Clarification Gate passes:

1. Read the latest user message, repo evidence, and existing specs or plans.
2. Update the Clarification Coverage matrix.
3. Pick the highest-priority unresolved dimension using the question order below.
4. Ask **exactly one** question about that dimension.
5. Optionally include a recommended answer or 2-3 concrete options to reduce user effort.
6. Stop and wait for the user reply. Do not enter Phase B in the same turn.

One message means one question. Multiple user replies means multiple loop iterations.

## Question Order

Ask in this order, skipping dimensions already `confirmed` or `waived`:

1. Purpose
2. Scope / non-goals
3. Users / callers
4. Behavior / interfaces
5. Constraints
6. Success criteria
7. Verification strategy
8. Capability gaps

If an answer resolves multiple dimensions, update all of them before choosing the next question.

## When To Explore The Repo Instead Of Asking

Prefer repo exploration over asking when the answer is likely already in:

- `AGENTS.md`, README, existing Specs, PRDs, plans, issues
- relevant code, tests, CI config, or verification scripts
- selected recovery surface artifacts

Mark those dimensions `inferred` with the file or command cited, then continue the loop or move to the assumption batch. Do not ask the user to repeat what the repo already states clearly.

## When To Ask The User

Ask when:

- two reasonable interpretations would change scope, behavior, or verification
- success criteria or verification path cannot be derived from repo evidence
- the user stated preference, priority, or tradeoff matters
- a capability gap has no documented fallback

## Same-Turn Forbidden Actions

While Phase A is active, do **not** in the same turn as a clarification question:

- write or update `docs/specs/...`
- compare final chosen approaches as if the Spec were ready
- call `plan`, `implement`, or `verify`
- treat silence, "sounds good", or no objection as Spec approval

## Entering Phase B

Enter Phase B only after:

- Clarification Gate passes
- any assumption batch is confirmed or corrected

Then proceed with `spec-drafting.md`.

## Phase A Anti-patterns

- Asking one question total, then converging.
- Writing a Spec in the first turn or in the same turn as a clarification question.
- Treating repo inference as user confirmation without an assumption batch.
- Treating silence or "sounds good" as Spec approval.
