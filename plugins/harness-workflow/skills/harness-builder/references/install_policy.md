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

Before writing, produce an existing-file decision:

| Decision | Meaning |
| --- | --- |
| `keep` | The file is current and needs no edit. |
| `patch` | The file is authoritative but stale or incomplete. |
| `archive/deprecate` | The file is historical or superseded; preserve only if useful. |
| `reject/remove` | The file is misleading, duplicate, or unsafe; removal needs explicit approval. |

Do not blend old task state into a new harness. If an existing state file describes a different active slice, either close/archive that slice, update it as the current approved slice, or stop for user direction.

`AGENTS.md` updates must be thin-rule updates only. If the needed content is a task plan, evidence log, session note, or cleanup report, put it in the selected recovery surface instead.
