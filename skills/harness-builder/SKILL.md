---
name: harness-builder
description: "Use this skill to design or repair a project-level agent workbench: entry rules, project map, verification entry, recovery surface, capability decisions, and anti-entropy guardrails. Trigger it for harness/bootstrap/onboarding/governance or missing workbench gaps; not for vague product requirements before brainstorm/plan."
---

# Harness Builder

Controller for building or repairing a minimal useful **project-level harness**:
project map, `AGENTS.md`, Project iron laws, verification entry, selected
recovery surface, capability decisions, audit records, and cleanup discipline.

Default to project-local output. Do not modify user-global config unless the
user explicitly asks for it.

## Routing Snapshot

- **Use when**: the repo needs project-level harness governance, recovery,
  verification entry, Capability Discovery, Research Route, or capability
  policy decisions.
- **Do not use when**: the user request is vague, or a scoped implementation can
  proceed with the current workbench.
- **Route to**: unclear goals go to `brainstorm` / `plan`; approved harness
  installation goes to `implement`, then `verify` and `cleanup`.

## Hard Rules

- Evidence first: collect repo facts before questions, plans, or files.
- Do not install on silence. Harness Charter, Coverage Matrix, Harness Plan,
  and `USER CHECKPOINT` come before writes.
- Requests like "start", "initialize", "build harness", or "build from latest
  Spec/Plan" authorize evidence collection and plan drafting only; they are not
  approval to write project files.
- Skip the checkpoint only when the current user message explicitly says to
  skip it and lists the exact files or actions to perform.
- Ask only questions that change harness design.
- Do not invent acceptance criteria. If objective, non-goals, success criteria,
  or verification strategy are not evidence-backed, ask or route back.
- Reconcile existing harness sources before adding new ones: keep, patch,
  archive/deprecate, or reject.
- Add files, scripts, skills, hooks, MCP, subagents, CI, GC, or packs only when
  they close one named coverage gap.
- Treat install packs as implementation assets, not workflow owners.
- Treat three-file as one backend option, not the workflow identity.
- Keep `AGENTS.md` thin; never mix current active-slice state, one-off
  conclusions, or stale recovery notes into it.
- Prefer mechanical enforcement for stable boundaries: tests, lint rules,
  baselines, ratchets, and agent-readable errors beat prose-only rules.
- Do not claim the harness works without fresh evidence.

## Working Model

```text
repo evidence + user intent + existing harness reconciliation
-> Harness Hypothesis
-> Harness Charter
-> Coverage Matrix
-> Capability Discovery for uncovered gaps
-> Capability Shortlist pass for selected rows
-> Pack Selection for selected coverage rows
-> Harness Plan
-> USER CHECKPOINT
-> project-local install by phase
-> phase verification and audit records
```

## Mandatory execution gates

Required unless the user requested read-only explanation or a narrower
single-file task. If skipped, state why.

1. **Question gate**
   - After evidence collection, ask the smallest material question set.
   - Cover missing target outcome, non-goals, acceptance criteria, verification
     depth, and current source of truth when unclear.
   - If no question is needed, say `No user questions needed` and list
     evidence-backed assumptions.

2. **Harness Charter gate**
   - Before the Harness Plan, state objective, non-goals, user-facing acceptance
     criteria, verification path, evidence location, selected recovery surface,
     source-of-truth priority, and existing harness decisions.
   - Unknown required fields trigger a question or route to `brainstorm` /
     `plan`.

3. **Coverage Matrix gate**
   - Produce one `Required / Recommended / Deferred / Rejected` table across:
     agent entry and project map; static docs and durable rules; selected
     recovery surface; verification entry and deeper checks; architecture
     boundaries and mechanical enforcement; anti-entropy and stale-state
     detection; skill fit; hook fit; MCP fit; subagent fit; external research
     fit; dynamic context; commit protocol and milestone discipline.
   - State whether each row is satisfied, patched, newly installed, deferred, or
     rejected.
   - read_when: `references/coverage_matrix_policy.md`,
     `references/architecture_enforcement_policy.md`, `references/anti_entropy.md`.

4. **Capability Discovery gate**
   - Run after the Coverage Matrix exposes an uncovered or weak row.
   - Evaluate skills, hooks, MCP, subagents, external research, CI, GC, and
     helper scripts as row-bound candidates.
   - Each Capability Shortlist pass row states repo signal, candidate, coverage
     row, why, install surface, risk/cost, fallback, and classification.
   - For skill gaps, invoke `$find-skills` / `find-skills`, or state
     `No reusable skill search needed` with reason.
   - For hooks, MCP, subagents, agent config, CI, GC, architecture tooling, or
     recently changed external tool behavior, use targeted web search, or state
     `No web research needed` with reason.
   - In analysis-only mode, output a recommendation report; do not write files
     or enter Pack Selection.
   - read_when: `references/capability_signal_policy.md`,
     `references/skill_policy.md`, `references/hook_policy.md`,
     `references/mcp_policy.md`, `references/subagent_orchestration.md`,
     `references/web_research_policy.md`.

5. **Pack Selection gate**
   - Run only after Coverage Matrix and Capability Discovery expose a real gap.
   - Use `init_scaffold` only for approved rows such as AGENTS snippets,
     architecture docs, boundary tests, linter snippets, CI templates, read-only
     GC, or security docs.
   - Produce a pack dry-run: target files, create/patch/skip/defer/reject
     status, coverage-row binding, verification command, and blockers.
   - Reject unbound output or anything duplicating a better existing artifact.
   - read_when: `references/packs/init_scaffold/adapter.md`,
     `references/packs/init_scaffold/precedence.md`.

6. **Verification design gate**
   - Before installation, propose fast check, deeper smoke/E2E/manual check,
     evidence location, unverified risks, and per-phase acceptance.
   - If validation command is unknown, ask whether to adopt a syntax/import/
     config smoke, dry-run, or equivalent.
   - read_when: `references/verification_policy.md`.

7. **User checkpoint gate**

```text
USER CHECKPOINT
Approve this Harness Plan before I install project-local files:
- Charter:
- Coverage:
- Install:
- Patch existing:
- Archive/deprecate:
- Defer:
- Reject:
- Verification:
Reply approve / change / stop.
```

8. **Verification gate**
   - After installation, run selected validation commands and phase checks, or
     state the blocker. No fresh evidence means no ready claim.

9. **Research Graduation gate**
   - Required only when Research Route is used.
   - Before research closeout, choose a winner or explicit no-winner, declare
     merge mode, and record branch/worktree cleanup.
   - Preserve failed evidence before rollback. Use `git reset --hard` only
     inside an approved isolated research branch/worktree after evidence is
     preserved.
   - read_when: `references/research_route_policy.md`,
     `references/research_graduation_policy.md`,
     `references/research_entropy_gate.md`, `templates/research_route`.

## Workflow Skeleton

1. Collect evidence: user intent, Spec/Executable Plan if present, `AGENTS.md`,
   README/docs, scripts/tests/CI, git state, existing `.harness/`, `.agents/`,
   `.codex/`, `.claude/`, generated/protected paths, and cheap dynamic signals.
2. Reconcile existing harness and name current truth for rules, active work,
   evidence, decisions, risks, and next actions.
3. Form Harness Hypothesis: facts, missing info, questions, assumptions, course
   coverage, and orchestration mode.
4. Build Coverage Matrix, run Capability Discovery, select packs only for
   approved rows, and choose recovery surface: `none`, `lightweight`,
   `three-file`, `feature-list`, or `existing`.
5. For three-file, map `active_slice` to `task_plan.md`, evidence to
   `progress.md`, and decisions/risks to `findings.md`.
6. Write Harness Charter and phased Harness Plan, emit `USER CHECKPOINT`, wait
   for `approve`, then install only approved components by phase. Skip this wait
   only when the current user explicitly says to skip the checkpoint and lists
   the exact files or actions to perform.
7. Verify, record phase status, and route to the next skill.

## Output Contract

Before approved installation:

```text
HARNESS EVIDENCE
EXISTING HARNESS RECONCILIATION
HARNESS QUESTIONS
HARNESS CHARTER
HARNESS COVERAGE MATRIX
CAPABILITY DISCOVERY
PACK SELECTION
PACK DRY RUN
VERIFICATION DESIGN
HARNESS PLAN
USER CHECKPOINT
```

After approved installation:

```text
HARNESS INSTALL REPORT
PACK INSTALL REPORT
PHASE VERIFICATION
RECORDED STATE
NEXT
```

Always state evidence, unknowns, questions, charter assumptions, coverage
decisions, capability value/cost, pack decisions, install/patch/archive/defer/
reject decisions, verification plan, phase status, and skipped-gate reasons.

## Asset Routing

`SKILL.md` is the controller. Support assets must be owned by a gate, coverage
row, pack, script, or preservation rule. See `references/asset-routing.md`
before adding, merging, downgrading, archiving, or deleting assets.

## Recommended next skill

| Situation | Recommended next skill |
| --- | --- |
| Harness files or capabilities were installed or repaired | `verify` |
| Harness hypothesis exposes unclear goals, non-goals, or success criteria | `brainstorm` |
| Harness plan is approved and first work slice is clear | `implement` |
| Research Route completes | `review`, then `cleanup` |
| Harness verification fails or setup breaks | `diagnose` |
| Harness is current and no implementation is requested | `cleanup` |
