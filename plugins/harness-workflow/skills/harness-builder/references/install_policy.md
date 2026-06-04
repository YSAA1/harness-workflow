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

Project-local skills, hooks, subagents, and MCP are normal capability supplements, not last resorts. They live in this repo and do not change user/global config, so recommend them whenever a concrete repo signal shows they would help the project's development workflow. A project-local, non-credential, non-destructive supplement is approvable at `USER CHECKPOINT`; only the higher-risk cases below need explicit approval.

## Automation install surfaces

Recommendations must name the surface separately from the candidate. Default is recommendation-only until the user approves; project-local supplements are approvable at `USER CHECKPOINT`, not blocked by default.

| Capability | Codex surface | Claude Code surface | Cursor surface | Approval boundary |
| --- | --- | --- | --- | --- |
| Project instructions | `AGENTS.md`, `.codex/` project files if present | `CLAUDE.md`, `.claude/` project files | `.cursor/rules/`, `.cursor/skills/` | project-local patch can be approved at `USER CHECKPOINT` |
| Project-local skills | repo-local skill folder documented in `AGENTS.md` or plugin skill surface | `.claude/skills/<name>/SKILL.md` or plugin skill | `.cursor/skills/<name>/SKILL.md` | `USER CHECKPOINT` |
| User/global skills | `$CODEX_HOME/skills` or installed plugin cache | user/global `.claude/skills` or `/plugin install` | user/global Cursor skill surface if configured | explicit user approval only |
| Hooks | project docs or approved local hook templates; Codex hook support varies by environment | `.claude/settings.json` hooks | Cursor rules/extensions or project scripts, depending on available surface | project-local non-blocking hooks: `USER CHECKPOINT`; blocking, mutating, global, or long-running hooks: explicit approval |
| MCP | project `.codex/config.toml` notes or approved MCP config where supported | `.mcp.json`, `.claude/settings.json`, or `claude mcp add` | Cursor MCP settings if available | project-local read-only / non-credential MCP: `USER CHECKPOINT`; credential-bearing or write-capable MCP: explicit approval |
| Subagents | subagent policy and delegated roles in project docs; use only when supported by runtime | `.claude/agents/<name>.md` | Cursor agent/rule equivalent if available | project-local read-only subagents: `USER CHECKPOINT`; write-capable subagents: explicit approval |
| Plugins | `.codex-plugin/`, local plugin cache, marketplace entry | `.claude-plugin/`, `/plugin install` | `.cursor-plugin/` | explicit approval before install or marketplace/cache changes |
| Slash/CLI commands | documented scripts, `codex exec`, project commands | `.claude/commands/`, `claude -p` | Cursor commands/rules or project scripts | project-local scripts need `USER CHECKPOINT`; global commands need explicit approval |

When a surface is unavailable or unknown, recommend a project-local note, script, or fallback workflow instead of inventing config.

## Approval levels

- `No approval`: read-only Harness Recommendation Plan, local evidence gathering, and existing file reads.
- `USER CHECKPOINT`: project-local files and project-local capability supplements under the target repo — `AGENTS.md`, `scripts/agent/check.sh`, docs, `.harness/`, repo-local skills, and project-local non-credential, read-only, or non-destructive hooks, subagents, and MCP config. These do not change user/global state, so recommend and install them at this level when a repo signal justifies them; default project-local supplements here rather than to explicit approval.
- `Explicit user approval`: user/global config or skills, credential-bearing or write-capable MCP, blocking/mutating/destructive hooks, plugin install/cache/marketplace changes, and any global or irreversible automation.
- `Reject/defer`: unclear owner, unclear fallback, secret exposure, broad write permissions, long-running hooks, or verification cannot be probed.

## Existing files

If a file exists: read it first, preserve project-specific content, prefer patching over overwriting, and record material changes in `.harness/decisions.md`.

Before writing, produce an existing-file decision: keep, patch, archive/deprecate, or reject/remove. Do not blend old task state into a new harness. `AGENTS.md` updates must be thin-rule updates only.
