# Clarification Coverage

Use this during **Phase A** of `brainstorm` as the **progress ledger** for the unified grill loop. Maintain the matrix in chat every turn. Do not write a Spec while any blocking dimension remains unresolved.

Coverage does **not** run as a separate survey phase before Design Grill. Filling a ledger row and grilling a design branch happen in the same interview — see `clarification-loop.md` and `design-grill.md`.

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

| Status | Meaning | Allowed in Phase B? |
| --- | --- | --- |
| `unknown` | Not answered; only a guess or open question | No |
| `inferred` | Filled from repo, docs, or reasonable inference; user has not confirmed | No, until assumption batch is confirmed or corrected |
| `confirmed` | User explicitly confirmed, or material already states it unambiguously | Yes |
| `waived` | User explicitly says this dimension does not need further discussion for this slice | Yes |

## Blocking Dimensions

These cannot remain `unknown` or unconfirmed `inferred` at the Phase A Gate:

- Purpose
- Scope
- Success criteria
- Verification strategy

Behavior may stay `inferred` only when the slice is trivial and the inferred behavior is already demonstrated in repo evidence; still confirm in the assumption batch.

## Phase A Gate

Phase A is complete only when the full gate in `clarification-loop.md` passes. Ledger-facing summary:

1. Every dimension is `confirmed` or `waived`, or `inferred` with no blocking dimension left `unknown`.
2. Purpose, scope, success criteria, and verification strategy are not `unknown`.
3. Any remaining `inferred` items were presented in an assumption batch and the user confirmed or corrected them.
4. Non-trivial depth requirements (grill rounds / stress scenario) from `clarification-loop.md` are met or waived.
5. At least one of:
   - the user replied at least once after the initial framing, or
   - the user provided a comprehensive brief that already covers all dimensions with no blocking ambiguity.
6. The current turn ends by waiting for user input, unless the gate is already passed and you are presenting the assumption batch or asking to enter Phase B.

Do not treat "all eight rows labeled" as sufficient on non-trivial work — design branches and stress scenarios are part of the same gate.

## Coverage Matrix Template

Copy the default template for English/non-Chinese users and update it every Phase A turn. For Chinese users, use the localized example below instead. Preserve stable status values and gate tokens.

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
Next question: <one recommendation-backed question; include stress scenario when design-sensitive>
```

Chinese-user example:

```text
澄清覆盖矩阵（Clarification Coverage）
| 维度（Dimension） | 状态（Status） | 来源 / 备注（Source / note） |
| --- | --- | --- |
| 目的（Purpose） | unknown | |
| 范围（Scope） | unknown | |
| 用户 / 调用者（Users / callers） | unknown | |
| 行为（Behavior） | unknown | |
| 约束（Constraints） | unknown | |
| 成功标准（Success criteria） | unknown | |
| 验证策略（Verification strategy） | unknown | |
| 能力缺口（Capability gaps） | unknown | |

闸门 / Gate: BLOCKED
下一个问题 / Next question: <one recommendation-backed question; include stress scenario when design-sensitive>
```

When the gate passes, set `Gate: PASSED` and move to the assumption batch if needed, then Phase B.

## Assumption Batch

Before Phase B, if any dimension is still `inferred`, present a numbered assumption list:

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

## Phase A Output

Default English/non-Chinese output:

```text
BRAINSTORM CLARIFICATION IN PROGRESS

Coverage: <confirmed+waived>/<8> confirmed or waived; <N> inferred pending assumption batch
Gate: BLOCKED | PASSED (assumption batch pending) | PASSED

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

Question: <exactly one question>
Recommended answer (optional): <short recommendation or options>
Stress scenario (when design-sensitive): <one concrete case>

Waiting for: user reply before Phase B
```

Chinese-user output:

```text
BRAINSTORM CLARIFICATION IN PROGRESS

覆盖度 / Coverage: <confirmed+waived>/<8> 已确认或豁免（confirmed or waived）；<N> 条推断项待假设批次确认（inferred pending assumption batch）
闸门 / Gate: BLOCKED | PASSED (assumption batch pending) | PASSED

澄清覆盖矩阵（Clarification Coverage）
| 维度（Dimension） | 状态（Status） | 来源 / 备注（Source / note） |
| --- | --- | --- |
| 目的（Purpose） | ... | ... |
| 范围（Scope） | ... | ... |
| 用户 / 调用者（Users / callers） | ... | ... |
| 行为（Behavior） | ... | ... |
| 约束（Constraints） | ... | ... |
| 成功标准（Success criteria） | ... | ... |
| 验证策略（Verification strategy） | ... | ... |
| 能力缺口（Capability gaps） | ... | ... |

问题 / Question: <exactly one question>
推荐回答 / Recommended answer (optional): <short recommendation or options>
压力场景 / Stress scenario (when design-sensitive): <one concrete case>

等待 / Waiting for: user reply before Phase B
```

When the gate passed but assumptions remain, replace the `Question` block with the assumption batch.
