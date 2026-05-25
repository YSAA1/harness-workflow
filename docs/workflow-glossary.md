# Workflow Glossary

This glossary is the shared language for Harness Workflow skills. Keep `SKILL.md`
hot paths short by linking here instead of redefining these terms in every skill.

## Core Terms

**Ready claim**
: A concrete statement that a slice is done, mergeable, releasable, or otherwise
safe to close. Only `verify` can accept or reject a ready claim.

**Fresh evidence**
: Evidence gathered or rechecked in the current turn after the last relevant
change. Old logs, old CI output, and remembered command results are not fresh
unless they are explicitly revalidated.

**Active slice**
: The one current unit of work. `implement`, `review`, and `verify` should all
name the same active slice, or route back to `plan`.

**Spec**
: The user-approved artifact from `brainstorm`: goals, non-goals, constraints,
options considered, success criteria, and verification strategy.

**Executable Plan**
: The `plan` artifact that turns a clear request or approved Spec into ordered
work, active slice, success criteria, verification path, risks, capabilities,
commit units, and next skill.

**Planning surface**
: Where an Executable Plan is written: a docs plan, issue, feature list, existing
tracker, lightweight chat plan, or three-file backend.

**Recovery surface**
: Durable project-local artifacts that let a future agent resume without chat
history. A three-file backend is one possible recovery surface, not the concept.

**Selected recovery surface**
: The recovery surface chosen for the current project or task. Skills update it
only when the project asks for durable state or when the skill owns that record.

**Capability gap**
: A missing tool, command, check, skill, MCP server, hook, service, environment,
or knowledge entry that blocks reliable work or proof.

**Capability shortlist**
: A signal-bound recommendation table for optional capabilities. Each row needs
repo signal, coverage row, candidate, why, install surface, risk/cost, fallback,
and classification.

**Knowledge freshness**
: The state where README, AGENTS/CLAUDE instructions, docs, generated artifacts,
commands, and recovery surface match current repository behavior.

**Output contract**
: The stable fields a skill reports when it completes or routes away. Output
contracts make handoff, recovery, review, and verification machine-checkable
enough for humans and agents.

**Verification record**
: The `verify` record that maps a ready claim to fresh evidence, success
criteria, skipped checks, capability gaps, residual risks, and final verdict.

**Commit unit**
: A planned milestone-sized change that should be reviewed, verified, and
committed as one coherent step when the project asks for commits.

**Final integration claim**
: The proof target for a multi-phase plan after all commit units are integrated.

## Status Words

Use these status words consistently in skill outputs:

| Word | Meaning |
| --- | --- |
| `PASS` | The skill's claim is supported by current evidence. |
| `FAIL` | The checked claim is disproved by current evidence. |
| `INSUFFICIENT` | Evidence is missing, stale, blocked, or does not map to the claim. |
| `BLOCKED` | Progress needs user input, external capability, or a project-level fix. |
| `ROUTE_BACK` | The wrong lane was reached; another skill owns the missing decision. |
| `UPDATED` | The artifact or recovery surface was changed intentionally. |
| `UNCHANGED` | The artifact was checked and did not need changes. |
| `N/A` | The field does not apply to this task. |

## Shared Output Fields

Each skill may keep its own shape, but should include these concepts when
applicable:

| Field | Meaning |
| --- | --- |
| `Status` | The skill outcome or route state. |
| `Primary artifact` | The Spec, plan, report, verification record, cleanup record, or candidate list. |
| `Active slice` | The current work unit, when the lane is slice-oriented. |
| `Evidence` | Commands, reads, manual signals, or explicit missing evidence. |
| `Success criteria mapping` | Required for `verify`; useful for `review` and `plan`. |
| `Capability gaps` | Missing capabilities and their fallback, if any. |
| `Recovery surface updated` | `yes`, `no`, or `n/a`, with path when relevant. |
| `Ready claim` | `not made` outside `verify`; accepted or rejected only by `verify`. |
| `Next` | The next skill, stop state, or user checkpoint. |

## Boundary Reminders

- `brainstorm` owns Spec clarity, not execution planning.
- `plan` owns the Executable Plan, not requirement discovery.
- `harness-builder` owns project workbench and capability decisions, not vague
product requirements.
- `implement` may run local checks as feedback, but cannot mark ready.
- `diagnose` owns unknown failures and root cause proof.
- `review` owns structural judgment, but cannot mark ready.
- `verify` is the only ready gate.
- `cleanup` owns knowledge freshness and handoff hygiene, not behavior changes.
- `find-skills` discovers candidates; project adoption routes through
`harness-builder`.
