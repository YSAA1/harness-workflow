# Harness Builder Decision Matrix

Use this matrix to decide where a requirement belongs.

| Requirement | Best artifact | Reason |
|---|---|---|
| All agents must always know this | `AGENTS.md` | Always loaded or easy entry point |
| Only one directory has this rule | local `AGENTS.md` | Keeps root file short |
| Detailed background | `docs/agent/project_context.md` | Avoids bloating root instructions |
| Fast proof the repo still works | `scripts/agent/check.sh` | Deterministic feedback |
| Long-running task status | `.harness/progress.md` | Recoverable state |
| Session restart context | `.harness/session_handoff.md` | Reduces context loss |
| Repeated project-specific workflow | `.agents/skills/<name>/SKILL.md` | Progressive disclosure |
| Must block a dangerous action | hook | Harder boundary than prose |
| Independent review or codebase exploration | subagent | Isolates context and bias |
| External docs/issues/tools | MCP | External context/tool access |
| Why this exists | `.harness/decisions.md` | Auditability |
| What is installed | `.harness/manifest.yaml` | Inventory and governance |

Add a component only if it prevents a real or likely failure, has a clear trigger/purpose, can be verified/audited, does not duplicate a better component, and will not add more entropy than it removes.
