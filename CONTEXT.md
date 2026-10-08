# Domain and boundaries

- Spec: goal, scope, design decisions and observable acceptance; may be draft while material choices are unresolved.
- Executable Plan: actionable dependencies and verification for work that benefits from planning; not mandatory for small tasks.
- Active slice: the current scope within one task/track, not a global ban on parallel work.
- Recovery surface: none, lightweight, harness, feature-list or existing; use one authoritative entry per track.
- Fresh evidence: actual observations applicable to current relevant code, configuration and inputs, reusable until those change.
- Review: substantive review plus evidence judgment. Verify is a trigger alias, not a second lane.
- Ship: orchestration that chains implement, review and cleanup for one authorized task; it is not an extra gate.
- AutoResearch: bounded research-work loop — a user-assigned goal with an unknown approach runs as repeated research → hands-on → adversarial review → distill rounds, checked against fixed completion criteria; hands-on experiments (local, reversible) are first-class evidence; exclusion-driven re-open; honest terminal states (answered/inconclusive/blocked/budget-exhausted/cancelled); only spending money, external writes, or irreversible/production impact pause for authorization; the research log is a retained deliverable, and `autoresearch <log>` resumes.
- Knowledge Cleanup: task-scoped document, code and artifact reconciliation, including blocked handoffs.
- Helper Skill: capability-recommender (Capability Recommender), writing-for-agents (Writing for Agents) and find-skills.
- Discipline Skill: tdd — red-green loop at pre-agreed seams, driven by implement; not a workflow lane.
- Tool Skill: remove-deadcode-py — on-demand repo-wide Python dead-code removal (tool-detected, evidence-convicted, batched atomic deletion), routed from cleanup or explicitly invoked; not a workflow lane and not a task closeout.
- Tool Skill: sweep — on-demand repo-wide reconciliation (recovery-surface probe, six-bucket audit, mechanical fixes plus evidence-listed user adjudication, retirement four steps), routed from cleanup or explicitly invoked; not a workflow lane and not a task closeout.
- Tool Skill: research — lightweight single-shot research (background legwork over primary sources, self-registered findings under docs/research/), explicitly invoked; not a workflow lane and not a task closeout.
- Tool Skill: handoff — session handoff compacting the current conversation for the next agent (prefers track state when a recovery surface exists), explicitly invoked; not a workflow lane and not a task closeout.
- Task graph: a plan whose work items carry dependency edges (`depends: #N`); the frontier is every item whose prerequisites are done, computed from what has actually merged.
- Integration branch: the single branch that ship's parallel mode merges every item into; review runs once on it after everything lands.
- Context pointer: a path, item number, commit or link handed to a subagent instead of a pasted summary.
- Feedback loop: in diagnose, one already-run command that goes red on this failure (original symptom, deterministic, fast, agent-runnable); the gate before any hypothesis.
- Observed failure: the bar for changing skill behavior (what ran, what the skill did, what was expected); rejected ideas live in docs/out-of-scope/.
- Harness Recommendation Matrix: optional table for cross-surface gaps; recommendation priority is not action authorization.

Stable behavior: docs/harness-method-contract.md. Historical plans and evaluation results describe their recorded version, not current instructions.
