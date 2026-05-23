# Capability Signal Policy

Use this policy during Harness Builder Capability Discovery after the Coverage Matrix exposes a real gap.

The goal is not to build an automation catalog. The goal is to turn repo evidence into a short, auditable capability shortlist that can close named harness gaps.

## Shortlist contract

Every candidate must include these fields:

| Field | Meaning |
| --- | --- |
| `repo_signal` | The concrete repo evidence that triggered the candidate: file, config, script, dependency, CI, runtime signal, or user intent. |
| `candidate` | The proposed skill, hook, MCP server, subagent, helper script, CI check, or external research action. |
| `coverage_row` | Exactly one Coverage Matrix row id or name that this candidate would close or improve. |
| `why` | The specific harness gap it closes. Avoid generic best-practice language. |
| `install_surface` | Where it would live if approved: project skill path, hook config, `.mcp.json`, project docs, script, CI, subagent file, or manual practice. |
| `risk_cost` | Permission, false-positive, runtime, token, maintenance, security, or team-adoption cost. |
| `fallback` | The simpler or manual alternative if the capability is not installed. |
| `classification` | `Required`, `Recommended`, `Deferred`, or `Rejected`. |

Do not list a candidate if it cannot be tied to exactly one coverage row. If one repo signal suggests multiple options, split them into separate candidate rows and classify each independently.

## Shortlist limits

- Run the shortlist pass only after the Coverage Matrix shows a real uncovered or weak row.
- Default to 1-2 candidates per capability category. Put extra plausible ideas in `Deferred`.
- If a simpler doc, script, test, lint rule, or manual practice closes the row, reject heavier capabilities.
- `Required` means the harness cannot meet the accepted objective or verification path without it.
- `Recommended` means it materially improves verification, observability, automation, or domain work but the harness can still function without it.
- `Deferred` means useful later, but not needed for this active harness objective.
- `Rejected` means duplicate, too risky, too broad, not project-local enough, or not bound to a real row.

## Proactive scan from stack signals

Concrete stack signals may produce candidates before the user names a capability. Examples include package managers, framework configs, CI files, training scripts, dataset/checkpoint paths, auth/secret surfaces, generated artifacts, and repeated workflow docs.

Use `capability_starter_catalog.md` as a starter map, then still apply the shortlist contract. Stack-driven candidates must bind to one of the split capability rows: skill fit, hook fit, MCP fit, subagent fit, or external research fit.

Project-level Harness Builder should be more active about recommending low-risk project-local capabilities when stack signals are strong. Single-task lanes should stay conservative and only adopt capabilities needed for that task.

## Recommendation-only mode

If the user asks only to analyze, recommend, audit, or "see what would help":

- stay read-only;
- output a recommendation report instead of an install plan;
- do not write files, create local config, or proceed to Pack Selection;
- still include `repo_signal`, `coverage_row`, `why`, `risk_cost`, `fallback`, and `classification`;
- tell the user which recommendations would require explicit approval before installation.

## Category signals

### Skills

Use skills for repeated specialized workflows with clear triggers and enough procedure to be worth packaging.

Good signals:

- repeated PR, release, migration, experiment, data, security, or docs workflow;
- domain-specific review that is too detailed for `AGENTS.md`;
- project-specific templates, checklists, scripts, or examples that the skill can bundle;
- a task family where mistakes are costly and recurrence is likely.

Default classification:

- `Recommended` for repeatable, low-risk knowledge workflows;
- `Recommended` for repeated project-level domain workflows when repo signals show recurrence;
- `Required` only when the approved harness objective depends on that skill to run safely or consistently;
- `Deferred` for plausible but unproven recurrence;
- `Rejected` for one-off fixes or generic advice.

### Hooks

Use hooks only as narrow deterministic guardrails.

Good signals:

- destructive commands or protected paths that must be blocked;
- `.env`, secret, dataset, checkpoint, or generated-artifact paths that are easy to edit accidentally;
- a known repeated validation reminder that is cheap and reliable;
- a stable formatting/lint command that does not hide unrelated diffs.

Default classification:

- `Recommended` for narrow warning or reminder hooks;
- `Recommended` for protected paths, known fast verification reminders, or commit/branch guardrails when repo signals are clear;
- `Required` only for concrete high-risk failures that tests or review cannot reliably catch;
- `Deferred` when false positives are likely or the team workflow is unknown;
- `Rejected` for long-running, subjective, broad, or fragile automation.

Every hook candidate must state false-positive risk and a disable or repair path.

### MCP

Use MCP when external context or actions are needed and cannot be handled better by local files or existing CLI tools.

Good signals:

- current documentation lookup for fast-moving libraries;
- browser automation, database inspection, repository/issue tracker integration, cloud APIs, or observability tools needed for verification;
- user-approved team tooling that is part of the project workflow.

Default classification:

- `Recommended` for read-only MCP that closes a real evidence or docs gap;
- `Recommended` for read-only docs, repository, or observability MCP when stack or workflow signals show current external context is repeatedly needed;
- `Required` only when the selected verification path cannot run without it;
- `Deferred` when local docs or CLI commands are sufficient for now;
- `Rejected` for write-capable or secret-bearing MCP without explicit approval.

Do not treat `.mcp.json` or global MCP setup as the default install surface. Prefer project-local documentation or read-only setup notes until the user approves installation.

### Subagents

Use subagents to reduce analysis or review gaps, not to own writes.

Good signals:

- large or legacy codebase where parallel read-only mapping reduces risk;
- security, API, ML/RL/data, performance, or UI review where specialized critique is useful;
- verification discovery or plan review that can run in parallel without blocking the main agent.

Default classification:

- `Recommended` for bounded read-only research or review;
- `Recommended` for `repo_explorer` on large or unfamiliar repos, and for security/API/ML reviewers when those risks are signaled;
- `Required` only when the user explicitly asks for delegated analysis or the harness objective cannot be reviewed safely by the main agent alone;
- `Deferred` for nice-to-have expert review;
- `Rejected` when it would duplicate the main agent's immediate blocking work.

The main agent remains responsible for writing files and integrating results.

### Helper scripts

Use helper scripts for deterministic local evidence, validation, rendering, inventory, or drift detection.

Good signals:

- repeated command sequences that are easy to run incorrectly;
- validation logic that should be machine-checkable;
- generated artifacts that need a reproducible generator;
- repo inventory or drift checks that should not depend on prose.

Default classification:

- `Required` when the selected verification path depends on the script;
- `Recommended` when it lowers recovery or validation cost;
- `Deferred` when it is useful but the manual command is adequate;
- `Rejected` when it hides project behavior or duplicates existing tooling.

## Optional platform-specific notes

Plugins and slash commands can be mentioned only as platform-specific delivery options. They are not first-class capability categories in Harness Builder v1 of this policy.

If mentioned, they must still bind to an existing candidate row and must not create a new workflow lane.
