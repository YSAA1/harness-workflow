---
name: harness-builder
description: "Project-level Harness Builder for designing or repairing the project workbench and recovery surface: AGENTS.md/CLAUDE.md, project map, project iron laws, verification entry point, reusable skills, justified hooks, subagents, MCP policy, Capability Discovery, and anti-entropy guardrails. Trigger when the user says harness builder, bootstrap, initialize, onboard, build harness, prepare workbench, create project rules, find reusable skills, or repair recovery surface."
---

# Harness Builder

This is the workflow's project harness skill. It builds the minimal useful **project-level harness** for AI coding agents and treats "bootstrap" as a historical alias or trigger word, not the canonical skill identity.

A harness is the project-specific operating system around an agent: project map, hard rules, context, recovery surface, verification, scope control, lifecycle, reusable skills, hooks, reviewer agents, and audit records.

Default to project-local output. Do not modify user-global config unless explicitly requested.

---

## Core idea

Do not start by generating files.

Start by collecting evidence, identifying information gaps, and brainstorming only the questions that matter for this project's harness.

The working model is:

```text
repo evidence + user intent + Capability Discovery + optional research
→ Harness Hypothesis
→ Harness Plan
→ project-local install
→ verification and audit records
```

Use `references/brainstorming_policy.md` before asking questions.

---

## Non-negotiable goals

Design the harness so future agent work is:

- **Controllable**: project rules, protected paths, permissions, and workflow are explicit.
- **Verifiable**: there is a fast deterministic check before success is claimed.
- **Recoverable**: future sessions can resume from a declared recovery surface instead of chat history.
- **Auditable**: installed components, design reasons, and rejected options are recorded.
- **Sustainable**: the harness resists instruction bloat, stale skills, noisy hooks, and project entropy.

Use `references/harness_subsystems.md` for the detailed model.

---

## Default flow

Follow this sequence unless the user asks for a narrower task.

1. **Collect evidence**
   - Read the user request and scan the repo.
   - Use `scripts/scan_project.py` if useful.
   - Identify known facts, unknowns, existing harness files, recovery surface, verification signals, protected paths, and project-specific rules.

2. **Gap-driven brainstorm**
   - Do not ask a fixed questionnaire.
   - Ask only questions that change the harness design.
   - For each question, explain why it matters, which harness component it affects, and the conservative default if unanswered.
   - Produce a **Harness Hypothesis**.
   - Use `references/brainstorming_policy.md` and `references/course_alignment.md`.

3. **Choose orchestration mode**
   - Use solo mode for small/simple projects.
   - Recommend read-only subagents when they reduce a specific gap: repo map, verification, risk, skills, research, or plan review.
   - Subagents should read, research, or review. The main agent installs files.
   - Use `references/subagent_orchestration.md`.

4. **Capability Discovery**
   - First decide what capability the current task actually needs.
   - For skill capabilities, use Claude Code skill discovery first: ask Claude to list available skills, inspect project/personal skill folders, or invoke `/find-skills` if that skill is installed. Search strongly relevant reusable skills beyond the current installed inventory.
   - For MCP, hooks, or external agent capabilities, use targeted web search for official docs, mature implementations, or task-specific integrations.
   - Classify each candidate as `Required`, `Recommended`, `Deferred`, or `Rejected` by value, enablement, risk/cost, and fallback.
   - Do not install or recommend skills, MCP, hooks, or subagents merely because they might be useful.
   - Use `scripts/find_skills.py` only as local availability support; it is not the discovery boundary.
   - Use `references/skill_policy.md`, `references/web_research_policy.md`, `references/hook_policy.md`, and `references/mcp_policy.md`.

5. **Research only when needed**
   - Use web search for current external facts: Codex/Claude syntax, MCP config, hook schema, official framework commands, or public skill examples.
   - Record adopted research in `.harness/research_notes.md`.
   - Use `references/web_research_policy.md`.

6. **Choose recovery surface**
   - Select or repair the project recovery surface only if the task needs durable state.
   - Options include none, lightweight, three-file, feature-list, or existing project systems.
   - Three-file maps `active_slice` to `task_plan.md`, evidence to `progress.md`, and decisions/risks to `findings.md`.
   - Declare field mapping without making three-file state a universal prerequisite.
   - Use `references/recovery_surface_policy.md`.

7. **Synthesize Harness Plan**
   - Merge user intent, repo evidence, gap answers, capability candidates, subagent findings, research, and recovery-surface choice.
   - Produce `Required`, `Recommended`, `Deferred`, and `Rejected`.
   - Include orchestration strategy and course coverage check.
   - Use `references/profiles.md` and `references/decision_matrix.md`.

8. **User checkpoint**
   - Before installing, show the plan and ask for confirmation unless the user explicitly authorized direct install.
   - Do not install if the Harness Hypothesis has not considered the relevant course dimensions.

9. **Install only approved project-local components**
   - Install `Required` only unless the user approved more.
   - Prefer: `AGENTS.md`, `CLAUDE.md`, `scripts/agent/check.sh`, `docs/agent/*`, `.harness/*`, `.agents/skills/*`, `.claude/*`, `.codex/*`.
   - Use `references/install_policy.md`.

10. **Verify**
   - Validate files, frontmatter, JSON/TOML/YAML, hook scripts, and fast check command.
   - Use `scripts/validate_harness.py` where possible.
   - Do not claim the harness works if verification was not run or failed.

11. **Record and evolve**
   - Update `.harness/manifest.yaml`, `.harness/decisions.md`, `.harness/state.md`, skill inventory, and research notes.
   - For later cleanup, use `references/anti_entropy.md`.

---

## Harness Hypothesis format

Before a full Harness Plan, produce:

```markdown
# Harness Hypothesis

## Known from repo

## Known from user

## Missing information
| Missing info | Why it matters | Affected harness component | Conservative default |
|---|---|---|---|

## Questions for user

## Assumptions if unanswered

## Course coverage check
| Dimension | Considered? | Adopt / Defer / Reject | Reason |
|---|---|---|---|
```

If no questions are needed, state the assumptions and proceed.

---

## What to generate first

For most projects, the first useful harness is:

- `AGENTS.md` with:
  - project overview;
  - project map;
  - quick start;
  - Project iron laws / hard rules;
  - harness map;
  - required reading by task type;
  - protected paths;
  - Definition of Done.
- `scripts/agent/check.sh`
- `docs/agent/project_context.md`
- `docs/agent/workflow.md`
- `docs/agent/verification.md`
- `.harness/manifest.yaml`
- `.harness/decisions.md`
- recovery surface declaration: `.harness/state.md`, project docs, an issue/task system, or three-file backend

Add project-local skills, hooks, subagents, and MCP only when the plan justifies them.

---

## Reference routing

Read the relevant reference before detailed work:

- brainstorm and Harness Hypothesis: `references/brainstorming_policy.md`
- Learn Harness Engineering alignment: `references/course_alignment.md`
- subagent orchestration: `references/subagent_orchestration.md`
- AGENTS.md design: `references/project_map_policy.md`
- five harness subsystems: `references/harness_subsystems.md`
- install layout: `references/install_policy.md`
- skill decisions: `references/skill_policy.md`
- recovery surface policy: `references/recovery_surface_policy.md`
- verification: `references/verification_policy.md`
- hooks: `references/hook_policy.md`
- subagents: `references/subagent_policy.md`
- MCP: `references/mcp_policy.md`
- profiles: `references/profiles.md`
- anti-entropy repair: `references/anti_entropy.md`
- web research: `references/web_research_policy.md`

---

## Report style

Be practical and explicit.

Always state:

- what evidence was found in the repo;
- what is unknown and why it matters;
- what questions remain for the user;
- what will be installed now;
- what is deliberately deferred or rejected;
- why each required or recommended capability is worth its cost;
- how the harness will be verified;
- what future failure would justify adding more harness.

Prefer a small working harness over a large impressive one.
