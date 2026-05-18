# MCP Policy

MCP adds external context or external actions. Treat it as a capability boundary.

Default: defer MCP unless the project clearly needs it. Prefer read-only. Require explicit user approval for write operations. Document why each MCP is needed. Record MCP decisions in `.harness/decisions.md`. Keep MCP out of the default Required set unless essential.

Do not treat `.mcp.json`, global MCP configuration, or user-level install as the default answer. First decide whether the repo needs external context or external action at all, then choose the smallest project-local surface that preserves team safety and recoverability.

## Approval boundary

- Read-only MCP can be `Recommended` when it closes a named evidence, docs, browser, repo, or observability gap.
- Write-capable MCP must stay `Deferred` or `Rejected` until the user explicitly approves the action boundary, credentials model, and install surface.
- MCP that requires secrets must document where secrets live and must not put them in repo files.
- If a local CLI, checked-in docs, API fixture, or manual command can provide the same evidence, prefer that fallback before adding MCP.

Every MCP candidate must include repo signal, coverage row, why, install surface, risk/cost, fallback, and classification per `capability_signal_policy.md`.
