# Clarification Coverage

Use this during `brainstorm` as the **progress ledger** for the frontier grill loop. Keep it as internal notes with a one-line summary per round; show the full matrix only when the user asks for progress. Do not write a Spec while any blocking dimension is unresolved.

Coverage does **not** run as a separate survey phase before Design Grill. Filling a ledger row and grilling design branches happen in the same interview — see `clarification-loop.md` and `design-grill.md`.

## Coverage Dimensions

Track these eight dimensions. Map each to the eventual Spec sections.

| Dimension | Spec section | What must be explicit |
| --- | --- | --- |
| Purpose | Goals / Background | Problem being solved and why now |
| Scope | Goals / Non-goals | In-scope outcomes and explicit exclusions |
| Users / callers | Users / Callers | Who uses this, through what entry point |
| Behavior | Behavior Spec | Happy path, edge cases, interfaces or state |
| Constraints | Constraints | Compatibility, security, performance, migration, time, preference |
| Success criteria | Success Criteria | Observable, falsifiable acceptance signals |
| Verification strategy | Verification Strategy | Baseline, automated checks, smoke/E2E, negative cases, fresh evidence |
| Capability gaps | Capability Gaps | Missing skills, MCP, hooks, credentials, hardware, or human judgment |

## Status Values

| Status | Meaning | Allowed before Spec draft? |
| --- | --- | --- |
| `unknown` | Not answered; only a guess or open question | No |
| `inferred` | Factual inference from repo/docs with a recorded source; user has not confirmed. Preferences and trade-offs are never `inferred` — they go to the frontier | No, until the factual assumption batch is confirmed |
| `confirmed` | User explicitly confirmed, or material already states it unambiguously | Yes |
| `waived` | User explicitly says this dimension does not need further discussion for this slice | Yes |

## Blocking Dimensions

These must be `confirmed` or `waived` at the Grill Gate — `inferred` does not pass:

- Purpose
- Scope
- Success criteria
- Verification strategy

Behavior facts demonstrated by repo evidence may be `inferred` with source; behavior trade-offs on non-trivial work must enter the frontier and cannot pass the gate as `inferred`.

## Grill Gate

The gate lives in `clarification-loop.md` (single source). Ledger-facing consequences: blocking dimensions must be `confirmed` or `waived`; remaining factual `inferred` items go to the assumption batch; an empty frontier means every Branch Order branch is answered, explicitly waived, or repo-provable with source. Do not treat "all eight rows labeled" as sufficient on non-trivial work.

## Assumption Batch

Before Spec drafting, present any remaining **factual** inferences — repo/docs-provable facts with sources, nothing else. Goal, boundaries, success criteria, verification strategy, and behavior trade-offs are preferences: they must be answered as frontier questions and never parked here.

```text
Before I draft the Spec, please confirm or correct these factual inferences:
1. <fact> — source: <repo path / doc>
2. <fact> — source: <repo path / doc>
```

Wait for user confirmation or corrections. Update the matrix to `confirmed` or revise and re-ask only the affected items. For trivial slices, the batch may also record an explicit user waiver of further design-branch or stress-scenario depth.

## Round Output

The round shape has a single source: `SKILL.md` Output — numbered frontier questions first, one-line Coverage summary after. This file carries no second template. Chinese users get the same structure; labels may be localized to Chinese, while status values and Gate tokens stay in English.

## Progress Ledger (on request)

When the user asks for progress, show the matrix as a footnote after the frontier questions:

```text
Coverage
| Dimension | Status | Source / note |
| --- | --- | --- |
| Purpose | ... | ... |
| Scope | ... | ... |
| Users / callers | ... | ... |
| Behavior | ... | ... |
| Constraints | ... | ... |
| Success criteria | ... | ... |
| Verification strategy | ... | ... |
| Capability gaps | ... | ... |
```
