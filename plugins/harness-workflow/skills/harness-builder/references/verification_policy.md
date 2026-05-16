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

## Phase Acceptance

For harness installation, a phase is complete only when the approved artifact exists or was patched, the relevant command/manual check ran or a blocker is recorded, the evidence location is stated, and residual risk is recorded when proof is weak. File existence alone is not enough.

## Agent-Readable Failures

Validation output should teach the next agent how to recover: name failed file/command/layer, point to governing docs, separate blocker from residual risk, and avoid generic failures.
