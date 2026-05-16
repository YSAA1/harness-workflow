# MCP Policy

MCP adds external context or external actions. Treat it as a capability boundary.

Default: defer MCP unless the project clearly needs it. Prefer read-only. Require explicit user approval for write operations. Document why each MCP is needed. Record MCP decisions in `.harness/decisions.md`. Keep MCP out of the default Required set unless essential.
