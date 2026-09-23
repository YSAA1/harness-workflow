---
name: harness-builder
description: "Build or repair the agent workbench in a target project: project entry, recovery surface initialization, verification gates, capability configuration. Triggers: onboarding this skill set into a new project for the first time, or the user asks to build/initialize/repair the workbench; routine tasks do not pass through (task-level setup is done automatically by plan); when the existing workbench is sufficient, return directly to the original task."
---

# Harness Builder

This is the controller for cross-workbench concerns; it delivers configuration or recommendations proportionate to the gap, and does not treat the full workflow as a precondition for every task.

## Process

1. Read the entry points, configuration, scripts, recovery records and actual errors relevant to the user's goal. Confirm the canonical source, the target runtime and existing capabilities.
2. Choose remedies only for real gaps, and identify outdated components that can be removed; for simple fixes it is enough to state the file and the check directly, while cross-domain rework is summarized in one HARNESS RECOMMENDATION MATRIX covering gap, evidence, treatment, owner and verification. Required / Recommended / Deferred / Rejected are recommendation levels, not installation authorization.
3. Helper routing is in the table below. Independent, well-bounded read-only investigations may run in parallel; a simple one-line change does not require spinning up another full workflow for every file type; carry existing goals and authorizations across helpers.
4. USER CHECKPOINT is reserved for authorizations that are actually missing or for key trade-offs. Audit/recommendation-only work stays read-only; when explicitly asked to build, repair or optimize, complete in-scope reversible edits and the necessary verification without demanding user approval of every exact patch. New external operations or widened configuration scope need separate authorization.
5. Modify the canonical source; when the install surface is affected, sync the `.claude-plugin/` manifest with `README.md` and `docs/install.md`, and verify against the real target. Do not install hooks, MCP, subagent configurations or all templates by default. When generating or repairing a target project's harness, the write-side discipline (the four flip-the-row-out-of-active retirement steps, the reachability liveness criterion, the deletion precondition, the consistency gate) must enter the target project together with `AGENTS.md`; the discipline text must be self-contained and must not reference things that do not exist in the target project (such as this repository's scripts).
6. When the relevant checks pass and risk is low, the task may complete; complex contract changes get further review via `review`. If the user has also authorized follow-up product work, continue that work; workbench recommendations alone do not authorize executing product tasks.

## Helper Skill routing

| Gap | Helper Skill |
| --- | --- |
| Durable instructions and recovery/state surfaces (AGENTS / CLAUDE / Cursor rules, work index, plan, state) | `writing-for-agents` (Writing for Agents) |
| Capability selection | `capability-recommender` (Capability Recommender, read-only) |
| Explicitly needs to find skills | `find-skills` |

## On-demand references

- Scope and authorization: `references/controller_discipline.md`, `references/install_policy.md`.
- Recommendation matrix: `references/recommendation_matrix_policy.md`; configuration placement: `references/decision_matrix.md`.
- Verification entry: `references/verification_policy.md`; architecture guardrails: `references/architecture_enforcement_policy.md`; drift: `references/anti_entropy.md`.
- When a helper is unavailable, `references/capability_discovery_playbook.md` may be used; do not treat the fallback as a repeated must-read.
- For parallel investigations: `references/subagent_orchestration.md`.

## Recommended next skill

Choose a helper, `implement`, `diagnose` or `review` according to the actual work still outstanding; use `cleanup` only when this session's records need tidying, otherwise end.
