# Clarification Coverage

Use this during `brainstorm` as the **progress ledger** for the frontier grill loop. Maintain the matrix in chat every round. Do not write a Spec while any blocking dimension remains unresolved.

Coverage does **not** run as a separate survey phase before Design Grill. Filling a ledger row and grilling design branches happen in the same interview — see `clarification-loop.md` and `design-grill.md`.

## Coverage Dimensions

Track these eight dimensions. Map each to the eventual Spec sections.

| Dimension | Spec section | What must be explicit |
| --- | --- | --- |
| 目的（Purpose） | 目标 / 背景 | Problem being solved and why now |
| 范围（Scope） | 目标 / 非目标（Non-goals） | In-scope outcomes and explicit exclusions |
| 用户 / 调用者（Users / callers） | 用户 / 调用者（Users / Callers） | Who uses this, through what entry point |
| 行为（Behavior） | 行为规格（Behavior Spec） | Happy path, edge cases, interfaces or state |
| 约束（Constraints） | 约束（Constraints） | Compatibility, security, performance, migration, time, preference |
| 成功标准（Success criteria） | 成功标准（Success Criteria） | Observable, falsifiable acceptance signals |
| 验证策略（Verification strategy） | 验证策略（Verification Strategy） | Baseline, automated checks, smoke/E2E, negative cases, fresh evidence |
| 能力缺口（Capability gaps） | 能力缺口（Capability Gaps） | Missing skills, MCP, hooks, credentials, hardware, or human judgment |

## Status Values

| Status | Meaning | Allowed before Spec draft? |
| --- | --- | --- |
| `unknown` | Not answered; only a guess or open question | No |
| `inferred` | Filled from repo, docs, or reasonable inference; user has not confirmed | No, until assumption batch is confirmed or corrected |
| `confirmed` | User explicitly confirmed, or material already states it unambiguously | Yes |
| `waived` | User explicitly says this dimension does not need further discussion for this slice | Yes |

## Blocking Dimensions

These cannot remain `unknown` or unconfirmed `inferred` at the Grill Gate:

- Purpose
- Scope
- Success criteria
- Verification strategy

Behavior may stay `inferred` only when the slice is trivial and the inferred behavior is already demonstrated in repo evidence; still confirm in the assumption batch.

## Grill Gate

Clarification is complete only when the full gate in `clarification-loop.md` passes. Ledger-facing summary:

1. Every dimension is `confirmed` or `waived`, or `inferred` with no blocking dimension left `unknown`.
2. Purpose, scope, success criteria, and verification strategy are not `unknown`.
3. Any remaining `inferred` items were presented in an assumption batch and the user confirmed or corrected them.
4. Non-trivial depth requirements (frontier rounds / stress scenario) from `clarification-loop.md` are met or waived.
5. At least one of:
   - the user replied at least once after the initial framing, or
   - the user provided a comprehensive brief that already covers all dimensions with no blocking ambiguity.
6. Frontier is empty and shared understanding is confirmed before Spec drafting.
7. The current turn ends by waiting for user input, unless the gate is already passed and you are presenting the assumption batch, confirming shared understanding, or asking to draft Spec.

Do not treat "all eight rows labeled" as sufficient on non-trivial work — design branches and stress scenarios are part of the same gate.

## Coverage Matrix Template

Copy the default template for English/non-Chinese users and update it every frontier round. For Chinese users, use the localized example below instead. Preserve stable status values and gate tokens.

```text
Clarification Coverage
| Dimension | Status | Source / note |
| --- | --- | --- |
| Purpose | unknown | |
| Scope | unknown | |
| Users / callers | unknown | |
| Behavior | unknown | |
| Constraints | unknown | |
| Success criteria | unknown | |
| Verification strategy | unknown | |
| Capability gaps | unknown | |

Gate: BLOCKED
Frontier: <N open questions this round>
```

When the gate passes, set `Gate: PASSED` and move to the assumption batch if needed, then shared understanding + Spec drafting.

## Assumption Batch

Before Spec drafting, if any dimension is still `inferred`, present a numbered assumption list:

```text
Before I draft the Spec, please confirm or correct:
1. Goal: ...
2. Non-goals: ...
3. Success criteria: ...
4. Verification: ...
5. Other inferred items: ...
```

For trivial slices, the batch may also record an explicit waiver of further design-branch or stress-scenario depth.

Wait for user confirmation or corrections. Update the matrix to `confirmed` or revise and re-ask only the affected items.

## Round Output



Default English/non-Chinese output:

```text
BRAINSTORM CLARIFICATION IN PROGRESS

Coverage: <confirmed+waived>/<8> confirmed or waived; <N> inferred pending assumption batch
Gate: BLOCKED | PASSED (assumption batch pending) | PASSED
Frontier: open | empty

Clarification Coverage
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

❓ **Q1** - **<title>**: <body>
➡️ <recommended answer>

❓ **Q2** - **<title>**: <body>
➡️ <recommended answer>

Waiting for: numbered answers to this frontier round
```

中文用户：同一结构，标签可中文化；提问仍用 `❓` / `➡️`。
