---
name: brainstorm
description: "Approach brainstorming: grill a vague requirement into a settled approach, then a user-approved Spec. Takes a depth gear (low = few questions, fast out / medium = the daily default / high = research-grade deep grilling for bottlenecks and innovative design). Triggers: brainstorm, grill, discuss first, spec first (先讨论/grill/先落 Spec) — use when approach/goals/boundaries/trade-offs/success criteria/verification strategy are unsettled. Skip when a complete Spec already exists or for a small patch; hand off to plan after approval."
---

# Approach Brainstorming (Frontier Grill)

The subject of the brainstorm is the **approach**: open the approach space in conversation, settle it round by round, then write the **Spec** that records the outcome → `plan`. No production code, no Executable Plan.

Leading words: **frontier** · **design tree** · **shared understanding**

Canonical Spec: `docs/specs/YYYY-MM-DD--<topic>.md` (override only when the user or `AGENTS.md` explicitly names a path). By default, do not write `.harness/`; the sole exception: when the project already has a `.harness/` recovery surface, perform "register on write" (see Flow steps 1–2).

User-visible language follows the user; protocol tokens (`BRAINSTORM …`, `Spec`, `Gate`, paths) may stay in English.

## Routing

- **Use**: open-ended intent, unsettled approach, grilling wanted. Vagueness is not a reason to wait — it is the thing this session eats.
- **Don't**: Spec already approved; single-point small patch; only a factual answer wanted.
- **Next**: Spec approved → `plan`; workbench gap → (after Spec approval or when the user explicitly says so) `harness-builder`.

## Gears

The depth dial belongs to the user; the agent never sets it silently:

- **Invocation**: `brainstorm <topic>` may carry a gear (low/medium/high; natural language works too: "low gear / fewer questions", "high gear / dig deeper / research-grade / I'm stuck on a bottleneck"). Unspecified means **medium**; the first round's banner states the gear; the user retunes with one word at any time, and the gear follows the user's exact words.
- **Inference (must be stated, and vetoable)**: infer low only when the user's own words anchor goal + boundaries and it is clearly a small matter; infer high only when the user explicitly says bottleneck/innovation/research; everything else is medium.
- Gears change only the **question-surface width and grilling intensity**; rounds always follow the frontier — no round quotas (no minimum round count, settled decisions are not re-asked).

| Gear | Fits | Approach space | Grilling intensity | Spec |
| --- | --- | --- | --- | --- |
| Low | short needs with anchors present, minimal interruption wanted | one recommended approach + 1 alternative, confirmed in the same round | waivable branches waived wholesale; stress scenarios may be waived | Thin Spec |
| Medium (default) | everyday approach settling | 2–3 concrete approaches that **differ structurally** (mechanism/boundaries/data shape — three tweaked variants are wallpaper, not approaches), each with trade-offs + failure modes + a `➡️` recommendation; when only one path is obvious, the question degrades to a confirmation and the one alternative considered is recorded | design-sensitive questions must carry a stress scenario (good enough to trigger "wait, that shouldn't be possible") | standard Spec |
| High | research-grade innovation, hitting a bottleneck | 3+ candidates including at least one non-obvious/cross-domain one; candidate material researched first (sub-agents in parallel); each candidate carries an inversion lens (under what conditions it would win instead); rejected candidates must carry their failure reasons | key approaches each get a counter-example scenario; four actions below | standard Spec, rejected alternatives mandatory |

**The four high-gear actions**:

1. **Frame the bottleneck** (first frontier round): destination first — what does "through the wall" look like (it shapes every later question); where exactly it is stuck, what has been tried, why each attempt died; which constraints bind (what cannot move); draw the scope line up front (out of scope, written down).
2. **Breadth-first fog sweep**: sweep the whole approach space and record the **fog** — decisions you can tell are coming but cannot yet phrase sharply (the test: can the question be stated sharply *now*, not whether it can be answered); every step of frontier advance graduates patches of fog into fresh questions. **No fog found = high gear not needed**: tell the user and drop to medium.
3. **Upgrade the approach space**: at least one non-obvious/cross-domain candidate; candidate material researched first (facts are the agent's job; research does not block); each candidate carries the inversion lens ("under what conditions would this one win instead"); **rejected candidates must carry their failure reasons** — no silent elimination.
4. **Minimum-verdict escape hatch**: when an approach debate cannot be settled by talking (the answer needs something to look at) → build a throwaway spike/wireframe/single-file demo to decide it — it answers that one question only, is discarded after looking, its one-line answer goes back into the frontier, and the prototype never enters the mainline.

**Low-gear semantics**: fewer questions, but still confirmed — after questions go out, each still waits for the user to confirm or amend; in every gear, silence ≠ approval.

## The Grilling Discipline (the full craft lives in this file — no second source)

One relentless interview, until shared understanding. Eight mechanisms carry all of it:

1. **Design tree, approaches on top**: map the requirement as a tree of decisions whose **top-tier forks are the candidate approaches** — the main arena of the brainstorm. Framing (goal/scope) is asked only until it is "sharp enough to choose an approach", not until all essentials are green; **done-criteria and verification strategy sit downstream of the chosen approach — while the approach is undecided, they are not asked** (the dependent-question rule).
2. **Frontier rounds**: the frontier is every open decision whose prerequisites are already settled. **One message asks the whole frontier**: numbered questions, each with a `➡️` recommended answer; bodies may run multiple paragraphs and offer 2–3 concrete options, so the user can answer by number ("1 yes, 2 the second option, 3 no, here's why"); questions are separated by `---`; dependent questions belong to later rounds.
3. **Branch and stress**: every question carries its `Design branch` (a Branch Order branch name), design-sensitive ones add one concrete stress scenario; pure framing questions may omit both anchor lines. Branch Order: **approach space (candidates + trade-offs + rejection record)** → actors/boundaries → happy path → failure/edge → data/state → interfaces → NFR → verification hooks.
4. **Facts are the agent's job, decisions are the user's**: facts the environment can settle (code, docs, tools) you look up yourself or dispatch a sub-agent for — **never ask the user**; lookups do not block — a running exploration is an unsettled prerequisite, so only its downstream questions wait. Preferences, trade-offs, verification depth, and scope boundaries are **decisions**: put each to the user and wait. An agent that answers its own decisions has broken the skill, not interpreted it liberally.
5. **Each round reshapes the tree**: after the user's answers land, recompute the frontier before the next round; discovering a mis-paired round or a missed branch later → reopen the affected branch next round; do not pretend it didn't happen.
6. **The ungrillable escape hatch**: recognize the questions that "need something to look at" (shape, feel, one page or three) — stop grilling and take the minimum-verdict escape hatch (available in every gear, default in high); "I don't know" is a real answer — when the user cannot answer, prototype rather than guess. Grinding on an ungrillable question is where sessions balloon.
7. **Paper trail**: challenge terminology conflicts on the spot ("your glossary defines X as A; what you just said sounds like B"); sharpen fuzzy words into canonical terms ("is this 'account' the Customer or the User?"); a resolved term lands in the target project's existing glossary **in the round it resolves** (never batched, never auto-created); an ADR is offered only when all three gates pass (hard to reverse + surprising without context + a real trade-off) — a session with zero ADRs is working as designed.
8. **Empty means done**: the frontier is empty when every Branch Order branch is answered / explicitly waived / repo-provable (high gear adds the rejected candidates' failure reasons), and the four framing essentials (goal → scope → **approach** → success criteria → verification strategy, in this dependency order) are confirmed or waived. **The message declaring emptiness carries the one-line-per-branch reconciliation**; a self-assessed "already thought through" is not an emptiness claim. Common-sense defaults, industry conventions, and deferrability do not exempt a question. After emptiness, the user must still confirm shared understanding (a comprehensive brief with drafting authorization, or a single confirmation) before Spec drafting.

If the user asks for one question at a time, switch to sequential asking while maintaining the same tree.

**Session health check** (run before closing): the user rejected at least one recommendation; at least one question surfaced a decision the user had been making implicitly; at the end the user could defend every choice to someone who wasn't there — if all three are missing, the interview produced nothing, so ask more before closing. Questions getting worse as the session runs (the dumb zone) = the surface is too large: suggest splitting into multiple tracks before grilling on.

## Round Output (single source)

```text
BRAINSTORM CLARIFICATION IN PROGRESS · Gear: L/M/H
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

After the Gate passes, switch to (the Branches line is the emptiness reconciliation; high gear puts rejection reasons inside the approach branch; repo-proof sources given on the line or in the Spec):

```text
BRAINSTORM SPEC READY
Spec: <path>; Gear: M; Gate: PASSED; Frontier: empty
Branches: approach✓(A chosen; B rejected:<reason>) · actors✓ · happy✓ · failure waived · data✓ · ifaces✓ · NFR repo-proof · verify✓
Needs: approve Spec
Next after approval: plan
```

If factual inferences remain before emptiness, present them once as an assumption batch (each with a source) and fold them in after confirmation; preferences and trade-offs never enter the batch.

## Flow

### 1. Approach grill

Run the Grilling Discipline: gear first (stated/confirmed) → approach space settled in conversation → branch detail → emptiness reconciliation → confirmed shared understanding. Before starting, read: existing Specs/code/`AGENTS.md`, `git status`, user materials.

Recovery-surface continuation (only when the project already has `.harness/`): after the first frontier round goes out, register a row for this track in work_index — Status `active`, Primary artifact filled with "(Spec not yet persisted to disk: <intended Spec path>)"; at the end of each grill round, update that row's Last verified cell in passing to "date · settled n/m · open question numbers". After a session break, the new session continues asking from the progress recorded in the row instead of re-asking from scratch; projects without a recovery surface skip this paragraph and stay zero-file.

### 2. Spec

Follow `references/spec-drafting.md`: verification strategy → **record the approach comparison settled in the grill** → write Spec → self-review → request approval. No `plan` before approval. In the same action as persisting the Spec to disk, flip this track's work_index row's Primary artifact to the actual Spec path (if it was not registered during the grill phase, backfill the registration now; projects without a recovery surface do not register — after approval, `plan` takes over filing). An unapproved Spec is not an orphan because the row links out to it.

Done: independent Spec path delivered, awaiting approval.

## Hard Rules

- While unresolved preferences/trade-offs exist, the first user-visible message must be the numbered frontier questions; sending only a score line or an assumption batch in place of questions is forbidden.
- **The approach is settled in conversation**: the Spec only records the grill's settled approaches and rejection reasons — it never makes choices the user was never asked.
- One message, one frontier round; dependent questions are split into later rounds, independent questions go out in the same round.
- Silence ≠ approval (in every gear); shared understanding is covered by a comprehensive brief and explicit drafting authorization, otherwise ask exactly once — do not repeatedly request the same confirmation.
- Emptiness requires reconciliation: the message declaring the Gate passed / the frontier empty carries the one-line-per-branch Branch Order reconciliation; a self-assessed "already thought through" or a bare score line is not an emptiness claim.

## Acceptance

- [ ] Gear stated in the first round; retuning follows the user's exact words
- [ ] Approach space settled in conversation (medium/high gears carry structurally different candidates); the Spec only records the outcome
- [ ] Gate passed; the four essentials confirmed or waived, never as inferred (order: goal → scope → approach → success criteria → verification strategy)
- [ ] The emptiness declaration carries the one-line-per-branch reconciliation (high gear includes rejection reasons)
- [ ] Session health check run (zero rejections and zero implicit decisions surfaced → ask more before closing)
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
