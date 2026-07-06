# Work Index

任务注册表（T3）。`AGENTS.md` 只指向本文件，不指向具体任务 artifact。同一时刻只能有一个 `active` 行。

| ID | 标题 | Status | Primary artifact | Last verified |
| --- | --- | --- | --- | --- |
| 001 | brainstorm / harness-builder 文档纪律与 `.harness/` 统一 | complete | （本 batch；见 `.harness/state.md`） | 2026-06-24 |
| 002 | harness-builder check.sh 协议加固（防 fragile 断言） | complete | （本 batch；见 `.harness/state.md`） | 2026-06-29 |
| 003 | 中文默认 + 可打勾计划文件 | complete | `docs/plans/2026-06-29--checkbox-chinese-plan-docs-plan.md` | 2026-06-29 |
| 004 | plan skill 主文件瘦身 | blocked | `skills/plan/SKILL.md` | 2026-06-29 |
| 005 | harness-builder skill 拆分与 Research Route 移除 | complete | `docs/plans/2026-07-06--harness-builder-skill-split-plan.md` | 2026-07-06 |
| 006 | review / verify / cleanup 三 skill 优化 | active | `docs/plans/2026-07-06--review-verify-cleanup-optimization-plan.md` | — |

Status values: `active`, `blocked`, `complete`, `abandoned`

## 维护规则

- 新任务：新增行，将旧 `active` 改为 `complete` / `blocked` / `abandoned`
- 不要删除历史行
- 会话启动先读本表，再打开 `active` 行的 primary artifact
