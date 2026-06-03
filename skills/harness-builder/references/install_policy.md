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

## Automation install surfaces

Recommendations must name the surface separately from the candidate. Default is recommendation-only until the user approves installation.

| Capability | Codex surface | Claude Code surface | Cursor surface | Approval boundary |
| --- | --- | --- | --- | --- |
| Project instructions | `AGENTS.md`, `.codex/` project files if present | `CLAUDE.md`, `.claude/` project files | `.cursor/rules/`, `.cursor/skills/` | project-local patch can be approved at `USER CHECKPOINT` |
| Project-local skills | repo-local skill folder documented in `AGENTS.md` or plugin skill surface | `.claude/skills/<name>/SKILL.md` or plugin skill | `.cursor/skills/<name>/SKILL.md` | require approval before writing |
| User/global skills | `$CODEX_HOME/skills` or installed plugin cache | user/global `.claude/skills` or `/plugin install` | user/global Cursor skill surface if configured | explicit user approval only |
| Hooks | project docs or approved local hook templates; Codex hook support varies by environment | `.claude/settings.json` hooks | Cursor rules/extensions or project scripts, depending on available surface | explicit approval, especially if blocking or mutating |
| MCP | project `.codex/config.toml` notes or approved MCP config where supported | `.mcp.json`, `.claude/settings.json`, or `claude mcp add` | Cursor MCP settings if available | explicit approval; credential-bearing MCP needs stronger approval |
| Subagents | subagent policy and delegated roles in project docs; use only when supported by runtime | `.claude/agents/<name>.md` | Cursor agent/rule equivalent if available | explicit approval before creating agent files |
| Plugins | `.codex-plugin/`, local plugin cache, marketplace entry | `.claude-plugin/`, `/plugin install` | `.cursor-plugin/` | explicit approval before install or marketplace/cache changes |
| Slash/CLI commands | documented scripts, `codex exec`, project commands | `.claude/commands/`, `claude -p` | Cursor commands/rules or project scripts | project-local scripts need `USER CHECKPOINT`; global commands need explicit approval |

When a surface is unavailable or unknown, recommend a project-local note, script, or fallback workflow instead of inventing config.

## Approval levels

- `No approval`: read-only Harness Recommendation Plan, local evidence gathering, and existing file reads.
- `USER CHECKPOINT`: project-local files under the target repo, such as `AGENTS.md`, `scripts/agent/check.sh`, docs, `.harness/`, or repo-local skills.
- `Explicit user approval`: user/global config, MCP install, hooks, subagents, plugin install/cache/marketplace changes, credential-bearing integrations, destructive or blocking automation.
- `Reject/defer`: unclear owner, unclear fallback, secret exposure, broad write permissions, long-running hooks, or verification cannot be probed.

## Existing files

If a file exists: read it first, preserve project-specific content, prefer patching over overwriting, and record material changes in `.harness/decisions.md`.

Before writing, produce an existing-file decision: keep, patch, archive/deprecate, or reject/remove. Do not blend old task state into a new harness. `AGENTS.md` updates must be thin-rule updates only.
