# Task Plan: [task name]

> Legacy migration reference only. New Harness Workflow plans belong in `docs/plans/`; runtime recovery belongs in `.harness/`.
> Source: adapted from `OthmanAdi/planning-with-files` Chinese `planning-with-files-zh/templates/task_plan.md`.
> License: MIT. Local adaptation: legacy three-file migration reference, active slice, verification commands, and success criteria.

## Objective

[Describe the final verifiable state in one sentence.]

## Scope Contract

- Active slice: [the only smallest verifiable slice being advanced now]
- Non-goals: [things explicitly out of scope for this round]
- Success criteria: [how to know the active slice is complete]
- Verification path: [commands, smoke / E2E, or human signals required]
- Verification path status: `runnable | blocked`
- Required capabilities: [scripts, services, browser, MCP, human check, etc.]
- Fallback evidence: [user-accepted substitute evidence when full verification is unavailable; otherwise `none`]
- Final integration claim: [overall claim for multi-phase or multi-commit work; otherwise `none`]
- Project map: [project map location, for example `docs/project-map.md` or `AGENTS.md#Project map`]

## Current Phase

Phase 1 - [phase name]: `in_progress`

## Overall Success Criteria

- [observable completion criterion 1]
- [observable completion criterion 2]
- [fresh-evidence criterion that maps to Verification path]
- [final integration claim is covered by final verify for multi-phase work]

## Phases

### Phase 1 - Requirements And Boundaries

Status: `in_progress`
Acceptance criteria: [falsifiable completion condition]
Verification commands: [`command 1`, `command 2`]
Success definition: [one sentence describing the successful state]

- [ ] Clarify user intent, constraints, and non-goals.
- [ ] Record accepted spec, rejected options, and risks in `findings.md`.
- [ ] Define active slice, verification path, verification path status, capability gaps, and completion criteria.

### Phase 2 - Project Surface Preparation

Status: `pending`
Acceptance criteria: [falsifiable completion condition]
Verification commands: [`command 1`, `command 2`]
Success definition: [one sentence describing the successful state]

- [ ] Confirm project map, entry point, and relevant files.
- [ ] Confirm `AGENTS.md`, legacy three-file surface, or equivalent state entry is usable.
- [ ] Confirm verification commands, smoke / E2E candidates, fallback evidence, and capability gaps.
- [ ] If verification path is blocked and no user-accepted fallback exists, route to `harness-builder`.

### Phase 3 - Implementation

Status: `pending`
Acceptance criteria: [falsifiable completion condition]
Verification commands: [`command 1`, `command 2`]
Success definition: [one sentence describing the successful state]

- [ ] Implement in small steps within the active slice.
- [ ] Sync relevant docs and legacy three-file artifacts when code, commands, or user-visible behavior change.
- [ ] Record RED / GREEN / REFACTOR or equivalent verification evidence in `progress.md`.

### Phase 4 - Review And Verification

Status: `pending`
Acceptance criteria: [falsifiable completion condition]
Verification commands: [`command 1`, `command 2`]
Success definition: [one sentence describing the successful state]

- [ ] Run structural review against accepted spec, risks, and non-goals.
- [ ] Use `verify` to run relevant verification commands and record fresh evidence.
- [ ] If verification capability is insufficient, record recommended capability and fallback path.

### Phase 5 - Cleanup And Handoff

Status: `pending`
Acceptance criteria: [falsifiable completion condition]
Verification commands: [`command 1`, `command 2`]
Success definition: [one sentence describing the successful state]

- [ ] Clean low-risk temporary artifacts, stale TODOs, duplicate rules, and outdated state.
- [ ] Update `progress.md` and `findings.md` with final evidence and residual risks.
- [ ] Confirm the next session can recover from repository artifacts.

## Commit Protocol

| Commit unit | Phases | Scope | Preconditions | Message template |
| --- | --- | --- | --- | --- |
| M1 | Phase 1-2 | [scope] | review has no Critical + verify PASS | [template] |
| M2 | Phase 3 | [scope] | review has no Critical + verify PASS | [template] |

## Key Questions

1. [open question]
2. [open question]

## Decisions Made

| Decision | Rationale | Evidence / source |
| --- | --- | --- |
|  |  |  |

## Errors Encountered

| Error | Attempts | Resolution | Status |
| --- | --- | --- | --- |
|  | 1 |  |  |

## Blockers

- [current blocker or `none`]

## Next Steps

- [top 1-3 actions]

## Notes

- Only one phase may be `in_progress`.
- `Scope Contract` is the source of truth for WIP=1; do not keep active slice and non-goals only in chat.
- Put major decisions and rejected options in `findings.md`, not in this file.
- Put execution history and command results in `progress.md`.
