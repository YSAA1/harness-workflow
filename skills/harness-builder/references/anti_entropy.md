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

## Principle

If a harness component cannot explain what failure it prevents, remove or downgrade it.
