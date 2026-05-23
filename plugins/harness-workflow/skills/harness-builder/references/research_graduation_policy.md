# Research Graduation Policy

Use this policy when a Research Route loop is ready to stop. Graduation is required before research work can be treated as complete.

## Graduation inputs

Record these before choosing a merge path:

- baseline commit, metric, and verification command;
- candidate iterations and their evidence links;
- winning iteration, or an explicit no-winner decision;
- files, dependencies, generated artifacts, and recovery notes touched by the loop;
- target branch or integration branch;
- branch/worktree cleanup checkpoint.

## Winner standard

A winner must beat the baseline on the approved metric or rubric, pass the agreed verification path, and avoid adding unexplained risk or code entropy. If the result is ambiguous, graduate as `no-winner` and preserve the learning instead of merging code.

## Merge modes

| Mode | Use when | Requirement |
| --- | --- | --- |
| Squash single commit | One iteration is clearly best and the intermediate commits are noisy. | Commit message summarizes the winning hypothesis, metric delta, verification, and rollback note. |
| Cherry-pick winner | The research branch contains failed commits that should not enter the main line. | Cherry-pick only the winner and any required support commits after evidence is preserved. |
| Rebase and drop failed | The branch is private, approved for rewriting, and failed commits are already captured in evidence. | Drop only failed experiment commits, then re-run verification. |

Do not force-push shared branches as part of graduation unless the user explicitly approves that exact action.

## No-winner closeout

If no candidate wins:

- keep code unchanged or revert experimental changes;
- add a failed-hypothesis note to the evidence log;
- preserve raw artifacts according to the artifact policy;
- close or archive the research branch/worktree only after the user-approved evidence is recoverable.

## Entropy and cleanup

Before graduation is accepted, run the `research_entropy_gate.md` checklist. After graduation, route to `review` for independent scrutiny and then `cleanup` to reconcile docs, branches, artifacts, and recovery state.
