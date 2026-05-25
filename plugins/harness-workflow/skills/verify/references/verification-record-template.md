# Verification Record Template

Use this reference when `verify` needs to emit a full verification record.

## Minimal Record

```text
VERIFICATION: PASS|FAIL|INSUFFICIENT

Claim:
  - Active slice: <one sentence>
  - Success criteria checked:
    - <criterion>

Evidence:
  - <command or signal> -> <pass|fail|unknown>

Freshness:
  - Latest relevant change: <diff summary | commit | file timestamp>
  - Evidence after change: yes|no

Ready:
  - YES|NO
  - Next: <cleanup | diagnose | harness-builder | plan>
```

## Full Record

```text
VERIFICATION: PASS|FAIL|INSUFFICIENT

Verification record:
  claim_id: <stable short id>
  claim: <ready claim>
  covered_paths:
    - <path or behavior surface>
  latest_change_ref: <git diff summary | commit | file timestamp basis>
  success_criteria:
    - criterion: <text>
      evidence: <command/smoke/manual signal>
      status: pass|fail|unknown
  commands:
    - command: <exact command>
      cwd: <path>
      result: pass|fail
      evidence_after_change: yes|no
  skipped_high_value_checks:
    - check: <name>
      reason: <why skipped>
      risk: <risk>
      fallback: <current substitute>
  unknowns:
    - <what remains unproven>
  commit_gate: eligible|not eligible|no commit unit|deferred
  ready: yes|no

Capabilities:
  - recommended: <none | capability + value/enablement/risk/fallback>

Risks:
  - <residual risk or none>
```

## Success-Criterion Mapping

Every success criterion gets one of:

- `pass`: fresh evidence covers this criterion.
- `fail`: evidence contradicts this criterion.
- `unknown`: evidence is missing, stale, indirect, or too weak.

`unknown` is not ready.
