# Work Index

任务注册表（T3）。`AGENTS.md` 只指向本文件，不指向具体任务 artifact。每个任务/轨道一个权威入口，独立任务可同时 active。

| ID | 标题 | Status | Primary artifact | Last verified |
| --- | --- | --- | --- | --- |
| 001 | brainstorm / harness-builder 文档纪律与 `.harness/` 统一 | complete | （本 batch；见 `.harness/state.md`） | 2026-06-24 |
| 002 | harness-builder check.sh 协议加固（防 fragile 断言） | complete | （本 batch；见 `.harness/state.md`） | 2026-06-29 |
| 003 | 中文默认 + 可打勾计划文件 | complete | `docs/plans/2026-06-29--checkbox-chinese-plan-docs-plan.md` | 2026-06-29 |
| 004 | plan skill 主文件瘦身 | complete | `skills/plan/SKILL.md` | 2026-09-21 |
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
| 016 | 重构安装面：skills.sh 多端可选安装 + cli-delegate 软指针 | complete | `docs/install.md` | 2026-09-15 |
| 017 | 清理死功能与历史证据 + 三合一 writing-for-agents + implement TDD 化 | complete | `skills/writing-for-agents/SKILL.md` | 2026-09-15 |
| 018 | 恢复面重设计：plan 建档 + 三文件收敛 + lessons + 模板瘦身 | complete | `.harness/lessons.md` | 2026-09-15 |
| 019 | 新增 remove-deadcode-py 工具 skill 并接入 cleanup 路由 | complete | `skills/remove-deadcode-py/SKILL.md` | 2026-09-21 |
| 020 | 恢复面闭环落地：退休契约+lint+sweep | complete | `docs/specs/2026-09-18--recovery-surface-loop.md` | 2026-09-21 |
| 021 | 新增 autoresearch 研究循环总控 skill（授权档位+对抗 lens） | complete | `skills/autoresearch/SKILL.md` | 2026-09-21 |
| 022 | 对比报告施工：闭环断点与好用性修复四步 | complete | （对话计划：四步施工，见 state.md） | 2026-09-22 |
| 023 | 收编 research/handoff 工具 skill + 触发语义澄清 | complete | （对话计划：收编两 skill，见 state.md） | 2026-09-22 |
| 024 | README 重写+技能双语化+隐触发调查（brainstorm 收敛中） | complete | `docs/plans/2026-09-23--bilingual-skills-m1m3-plan.md` | 2026-09-23 |
| 025 | 展示面大扫除 + 17 技能双语通俗详解指南 | complete | `docs/skills.zh-CN.md` | 2026-09-23 |
| 026 | autoresearch goal 契约入口改造（扫描+goal 文档+免中断迭代） | active | `docs/plans/2026-09-23--autoresearch-goal-entry-plan.md` | 2026-09-23 |

Status values: `active`, `blocked`, `complete`, `abandoned`

## 维护规则

- 新任务：新增当前轨道行，不改变其他轨道状态；同轨道换轨时更新旧入口
- 不要删除历史行
- 历史行的 primary artifact 可能已被后续重构合并或删除（如 `docs/install/*` 已并入 `docs/install.md`）；保留原路径作为时间点记录
- 会话启动先读本表，再打开 `active` 行的 primary artifact
