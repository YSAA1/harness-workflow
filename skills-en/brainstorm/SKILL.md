---
name: brainstorm
description: "Converges vague requirements into a user-approved Spec. Triggers: brainstorm, grill, discuss first, spec first (先讨论/grill/先落 Spec) — use when goals/boundaries/trade-offs/success criteria/verification strategy are unsettled, or the user says discuss first / grill / settle a Spec first. Skip when a complete Spec already exists or for a small patch; hand off to plan after approval."
---

# Spec Brainstorming (Frontier Grill)

Converge vague ideas → user-approved **Spec** → `plan`. No production code, no Executable Plan.

Leading words: **frontier** · **design tree** · **shared understanding**

Canonical Spec: `docs/specs/YYYY-MM-DD--<topic>.md` (override only when the user or `AGENTS.md` explicitly names a path). By default, do not write `.harness/`; the sole exception: when the project already has a `.harness/` recovery surface, perform "register on write" (see Flow steps 1–2).

User-visible language follows the user; protocol tokens (`BRAINSTORM …`, `Spec`, `Gate`, paths) may stay in English.

## Routing

- **Use**: open-ended intent, unclear criteria or verification, grilling wanted. Vagueness is not a reason to wait — it is the thing this session eats.
- **Lightweight entry**: only when the user's own words/materials already anchor goal, boundaries, and done-criteria (three anchors) and the work fits a single session — say so in the first round with the anchor citations; missing anchors mean the full framework, never a silent "already thought through" verdict, and the user may reroute either way. The four framing essentials still get the quick assessment (askable in one round or all waived), and the Spec takes the Thin Spec path (the Thin Spec section of `references/spec-drafting.md`); do not default to the full-framework interview just because the entry point is brainstorm.
- **Don't**: Spec already approved; single-point small patch; only a factual answer wanted.
- **Next**: Spec approved → `plan`; workbench gap → (after Spec approval or when the user explicitly says so) `harness-builder`.

## The Grilling Discipline (the full craft lives in this file — no second source)

One relentless interview, until shared understanding. Six mechanisms carry all of it:

1. **Design tree**: map the requirement as a tree of decisions — every decision branches into the decisions that hang off it.
2. **Frontier rounds**: the frontier is every open decision whose prerequisites are already settled — what you can ask now without guessing at answers you haven't heard. **One message asks the whole frontier**: numbered questions, each with a `➡️` recommended answer; bodies may run multiple paragraphs and offer 2–3 concrete options, so the user can answer by number ("1 yes, 2 the second option, 3 no, here's why"). While framing (goal/scope) is unsettled, ask framing first, then design branches.
3. **Branch and stress**: every question carries its `Design branch` (a Branch Order branch name), design-sensitive ones add one concrete stress scenario; pure framing questions may omit both anchor lines. Branch Order: actors/boundaries → happy path → failure/edge → data/state → interfaces → NFR → verification hooks → rejected alternatives.
4. **Facts are the agent's job, decisions are the user's**: facts the environment can settle (code, docs, tools) you look up yourself or dispatch a sub-agent for — **never ask the user**; lookups do not block — a running exploration is an unsettled prerequisite, so only its downstream questions wait while the rest of the frontier goes out now. Preferences, trade-offs, verification depth, and scope boundaries are **decisions**: put each to the user and wait. An agent that answers its own decisions has broken the skill, not interpreted it liberally.
5. **Each round reshapes the tree**: after the user's answers land, recompute the frontier before the next round; when one question's answer would change another, the dependent question belongs to a later round. Discovering a mis-paired round or a missed branch later → reopen the affected branch next round; do not pretend it didn't happen.
6. **Empty means done**: the frontier is empty when every Branch Order branch is answered / explicitly waived / repo-provable (source reachable: the reconciliation line or the Spec), and the four framing essentials (goal/scope/success criteria/verification strategy) are confirmed or waived. **The message declaring emptiness carries the one-line-per-branch reconciliation**; a self-assessed "already thought through" is not an emptiness claim. Common-sense defaults, industry conventions, and deferrability do not exempt a question. No minimum round count; settled decisions are not re-asked. After emptiness, the user must still confirm shared understanding (a comprehensive brief with drafting authorization, or a single confirmation) before Spec drafting; silence ≠ approval.

If the user asks for one question at a time, switch to sequential asking while maintaining the same tree. Challenge terminology conflicts on the spot and propose canonical terms for fuzzy language (update the target project's existing glossary per current task authorization; never auto-create); ADRs are for irreversible architecture decisions only — offer immediately per authorization, do not batch offers.

## Round Output (single source)

```text
BRAINSTORM CLARIFICATION IN PROGRESS
❓ Q1 - <title>: <body; may be multiple paragraphs, options welcome>
Design branch: <Branch Order branch name>
Stress scenario: <one concrete case; required on design-sensitive items>
➡️ <recommended answer>
---
❓ Q2 - <title>: <body>
Design branch: <branch>
➡️ <recommended answer>
Framing: <confirmed+waived>/4; Gate: BLOCKED; Frontier: open
Needs: frontier answers | shared understanding
```

After the Gate passes, switch to (the Branches line is the emptiness reconciliation: waivers and repo-proofs are visible on the spot, sources given on the line or in the Spec):

```text
BRAINSTORM SPEC READY
Spec: <path>; Gate: PASSED; Frontier: empty
Branches: actors✓ · happy✓ · failure waived · data✓ · ifaces✓ · NFR repo-proof · verify✓ · rejected✓
Needs: approve Spec
Next after approval: plan
```

If factual inferences remain before emptiness, present them once as an assumption batch (each with a source) and fold them in after confirmation; preferences and trade-offs never enter the batch.

## Flow

### 1. Frontier grill

Run the Grilling Discipline until emptiness + confirmed shared understanding. Before starting, read: existing Specs/code/`AGENTS.md`, `git status`, user materials.

Recovery-surface continuation (only when the project already has `.harness/`): after the first frontier round goes out, register a row for this track in work_index — Status `active`, Primary artifact filled with "(Spec not yet persisted to disk: <intended Spec path>)"; at the end of each grill round, update that row's Last verified cell in passing to "date · settled n/m · open question numbers". After a session break, the new session continues asking from the progress recorded in the row instead of re-asking from scratch; projects without a recovery surface skip this paragraph and stay zero-file.

### 2. Spec

Follow `references/spec-drafting.md`: verification strategy → approach comparison → write Spec → self-review → request approval. No `plan` before approval. In the same action as persisting the Spec to disk, flip this track's work_index row's Primary artifact to the actual Spec path (if it was not registered during the grill phase, backfill the registration now; projects without a recovery surface do not register — after approval, `plan` takes over filing). An unapproved Spec is not an orphan because the row links out to it.

Done: independent Spec path delivered, awaiting approval.

## Hard Rules

- While unresolved preferences/trade-offs exist, the first user-visible message must be the numbered frontier questions; sending only a score line or an assumption batch in place of questions is forbidden.
- One message, one frontier round; dependent questions are split into later rounds, independent questions go out in the same round.
- Silence ≠ approval; shared understanding is covered by a comprehensive brief and explicit drafting authorization, otherwise ask exactly once — do not repeatedly request the same confirmation.
- Emptiness requires reconciliation: the message declaring the Gate passed / the frontier empty carries the one-line-per-branch Branch Order reconciliation; a self-assessed "already thought through" or a bare score line is not an emptiness claim.

## Acceptance

- [ ] Gate passed; purpose/scope/success/verification are confirmed or waived, never passing the gate as inferred
- [ ] The emptiness declaration carries the one-line-per-branch reconciliation (answered / waived / repo-proven); self-assessment does not replace it
- [ ] While unresolved trade-offs exist, Frontier is open and this round carries numbered questions
- [ ] Shared understanding covered; Spec submitted for approval
- [ ] Projects with a recovery surface: this track's work_index row points to the Spec when it is persisted to disk (waived if the project truly has no recovery surface)

## Read on demand

- From step 2: `references/spec-drafting.md` · `spec-review-checklist.md` · `templates/spec.md`
- In this text, `CONTEXT.md` refers to the domain glossary at the target project root (if present), not a plugin-package file; locate the actual terminology source via the project's `AGENTS.md` first — do not force-create it if absent.

## Recommended next skill

| Situation | Next |
| --- | --- |
| Spec approved | `plan` |
| Spec rejected / discussion abandoned (including grill aborted) | In the same commit, flip the row out of active to `abandoned` and run the four retirement steps (delete the unapproved Spec; nothing to delete when there is no recovery surface or the grill was aborted) → end |
| Workbench gap (after Spec approval or when the user explicitly says so) | `harness-builder` |
