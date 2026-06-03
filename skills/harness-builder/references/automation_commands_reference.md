# Automation Commands And Headless Reference

Slash commands, CLI commands, and CI/headless automation turn repeated harness workflows into explicit entry points. Recommend them when the project already has repeatable checks, commit/review flows, or CI gates that should be easy for agents and humans to invoke.

Derived from Anthropic `claude-code-setup` 1.0.0 main skill guidance and adapted for Codex / Claude Code / Cursor surfaces. See `automation_recommendation_attribution.md`.

**Note**: These are common patterns. Use targeted web search or local official docs to find command and headless automation ideas specific to the codebase's tools, frameworks, and agent runtime.

## Placement Surfaces

| Surface | Project-local option | User/global option | Notes |
| --- | --- | --- | --- |
| Codex | `scripts/agent/*.sh`, documented `codex exec` prompts, CI jobs | user shell aliases or Codex config | prefer project scripts and `codex exec --json` for automation |
| Claude Code | `.claude/commands/<name>.md`, `claude -p` headless flows | user/global commands | commands can bundle live shell context |
| Cursor | project scripts, `.cursor/rules/`, command docs | user Cursor commands if available | verify current Cursor command surface |

## Slash / Project Commands

| Signal | Candidate | Value |
| --- | --- | --- |
| repeated verification | `/check` or `scripts/agent/check.sh` | one stable validation entry |
| PR review workflow | `/pr-review` | consistent pre-merge review |
| release process | `/release-notes` | repeatable release summary |
| onboarding | `/setup-dev` | prerequisite and setup checks |
| docs generation | `/docs-refresh` | regenerate generated docs/assets |
| harness maintenance | `/harness-audit` | inspect AGENTS/recovery/verification drift |

## Headless / CI Automation

| Signal | Candidate | Value |
| --- | --- | --- |
| CI needs agent-readable output | `codex exec --json` or structured report | machine-readable gate evidence |
| scheduled maintenance | headless stale-doc or dependency audit | regular drift detection |
| pre-merge checks | run agent review against diff | catches policy gaps |
| generated artifacts | regenerate and compare generated outputs | prevents hand-edited generated files |
| recurring failures | diagnostic command packet | consistent reproduction evidence |

## Permission And Tool Boundaries

| Boundary | Recommendation |
| --- | --- |
| read-only analysis | allow read/search/list commands only |
| project-local patch | require `USER CHECKPOINT` |
| commit/push/deploy | explicit user approval or user-only command |
| credentials/MCP/global config | explicit user approval |
| long-running or costly jobs | CI/manual gate, not post-edit hook |

## Verification Probes

- Command appears in project docs or command directory.
- Dry-run command prints expected steps without writing.
- CI/headless command exits nonzero on a seeded failure.
- `codex exec --json` or equivalent structured mode returns parseable output when used.
- Fallback script works without the agent runtime.
