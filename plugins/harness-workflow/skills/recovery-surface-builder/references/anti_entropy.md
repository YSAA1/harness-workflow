# Anti-Entropy Policy

Harnesses can rot. Treat harness maintenance as part of the project.

## Warning signs

- `AGENTS.md` keeps growing;
- rules repeat across files;
- `check.sh` takes too long;
- skills overlap or never trigger;
- hooks block valid work;
- subagents exist but are never useful;
- MCP servers are enabled "just in case";
- state/progress files are stale;
- hot recovery docs grow as append-only reports;
- status/check/selftest scripts mirror active slices, evidence logs, probe inventories, or long conclusions;
- multiple recovery surfaces claim to be current;
- old active slices are mixed with a new user request;
- `AGENTS.md` contains session notes, review conclusions, or temporary TODOs;
- failed-experiment leftover code remains after research closeout;
- orphan research branches, worktrees, or tags are not recorded;
- research artifacts are unarchived or outside the approved artifact policy;
- capability candidates are marked `Deferred` without a revisit date or trigger;
- agents still repeat the same mistakes.

## Repair moves

Keep root instructions thin, split slow checks, classify skills, narrow hooks, defer MCP unless justified, reconcile existing harness drift, roll up hot recovery docs into bounded indexes with links to cold evidence, and prefer read-only GC/drift scans before cleanup automation.

## Read-only GC / drift scan

Default scans must report only; scheduled scans must not auto-fix or delete; any `--fix` behavior requires explicit user approval; findings must include file paths and remediation hints.

## `check.sh` mirroring test

`scripts/agent/check.sh` is a view/probe, not a state store. A `check.sh`
that mirrors recovery surface content is an entropy multiplier: every
state change forces a parallel edit in `check.sh`, and every `check.sh`
failure burns tokens re-aligning docs instead of doing work.

A `check.sh` violates the no-mirror rule if any of these hold:

- It contains `grep -F` / `grep -q` against a literal that is also a field
  value in `.harness/state.md`, `.harness/work_index.md`,
  `.harness/progress.md`, or `.harness/manifest.yaml` (e.g. the current
  `active_slice` text, a Work Index row, a `Primary artifact:` line).
- It asserts a specific run id, timestamp, test count, or experiment
  value as a literal (see `verification_policy.md` "Fragile check
  patterns").
- It enumerates the full source/test tree as a `required_files` list
  instead of guarding only protected paths and harness entry files.

Repair: replace literal `grep -F` with dynamic extraction (`jq`,
`python -c`, `awk`, `git ls-files`) and assert a predicate
("exactly one active row", "manifest active_plan file exists"), not a
literal. This keeps `check.sh` stable under normal progress.

## Principle

If a harness component cannot explain what failure it prevents, remove or downgrade it.
