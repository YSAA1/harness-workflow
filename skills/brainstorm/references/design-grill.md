# Design Grill (craft)

Use during `brainstorm` clarification as the **question craft** inside the frontier grill loop (`clarification-loop.md`). This is not a separate phase.

Design Grill means: walk design dependencies branch by branch, stress-test with concrete scenarios, sharpen domain language, and capture durable glossary or ADR material as it crystallises — in the **same** interview that updates the coverage ledger.

Read this together with `clarification-coverage.md` and `clarification-loop.md`. `CONTEXT.md` 指目标项目既有领域词汇表，不是插件文件。术语和 ADR 写入遵循当前任务授权；纯讨论在回复中记录即可。

## When Depth Is Required

| Situation | Grill depth |
| --- | --- |
| Non-trivial feature, migration, architecture, or multi-session work | 按未决风险检验设计与场景，不要求固定问询轮数（见 Grill Gate） |
| User says grill, stress-test, or "再深挖" | **Required** — continue until user waives or branches resolve |
| Single-point patch with no design branches | **Waivable** — user may waive in assumption batch |

Framing gaps (Purpose / Scope still `unknown`) still go first per `clarification-loop.md` Priority — then use these branches instead of re-surveying Behavior.

## Per-Round Craft

For each frontier round:

1. Prefer unresolved **design branches** that block the most downstream decisions (see Branch Order), limited to questions whose prerequisites are settled.
2. If a question can be answered from codebase or docs, explore first (or dispatch a sub-agent) and record the finding in the matching coverage row — `inferred` with source, or `confirmed` when the repo demonstrates it.
3. Form a working recommendation before asking each frontier question.
4. Ask the whole frontier in one message; number questions; each item is accept/correct/reject (or choose among 2–3 concrete options) with a recommended answer.
5. Include a **concrete stress scenario** on design-sensitive questions unless the branch is pure terminology.
6. Update matching coverage ledger rows in the same round.
7. 术语已明确且任务包含文档化时，更新目标项目既有词汇表（仅术语）；否则在回复中记录。
8. If an ADR is warranted, offer to create it under `docs/adr/` immediately — do not batch ADR offers. ADR 仅限不可逆架构决策；过程与环境坑记入项目恢复面的 lessons（无恢复面则不写，也不暗示新建）。

## Branch Order

Walk branches in this order, skipping branches already settled — coverage row `confirmed` or `waived`, or carrying a sourced factual note:

1. **Actors and boundaries** — who does what, where system boundaries sit
2. **Happy path** — primary flow end-to-end
3. **Failure and edge cases** — errors, partial success, rollback, idempotency
4. **Data and state** — what is stored, who owns it, lifecycle
5. **Interfaces and contracts** — APIs, events, file formats, compatibility
6. **Non-functional constraints** — security, performance, observability, migration
7. **Verification hooks** — how each branch would be proven or falsified
8. **Rejected alternatives** — paths intentionally not taken and why

If one answer settles multiple branches, note it in each matching coverage row's Source/note before choosing the next frontier — no second status vocabulary. 判空宣告按 Grill Gate 附八支一行对账（见 `clarification-loop.md`）。

## Question Shape

Question shape has a single source: `SKILL.md` 输出——每题带 `Design branch` 行，设计敏感题另附 `Stress scenario` 行；本文件不再保留第二模板。Craft：纯 framing 题（Purpose / Scope 仍 open）可省锚定行；行为或边界一入场即补压力场景。

## Domain and ADR

- **Challenge glossary conflicts** immediately when the user conflicts with `CONTEXT.md`.
- **Sharpen fuzzy language** by proposing a precise canonical term.
- **Discuss concrete scenarios** when relationships or boundaries are unclear.
- **Cross-reference code** when the user states how something works; surface contradictions.
- **按授权更新目标项目词汇表**，不因术语讨论自动创建文档。
- **Offer ADRs sparingly** — only when all three are true: hard to reverse; surprising without context; real trade-off with alternatives.

## Same-Turn Forbidden Actions

While a frontier round is open, do **not** in the same turn: write Spec draft, call `plan`/`implement`/`review`, or treat silence as approval.

## Anti-patterns

- Splitting clarification into "coverage survey" then "grill mode".
- 标签已齐但仍有实质设计风险未检查就停止，或为凑轮数重复已有结论。
- Putting dependent questions in the same frontier round.
- Asking the user for facts that the repo or docs can answer.
- Asking broad survey questions instead of challenging a concrete recommendation.
- Host-product or host-CLI name-dropping as protocol.
