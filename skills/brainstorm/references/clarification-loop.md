# Grill Loop (Frontier)

Use for `brainstorm` clarification. Read with `clarification-coverage.md` and `design-grill.md` at session start.

This is **one** relentless interview — not a survey then a second grill, and not a named Phase A/B ceremony. Coverage is a **progress ledger** kept as internal notes. Question craft lives in `design-grill.md`. Aligns with frontier grilling: design tree → frontier rounds → shared understanding → Spec.

## Roles of the three references

| File | Role |
| --- | --- |
| This file | Frontier loop, priority, and Grill Gate (gate 的唯一源) |
| `clarification-coverage.md` | Eight-dimension ledger + factual assumption batch |
| `design-grill.md` | Question craft: branches, stress scenarios, domain/ADR |

## Unified Loop

Repeat until the Grill Gate passes:

1. Read the latest user message, repo evidence, existing specs/plans, and the target project's `CONTEXT.md` if present (resolve from project instructions, never from the plugin package).
2. If a gap is **factual**, close it by exploring the codebase or docs (or a sub-agent) and record it in the coverage ledger as `inferred` with source — or `confirmed` when the repo demonstrates it — instead of asking. This closes factual gaps only: preferences and trade-offs must enter the frontier. Do not block the round on background lookups — only questions that depend on unsettled facts wait.
3. Recompute the **frontier**: every open decision whose prerequisites are already settled. Do **not** put two questions in the same round if one answer should change the other.
4. For each frontier question, form a working recommendation before asking. Use craft in `design-grill.md`. Design-sensitive items include a concrete stress scenario.
5. Ask the **whole frontier in one message**. Number questions. Prefer this shape per question:

```text
❓ **Q1** - **<title>**: <body; options if useful>

➡️ <recommended answer>
```

6. Update the coverage ledger (`clarification-coverage.md`) as internal notes; surface one summary line, not the matrix, unless the user asks for progress.
7. 术语已明确且任务包含文档化时，更新目标项目既有词汇表；纯讨论可在回复中记录，不因插件流程自动创建 `CONTEXT.md`。必要 ADR 按本任务授权处理。
8. Stop and wait for the user's answers to the round. Do not draft Spec in the same turn as an open frontier.

One message means one frontier round. Dependent questions belong to later rounds.

Opt-out: if the user asks for one question at a time, ask the frontier sequentially while still tracking the same tree.

## Priority

Prefer this order when choosing what enters the frontier. Skipping ahead requires the earlier item to be `confirmed` or `waived` — a brief that states it unambiguously counts as `confirmed`; `inferred` never skips framing. Independent items, including framing questions and design branches, may share one round: the order sets attention, not serialization.

1. **Purpose** — if `unknown`
2. **Scope / non-goals** — if `unknown`
3. **Design branches** that still block behavior — walk with `design-grill.md` Branch Order
4. **Success criteria** — if still `unknown` after enough behavior is settled
5. **Verification strategy** — if still `unknown`
6. **Capability gaps** — if `unknown` or unexamined；修复建议等 Spec 批准后再提，不劫持 frontier
7. Remaining open design branches (failure/edge, data/state, interfaces, NFR, rejected alternatives)

Do **not** fill Behavior/Constraints as a flat survey and later re-ask the same content as design branches.

## Depth Scaling

| Situation | Depth |
| --- | --- |
| Non-trivial feature, migration, architecture, or multi-session work | 按未决风险提问与检验具体场景；已有清晰需求可直接收敛，不设固定轮数 |
| User says grill, stress-test, or "再深挖" | Continue until branches resolve or user waives |
| Single-point patch with no design branches | Shallow: ledger can fill quickly; design branches and scenarios may be waived in the assumption batch |

Same loop in all cases — complexity changes depth, not protocol.

## Grill Gate

One rule set for the whole interview — facts may be `inferred` (sourced); preferences, trade-offs, verification depth, and scope boundaries must be `confirmed` or `waived`. Clarification is complete only when all of the following are true:

1. Purpose, scope, success criteria, and verification strategy are `confirmed` or `waived` — never `inferred` or `unknown`.
2. Every other dimension is `confirmed`, `waived`, or `inferred` from a sourced fact, presented in the factual assumption batch.
3. 非平凡任务没有阻塞设计分支未经检验：Branch Order 每支已答、显式豁免或仓库可证；无最低问询轮数。
4. Every design-sensitive trade-off carries a recommendation the user accepted or corrected — repo evidence alone never replaces user acceptance for preferences.
5. The frontier is empty under the rule above, and shared understanding is covered by explicit user decisions or a comprehensive brief with drafting authorization — otherwise asked exactly once. Silence is not approval; do not re-ask what is already confirmed.
6. No unresolved terminology conflict remains between the emerging Spec and `CONTEXT.md`, and no open question could be answered by reading local code or docs.

## Entering Spec Drafting

Enter Spec drafting only after: Grill Gate passes; factual assumption batch confirmed (if any `inferred` facts remain); shared understanding covered. Then proceed with `spec-drafting.md`.

## Anti-patterns

- Sending a Coverage scoreboard or an assumption batch instead of numbered frontier questions while trade-offs remain open.
- Running a coverage survey first, then switching into a second "grill mode".
- Treating matrix completion as design completion on non-trivial work.
- 为满足形式重复询问已明确的决定，或仍有阻塞问题就过早收敛。
- Asking dependent questions in the same frontier round.
- Dumping an unordered questionnaire with no recommendations.
- Asking the user for facts that the repo or docs can answer.
- Acting or writing Spec before shared understanding is confirmed.
- Naming host products or host-specific CLIs as interview protocol.
