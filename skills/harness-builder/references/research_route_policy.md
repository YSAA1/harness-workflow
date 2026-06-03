# Research Route policy

Use when the user explicitly asks for autoresearch, autonomous research, repeated research attempts, method exploration, or "research this idea" after enough brainstorm/plan context.

Research Route is project-local harness mode—not a ninth workflow lane and not a replacement for `brainstorm`, `plan`, `review`, `verify`, or `cleanup`.

Recommend only for open questions with hypothesis, baseline, metric/rubric, bounded verification loop, budget, guardrails, artifact policy, and stop rule.

Before the evidence loop, confirm: Goal, Hypothesis, Counter-hypothesis, Baseline, Scope, Non-goals, Metric, Verify, Guard, Budget, Artifact policy, Stop rule.

Approved artifacts: `docs/research/research_plan.md`, `docs/research/evidence_log.md`, `docs/research/iteration_protocol.md`, `.harness/research_manifest.yaml` (from `templates/research_route/*`).

Failed code may be discarded; failed knowledge must be preserved.

## Isolation default

Default to isolated worktree or branch. Use `worktree` when normal development continues or rollback risk is high. Record isolation mode in `.harness/research_manifest.yaml`.

## Git convention

- branch: `research/<topic>`
- tags: `research/baseline`, `research/iter-N`, `research/winner` (optional for tiny loops)
- commit trailers: `Iter`, `Result`, `Metric`, `Decision`

## Graduation

Required before research is treated as complete.

**Inputs:** baseline commit/metric/verification; candidate iterations and evidence; winner or explicit no-winner; touched files/artifacts; target branch; cleanup checkpoint.

**Winner:** beats baseline on approved metric, passes verification, no unexplained entropy. Ambiguous → `no-winner` and preserve learning.

**Merge modes:** squash single commit; cherry-pick winner; rebase and drop failed (private branch only, evidence preserved). No force-push shared branches without explicit approval.

**No-winner:** keep or revert code; log failed hypothesis; preserve artifacts per policy; archive branch/worktree only after evidence is recoverable.

## Entropy gate (before merge/archive)

- Explain meaningful LOC growth vs baseline.
- Remove or justify unused imports, helpers, configs, generated files.
- Revert or quarantine failed-experiment code.
- Artifacts inside approved policy only.
- Drop deps introduced only for failed experiments.
- Record orphan branches, worktrees, tags, raw dirs for `cleanup`.
- Failed-hypothesis note per iteration that affected decisions.

Graduate only when entropy is removed, intentionally kept with reason, or recorded as `cleanup` work.

## Closeout

Research Route does not declare done. After graduation and entropy gate, route through `review` then `cleanup`.
