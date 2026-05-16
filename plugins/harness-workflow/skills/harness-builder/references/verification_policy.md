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

## Phase Acceptance

For harness installation, a phase is complete only when:

1. the approved artifact exists or existing artifact was patched;
2. the relevant command/manual check ran, or a concrete blocker is recorded;
3. the evidence location is stated;
4. residual risk is recorded when the proof is weaker than desired.

File existence alone is not enough.

Examples:

| Phase | Minimum acceptance |
| --- | --- |
| Agent entry | `AGENTS.md` exists, stays thin, and points to real docs/commands |
| Recovery surface | selected artifact can answer objective, active slice, evidence, decisions, risks, and next actions |
| Verification entry | fast command exists and has been run, or missing dependency is recorded as blocker |
| Architecture boundaries | layer source is documented; if mechanical check is installed, baseline/ratchet behavior is verified |
| Anti-entropy scan | scan is read-only and can report at least one class of drift with file-level evidence |
| Capability install | skill/hook/MCP/subagent is bound to a coverage gap and has a fallback |

## Agent-Readable Failures

Validation output should teach the next agent how to recover:

- name the failed file, command, or layer;
- point to the governing doc or recovery surface;
- separate blocker from residual risk;
- avoid generic "failed" messages with no remediation.
