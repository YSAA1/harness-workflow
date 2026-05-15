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

### AGENTS.md too long

Keep project overview, project map, quick start, iron laws, harness map, protected paths, verification, and DoD. Move details to `docs/agent/`, local `AGENTS.md`, or project skills.

### check.sh too slow

Split into:
- `check.sh`: fast default
- `smoke.sh`: moderate smoke
- `full_check.sh`: slow/manual

### skills too many

Classify into keep, merge, specialize, archive, or delete. Keep only skills with clear triggers and repeated value.

### hooks noisy

Narrow patterns, document false positives, move subjective checks to review/tests, and disable hooks that block normal work.

### MCP overreach

Prefer read-only, remove unused servers, require approval for write tools, and document risk/reason.

### Existing harness drift

Before adding new files, reconcile the old harness:

- identify the current source of truth for objective, active slice, verification, decisions, and next actions;
- classify old harness components as keep, patch, archive/deprecate, or reject;
- move durable rules into `AGENTS.md` only when they are stable;
- move current task status into the selected recovery surface;
- record unresolved conflicts as risks instead of blending them into new instructions.

## Principle

If a harness component cannot explain what failure it prevents, remove or downgrade it.
