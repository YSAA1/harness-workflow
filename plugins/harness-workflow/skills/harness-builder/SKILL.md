---
name: harness-builder
description: "Project-level Harness Builder for designing or repairing the project workbench and recovery surface: AGENTS.md/CLAUDE.md, project map, project iron laws, verification entry point, reusable skills, justified hooks, subagents, MCP policy, Capability Discovery, and anti-entropy guardrails. Trigger when the user says harness builder, bootstrap, initialize, onboard, build harness, prepare workbench, create project rules, find reusable skills, or repair recovery surface."
---

# Harness Builder

Build or repair the minimal useful **project-level harness** for AI coding agents.

A harness is the repo-local operating system around the agent: project map, Project iron laws, protected paths, verification entry, recovery surface, reusable skills, hooks, MCP policy, subagent policy, audit records, and cleanup discipline. "bootstrap" is only a historical alias.

Default to project-local output. Do not modify user-global config unless explicitly requested.

## When to use

- User asks to bootstrap, initialize, onboard, build harness, create project rules, or repair agent governance.
- Project entry, verification command, recovery surface, protected paths, or capability policy is unclear.
- The repo needs project-local skills, hooks, MCP, subagents, or anti-entropy rules evaluated.
- User explicitly asks for autoresearch, autonomous research, repeated investigation, or method exploration.

Prefer running after `brainstorm` or `plan` when goal, non-goals, success criteria, implementation shape, and verification strategy are known. Direct harness audit is allowed, but still starts from evidence and must still produce a user-visible harness contract before installation.

## Hard rules

- Do not start by generating files.
- Collect repo evidence before questions or installation.
- Ask only questions that change harness design.
- Do not invent acceptance criteria silently. If objective, non-goals, success criteria, or verification strategy are not evidence-backed, ask or route to `brainstorm` / `plan`.
- Do not install a harness until the Harness Charter states what this harness must make possible and how the user will know it worked.
- When a repo already has harness files, reconcile the existing system before adding or replacing anything.
- Do not install on user silence.
- Add capabilities only when they close a real verification, observability, automation, or domain gap.
- Treat three-file as one backend option, not the workflow identity.
- Keep `AGENTS.md` thin and stable; never mix current active-slice state, one-off conclusions, or stale recovery notes into it.
- Do not claim the harness works without fresh evidence.
- Use `references/research_route_policy.md` before Research Route work.

Working model:

```text
repo evidence + user intent + existing harness reconciliation + Capability Discovery + optional research
-> Harness Hypothesis
-> Harness Charter
-> Harness Plan
-> user checkpoint
-> project-local install
-> verification and audit records
```

## Mandatory execution gates

These gates are required unless the user explicitly asks for read-only explanation or a narrower single-file task. If skipped, state why.

1. **Question gate**
   - After evidence collection, ask the smallest material question set.
   - Questions must cover missing target outcome, non-goals, acceptance criteria, verification depth, and current source of truth when those are not already clear.
   - If no question is needed, say `No user questions needed` and list evidence-backed assumptions.
   - If fast/deep validation is unclear, ask at least one verification question before writing the Harness Plan.

2. **Harness Charter gate**
   - Before the Harness Plan, state:
     - objective and non-goals for this harness;
     - user-facing acceptance criteria;
     - verification path and evidence location;
     - selected recovery surface and source-of-truth priority;
     - existing harness components to keep, patch, archive, or reject.
   - If any required field is unknown, ask the user or route to `brainstorm` / `plan`; do not fill it with template text.

3. **Capability Discovery gate**
   - Always produce a `Required / Recommended / Deferred / Rejected` table.
   - For skill gaps, invoke `$find-skills` / `find-skills` or state `No reusable skill search needed` with reason.
   - For hooks, MCP, subagents, agent config, or recently changed external tool behavior, use targeted web search or state `No web research needed` with reason.

4. **Verification design gate**
   - Before installation, propose fast default check, deeper smoke/E2E/manual check, evidence location, and unverified risks.
   - If validation command is unknown, ask whether to adopt a conservative default: syntax/import/config smoke, dry-run, or equivalent.

5. **User checkpoint gate**
   - Before writing or installing harness files, show the Harness Plan and ask for approval.
   - Exact checkpoint text:

```text
USER CHECKPOINT
Approve this Harness Plan before I install project-local files:
- Charter:
- Install:
- Patch existing:
- Archive/deprecate:
- Defer:
- Reject:
- Verification:
Reply approve / change / stop.
```

6. **Verification gate**
   - After installation, run the selected validation command or state the concrete blocker.
   - No fresh evidence means no ready claim.

## Workflow

1. **Collect evidence**
   - Read user intent, `AGENTS.md`/`CLAUDE.md`, README, docs, scripts, tests, CI, git state, existing `.harness/`, `.agents/skills/`, `.codex/`, `.claude/`, protected/generated paths.
   - For existing harnesses, identify authoritative vs stale sources and note conflicting claims before planning changes.
   - Use `scripts/scan_project.py` if useful.

2. **Reconcile existing harness**
   - If harness artifacts already exist, classify each as keep, patch, archive/deprecate, or reject.
   - Name the current source of truth for project rules, active work, evidence, decisions, and next actions.
   - Do not create a second recovery surface unless the existing one cannot represent the required semantic fields.
   - Use `references/recovery_surface_policy.md`, `references/anti_entropy.md`, and `references/install_policy.md`.

3. **Form Harness Hypothesis**
   - Summarize known repo facts, known user intent, missing info, questions, assumptions, and course coverage.
   - Use `references/brainstorming_policy.md` and `references/course_alignment.md`.

4. **Choose orchestration mode**
   - Use solo mode for small repos.
   - Recommend read-only subagents only for specific gaps: repo map, verification, risk, skills, research, or plan review.
   - Main agent installs files. See `references/subagent_orchestration.md`.

5. **Run Capability Discovery**
   - For reusable skills, use `find-skills` when a real skill gap exists.
   - For hooks/MCP/external agent behavior, use targeted web search against official docs or mature sources.
   - Classify each candidate by value, enablement, risk/cost, and fallback.
   - Record adopted external research in `.harness/research_notes.md`.
   - See `references/skill_policy.md`, `references/web_research_policy.md`, `references/hook_policy.md`, `references/mcp_policy.md`.

6. **Handle Research Route only when explicit**
   - Require Goal, Hypothesis, Counter-hypothesis, Baseline, Scope, Metric, Verify, Guard, Budget, Artifact policy, and Stop rule.
   - If incomplete, return to gap-driven questions.
   - If approved, install `templates/research_route`: `docs/research/research_plan.md`, `docs/research/evidence_log.md`, `docs/research/iteration_protocol.md`, `.harness/research_manifest.yaml`.
   - Preserve failed evidence before rollback. Use `git reset --hard` only inside an approved isolated research branch/worktree after evidence is recorded.

7. **Choose recovery surface**
   - Options: none, lightweight, three-file, feature-list, existing system.
   - For three-file, map `active_slice` to `task_plan.md`, evidence to `progress.md`, decisions/risks to `findings.md`.
   - Declare semantic field mapping. Do not force file layout. See `references/recovery_surface_policy.md`.

8. **Write Harness Charter and Plan**
   - Charter first: objective, non-goals, user-facing acceptance criteria, verification path, evidence location, selected recovery surface, and source-of-truth priority.
   - Then merge evidence, answers, capability decisions, research, orchestration, recovery surface, and verification design into the Harness Plan.
   - Use `references/profiles.md` and `references/decision_matrix.md`.

9. **Checkpoint**
   - Emit `USER CHECKPOINT`.
   - Wait for explicit approval unless user already authorized direct changes in this turn.

10. **Install approved project-local components**
   - Install `Required` only unless user approves more.
   - Prefer `AGENTS.md`, `scripts/agent/check.sh`, `docs/agent/*`, `.harness/*`, `.agents/skills/*`, `.codex/*`.
   - For existing harness files, patch only approved sections and record whether old content was kept, moved, or marked stale.
   - Use templates instead of hand-creating large boilerplate. See `references/install_policy.md`.

11. **Verify and record**
   - Validate files, frontmatter, JSON/TOML/YAML, hook scripts, and fast check command.
   - Use `scripts/validate_harness.py` where possible.
   - Update `.harness/manifest.yaml`, `.harness/decisions.md`, `.harness/state.md`, skill inventory, and research notes.
   - Use `references/anti_entropy.md` for cleanup drift.

## Output contract

Before approved installation:

```text
HARNESS EVIDENCE
EXISTING HARNESS RECONCILIATION
HARNESS QUESTIONS
HARNESS CHARTER
CAPABILITY DISCOVERY
VERIFICATION DESIGN
HARNESS PLAN
USER CHECKPOINT
```

After approved installation:

```text
HARNESS INSTALL REPORT
VERIFICATION
RECORDED STATE
NEXT
```

Always state found evidence, unknowns, user questions, charter assumptions, install/patch/archive/defer/reject decisions, capability value/cost, verification plan, and skipped-gate reasons.

## Recommended next skill

| Situation | Recommended next skill |
| --- | --- |
| Harness files or capabilities were installed or repaired | `verify` |
| Harness hypothesis exposes unclear goals, non-goals, or success criteria | `brainstorm` |
| Harness plan is approved and first work slice is clear | `implement` |
| Harness verification fails or setup breaks | `diagnose` |
| Harness is current and no implementation is requested | `cleanup` |
