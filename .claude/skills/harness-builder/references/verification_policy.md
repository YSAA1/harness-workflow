# Verification Policy

The default verification command must be fast, local, and safe.

## Good checks

- unit tests
- lint
- typecheck
- import smoke test
- dry-run
- tiny train/eval
- tiny RL rollout
- config parse
- schema validation

## Bad default checks

- full training
- long benchmarks
- production deploys
- cloud writes
- destructive migrations
- tests requiring private services unless already standard
- anything expected to take hours

## Pattern

Start weak and improve. For a legacy repo, an import smoke check is acceptable if no known test command exists.

Later split into:

- `scripts/agent/check.sh`: fast default
- `scripts/agent/smoke.sh`: deeper smoke
- `scripts/agent/full_check.sh`: slow/manual full validation
