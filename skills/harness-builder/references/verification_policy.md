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

## Fragile check patterns (forbidden in generated `check.sh`)

A fast check can still be fragile. The patterns below make `check.sh` fail on
normal progress, forcing agents to spend tokens re-aligning docs instead of
doing work. They have been observed in real projects and must not be generated.

- **Run-id / timestamp literals.** Do not `grep -F` a specific run id
  (e.g. `problem_smoke_matrix_20260625T210355`) into `README.md`,
  `state.md`, `progress.md`, or any plan. Run ids change every run.
- **Test-count or pass-count literals.** Do not assert a specific count
  like `289 passed, 2 warnings` as a literal string. Pytest / the runner
  already reports counts; `check.sh` must not freeze them.
- **Experiment-value literals.** Do not assert a numeric result like
  `author_800k=5.968893` as a literal. Experiment values drift by design.
- **Recovery-surface field-value mirroring.** Do not `grep -F` the exact
  value of `active_slice`, `Primary artifact:`, a Work Index row, or any
  other `.harness/` field back into `check.sh`. The recovery surface is
  the source of truth; `check.sh` must not become its second copy.
- **Filesystem-mirror `required_files` lists.** Do not enumerate every
  source/test/config file as a `[[ -f ]]` check. `git ls-files` already
  tracks them. Guard only protected paths and a small set of harness
  entry files (`AGENTS.md`, `scripts/agent/check.sh`, `.harness/manifest.yaml`).
- **Long-conclusion mirroring.** Do not assert multi-line status summaries
  from `state.md` / `progress.md` / `.ai-bridge/*` as literals.

If a check must verify a structural property of the recovery surface, use
dynamic extraction (`jq`, `python -c`, `awk`, `git ls-files`) and compare
against a predicate, not a literal. Example: assert "Work Index has exactly
one `active` row" by counting, not by grepping a specific row's text.

## Size budget

Keep `scripts/agent/check.sh` small. A `check.sh` that grows past a few
hundred lines is a warning sign per `anti_entropy.md`; split it into
focused sub-scripts and have `check.sh` call them, or move one-off
project checks into `scripts/agent/` siblings that are not run on every
session start.

## Phase Acceptance

For harness installation, a phase is complete only when the approved artifact exists or was patched, the relevant command/manual check ran or a blocker is recorded, the evidence location is stated, and residual risk is recorded when proof is weak. File existence alone is not enough.

## Agent-Readable Failures

Validation output should teach the next agent how to recover: name failed file/command/layer, point to governing docs, separate blocker from residual risk, and avoid generic failures.
