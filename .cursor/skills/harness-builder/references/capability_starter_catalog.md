# Capability Starter Catalog

Index for Capability Discovery. Use this file to choose the right deeper reference; do not maintain a second long automation table here.

Every recommendation still needs repo signal, source evidence, freshness, one coverage row, cost/risk, fallback, verification probe, approval boundary, and classification.

## Normal Shortlist

Use the normal shortlist when a harness gap needs a small number of capabilities:

- MCP candidates: `automation_mcp_servers.md`
- Hook candidates: `automation_hooks_patterns.md`
- Subagent candidates: `automation_subagent_templates.md`
- Skill candidates: `automation_skills_reference.md`
- Plugin candidates: `automation_plugins_reference.md`
- Recommendation report shape: `automation_recommendation_guide.md`
- Install and approval boundary: `install_policy.md`

Default output: 1-2 candidates per category, with extras deferred.

## Full Recommendation Mode

Use Full Recommendation Mode when the user explicitly asks for broader capability, automation, setup, or install recommendations.

Output a read-only report across:

- MCP servers
- skills
- hooks
- subagents
- plugins
- slash/CLI commands and CI/headless automation when relevant
- project-local harness files and scripts when they close a named gap

Default output remains prioritized: 1-2 top candidates per category, or 3-5 when the user asks about one category.

## Safety Defaults

- Do not install from this index alone.
- Prefer project-local, read-only, reversible capabilities.
- Pin versions where applicable.
- Keep secrets in env vars or the platform secret store.
- Treat write-capable or credential-bearing MCP/plugins/hooks as approval-required.
- Run `$find-skills` / `find-skills` when reusable skills are relevant, or record `No reusable skill search needed` with reason.
- Use targeted web search only for current external behavior, new registries, or tool-specific install syntax that local docs do not cover.
