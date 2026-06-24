# Progress Log

> Legacy migration reference only. New Harness Workflow evidence belongs in `.harness/progress.md` or the selected recovery surface.
> Source: adapted from `OthmanAdi/planning-with-files` Chinese `planning-with-files-zh/templates/progress.md`.
> License: MIT. Local adaptation: Harness Workflow append-only evidence log.

Append important progress, verification evidence, failures, and recovery notes here. Do not rewrite history unless correcting a clear error and recording why.

### YYYY-MM-DDTHH:MMZ

- Intent: [purpose of this action]
- Phase: [planning | harness-builder | implementation | review | verification | cleanup | paused | complete]
- Actions:
  - [what was done]
- Files:
  - [created or modified files]
- Commands / Checks:
  - `[command]` -> pass|fail|not run, reason or summary
- Outcome:
  - [what is now actually true]
- Next: [first thing to do next]

## Milestone Commits

| Time | Commit unit | Commit hash | Review status | Verify status | Message |
| --- | --- | --- | --- | --- | --- |

## Test Results

| Time | Check | Input / scope | Result | Status |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

## Error Log

| Time | Error | Attempts | Resolution | Status |
| --- | --- | --- | --- | --- |
|  |  | 1 |  |  |

## Five-Question Recovery Check

| Question | Answer |
| --- | --- |
| Where am I? | [current phase / active slice] |
| Where am I going? | [next phase / goal] |
| What is the goal? | [verifiable goal] |
| What did I learn? | See `findings.md` |
| What did I do? | See progress entries above |

## Notes

- Append an entry after each completed phase, error, verification failure, pause, or cleanup.
- Record only fresh evidence; do not mark unrun verification as passed.
- If verification is limited, state the skipped reason and residual risk.
