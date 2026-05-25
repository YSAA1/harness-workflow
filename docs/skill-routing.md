# Skill Routing Matrix

This document is the short routing contract for Harness Workflow skills. Use it to choose the next lane before loading a heavier `SKILL.md`.

## Matrix

| Situation | Use | Do not use |
| --- | --- | --- |
| User idea is fuzzy, success criteria are missing, or tradeoffs need discussion | `brainstorm` | `plan` |
| Requirement is clear but the execution contract is missing | `plan` | `brainstorm` |
| Repo lacks a reliable workbench, recovery surface, verification entry, or capability decision | `harness-builder` | `implement` |
| One active slice is scoped and ready to change files | `implement` | `verify` |
| A build, test, lint, typecheck, CI, or runtime failure exists and root cause is unknown | `diagnose` | `implement` |
| A stable diff needs structural judgment on scope, correctness, docs, entropy, or risk | `review` | `verify` |
| A ready/done/merge claim needs fresh evidence mapped to success criteria | `verify` | `review` |
| A batch needs docs, artifacts, recovery state, and handoff closure | `cleanup` | `implement` |
| A clear task gap may be covered by an existing reusable skill | `find-skills` | `harness-builder`, unless project adoption is being decided |

## Boundary Rules

- `brainstorm` writes an approved-ready Spec; it does not write an Executable Plan or implementation.
- `plan` writes the execution contract; it does not reopen unclear requirements.
- `harness-builder` repairs the project workbench; it does not silently turn vague work into a harness.
- `implement` can run local checks as implementation feedback; it cannot mark work ready.
- `diagnose` fixes only after reproduction and root-cause evidence.
- `review` can pass structural judgment; it cannot make a ready claim.
- `verify` proves or rejects a ready claim with fresh evidence; it does not fix.
- `cleanup` aligns knowledge and artifacts; it does not change behavior unless the user explicitly asks.
- `find-skills` discovers candidates; project adoption routes through `harness-builder`.

## Default Route

```text
brainstorm -> plan -> harness-builder -> implement -> review -> verify -> cleanup
```

Skip lanes only when their decision is already evidence-backed. If a lane exposes uncertainty, route back to the lane that owns that uncertainty instead of continuing forward.
