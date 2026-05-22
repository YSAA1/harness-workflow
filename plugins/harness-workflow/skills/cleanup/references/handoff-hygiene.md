# Handoff Hygiene

Use this checklist during Knowledge Cleanup when a substantial batch is closing, blocked, abandoned, or likely to be resumed by another agent.

## Required Answers

The selected recovery surface should answer:

| Question | Why it matters |
| --- | --- |
| What is the current active slice? | Prevents scope drift |
| What proves the current state? | Prevents stale evidence from becoming truth |
| What files changed? | Helps the next agent inspect quickly |
| What remains risky or blocked? | Prevents hidden uncertainty |
| What should happen next? | Avoids vague "continue" handoffs |
| What should not be retried? | Preserves rejected options and dead ends |
| Which milestones are committed? | Prevents losing verified work across sessions |
| Are there verified but uncommitted changes? | Ensures milestone commits are not forgotten |

If an answer is unknown, write `unknown` with the reason instead of guessing.

## Pause / Closure States

| State | Meaning |
| --- | --- |
| `complete` | Success criteria are met with fresh evidence |
| `blocked` | External input or capability is required |
| `abandoned` | The attempt is intentionally stopped |
| `reopen` | Cleanup found missing work |

## Anti-Patterns

- Claiming "done" without fresh commands or explicit evidence limits.
- Writing temporary task status into `AGENTS.md`.
- Creating a fourth handoff file when the selected recovery surface already exists.
- Leaving next action as "continue".
- Hiding failed commands or skipped checks.
- Verified changes left uncommitted across session boundaries.
