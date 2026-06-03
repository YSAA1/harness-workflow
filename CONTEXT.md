# Harness Workflow Context

This context defines the language for the Harness Workflow plugin that turns harness engineering practice into reusable workflow skills for Codex, Claude Code, and Cursor.

## Language

**Harness Builder**:
The project-level skill that designs or repairs the agent workbench: project map, recovery surface, verification entry, local skills, hooks, subagents, MCP policy, and anti-entropy rules.
_Avoid_: bootstrap as the canonical name; keep "bootstrap" only as a historical alias or trigger word.

**Skill Independence**:
The design rule that each workflow skill can run for its own activity without requiring a fixed global sequence or a particular state backend.
_Avoid_: making Harness Builder, planning, or three-file state a universal prerequisite.

**Capability Recommendation**:
The Harness Builder activity that searches for task-relevant skills, MCP servers, hooks, subagents, plugins, commands, CI/headless automation, or external agent capabilities before recommending project-level installation.
_Avoid_: treating the current user's installed skills as the full capability universe, or installing optional capabilities without clear value.

**Harness Recommendation Matrix**:
The unified Required / Recommended / Deferred / Rejected table that keeps entry docs, recovery, verification, architecture, anti-entropy, skills, hooks, MCP, subagents, plugins, commands, CI/headless automation, external research, dynamic context, and commit protocol in one recommendation surface.
_Avoid_: turning recommendations into a separate automation profile or shopping list detached from actual harness gaps.

**Capability Recommendation Table**:
The evidence-bound table inside Harness Recommendation Mode: repo signal, source evidence, freshness, candidate, recommendation row, why, install surface, trust boundary, approval needed, risk/cost, fallback, verification probe, and classification.
_Avoid_: recommending capabilities that do not close a named recommendation row.

**Research Route**:
A Harness Builder mode for explicit autoresearch or open-ended method exploration after enough brainstorm or plan context exists. It creates a project-local research plan, evidence log, iteration protocol, and research manifest.
_Avoid_: treating Research Route as a mandatory lane for all work, a replacement for brainstorm, or a generic hyperparameter-tuning loop.

**Evidence Loop**:
The bounded research cycle that tests one iteration hypothesis, changes the project, verifies the result, records evidence, then keeps, reverts, resets, discards, or stops.
_Avoid_: looping without a baseline, metric, verification path, budget, or failure record.

**Research Reset Policy**:
The rule that failed code may be discarded only after failed knowledge is preserved. `git reset --hard` can be valid inside an approved research branch or worktree, but not over unrelated user work or an unreviewed dirty tree.
_Avoid_: both extremes: keeping every failed patch until the codebase rots, or deleting failed attempts without evidence.

**Recovery Surface**:
The durable project-local artifacts that let a future agent resume work without relying on chat history.
_Avoid_: three files as a synonym, because three-file state is only one possible implementation.

**Recovery Policy**:
The project rule that tells agents how to reconstruct context from the recovery surface at session start or after interruption.
_Avoid_: requiring a dedicated resume skill when AGENTS.md and living project documents already define recovery.

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
The chosen storage shape for execution contracts, evidence, decisions, risks, blockers, and next actions.
_Avoid_: assuming the backend must be `task_plan.md`, `progress.md`, and `findings.md`.

**Executable Plan**:
A planning artifact that turns a clear goal or approved spec into ordered work, success criteria, verification path, and handoff guidance.
_Avoid_: equating a plan with the three-file backend.

**Spec**:
A user-approved description of the problem, goals, non-goals, behavior, constraints, verification strategy, and plan handoff.
_Avoid_: storing the full spec inside workflow state logs.

**Three-File Backend**:
A workflow state backend implemented with `task_plan.md`, `progress.md`, and `findings.md`.
_Avoid_: treating it as the default dependency of every skill.

## Relationships

- A **Harness Builder** selects or repairs the **Recovery Surface** for a project.
- A **Harness Builder** defines the **Recovery Policy** for a project.
- A **Harness Builder** performs **Capability Recommendation** with `$find-skills` and targeted web research when the current task may benefit from reusable skills, MCP servers, hooks, subagents, plugins, commands, CI/headless automation, or agent tooling.
- A **Capability Recommendation Table** only includes candidates bound to **Harness Recommendation Matrix** gaps; recommendation requests stay read-only until `USER CHECKPOINT`.
- A **Harness Builder** may create a **Research Route** harness when the user explicitly asks for autoresearch or research exploration and the research contract is clear.
- A **Research Route** uses an **Evidence Loop** only after goal, hypothesis, baseline, metric, verification, guardrails, budget, and stop rule are defined.
- A **Research Reset Policy** preserves negative evidence before failed code is removed from the active branch or worktree.
- A **Recovery Surface** may use a **Three-File Backend**, `.harness/*`, an issue tracker, a feature list, or an existing project status system.
- A **Workflow Skill** reads and writes through the **Workflow State Backend** only when its own activity requires durable state.
- A `brainstorm` workflow produces a **Spec**, defaulting to `docs/specs/YYYY-MM-DD--<topic>.md`, and does not default to writing workflow state.
- An **Executable Plan** defaults to `docs/plans/YYYY-MM-DD--<topic>-plan.md`; it can use an issue, feature-list entry, existing system, or **Three-File Backend** contract only when that surface is explicitly selected.
- The **Three-File Backend** is an implementation option, not the conceptual contract for all workflow skills.
- **Skill Independence** means **Harness Builder** is invoked when project-level workbench or recovery design is needed, not because it occupies a mandatory position before or after `brainstorm` or `plan`.
- `cleanup` performs **Knowledge Cleanup** against the current project, with special attention to stale docs, bloated AGENTS.md, missing reader-facing docs, and contradictions between code and documentation.
- **Review**, **Verification**, and **Knowledge Cleanup** are separate gates: review judges correctness and risk, verification proves behavior with fresh evidence, and cleanup reconciles knowledge artifacts.

## Example Dialogue

> **Dev:** "Should `verify` refuse to run if `task_plan.md` is missing?"
> **Domain expert:** "No. `verify` should verify a claim using available evidence. If durable state is needed but missing, that is a **Recovery Surface** gap for **Harness Builder**, not a reason for `verify` to depend on the **Three-File Backend**."

> **Dev:** "Should every new task run **Harness Builder** before `plan`?"
> **Domain expert:** "No. Use **Harness Builder** when the project workbench or **Recovery Surface** is unclear. If the task already has enough context, `brainstorm`, `plan`, or another **Workflow Skill** can run independently."

> **Dev:** "Should Harness Builder only inspect already installed skills?"
> **Domain expert:** "No. During **Capability Recommendation**, it should use `$find-skills` for strongly relevant reusable skills and targeted web search for useful MCP, hook, plugin, command, or subagent options, then recommend installation only when the value is clear."

> **Dev:** "Can Capability Recommendation recommend every automation that looks helpful?"
> **Domain expert:** "No. It should produce a **Capability Recommendation Table** bound to Harness Recommendation Matrix gaps. Each candidate needs repo evidence, source evidence, freshness when external facts matter, one recommendation row, trust and approval boundaries, risk/cost, fallback, verification probe, and a Required / Recommended / Deferred / Rejected classification."

> **Dev:** "If the user asks for autoresearch, should we skip `brainstorm` and start looping?"
> **Domain expert:** "No. Autoresearch needs an approved **Research Route** contract first: goal, hypothesis, baseline, metric, verification, guardrails, budget, and stop rule. The loop starts only after that contract exists."

> **Dev:** "Is `git reset --hard` always wrong after a failed research attempt?"
> **Domain expert:** "No. A failed patch can be reset inside an approved research branch or worktree after the failure evidence is recorded. It is wrong when it erases user work or deletes the only record of why the attempt failed."

> **Dev:** "Does `plan` always create `task_plan.md`, `progress.md`, and `findings.md`?"
> **Domain expert:** "No. `plan` creates an **Executable Plan**. It writes the **Three-File Backend** only when the project has selected that backend."

> **Dev:** "Should `brainstorm` append a summary to `findings.md`?"
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
