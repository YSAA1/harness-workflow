# Install Policy

Install the smallest project-local harness that closes the identified gaps.

## Project-local by default

Prefer writing to:

- `AGENTS.md`
- `scripts/agent/`
- `docs/agent/`
- `.harness/`
- `.agents/skills/`
- `.codex/`
- `.claude/` only if explicitly supporting Claude Code

Do not modify user-global config unless explicitly requested.

## Minimal install set

For most projects:

- `AGENTS.md`
- `scripts/agent/check.sh`
- `docs/agent/project_context.md`
- `docs/agent/workflow.md`
- `docs/agent/verification.md`
- `.harness/manifest.yaml`
- `.harness/decisions.md`
- `.harness/state.md`

Add skills, hooks, subagents, and MCP only if the plan justifies them.

## Existing files

If a file exists: read it first, preserve project-specific content, prefer patching over overwriting, and record material changes in `.harness/decisions.md`.
