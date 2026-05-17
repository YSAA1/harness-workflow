# Harness Workflow Teaching Deck

This directory contains the image-first teaching deck for explaining Harness Workflow as specification-driven Agent development.

## Final Artifacts

- Final PPTX: `../harness-workflow-teaching-deck.pptx`
- Source protocol: `deck-protocol.json`
- Protocol review: `deck-protocol.review.md`
- Image generation jobs: `imagegen-jobs.json`
- PNG manifest: `png-manifest.json`
- Assembled slide spec: `assembled-slide-spec.json`
- Deterministic visual QA: `visual-qa.json`
- PPTX QA: `qa-pptx.json`
- Full-slide PNGs: `slides/slide-01.png` through `slides/slide-28.png`

## Deck Intent

This is the revised teaching-oriented version. It is not the older plugin overview deck.

The storyline focuses on:

- moving from chat-driven Agent work to specification-driven engineering;
- explaining Harness as the workbench around the Agent, not a prompt pack;
- teaching the full loop: clarify, Spec, Plan, initialize workbench, act, diagnose, review, verify, cleanup;
- mapping skills to responsibilities only near the end, so the deck does not become a skill catalog.

## Production Route

- Route: `ppt-composer:image-first-ppt`
- Mode: image-first PNG deck
- Page count: 28
- Aspect ratio: 16:9
- Generation strategy: six bounded image workers over page ranges 1-4, 5-9, 10-14, 15-18, 19-23, and 24-28
- Assembly rule: one full-slide PNG per PowerPoint slide; no PowerPoint text overlays

## Verification Evidence

Fresh checks run after final PNG and PPTX generation:

```text
validate-deck-protocol --protocol docs/decks/harness-workflow-teaching-deck/deck-protocol.json --require-generated-png
visual-qa --protocol docs/decks/harness-workflow-teaching-deck/deck-protocol.json --jobs docs/decks/harness-workflow-teaching-deck/imagegen-jobs.json
imagegen-jobs-to-manifest --jobs docs/decks/harness-workflow-teaching-deck/imagegen-jobs.json
assemble-image-ppt --manifest docs/decks/harness-workflow-teaching-deck/png-manifest.json --out docs/decks/harness-workflow-teaching-deck.pptx
qa --pptx docs/decks/harness-workflow-teaching-deck.pptx --spec docs/decks/harness-workflow-teaching-deck/assembled-slide-spec.json
```

Observed QA summary:

- Protocol validation: pass, 28 pages, 13 assets
- Deterministic visual QA: pass, 28 pages, 0 findings, 0 failures, 0 warnings
- PPTX QA: pass, 28 slides, 28 pictures, 0 text shapes, 0 errors
- Expected warning: image-first decks are intentionally low-editability

## Notes

The visible Chinese text is generated inside the PNGs. Deterministic QA validates structure, PNG integrity, dimensions, manifest completeness, and PPTX assembly; image text quality was also spot-checked on key pages.
