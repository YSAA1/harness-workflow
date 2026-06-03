# Harness Recommendation Guide

Use this guide in Harness Recommendation Mode. The user's goal is to know what harness contents should be installed or repaired for this project: project entry docs, recovery surface, verification scripts, MCP, hooks, skills, subagents, plugins, slash/CLI commands, CI/headless automation, and related guardrails.

Derived from Anthropic `claude-code-setup` / `claude-automation-recommender` 1.0.0, adapted for this Harness Builder and for Codex / Claude Code / Cursor surfaces. See `automation_recommendation_attribution.md`.

## Mode Contract

The first phase is read-only. Analyze the repo and output a Harness Recommendation Plan. Do not create `.mcp.json`, hook config, subagent files, skills, plugins, scripts, docs, or user/global config unless the user approves the plan at `USER CHECKPOINT` or explicitly approves a global/credential-bearing install.

## Output Scope

- Default: top 1-2 recommendations per relevant category.
- Specific category request: 3-5 recommendations for that category.
- Categories: project harness files/scripts, MCP servers, skills, hooks, subagents, plugins, slash/CLI commands, CI/headless automation, and external research.
- Skip categories with no meaningful repo signal, or mark them `Deferred` with reason.
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

Every recommendation must include:

| Field | Meaning |
| --- | --- |
| `repo_signal` | local evidence that triggered it |
| `source_evidence` | file/path/command or official reference used |
| `freshness` | local-current, official-current, web-verified, or unverified |
| `candidate` | capability name |
| `recommendation_row` | exactly one row from the Harness Recommendation Matrix |
| `why` | project-specific value |
| `install_surface` | Codex / Claude Code / Cursor surface, or recommendation-only |
| `trust_boundary` | read-only, project-write, user-global, credential-bearing, or external-write |
| `approval_needed` | no approval, USER CHECKPOINT, explicit user approval |
| `risk_cost` | false positives, drift, maintenance, permission, runtime cost |
| `fallback` | local docs/scripts/manual workflow if unavailable |
| `verification_probe` | cheap command or observation proving install/use works |
| `classification` | Required / Recommended / Deferred / Rejected |

## Reference Library

- MCP candidates: `automation_mcp_servers.md`
- Hook candidates: `automation_hooks_patterns.md`
- Subagent candidates: `automation_subagent_templates.md`
- Skill candidates: `automation_skills_reference.md`
- Plugin candidates: `automation_plugins_reference.md`
- Slash/CLI and CI/headless automation: `automation_commands_reference.md`
- Install and approval boundary: `install_policy.md`

Use `$find-skills` / `find-skills` when reusable skills are relevant, or record `No reusable skill search needed` with reason. Use `No web research needed` only when local evidence and these references are enough.

## Report Shape

```markdown
## Harness Recommendation Plan

### Codebase Profile
- Type:
- Stack:
- Existing agent surfaces:
- Verification entry:
- Risk signals:

### Recommendation Matrix
| Category | Top candidates | Classification | Approval |
| --- | --- | --- | --- |

### Project Harness Files and Scripts
...

### MCP Servers
#### <candidate>
- repo_signal:
- why:
- install_surface:
- approval_needed:
- fallback:
- verification_probe:

### Skills
...

### Hooks
...

### Subagents
...

### Plugins
...

### Slash/CLI Commands and CI/Headless Automation
...

### Approval Boundary
- Can include in the plan now:
- Can install after USER CHECKPOINT:
- Needs explicit user approval:
- Deferred or rejected:
```

## Decision Rules

- Prefer existing scripts, docs, tests, and project-local harness files before heavier automation.
- Prefer read-only MCP/subagents before write-capable or credential-bearing integrations.
- Prefer one capability that closes a named harness gap over broad tool bundles.
- Plugins are delivery bundles, not independent justification; bind them to an existing recommendation row.
- Hooks must be deterministic, narrow, fast, and easy to disable.
- Skills must have repeatable triggers and enough supporting material to be better than a prompt.
- Subagents should be named by failure mode or review need, not seniority.
- CI/headless automation should use existing verification commands and stable structured output where possible.
