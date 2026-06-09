# Harness Builder Recommendation Metric Pack

This plugin-eval metric pack evaluates the `harness-builder` skill as a
recommendation-quality artifact. It does not score product implementation
ability and does not override plugin-eval's core score.

## Scope

- V0: deterministic static checks over `SKILL.md` and the recommendation
  references.
- P1: deterministic scenario coverage fixtures under `scenarios/`.
- Output: `checks[]`, `metrics[]`, and one evidence-map artifact.

## Usage

```bash
node evals/plugin-eval/metric-packs/harness-builder-recommendation/emit-harness-builder-recommendation.mjs \
  skills/harness-builder skill

node /home/ssy/.codex/plugins/cache/openai-curated/plugin-eval/c3319989/scripts/plugin-eval.js \
  analyze skills/harness-builder \
  --metric-pack evals/plugin-eval/metric-packs/harness-builder-recommendation/manifest.json \
  --format json
```

The pack intentionally keeps IDs stable. Add new checks in later versions
instead of renaming existing IDs.
