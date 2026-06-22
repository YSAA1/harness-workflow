# Harness Builder Plugin Eval Metric Pack

This repo keeps a project-local plugin-eval metric pack for the
`harness-builder` skill at:

```text
evals/plugin-eval/metric-packs/harness-builder-recommendation/
```

The directory name is historical. The pack now measures `harness-builder` as a
project-level workbench designer: project entry, recovery surface,
verification entry, capability fit, anti-entropy, architecture enforcement,
subagent policy, Research Route, language/output protocol, and install
approval boundaries. It still does not evaluate product feature implementation
and does not override plugin-eval's core score.

## What It Checks

- V0 static checks: global method contract coverage, task-vs-harness boundary,
  recovery field/backend/drift discipline, scoped work, fresh evidence,
  verification gates, artifact freshness, anti-entropy, architecture
  enforcement, subagent orchestration, Research Route policy, language/output
  protocol, and capability recommendation/install precision.
- P1 scenarios: deterministic fixtures that protect against product-task scope
  leaks, vague recommendations, speculative installs, approval mistakes,
  brownfield duplication, AGENTS.md state bloat, missing verification entry,
  stale ready claims, slow default checks, architecture ratchet mistakes,
  status-script state mirrors, subagent overuse, unbounded research loops, missing evidence gates,
  incomplete recommendation contracts, collapsed recommendation matrices,
  stale dynamic context, and command/CI fallback mistakes.

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
