# Research Route policy

Use this reference when the user explicitly asks for autoresearch, autonomous research, repeated research attempts, method exploration, or "research this idea" after the problem has gone through enough brainstorm or planning context.

Research Route is a project-local harness mode. It is not a ninth public workflow lane and it is not a replacement for `brainstorm`, `plan`, `review`, `verify`, or `cleanup`.

Recommend Research Route only for open research questions with a hypothesis, baseline, metric/rubric, bounded verification loop, budget, guardrails, artifact policy, and stop rule.

Before an evidence loop starts, create or confirm Goal, Hypothesis, Counter-hypothesis, Baseline, Scope, Non-goals, Metric, Verify, Guard, Budget, Artifact policy, and Stop rule.

Project-local artifacts are installed only when the user approves Research Route: `docs/research/research_plan.md`, `docs/research/evidence_log.md`, `docs/research/iteration_protocol.md`, and `.harness/research_manifest.yaml`.

Failed code may be discarded; failed knowledge must be preserved.

## Isolation default

Default Research Route execution to an isolated worktree or branch before experiments touch code. Use `worktree` when concurrent normal development may continue or when rollback risk is high. Use `branch` only when the repo is small, the tree is clean, and the user accepts that experiments share the checkout.

Record isolation mode and path in `.harness/research_manifest.yaml`.

## Git Convention

Use explicit research history so failed paths stay auditable without polluting the final line:

- branch: `research/<topic>`;
- tags: `research/baseline`, `research/iter-N`, `research/winner`;
- commit trailers:
  - `Iter: <N|baseline|winner>`;
  - `Result: <pass|fail|inconclusive>`;
  - `Metric: <metric name and value>`;
  - `Decision: <keep|revert|discard|graduate>`.

Tags are optional for very small loops, but the baseline and winner must still be identifiable from the manifest or evidence log.

## Closeout rule

Research Route does not directly declare done. After the loop stops, apply `research_graduation_policy.md`, run the `research_entropy_gate.md` checklist, then route through `review` and `cleanup`.
