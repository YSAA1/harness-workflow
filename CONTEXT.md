# Harness Workflow Context

This context defines the language for the Harness Workflow plugin that turns harness engineering practice into reusable workflow skills for Codex, Claude Code, and Cursor.

## Language

**Harness Builder**:
The project-level skill that designs or repairs the agent workbench: project map, recovery surface, verification entry, local skills, hooks, subagents, MCP policy, and anti-entropy rules.
_Avoid_: bootstrap as the canonical name; keep "bootstrap" only as a historical alias or trigger word.

**Skill Independence**:
The design rule that each workflow skill can run for its own activity without requiring a fixed global sequence or a particular state backend.
_Avoid_: making Harness Builder, planning, or `.harness/` recovery a universal prerequisite.

**Capability Recommendation**:
The Harness Builder activity that searches for task-relevant skills, MCP servers, hooks, subagents, plugins, commands, CI/headless automation, or external agent capabilities before recommending project-level installation.
_Avoid_: treating the current user's installed skills as the full capability universe, or installing optional capabilities without clear value.

**Harness Recommendation Matrix**:
The unified Required / Recommended / Deferred / Rejected table that keeps entry docs, recovery, verification, architecture, anti-entropy, skills, hooks, MCP, subagents, plugins, commands, CI/headless automation, external research, dynamic context, and commit protocol in one recommendation surface.
_Avoid_: turning recommendations into a separate automation profile or shopping list detached from actual harness gaps.

**Capability Recommendation Table**:
The concise evidence-bound table inside Harness Recommendation Mode: recommendation type, candidate, repo signal, why, install surface, approval needed, fallback, verification probe, and priority/classification. Add source evidence, freshness, trust boundary, and risk/cost only when they materially change the decision.
_Avoid_: recommending capabilities that do not close a named recommendation row.

**Helper Skill**:
A top-level callable support skill that owns a thick sub-capability but is not one of the eight active workflow lanes.
_Avoid_: treating helper skills as mandatory workflow steps or hidden internal subroutines.

**Capability Recommender**:
The official-derived helper skill adapted from Anthropic's Claude automation recommender. It performs read-only recommendations for skills, MCP servers, hooks, subagents, plugins, commands, CI/headless automation, and agent tooling.
_Avoid_: installing optional capabilities without a concrete gap and approval boundary.

**Agent Instructions Maintainer**:
The official-derived helper skill adapted from Anthropic's CLAUDE.md improver. It audits and patches durable agent instruction surfaces such as `AGENTS.md`, `CLAUDE.md`, `.claude.md`, `.claude.local.md`, and Cursor rules after a USER CHECKPOINT.
_Avoid_: storing active task state, session logs, or one-off conclusions in durable instruction files.

**Recovery Surface Builder**:
The helper skill that chooses, creates, or repairs the selected recovery backend: `.harness/`, issue tracker, feature list, existing planning files, or no durable state for tiny tasks. It adopts planning-with-files style persistence without forcing root `task_plan.md`, `findings.md`, and `progress.md`.
_Avoid_: creating a second recovery surface when a project already has one that works.
**Recovery Surface**:
The durable project-local artifacts that let a future agent resume work without relying on chat history. Canonical runtime layout is `.harness/` (`recovery_policy.md`, `work_index.md`, `state.md`, `progress.md`, `decisions.md`).
_Avoid_: root-level `task_plan.md` / `progress.md` / `findings.md` or calling legacy layouts "three-file backend".

**Recovery Policy**:
The session entry contract in `.harness/recovery_policy.md`: read order, field map, update triggers.
_Avoid_: storing current task state in `AGENTS.md`.

**Work Index**:
The T3 task registry at `.harness/work_index.md`. **Required** when recovery ≠ `none`. Exactly one `active` row unless parallel actives are declared.
_Avoid_: pointing `AGENTS.md` at one task's plan when the repo has multiple tasks.

**Source-of-Truth Tiers**:
T1–T6 classification (entry, domain, index, active work, evidence, generated) for conflict resolution.
_Avoid_: treating whichever file was edited last as authoritative.

**Design Grill**:
Phase A2 of `brainstorm`: design-tree questioning with concrete scenarios after the coverage matrix gate. **Mandatory for non-trivial work.**
_Avoid_: treating eight-dimension coverage as sufficient design stress-testing.

**Living Docs Discipline**:
When each doc class must update during workflow execution so `.harness/` stays a live index.
_Avoid_: write-once harness docs that drift within a single task.

**Harness Directory**:
The unified `.harness/` implementation of runtime recovery. Executable Plans stay in `docs/plans/`; `.harness/` holds active slice, evidence, and decisions during execution.
_Avoid_: duplicating the full plan inside `state.md` or creating parallel root-level state files.

**Knowledge Cleanup**:
The end-of-work activity that reconciles code, README, AGENTS.md, docs, generated artifacts, and recovery surface so project knowledge does not rot.
_Avoid_: treating cleanup as merely closing task state files.

**Review**:
The workflow activity that checks correctness, scope discipline, design risk, and missing tests before final evidence is claimed.
_Avoid_: using review as a docs synchronization pass.

**Verification**:
The workflow activity that gathers fresh evidence for a concrete claim.
_Avoid_: using verification to redesign scope or clean project knowledge.

**Workflow Skill**:
A focused reusable agent workflow that owns one activity such as brainstorming, planning, implementation, diagnosis, review, verification, handoff, or cleanup.
_Avoid_: making every workflow skill responsible for choosing project state storage.

**Workflow State Backend**:
The chosen storage shape for execution contracts, evidence, decisions, risks, blockers, and next actions during tracked work.
_Avoid_: root-level legacy files; prefer `.harness/`.

**Executable Plan**:
A planning artifact that turns a clear goal or approved spec into ordered work, success criteria, verification path, and handoff guidance. Defaults to `docs/plans/`.
_Avoid_: equating a plan with `.harness/state.md`.

**Spec**:
A user-approved description of the problem, goals, non-goals, behavior, constraints, verification strategy, and plan handoff.
_Avoid_: storing the full spec inside `.harness/progress.md`.

## Relationships

- A **Harness Builder** selects or repairs the **Recovery Surface** and installs `.harness/recovery_policy.md` plus `.harness/work_index.md` when recovery ≠ `none`.
- A **Harness Builder** declares **Source-of-Truth Tiers** in `AGENTS.md` (T1); current task pointers live in T3/T4 only.
- A **Harness Builder** performs **Capability Recommendation** with `$find-skills` and targeted web research when the current task may benefit from reusable skills, MCP servers, hooks, subagents, plugins, commands, CI/headless automation, or agent tooling.
- A `brainstorm` workflow runs **Design Grill** (Phase A2) after the coverage matrix gate for non-trivial work.
- A `brainstorm` workflow produces a **Spec**, defaulting to `docs/specs/YYYY-MM-DD--<topic>.md`, and does not default to writing `.harness/` runtime state.
- A **Recovery Surface** uses **Harness Directory** (`.harness/`), an issue tracker, a feature list, or an existing project status system — not root-level legacy state files.
- A **Workflow Skill** reads and writes through `.harness/` or other selected backend only when its activity requires durable state.
- An **Executable Plan** defaults to `docs/plans/YYYY-MM-DD--<topic>-plan.md`; runtime slice/evidence syncs to `.harness/` when tracked.
- **Skill Independence** means **Harness Builder** is invoked when project-level workbench or recovery design is needed, not because it occupies a mandatory position before or after `brainstorm` or `plan`.
- `cleanup` performs **Knowledge Cleanup** against the current project, with special attention to stale docs, bloated AGENTS.md, missing reader-facing docs, and contradictions between code and documentation.
- **Review**, **Verification**, and **Knowledge Cleanup** are separate gates: review judges correctness and risk, verification proves behavior with fresh evidence, and cleanup reconciles knowledge artifacts.

## Example Dialogue

> **Dev:** "Should `AGENTS.md` link to the current plan?"
> **Domain expert:** "No. T1 points to `.harness/work_index.md`. The active plan is T4, linked from the `active` row."

> **Dev:** "Where does runtime recovery live?"
> **Domain expert:** "Under `.harness/`: `recovery_policy.md`, `work_index.md`, `state.md`, `progress.md`, `decisions.md`. Not root-level legacy files."

> **Dev:** "Should `verify` refuse to run if `.harness/state.md` is missing?"
> **Domain expert:** "No. `verify` uses available evidence. Missing `.harness/` when tracked work needs it is a **Harness Builder** gap."

> **Dev:** "Is coverage matrix completion enough before drafting a Spec?"
> **Domain expert:** "No. **Design Grill** (Phase A2) is mandatory for non-trivial work after the matrix gate."

> **Dev:** "Should every new task run **Harness Builder** before `plan`?"
> **Domain expert:** "No. Use **Harness Builder** when the project workbench or **Recovery Surface** is unclear. If the task already has enough context, `brainstorm`, `plan`, or another **Workflow Skill** can run independently."

> **Dev:** "Should Harness Builder only inspect already installed skills?"
> **Domain expert:** "No. During **Capability Recommendation**, it should use `$find-skills` for strongly relevant reusable skills and targeted web search for useful MCP, hook, plugin, command, or subagent options, then recommend installation only when the value is clear."

> **Dev:** "Can Capability Recommendation recommend every automation that looks helpful?"
> **Domain expert:** "No. It should produce a **Capability Recommendation Table** bound to Harness Recommendation Matrix gaps. Keep it readable: candidate, repo signal, value, install surface, approval boundary, fallback, verification probe, and Required / Recommended / Deferred / Rejected classification. Add trust/risk/source details only when they affect the decision."

> **Dev:** "Does `plan` write Executable Plans into `.harness/state.md`?"
> **Domain expert:** "Plans default to `docs/plans/`. `.harness/state.md` holds the hot runtime index; sync active slice and next there during tracked execution."

> **Dev:** "Should `brainstorm` append a summary to `.harness/decisions.md`?"
> **Domain expert:** "Only if the selected **Recovery Surface** asks for that. The core output of `brainstorm` is a **Spec**."

> **Dev:** "Do we need separate `resume` and `save-session` skills?"
> **Domain expert:** "No. The **Recovery Policy** belongs to **Harness Builder**, while closure and handoff hygiene belong to `cleanup` and the project documents."

> **Dev:** "Is `cleanup` mainly about marking a task complete?"
> **Domain expert:** "No. `cleanup` mainly prevents knowledge rot by reconciling code, docs, AGENTS.md, generated artifacts, and the selected **Recovery Surface**."

> **Dev:** "Should `cleanup` decide whether the implementation is correct?"
> **Domain expert:** "No. That belongs to **Review** and **Verification**. `cleanup` checks whether project knowledge now matches the verified state."

## Flagged Ambiguities

- "bootstrap" was used to mean the canonical project harness construction skill. Resolved: the canonical term is **Harness Builder**; "bootstrap" remains only a historical alias or trigger word.
- "resume" and "save-session" were used as workflow skills. Resolved: recovery is a project-level policy generated by **Harness Builder**, not a dedicated skill lane.
