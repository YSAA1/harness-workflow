# Harness Workflow Teaching Deck Executable Plan

Date: 2026-05-17
Planning surface: docs plan
Spec source: `docs/specs/2026-05-17--harness-workflow-teaching-deck.md`

## Objective

Create a new teaching-oriented PPT deck that explains the Harness Engineering ideas behind Harness Workflow as a specification-driven Agent development method.

The deck must teach readers who already know Agent coding tools how to move from chat-driven work to specification-driven engineering:

```text
clarify -> spec -> plan -> initialize workbench -> act -> diagnose -> review -> verify -> cleanup
```

The deck should be 25+ pages, Chinese-first, content-dense, and styled as a restrained cyberpunk engineering console. It must not become a skill catalog, plugin marketing deck, or visible `C1-C10` course-marker explanation.

## Active Slice

Produce the new image-first deck protocol and protocol review for `harness-workflow-teaching-deck`, then stop for user confirmation before image generation.

## Non-goals

- Do not overwrite the existing `docs/decks/harness-workflow-overview.pptx` unless the user explicitly asks.
- Do not reuse the old deck structure that foregrounds skill names or `C1-C10`.
- Do not generate PNGs or assemble PPTX before the user confirms the new protocol.
- Do not modify workflow skill behavior, plugin manifests, install docs, or generated `docs/skill-flow-review/*.html`.
- Do not touch the untracked Office lock file `docs/decks/~$harness-workflow-overview.pptx`.

## Success Criteria

- A new plan exists that can be resumed without chat history.
- The first implementation slice is unambiguous: create `deck-protocol.json` and `deck-protocol.review.md` for the new teaching deck.
- The planned deck has at least 25 pages and follows the approved teaching storyline.
- The visible deck outline avoids `C1-C10` as chapter labels or course symbols.
- Verification includes protocol validation, visual QA, PPTX QA, content negative checks, and `node scripts/check-plugin.mjs`.
- Commit units are clear and Chinese.

## Verification Path

For this planning slice:

1. Confirm the plan references the approved Spec.
2. Run `node scripts/check-plugin.mjs`.
3. Check `git status --short`; ignore the unrelated Office temp lock file if still present.
4. Commit this plan with a Chinese commit message.

For the later PPT implementation:

1. `validate-deck-protocol --protocol docs/decks/harness-workflow-teaching-deck/deck-protocol.json`
2. Generate `deck-protocol.review.md` and wait for explicit user protocol confirmation.
3. After confirmation, create `imagegen-jobs.json`; because page count is 25+, use bounded imagegen workers.
4. Backfill real PNGs only; no prompt-only, SVG, HTML, deterministic placeholder, or PPT text overlay.
5. Run deterministic `visual-qa`.
6. Create `png-manifest.json`.
7. Assemble `docs/decks/harness-workflow-teaching-deck.pptx`.
8. Run final PPTX QA and confirm 25+ slides, one picture per slide, zero text overlays.
9. Run content negative checks:
   - final protocol / review / visible slide plan should not use `C1-C10` as visible chapter symbols;
   - deck should not be organized as a skill-by-skill reference;
   - deck must include the teaching line: chat-driven limits, specification-driven development, Harness as workbench, Spec, Plan, initialization, action, diagnosis, review, verification, cleanup.
10. Run `node scripts/check-plugin.mjs`.

## Work Items

1. **NEXT: Draft new deck protocol**
   - Create `docs/decks/harness-workflow-teaching-deck/deck-protocol.json`.
   - Use the approved 28-page teaching outline as the content backbone.
   - Set deck title around specification-driven Agent development, not plugin overview.
   - Use restrained cyberpunk console style: dark engineering interface, cyan/green/blue-violet accents, readable diagrams, no decorative noise.
   - Verification: protocol validates with 25+ pages and includes evidence bindings to Spec and repo method docs.

2. **Protocol review gate**
   - Generate `docs/decks/harness-workflow-teaching-deck/deck-protocol.review.md`.
   - Present page-by-page claims, style, evidence bindings, output filenames, and negative constraints.
   - Stop until the user explicitly confirms the protocol.
   - Verification: review artifact exists and `validate-deck-protocol` passes.

3. **Image generation after confirmation**
   - Create `imagegen-jobs.json`.
   - Dispatch bounded imagegen workers by page range.
   - Require workers to save real full-slide PNGs under `docs/decks/harness-workflow-teaching-deck/slides/`.
   - Verification: every page is backfilled as generated, PNG magic bytes pass, no tiny/placeholder outputs.

4. **Manifest and assembly**
   - Run `visual-qa`.
   - Create `png-manifest.json`.
   - Assemble `docs/decks/harness-workflow-teaching-deck.pptx`.
   - Verification: final QA reports 25+ slides, one image per slide, zero PowerPoint text overlays, zero errors.

5. **Content review and regeneration loop**
   - Inspect whether the deck teaches the approved concept flow rather than listing skills.
   - Check for unwanted visible `C1-C10` course markers.
   - Check readability of generated Chinese text.
   - If material pages fail, patch protocol or regenerate affected pages only.
   - Verification: residual issues are either fixed or explicitly recorded.

6. **Cleanup and commit**
   - Add `docs/decks/harness-workflow-teaching-deck/README.md` with final artifact map and evidence.
   - Run final project checks.
   - Commit final artifacts in Chinese.
   - Verification: `git status --short` contains only intended changes, plus any unrelated Office lock file left untouched.

## Commit Units

- `规划 workflow 教学课件制作` for this executable plan.
- `确定 workflow 教学课件 protocol` for the protocol and protocol review after drafting.
- `生成 workflow 教学课件图片` for generated slide PNGs and imagegen jobs.
- `组装 workflow 教学课件 PPT` for PPTX, manifest, QA, README, and final evidence.
- If regeneration is needed: `修订 workflow 教学课件页面` for targeted page fixes.

## Known Risks / Blockers

- **Chinese text quality in generated images:** imagegen may produce unclear Chinese. Mitigation: use fewer, larger visible text blocks per page; inspect pages; regenerate bad pages.
- **Cyberpunk style overpowering teaching:** keep the style as engineering console UI, not neon poster art.
- **Deck drifting into skill reference:** keep skill names as responsibility mapping near the end, not the main chapter structure.
- **Image-first low editability:** expected by route; preserve protocol, jobs, PNGs, and QA artifacts as source of truth.
- **Large deck generation cost/time:** use worker ranges and commit in milestones.
- **Existing Office lock file:** leave `docs/decks/~$harness-workflow-overview.pptx` alone unless the user closes PowerPoint and explicitly asks for cleanup.

## Handoff

Recommended next skill: `implement`.

Reason: the Spec is approved and this plan defines a single next slice: draft and validate the new deck protocol, then wait for user protocol confirmation.
