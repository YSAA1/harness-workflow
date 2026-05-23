# Research Entropy Gate

Use this checklist before a Research Route branch is merged, archived, or declared no-winner.

## Checklist

- Compare the final diff against the baseline LOC and explain meaningful growth.
- Remove or justify unused imports, helpers, tests, configs, and generated files.
- Confirm failed-experiment code is reverted, deleted, or explicitly quarantined.
- Check temporary data, checkpoints, logs, screenshots, and raw artifacts are inside the approved artifact policy.
- Remove dependencies introduced only for failed experiments.
- Restore protected paths and generated outputs that were changed only for exploration.
- Record orphan branches, worktrees, tags, and raw artifact directories that still need cleanup.
- Add a failed-hypothesis note for every failed iteration that affected design decisions.

## Exit condition

The research branch may graduate only when remaining entropy is either removed, intentionally kept with a reason, or recorded as cleanup work owned by `cleanup`.
