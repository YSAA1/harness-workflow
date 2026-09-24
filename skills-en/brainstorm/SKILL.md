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

- **Use**: open-ended intent, unclear criteria or verification, grilling wanted.
- **Lightweight entry**: only when the user's own words/materials already anchor goal, boundaries, and done-criteria (three anchors) and the work fits a single session — say so in the first round with the anchor citations; missing anchors mean the full framework, never a silent "already thought through" verdict, and the user may reroute either way. The four Gate essentials still get the quick assessment (askable in one round or all waived), and the Spec takes the Thin Spec path (the Thin Spec section of `references/spec-drafting.md`); do not default to the full-framework interview just because the entry point is brainstorm.
- **Don't**: Spec already approved; single-point small patch; only a factual answer wanted.
- **Next**: Spec approved → `plan`; workbench gap → (after Spec approval or when the user explicitly says so) `harness-builder`.

## Inputs

Required reading for step 1: `references/clarification-loop.md` + `clarification-coverage.md` + `design-grill.md`; existing Specs/code/`AGENTS.md`; `git status`; user materials.

## Flow

### 1. Frontier grill

No Spec is written before the Gate. This is **one relentless interview**: each round raises all open **frontier** decisions (would change the approach, prerequisites settled, mutually independent) at once as numbered questions, each with a `➡️` recommended answer, and design-sensitive questions attach one concrete stress scenario (branch order in `design-grill.md`). Close factual gaps by checking the repo/docs yourself first; preferences, trade-offs, verification depth, and scope boundaries must not be backfilled as `inferred` — they must enter the frontier. Emptiness criterion: every design branch is either already answered by the user or explicitly waived, or is a repo-provable fact (source recorded) — common-sense defaults, industry conventions, and deferrability do not constitute exemption from asking; the message declaring emptiness must carry a one-line-per-branch Branch Order reconciliation (each branch: answered / waived / repo-proven), and an unreconciled claim does not count. Carry over existing explicit requirements, decisions, and authorizations; set no minimum round count. Details: `clarification-loop.md`.

Done: Grill Gate passed + assumption batch (if any, factual inferences only) + shared understanding covered (a comprehensive brief with drafting authorization, or a single confirmation).

Recovery-surface continuation (only when the project already has `.harness/`): after the first frontier round goes out, register a row for this track in work_index — Status `active`, Primary artifact filled with "(Spec not yet persisted to disk: <intended Spec path>)"; at the end of each grill round, update that row's Last verified cell in passing to "date · settled n/m · open question numbers". After a session break, the new session continues asking from the progress recorded in the row instead of re-asking from scratch; projects without a recovery surface skip this paragraph and stay zero-file.

### 2. Spec

Follow `references/spec-drafting.md`: verification strategy → approach comparison → write Spec → self-review → request approval. No `plan` before approval. In the same action as persisting the Spec to disk, flip this track's work_index row's Primary artifact to the actual Spec path (if it was not registered during the grill phase, backfill the registration now; projects without a recovery surface do not register — after approval, `plan` takes over filing). An unapproved Spec is not an orphan because the row links out to it.

Done: independent Spec path delivered, awaiting approval.

## Hard Rules

- While unresolved preferences/trade-offs exist, the first user-visible message must be the numbered frontier questions; sending only a Coverage scoreboard or an assumption batch in place of questions is forbidden.
- One message, one frontier round; dependent questions are split into later rounds, independent questions go out in the same round.
- Silence ≠ approval; shared understanding is covered by a comprehensive brief and explicit drafting authorization, otherwise ask exactly once — do not repeatedly request the same confirmation.
- Emptiness requires reconciliation: the message declaring the Gate passed / the frontier empty carries the one-line-per-branch Branch Order reconciliation; a self-assessed "already thought through" or a bare Coverage score is not an emptiness claim.

## Output

The single source of the round template lives here: frontier questions lead, every question carries a Design branch line and design-sensitive ones add a one-line stress scenario (pure framing questions may omit both anchor lines), Coverage compressed into one line (the ledger is progress notes, not a deliverable).

```text
BRAINSTORM CLARIFICATION IN PROGRESS
❓ Q1 - <title>: <body; options if useful>
Design branch: <Branch Order branch name>
Stress scenario: <one concrete case; required on design-sensitive items>
➡️ <recommended answer>
❓ Q2 - <title>: <body>
Design branch: <branch>
➡️ <recommended answer>
Coverage: <confirmed+waived>/8; Gate: BLOCKED; Frontier: open
Needs: frontier answers | shared understanding
```

After the Gate passes, switch to (the Branches line is the emptiness reconciliation: waivers and repo-proofs are visible on the spot; repo-proof sources go into the ledger):

```text
BRAINSTORM SPEC READY
Spec: <path>; Gate: PASSED; Frontier: empty
Branches: actors✓ · happy✓ · failure waived · data✓ · ifaces✓ · NFR repo-proof · verify✓ · rejected✓
Needs: approve Spec
Next after approval: plan
```

Chinese users get the same structure; labels may be localized to Chinese, with `❓` / `➡️` and status tokens retained.

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
