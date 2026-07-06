# Harness Builder Workbench Metric Pack

This plugin-eval metric pack evaluates the `harness-builder` skill as a
project-level workbench design artifact. It does not score product
implementation ability and does not override plugin-eval's core score.

The directory name keeps the original `harness-builder-recommendation` path for
compatibility. The current pack scope is broader than install recommendations.

## Scope

- V0: deterministic static checks over `SKILL.md`, the Harness Method
  Contract, and harness-builder references. These checks cover scope boundary,
  recovery surface design, verification evidence, anti-entropy, architecture
  enforcement, subagent orchestration, external research boundary, language/output
  protocol, and capability recommendations.
- P1: deterministic scenario coverage fixtures under `scenarios/`. The
  scenario matrix covers real workbench design branches, not just install
  recommendations. The local validator requires at least 24 P1 scenarios.
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
