# Autoresearch integration

Harness Workflow treats autoresearch as an optional execution engine for bounded research loops. It does not replace the earlier work of defining the research question.

## Upstream idea

`uditgoenka/autoresearch` is organized around a simple loop:

```text
modify -> verify -> keep/discard -> repeat
```

That loop is useful once the project has a clear goal, scope, metric, verification command, and iteration budget. It is not enough by itself for research tasks where the hypothesis, baseline, or failure condition is still vague.

## Harness Workflow route

Use this route only when the user explicitly asks for autoresearch or research exploration:

```text
brainstorm -> plan -> harness-builder -> bounded evidence loop -> review -> verify -> cleanup
```

`brainstorm` and `plan` define the research question. `harness-builder` then decides whether the project is ready for Research Route and installs project-local artifacts when approved.

## Required contract

Before an autoresearch-style loop starts, the project needs:

- Goal
- Hypothesis
- Counter-hypothesis
- Baseline
- Scope and non-goals
- Metric or review rubric
- Verification command, tiny run, benchmark, or review protocol
- Guardrails for data, secrets, protected paths, and compute
- Iteration budget
- Artifact policy
- Stop rule

If those fields are missing, continue planning instead of looping.

## Project artifacts

Research Route installs or adapts:

```text
docs/research/research_plan.md
docs/research/evidence_log.md
docs/research/iteration_protocol.md
.harness/research_manifest.yaml
```

These files make the route resumable. A later agent should be able to read the manifest and evidence log to know what was tried, what failed, what was kept, and what should happen next.

## Rollback policy

Research attempts should not leave the codebase full of failed patches. At the same time, failed attempts are research evidence.

The rule is:

```text
failed code may be discarded; failed knowledge must be preserved
```

Recommended order:

1. Run the declared verification.
2. Summarize the result in `docs/research/evidence_log.md`.
3. Record changed files, metric, failure reason, and next hypothesis.
4. Then revert, reset, discard, or keep the code.

`git reset --hard` can be correct inside an approved research branch or worktree after the failure is recorded. It is not allowed over unrelated user work, unreviewed dirty state, or durable artifacts that have not been saved.

## What upstream autoresearch may handle

An external autoresearch engine can handle:

- repeated local modifications;
- verification command execution;
- keep/discard decisions;
- iteration summaries;
- bounded attempts.

Harness Workflow still owns:

- initial brainstorm and research framing;
- baseline selection;
- fairness and leakage checks;
- project-local recovery surface;
- review and final verification;
- cleanup of docs, artifacts, and handoff state.

## Example

For an RL method idea:

```text
Goal: test whether reward shaping X improves early training stability.
Baseline: current PPO run with the existing reward.
Metric: mean return and fall rate over the same seed set.
Verify: tiny run for smoke, then agreed longer run if smoke passes.
Guard: do not modify baseline config; no data leakage; keep logs outside reset target.
Budget: 3 iterations before review.
Stop: stop if no iteration beats baseline or if behavior degrades on stability metrics.
```

The evidence loop can then try one reward change at a time. Failed reward code can be reset, but the failed result stays in the evidence log.
