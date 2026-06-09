# Harness Builder Plugin Eval Metric Pack

This repo keeps a project-local plugin-eval metric pack for the
`harness-builder` skill at:

```text
evals/plugin-eval/metric-packs/harness-builder-recommendation/
```

The pack measures recommendation/install quality only. It does not evaluate
product feature implementation and does not override plugin-eval's core score.

## What It Checks

- V0 static checks: scope boundary, read-only recommendation phase, repo-signal
  binding, top-k discipline, install surface, approval boundary, fallback, and
  verification probe.
- P1 scenarios: deterministic fixtures that protect against product-task scope
  leaks, vague recommendations, speculative installs, approval mistakes, and
  brownfield duplication.

## Run

```bash
node scripts/check-plugin-eval-metric-pack.mjs

node /home/ssy/.codex/plugins/cache/openai-curated/plugin-eval/c3319989/scripts/plugin-eval.js \
  analyze skills/harness-builder \
  --metric-pack evals/plugin-eval/metric-packs/harness-builder-recommendation/manifest.json \
  --format json
```

`plugin-eval` stores this pack under `extensions[]`; the core score and summary
remain owned by plugin-eval.
