# Harness Recommendation Matrix Policy

Use one integrated recommendation matrix for harness design. Do not create a separate profile lane.

## Purpose

The matrix answers: what must this project have so future agents can work safely, verify work, and recover state?

Each row is classified as:

- `Required`: must be installed or repaired before the harness can be called usable.
- `Recommended`: useful, but not required for the current objective.
- `Deferred`: valid gap, intentionally postponed.
- `Rejected`: not useful, too costly, duplicates a better mechanism, or outside scope.

Default a project-local capability supplement (skill, hook, subagent, MCP) to `Recommended` when a concrete repo signal shows value. Do not drop it to `Deferred`/`Rejected` merely because the harness already runs or to avoid an install — project-local scope does not change user/global state. Reserve `Deferred`/`Rejected` for unclear owner, credential/global/destructive risk, missing fallback, or a mechanism a simpler artifact already covers.

## Rows

| Coverage area | What to check | Typical artifacts |
| --- | --- | --- |
| Agent entry and project map | Can a fresh agent find the project shape and first files to read? | `AGENTS.md`, `CLAUDE.md`, `ARCHITECTURE.md`, `docs/agent/project_context.md` |
| Static docs and durable rules | Are stable rules separated from current task state? | docs, golden-principle notes, local `AGENTS.md` |
| Recovery surface | Can future agents recover objective, active slice, evidence, decisions, risks, and next actions? | `.harness/state.md`, three-file backend, issue tracker, existing system |
| Verification entry | Is there a fast safe check and a deeper proof path? | `scripts/agent/check.sh`, test/lint/typecheck/smoke docs, CI |
| Architecture boundaries | Are dependency rules discoverable and enforceable when needed? | `docs/architecture/LAYERS.md`, boundary test, linter import rule, known-violations baseline |
| Anti-entropy | Can drift be detected without manual rediscovery? | read-only GC scan, doc drift check, stale state check, cleanup checklist |
| Skill fit | Are reusable skills justified for repeated project workflows? | `.agents/skills`, project-local skills, skill search notes |
| Hook fit | Are deterministic hook guardrails justified by concrete risk? | hooks, protected-path guards, verification reminders, audit loggers |
| MCP fit | Is external context or action needed beyond local files and CLI? | MCP config notes, read-only docs/repo/observability MCP, approval records |
| Subagent fit | Would read-only delegated analysis or review reduce real risk? | subagent templates, orchestration notes, review assignments |
| External research fit | Is web or paper research required to resolve current uncertainty? | research notes, source list, official docs links, evidence summaries |
| Dynamic context | Which fresh signals should be probed at session start? | git status/log, diagnostics/lint, CI status, logs, runtime health if already available |

## Phase Thinking Without Profiles

Borrow the useful phase discipline from initialization tools, but map it into recommendation rows:

| Initialization phase | Coverage row |
| --- | --- |
| Discovery | all rows; especially stack, tools, dynamic context, existing harness |
| Thin agent entry | agent entry and project map |
| Docs system of record | static docs and durable rules |
| Boundary test | architecture boundaries |
| Lint import rules | architecture boundaries and verification entry |
| CI or local check entry | verification entry |
| GC / drift scan | anti-entropy |
| Hooks | hook fit; optional unless blocking a concrete high-risk failure |

The user may ask for one area only. Still run enough discovery to avoid writing against the wrong stack or stale harness, then keep unrelated rows deferred.

## Binding Rule

Every proposed file, script, skill, hook, MCP, subagent, plugin, command, CI job, or GC scan must bind to exactly one primary recommendation row.

If a candidate cannot name the failure it prevents, reject or defer it.

## Existing Repo Rules

- Prefer patching authoritative artifacts over creating parallel ones.
- For old violations, establish baseline first; do not break a working repo with strict checks on day one.
- Use warning or report-only behavior before strict enforcement unless the repo is already clean or the user approves strict gates.
- Record deferred rows as known gaps, not as hidden TODOs in `AGENTS.md`.
