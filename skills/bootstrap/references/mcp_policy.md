# MCP Policy

MCP adds external context or external actions. Treat it as a capability boundary.

## Default

Defer MCP unless the project clearly needs it.

## Good first MCP candidates

- official documentation search;
- GitHub issue/PR read access;
- Linear/Jira read access;
- Sentry read-only;
- Figma read-only;
- internal docs read-only.

## High-risk MCP

- production databases;
- cloud write access;
- Kubernetes write access;
- Slack/email sending;
- payment or trading systems;
- any tool that can mutate production state.

## Rules

- Prefer read-only.
- Require explicit user approval for write operations.
- Document why each MCP is needed.
- Record MCP decisions in `.harness/decisions.md`.
- Keep MCP out of the default Required set unless it is essential.
