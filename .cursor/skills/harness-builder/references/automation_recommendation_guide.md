# Automation Recommendation Guide

Use this guide in Full Recommendation Mode: the user explicitly asks for capability, automation, setup, install, MCP, hooks, skills, subagents, plugins, or slash/CLI command recommendations.

Derived from Anthropic `claude-code-setup` / `claude-automation-recommender` 1.0.0, adapted for this Harness Builder and for Codex / Claude Code / Cursor surfaces. See `automation_recommendation_attribution.md`.

## Mode Contract

This mode is read-only by default. Analyze the repo and output recommendations. Do not create `.mcp.json`, hook config, subagent files, skills, plugins, or user/global config unless the user separately approves installation.

## Output Scope

- Default: top 1-2 recommendations per relevant category.
- Specific category request: 3-5 recommendations for that category.
- Categories: MCP servers, skills, hooks, subagents, plugins, slash/CLI commands, CI/headless automation, and project-local harness files/scripts.
- Skip categories with no meaningful repo signal, or mark them `Deferred` with reason.
- Go beyond these references only with targeted web search or local official docs when the stack needs current or tool-specific details.

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
| `coverage_row` | exactly one row from the Harness Coverage Matrix |
| `why` | project-specific value |
| `install_surface` | Codex / Claude Code / Cursor surface, or recommendation-only |
| `trust_boundary` | read-only, project-write, user-global, credential-bearing, or external-write |
| `approval_needed` | no approval, Harness Plan approval, explicit user approval |
| `risk_cost` | false positives, drift, maintenance, permission, runtime cost |
| `fallback` | local docs/scripts/manual workflow if unavailable |
| `verification_probe` | cheap command or observation proving install/use works |
| `classification` | Required / Recommended / Deferred / Rejected |

## Report Shape

```markdown
## Capability Recommendation Report

### Codebase Profile
- Type:
- Stack:
- Existing agent surfaces:
- Verification entry:
- Risk signals:

### Recommendation Summary
| Category | Top candidates | Classification | Approval |
| --- | --- | --- | --- |

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

### Slash/CLI and CI Automation
...

### Approval Boundary
- Can recommend now:
- Can install after Harness Plan approval:
- Needs explicit user approval:
- Deferred or rejected:
```

## Decision Rules

- Prefer existing scripts, docs, tests, and project-local harness files before heavier automation.
- Prefer read-only MCP/subagents before write-capable or credential-bearing integrations.
- Prefer one capability that closes a named harness gap over broad tool bundles.
- Plugins are delivery bundles, not independent justification; bind them to an existing coverage row.
- Hooks must be deterministic, narrow, fast, and easy to disable.
- Skills must have repeatable triggers and enough supporting material to be better than a prompt.
- Subagents should be named by failure mode or review need, not seniority.
- CI/headless automation should use existing verification commands and stable structured output where possible.
