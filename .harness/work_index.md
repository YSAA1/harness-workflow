# Work Index

任务注册表（T3）。`AGENTS.md` 只指向本文件，不指向具体任务 artifact。每个任务/轨道一个权威入口，独立任务可同时 active。

| ID | 标题 | Status | Primary artifact | Last verified |
| --- | --- | --- | --- | --- |
| 001 | brainstorm / harness-builder 文档纪律与 `.harness/` 统一 | complete | （本 batch；见 `.harness/state.md`） | 2026-06-24 |
| 002 | harness-builder check.sh 协议加固（防 fragile 断言） | complete | （本 batch；见 `.harness/state.md`） | 2026-06-29 |
| 003 | 中文默认 + 可打勾计划文件 | complete | `docs/plans/2026-06-29--checkbox-chinese-plan-docs-plan.md` | 2026-06-29 |
| 004 | plan skill 主文件瘦身 | blocked | `skills/plan/SKILL.md` | 2026-06-29 |
| 005 | harness-builder skill 拆分与 Research Route 移除 | complete | `docs/plans/2026-07-06--harness-builder-skill-split-plan.md` | 2026-07-06 |
| 006 | review / verify / cleanup 三 skill 优化 | complete | `docs/plans/2026-07-06--review-verify-cleanup-optimization-plan.md` | 2026-07-06 |
| 007 | harness-builder 总控瘦身与 Helper routing | complete | `skills/harness-builder/SKILL.md` | 2026-07-09 |
| 008 | SSY-1 工作流优化收尾：brainstorm Phase A / review+verify / cleanup | complete | （SSY-1 umbrella；见 `.harness/state.md`） | 2026-08-12 |
| 009 | Workflow lane slim：grill brainstorm + review ready gate | complete | `docs/specs/2026-08-12--workflow-lane-slim.md` | 2026-08-12 |
| 010 | Astra 全量技能审计与优化 | complete | `docs/reviews/2026-09-07--astra-workflow-audit.md` | 2026-09-07 |
| 011 | 恢复 grill 版 brainstorm（草稿语义合并远端精简） | complete | `skills/brainstorm/SKILL.md` | 2026-09-14 |
| 012 | 仓库精简 + verify 并入 review + cleanup 扩代码 + 新增 ship | complete | `skills/ship/SKILL.md` | 2026-09-14 |
| 013 | 新增 Grok/ZCode/Kimi 安装文档 + README 重写 + LICENSE | complete | `docs/install/kimi.md` | 2026-09-14 |
| 014 | 插件整合优化前置调研（harness 开发技巧 2025-2026） | complete | `docs/research/2026-09-15--agent-harness-landscape-research.md` | 2026-09-15 |
| 015 | skill 协议补强批A/批B（证据纪律、薄路径、安全审计、并行指引） | complete | （本 batch；见 `.harness/state.md`） | 2026-09-15 |

Status values: `active`, `blocked`, `complete`, `abandoned`

## 维护规则

- 新任务：新增当前轨道行，不改变其他轨道状态；同轨道换轨时更新旧入口
- 不要删除历史行
- 会话启动先读本表，再打开 `active` 行的 primary artifact
