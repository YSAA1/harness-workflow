# Capability Signal Policy

Use after the Coverage Matrix exposes a real gap. Turn repo evidence into a short, auditable capability shortlist—not an automation catalog.

## Shortlist contract

Every candidate must include: `repo_signal`, `source_evidence`, `freshness`, `candidate`, `coverage_row` (exactly one), `why`, `install_surface`, `trust_boundary`, `approval_needed`, `risk_cost`, `fallback`, `verification_probe`, `classification` (`Required` / `Recommended` / `Deferred` / `Rejected`).

- Default 1–2 candidates per category; defer extras.
- Prefer doc/script/test/lint over heavier capabilities.
- **Project-level Harness Builder:** on strong stack signals, default low-risk project-local candidates to `Recommended` and present them proactively.
- **Single-task lanes:** stay conservative; adopt only what the task needs.
- **Do not install on user silence.** User-level MCP/hooks need explicit checkpoint approval.

## Docs-first, then web search

1. Read `capability_starter_catalog.md` and local repo docs, manifests, and official tool READMEs already in-tree.
2. Use **targeted web search** only when a coverage row needs current external behavior, the user asks for MCP/hooks/skills/subagent recommendations, or local evidence is insufficient.
3. Source order: official docs → official repo → vendor docs → mature community examples.
4. Never use web search to guess local repo facts (file layout, test commands, protected paths).
5. If research changes the plan, note it in `.harness/research_notes.md`.

## Recommendation-only mode

Read-only: output a **recommendation report**; no `.mcp.json`, hooks config, subagent files, project-local skills, or other install. Include full shortlist fields; state what needs explicit approval before install.

## Skills

Repeated specialized workflows with clear triggers; too detailed for `AGENTS.md`.

- `Recommended` for repeatable low-risk or strong-recurrence domain workflows.
- `Required` only when the approved objective depends on the skill.
- Invoke `$find-skills` / `find-skills` or document `No reusable skill search needed`.
- Invocation mode: `user-only` (side effects), `agent-only` (background policy), or `both`. Default side-effecting skills to `user-only`.

## Hooks

Narrow deterministic guardrails only. See `templates/hooks/*` for install-ready patterns.

- `Recommended` for protected paths, fast verification reminders, format/lint after edit, commit/branch guards when signals are clear.
- `Required` only for high-risk failures tests/review cannot catch.
- Every candidate: event, false-positive risk, disable/repair path.
- Bad: long-running jobs, subjective review, broad formatting that hides diffs.

Cadences (Claude Code / Cursor): `PreToolUse` (block/mutate before tool), `PostToolUse` (lint/log/format after success), `SessionStart` (inject context).

## MCP

External context when local files/CLI are insufficient.

- `Recommended` for read-only docs/repo/observability MCP when signals are strong.
- `Required` only when the verification path cannot run without it.
- Write-capable or credential-bearing MCP → `Deferred`/`Rejected` until explicit approval.
- Prefer project-local setup notes before `.mcp.json` or global MCP.
- User-level MCP: checkpoint required; document fallback if unavailable.

## Subagents

Read/research/review only; main agent writes. See `references/subagent_orchestration.md`.

- `Recommended` for bounded parallel read-only work on large/unfamiliar repos or signaled security/API/ML/review gaps.
- `Required` only when user requests delegation or main agent cannot review safely alone.

## Helper scripts

`Required` when verification depends on them; `Recommended` when they lower recovery/validation cost.

## Platform notes

Plugins and slash commands are delivery options only; bind to an existing coverage row.
