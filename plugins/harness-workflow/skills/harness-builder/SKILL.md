---
name: harness-builder
description: "Use this skill to design or repair a project-level agent workbench: entry rules, project map, verification entry, recovery surface, capability decisions, and anti-entropy guardrails. Trigger it for harness/bootstrap/onboarding/governance or missing workbench gaps; not for vague product requirements before brainstorm/plan."
---

# Harness Builder

Build or repair the minimal useful **project-level harness** for AI coding agents.

A harness is the repo-local operating system around the agent: project map, Project iron laws, protected paths, verification entry, recovery surface, reusable skills, hooks, MCP policy, subagent policy, audit records, and cleanup discipline. "bootstrap" is only a historical alias.

Default to project-local output. Do not modify user-global config unless explicitly requested.

Harness Builder uses one integrated gap model. First decide which harness coverage areas are missing, then decide whether files, scripts, skills, hooks, MCP, or subagents are the right way to close each gap.

## Routing Snapshot

- **Use when**: the repo needs project-level agent governance, recovery, verification, capability, or Research Route decisions.
- **Do not use when**: the user request is still a vague product requirement, or a scoped implementation can proceed with the current workbench.
- **Route to**: unclear requirements go to `brainstorm` / `plan`; approved harness installation goes through `verify` and then `implement` or `cleanup`.

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
- Do not invent acceptance criteria silently; route unclear requirements to `brainstorm` / `plan`.
- Do not install a harness until the Harness Charter states what this harness must make possible and how the user will know it worked.
- Reconcile existing harness files before adding or replacing anything.
- Add files or capabilities only when they close a named coverage gap.
- Keep skills, hooks, MCP, subagents, CI, GC, and external research inside the same Coverage Matrix.
- Treat install packs as implementation assets, not workflow owners.
- Treat three-file as one backend option, not the workflow identity.
- Keep `AGENTS.md` thin and stable.
- Prefer mechanical enforcement for stable architecture boundaries when prose-only rules are too weak.
- Do not claim the harness works without fresh evidence.

## Mandatory execution gates

The full gate policy lives in `references/execution-gates.md`. In the hot path, keep these gates visible:

1. **Question gate** — ask only material questions after evidence collection, or state evidence-backed assumptions.
2. **Harness Charter gate** — objective, non-goals, acceptance criteria, verification path, evidence location, recovery surface, and existing harness reconciliation.
3. **Coverage Matrix gate** — one `Required / Recommended / Deferred / Rejected` table across instructions, recovery, verification, architecture, anti-entropy, skills, hooks, MCP, subagents, external research, dynamic context, and commit protocol.
4. **Capability Discovery gate** — evaluate optional capabilities only for uncovered rows and bind every candidate to one row.
5. **Pack Selection gate** — use install packs only for approved coverage rows and present a dry-run before writing.
6. **Verification design gate** — define fast check, deeper check, evidence location, and unverified risks before installation.
7. **User checkpoint gate** — show the Harness Plan and wait for approval before writing.
8. **Verification gate** — run selected checks after installation; no fresh evidence means no ready claim.
9. **Research Graduation gate** — Research Route must graduate through winner/no-winner, merge mode, cleanup checkpoint, `review`, and `cleanup`.

## Workflow

Detailed procedure: `references/workflow-protocol.md`.

1. **Collect evidence**: user intent, current docs/rules, scripts, tests, CI, git state, existing harness files, protected/generated paths, and cheap dynamic signals. Use `scripts/scan_project.py` when useful.
2. **Reconcile existing harness**: classify old artifacts as keep, patch, archive/deprecate, or reject. Use `references/recovery_surface_policy.md`, `references/anti_entropy.md`, and `references/install_policy.md`.
3. **Form Harness Hypothesis**: summarize repo facts, dynamic state, user intent, missing info, assumptions, and course coverage. Use `references/brainstorming_policy.md` and `references/course_alignment.md`.
4. **Build Coverage Matrix**: classify coverage rows and decide whether each row is satisfied by existing artifacts, a small patch, a new file, a script, a test, CI, GC, skill, hook, MCP, subagent, or manual practice. Use `references/coverage_matrix_policy.md` and `references/architecture_enforcement_policy.md`.
5. **Run Capability Discovery**: run `find-skills` for reusable skill gaps; use targeted web research for current hooks/MCP/external behavior when needed. Use `references/capability_signal_policy.md`, `references/skill_policy.md`, `references/hook_policy.md`, `references/mcp_policy.md`, and `references/web_research_policy.md`.
6. **Select install packs and recovery surface**: use `references/packs/init_scaffold/adapter.md` only for approved rows; choose none, lightweight, three-file, feature-list, or existing recovery surface using `references/recovery_surface_policy.md`.
7. **Write Charter, Plan, and checkpoint**: merge evidence, coverage, capability, research, orchestration, recovery, and verification design into a phase plan; emit `USER CHECKPOINT`.
8. **Install, verify, and record**: after approval, install by phase, validate artifacts, record phase status, and route next work.

## Research Route

Use Research Route only when explicit. Before installing research templates, require Goal, Hypothesis, Counter-hypothesis, Baseline, Scope, Metric, Verify, Guard, Budget, Artifact policy, and Stop rule.

Read `references/research_route_policy.md` before Research Route work, and apply `references/research_graduation_policy.md` plus `references/research_entropy_gate.md` before closeout.

## Output contract

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

For full output and preservation rules, read `references/workflow-protocol.md`.

## Recommended next skill

| Situation | Recommended next skill |
| --- | --- |
| Harness files or capabilities were installed or repaired | `verify` |
| Harness hypothesis exposes unclear goals, non-goals, or success criteria | `brainstorm` |
| Harness plan is approved and first work slice is clear | `implement` |
| Research Route completes | `review`, then `cleanup` |
| Harness verification fails or setup breaks | `diagnose` |
| Harness is current and no implementation is requested | `cleanup` |

## Preservation rule for existing harness-builder assets

The full preservation rule lives in `references/workflow-protocol.md`. The short rule: install packs are additive and must not replace Research Route, subagent policy, hook policy, project-local skill templates, or the current recovery surface unless the user explicitly approves that replacement.

Do not drop or weaken:

- `references/harness_subsystems.md`, `references/project_map_policy.md`, or `references/subagent_policy.md`;
- `templates/research_route/*`;
- `templates/agents/*`, `templates/hooks/*`, and `templates/skills/*`;
- current `scripts/scan_project.py` signals for packaged plugins, Cursor preview, Node script tooling, plugin rules, and evidence-only automation signals.

## 按需读取

- `references/execution-gates.md`：mandatory gates with full details and checkpoint text.
- `references/workflow-protocol.md`：detailed workflow, output contract, and preservation rule.
- `references/coverage_matrix_policy.md`：coverage rows and classification.
- `references/capability_signal_policy.md`：Capability Discovery and shortlist pass.
- `references/recovery_surface_policy.md`：recovery surface selection.
- `references/verification_policy.md`：phase verification design.
- `references/install_policy.md`：project-local install policy.
- `references/anti_entropy.md`：stale-state and cleanup risks.
- `references/research_route_policy.md`：Research Route setup.
- `references/research_graduation_policy.md` and `references/research_entropy_gate.md`：Research Route closeout.
