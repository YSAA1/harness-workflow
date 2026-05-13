# Research Route policy

Use this reference when the user explicitly asks for autoresearch, autonomous research, repeated research attempts, method exploration, or "research this idea" after the problem has gone through enough brainstorm or planning context.

Research Route is a project-local harness mode. It is not a ninth public workflow lane and it is not a replacement for `brainstorm`, `plan`, `review`, `verify`, or `cleanup`.

## When to recommend Research Route

Recommend Research Route only when most of these are true:

- The user is asking an open research question, not only a normal feature or bugfix.
- There is a stated hypothesis or the agent can derive one from an approved spec.
- The project has or can create a baseline.
- The research attempt has a metric, qualitative rubric, or falsifiable evidence target.
- There is a verification command, tiny run, benchmark, review protocol, or manual check that can be repeated.
- The work can be bounded by iterations, time, token budget, compute budget, or milestone gates.
- Failed attempts can be recorded without polluting the main branch or losing useful negative evidence.

Examples:

- "Try this RL reward idea and tell me if it holds up."
- "Investigate whether this architecture improves retrieval quality."
- "Run a bounded autonomous loop to improve this benchmark."
- "Explore this method, keep evidence, and stop if it does not beat baseline."

## When to reject or defer

Reject or defer Research Route when:

- The user has not approved the research question, baseline, or success criteria.
- The task is a normal implementation slice with deterministic acceptance criteria.
- There is no repeatable verification path.
- The loop would need expensive compute, external spend, or production access without explicit approval.
- The repo has a dirty git state that includes user work and no isolation strategy.
- The user wants unbounded autonomous work but has not accepted the budget and recovery policy.

Route unclear research questions back to `brainstorm`. Route implementation-ready work to `plan` or `implement`.

## Required research contract

Before an evidence loop starts, create or confirm:

| Field | Required content |
| --- | --- |
| Goal | The research question in one sentence. |
| Hypothesis | Why the proposed idea may work. |
| Counter-hypothesis | What result would make the idea look wrong or not worth pursuing. |
| Baseline | Existing behavior, previous result, paper result, or control condition. |
| Scope | Files, modules, experiments, or data allowed in this loop. |
| Non-goals | What this loop must not optimize or rewrite. |
| Metric | Numeric metric or review rubric. |
| Verify | Command, script, tiny run, benchmark, review checklist, or manual evidence path. |
| Guard | Safety rule: protected paths, secrets, data leakage, baseline protection, compute limits. |
| Budget | Iterations, wall time, token budget, compute budget, or all of them. |
| Artifact policy | Where logs, tables, checkpoints, reports, and discarded patches go. |
| Stop rule | Success, failure, plateau, budget exhaustion, or user review gate. |

If any required field is missing, write the gap and ask only the question that changes the design.

## Project-local artifacts

For a target project, install these only when the user approves Research Route:

- `docs/research/research_plan.md`
- `docs/research/evidence_log.md`
- `docs/research/iteration_protocol.md`
- `.harness/research_manifest.yaml`

Use `templates/research_route/` as the starting point. Adapt filenames to an existing project convention if the repo already has a research or experiment tracking system.

## Evidence loop

Each iteration must record:

1. hypothesis for this iteration;
2. planned change;
3. verification command or review path;
4. result;
5. keep, revert, or discard decision;
6. reason;
7. next hypothesis or stop reason.

The loop should increase knowledge even when the metric does not improve.

## Reset and rollback policy

Keeping failed code around can corrupt later attempts. Removing failed code without recording the reason also destroys research value. Research Route handles both concerns:

- Record the failure reason, command output summary, metric, changed files, and decision in `evidence_log.md` before rollback.
- Prefer an isolated branch or worktree for the research loop.
- Prefer `git revert` for committed attempts when the history itself is useful.
- Use `git reset --hard` only inside the approved research isolation boundary and only after failure evidence is recorded.
- Never run destructive reset against a dirty tree that may contain user-authored work unless the user explicitly approves that exact operation.
- Keep durable artifacts such as result tables, notes, and selected logs outside the reset target or commit them before reset.

The policy is: failed code may be discarded; failed knowledge must be preserved.

## Autoresearch integration

Upstream `uditgoenka/autoresearch` is best treated as an optional evidence-loop engine. It can run the repeated modify, verify, keep/discard cycle after the research contract is clear.

Do not let it replace:

- brainstormed problem framing;
- baseline selection;
- data leakage or evaluation review;
- final research review;
- cleanup and project knowledge reconciliation.

Recommend installing or invoking an external autoresearch capability only when the target project already has `Goal`, `Scope`, `Metric`, `Verify`, `Guard`, and `Iterations`.

## Done criteria

Research Route is ready when:

- the target repo has a clear research plan and iteration protocol;
- the loop is bounded;
- baseline and verification are explicit;
- rollback is safe and failure evidence is preserved;
- artifacts have declared locations;
- a future agent can resume from the manifest and evidence log.
