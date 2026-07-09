# Harness Recommendation Guide

> Primary owner for thick capability design: `capability-recommender`. `harness-builder` uses this as fallback / matrix context only.

Use this guide in Harness Recommendation Mode. The user's goal is to know what harness contents should be installed or repaired for this project: project entry docs, recovery surface, verification scripts, MCP, hooks, skills, subagents, plugins, slash/CLI commands, CI/headless automation, and related guardrails.

Derived from Anthropic `claude-code-setup` / `claude-automation-recommender` 1.0.0, adapted for this Harness Builder and for Codex / Claude Code / Cursor surfaces. See `automation_recommendation_attribution.md`.

## Mode Contract

The first phase is read-only. Analyze the repo and output a concise Harness Recommendation Plan with concrete candidates. Do not create `.mcp.json`, hook config, subagent files, skills, plugins, scripts, docs, or user/global config unless the user approves concrete changes at `USER CHECKPOINT` or explicitly approves a global/credential-bearing install.

## Output Scope

- Default: top 1-2 recommendations per relevant category.
- Specific category request: 3-5 recommendations for that category.
- Categories: project harness files/scripts, MCP servers, skills, hooks, subagents, plugins, slash/CLI commands, CI/headless automation, and external research.
- Skip categories with no meaningful repo signal, or mark them `Deferred` with reason.
- When the user explicitly asks for setup, installation, automation, or capability recommendations, cover all capability categories with actionable candidates or a clear defer/reject reason. Do not turn a working current harness into a no-op recommendation.
- The reference files contain common patterns. Use targeted web search or local official docs to find recommendations specific to the codebase's tools, frameworks, services, and libraries.

## Evidence To Gather

| Evidence | Signals |
| --- | --- |
| manifests | `package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, `pom.xml`, `Gemfile`, `composer.json` |
| app structure | `src/`, `app/`, `lib/`, `components/`, `pages/`, `api/`, `server/`, `tests/` |
| existing agent config | `AGENTS.md`, `CLAUDE.md`, `.claude/`, `.codex/`, `.cursor/`, `.mcp.json`, `.agents/skills/` |
| verification | test scripts, lint/typecheck scripts, CI workflows, `scripts/agent/check.sh` |
| external services | database clients, cloud SDKs, issue tracker refs, monitoring SDKs, browser/E2E config |
| risk signals | `.env`, secrets, auth, payments, PII, production deploy scripts, lock files, generated artifacts |

## Candidate Record

Every recommendation should be easy to approve or reject. Prefer a compact table. Include:

| Field | Meaning |
| --- | --- |
| `repo_signal` | local evidence that triggered it |
| `candidate` | capability name |
| `why` | project-specific value |
| `install_surface` | Codex / Claude Code / Cursor surface, or recommendation-only |
| `approval_needed` | no approval, USER CHECKPOINT, explicit user approval |
| `fallback` | local docs/scripts/manual workflow if unavailable |
| `verification_probe` | cheap command or observation proving install/use works |
| `priority` / `classification` | High / Medium / Low and Required / Recommended / Deferred / Rejected |

Add source evidence, freshness, trust boundary, and risk/cost when they materially change the decision.

## Reference Library

- MCP candidates: `automation_mcp_servers.md`
- Hook candidates: `automation_hooks_patterns.md`
- Subagent candidates: `automation_subagent_templates.md`
- Skill candidates: `automation_skills_reference.md`
- Plugin candidates: `automation_plugins_reference.md`
- Slash/CLI and CI/headless automation: `automation_commands_reference.md`
- Install and approval boundary: `install_policy.md`
- Precise stack-specific discovery: `capability_discovery_playbook.md`

Use `$find-skills` / `find-skills` when reusable skills are relevant, or record `No reusable skill search needed` with reason. Use `No web research needed` only when local evidence and these references are enough.

## Report Shape

```markdown
Codebase Profile
- Type:
- Existing agent surfaces:
- Verification entry:
- Risk signals:

Recommendation Summary
| Priority | Type | Recommendation | Value | Where / install surface | Approval |
| --- | --- | --- | --- | --- | --- |

Details
- <candidate>: repo signal, fallback, verification probe, notable risk.

Next Choices
- Install/Patch now after USER CHECKPOINT:
- Defer:
- Reject:
```

## Decision Rules

- Project-local skills, hooks, subagents, and MCP supplement this project's capability and do not touch user/global config, so recommend them as `Recommended` (or `Required`) whenever a concrete repo signal shows value. Do not default them to `Deferred`/`Rejected` just because the current harness already runs; project-local scope is a reason to recommend, not a reason to withhold.
- Reuse existing scripts, docs, tests, and harness files first, then add the project-local capability that closes the remaining gap.
- Prefer read-only MCP/subagents before write-capable or credential-bearing integrations; the risk gate is credentials, write access, global scope, and destructiveness, not project-local installation itself.
- Prefer one capability that closes a named harness gap over broad tool bundles.
- Plugins are delivery bundles, not independent justification; bind them to an existing recommendation row.
- Hooks must be deterministic, narrow, fast, and easy to disable.
- Skills must have repeatable triggers and enough supporting material to be better than a prompt.
- Subagents should be named by failure mode or review need, not seniority.
- CI/headless automation should use existing verification commands and stable structured output where possible.
- Never ask the user to approve a plan that has no install, patch, archive, or config action. Say `No install recommended` instead.
