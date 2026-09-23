---
name: writing-for-agents
description: "Edits 'text written for agents to read': writing and revising skills themselves; auditing and revising durable instructions such as AGENTS.md/CLAUDE.md/Cursor rules; repairing and migrating the .harness recovery surface (work_index/state/lessons). Triggers: the user asks to write/revise a skill (写/改 skill), update or audit durable instructions (更新或审计持久指令), or repair/migrate a recovery surface (修复迁移恢复面). Division of labor — building the workbench in a target project goes to harness-builder; this skill handles only text and protocol."
---

# Writing for Agents

Write and maintain any surface agents consume: skills, `AGENTS.md` / `CLAUDE.md` / Cursor rules, documents reached by pointers, recovery/state surfaces. The packaging differs; the writing discipline does not — make the agent take the same _process_ every run, not produce the same output.

Daily task flows (brainstorm/plan/ship) do not pass through this skill: `plan` keeps the records; this skill repairs the filing system.

The core writing discipline (context pointers, the two loads, information hierarchy, completion criteria, leading words, pruning) is in `references/writing-core.md`; the invocation choice and router rules for writing a skill are in `references/skill-mechanics.md`. Read the corresponding reference before modifying any document in this skill family.

## Maintaining durable instructions

1. Discover the files actually in effect within the specified scope, distinguishing global, project, subdirectory, and generated mirrors; the Codex global entry is `$CODEX_HOME/AGENTS.md` (default `~/.codex`); Claude Code and Cursor use their own discovery mechanisms.
2. Check the rules against the current code, configuration, run entries, and user authorization, distinguishing outdated facts, conflicts, duplication, over-broad triggers, and constraints that still hold value; quality dimensions, update rules, and the optional outline are in `references/instructions-maintenance.md`.
3. Report problems with specific locations, consequences, and suggestions. Audit-only means read-only; once authorized, complete in-scope deletions, merges, migrations, and revisions, ask about key contract trade-offs, and do not re-confirm already-authorized edits.
4. Factual evidence says how the system works now; user/project contracts say how it should work; when they disagree, report — do not override the target contract with an existing bug.

## Maintaining the recovery/state surface

1. Check the project's existing recovery entries and this session's goal; old-task state does not override current instructions; read-only catch-up reports first, no writing files by default.
2. Choose the minimal backend per `references/recovery_surface_policy.md` (none / lightweight / harness / feature-list / existing); one authoritative entry per task/track, independent tracks may be active simultaneously. The minimal harness surface for a new task (work_index + state) is created inline by `plan` (`brainstorm` in a project with an existing recovery surface only pre-registers this track's row and does not create a surface); supplementary file templates are in `../harness-builder/templates/` (work_index/state/lessons), instantiated on demand; when harness-builder is not installed, hand-write isomorphic files from the recoverable field set in `references/recovery_surface_policy.md`, not depending on the templates' existence.
3. Record goal, status, next step, evidence links, and blockers; update on phase changes, key decisions, and hand-offs, not per tool-call count (see `references/planning_with_files_adaptation.md`). lessons read/write: read at the start of work (if present); write at cleanup close-out and after diagnose confirms the root cause; each entry carries a trigger condition and is deleted once invalid — no historical archive.
4. Passing the structural recoverability check is not passing business acceptance; migrate only when authorized and the benefit is clear, keeping traceability and links.

## Recommended next skill

- Narrow edit, already verified: end.
- Multi-surface workbench overhaul: `harness-builder`; user requests an independent review: `review`.
