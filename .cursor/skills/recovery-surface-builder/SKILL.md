---
name: recovery-surface-builder
description: "Use when the need is recovery surface only: work index, active slice, state, progress, decisions, risks, evidence, verification commands, or session catch-up. For cross-surface workbench bootstrap or repair, use harness-builder."
---

# Recovery Surface Builder

This helper designs, creates, or repairs a project's recovery surface: the durable place an agent can read after `/clear`, interruption, or handoff to know what is active, what changed, what was decided, and what evidence exists.

It is a **Helper Skill** owned by `harness-builder` routing for recovery-class gaps. It also adopts the useful idea from planning-with-files: persistent working memory must be read before decisions and updated after actions. Harness-workflow keeps that idea backend-neutral and does not default every project to root `task_plan.md`, `findings.md`, and `progress.md`.

## Scope

Use this for choosing a recovery backend, creating `.harness/`, repairing an existing recovery surface, documenting active slice and verification commands, and session catch-up after interruption.

Do not use this for broad capability recommendations, full instruction-file maintenance, task implementation, or research gating. This plugin no longer ships external research-governance integration.

## Backend Options

| Backend | Use when | Default files |
| --- | --- | --- |
| `none` | tiny one-turn task with no durable state needed | none |
| `lightweight` | ordinary repo maintenance where git diff plus chat is enough | optional plan/spec only |
| `harness` | multi-step or cross-session work needs durable state | `.harness/work_index.md`, `.harness/state.md`, `.harness/progress.md`, `.harness/decisions.md` |
| `feature-list` | project already has an issue tracker or feature board | existing issue/plan docs plus recovery field map |
| `existing` | project already has planning files | keep existing files and map required fields |

Never create a parallel recovery surface when one already exists and works.

## Required Field Map

Every chosen backend must answer:

- active slice: what is being worked on now?
- status: proposed, approved, active, blocked, ready, done, or abandoned
- next action: what should the next agent do first?
- evidence log: what commands or observations support the current claim?
- decisions: what was decided and why?
- risks/blockers: what could invalidate the current path?
- verification command: what proves readiness?
- source of truth: which file owns each field?

## Planning-With-Files Discipline

Adopt these behaviors from planning-with-files when work is non-trivial:

- Read the durable plan/state before deciding next steps.
- Keep progress as an append-only or timestamped trail where practical.
- Record findings separately from commands when they affect later decisions.
- Update the recovery surface after meaningful actions, not only at the end.
- Leave enough context for a fresh agent to resume without re-discovering the whole repo.

Harness adaptation: do not force root `task_plan.md`, `findings.md`, and `progress.md`. Prefer `.harness/` when harness-workflow owns the state, or map existing issues, specs, plans, ADRs, or docs.

## Build/Repair Flow

1. Inspect project entrypoints and existing state files.
2. Identify whether the user wants creation, repair, migration, or catch-up.
3. Propose backend choice and field map.
4. Stop for USER CHECKPOINT before creating or rewriting durable files, unless the user already approved the exact change.
5. Create or patch only the selected recovery surface.
6. Add a thin pointer from durable agent instructions only if needed.
7. Run the narrowest validation command or a structural self-check.
8. Report the resume path and next action.

## Minimal `.harness` Layout

```text
.harness/
  recovery_policy.md
  work_index.md
  state.md
  progress.md
  decisions.md
```

## Recommended next skill

- Use `harness-builder` when recovery is one row in a broader workbench recommendation (controller synthesizes the matrix).
- Use `agent-instructions-maintainer` when durable instructions must be updated beyond a thin pointer.
- Use `plan` when an approved spec needs an executable active slice.
- Use `verify` when the recovery surface already claims ready and needs fresh evidence.
