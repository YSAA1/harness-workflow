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
- multiple recovery surfaces claim to be current;
- old active slices are mixed with a new user request;
- `AGENTS.md` contains session notes, review conclusions, or temporary TODOs;
- agents still repeat the same mistakes.

## Repair moves

Keep root instructions thin, split slow checks, classify skills, narrow hooks, defer MCP unless justified, reconcile existing harness drift, and prefer read-only GC/drift scans before cleanup automation.

## Read-only GC / drift scan

Default scans must report only; scheduled scans must not auto-fix or delete; any `--fix` behavior requires explicit user approval; findings must include file paths and remediation hints.

## Principle

If a harness component cannot explain what failure it prevents, remove or downgrade it.
