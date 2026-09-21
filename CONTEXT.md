# Domain and boundaries

- Spec: goal, scope, design decisions and observable acceptance; may be draft while material choices are unresolved.
- Executable Plan: actionable dependencies and verification for work that benefits from planning; not mandatory for small tasks.
- Active slice: the current scope within one task/track, not a global ban on parallel work.
- Recovery surface: none, lightweight, harness, feature-list or existing; use one authoritative entry per track.
- Fresh evidence: actual observations applicable to current relevant code, configuration and inputs, reusable until those change.
- Review: substantive review plus evidence judgment. Verify is a trigger alias, not a second lane.
- Ship: orchestration that chains implement, review and cleanup for one authorized task; it is not an extra gate.
- AutoResearch: bounded research loop — falsifiable hypothesis rounds in a single research log, adversarial verification, distil, evidence-gated re-open requiring third-party-checkable artifacts; authorization levels are configurable (default: round-one approval of the hypothesis package); it adds no extra gate.
- Knowledge Cleanup: task-scoped document, code and artifact reconciliation, including blocked handoffs.
- Helper Skill: capability-recommender (Capability Recommender), writing-for-agents (Writing for Agents) and find-skills.
- Discipline Skill: tdd — red-green loop at pre-agreed seams, driven by implement; not a workflow lane.
- Tool Skill: remove-deadcode-py — on-demand repo-wide Python dead-code removal (tool-detected, evidence-convicted, batched atomic deletion), routed from cleanup or explicitly invoked; not a workflow lane and not a task closeout.
- Tool Skill: sweep — on-demand repo-wide reconciliation (recovery-surface probe, six-bucket audit, mechanical fixes plus evidence-listed user adjudication, retirement four steps), routed from cleanup or explicitly invoked; not a workflow lane and not a task closeout.
- Harness Recommendation Matrix: optional table for cross-surface gaps; recommendation priority is not action authorization.

Stable behavior: docs/harness-method-contract.md. Historical plans and evaluation results describe their recorded version, not current instructions.
