# Current task

Objective: 面向第三方用户的全仓展示面大扫除（docs/ 清开发痕迹、git 分支/worktree 残留清理）+ 17 技能双语通俗详解指南。
Status: complete
Primary artifact: docs/skills.zh-CN.md
Evidence: 两个施工 commit——大扫除：删孤儿调研文档（docs/research/2026-09-16--bloat-prevention-research.md，自带死亡条件已满足、根集合零引用）与内部 ADR 0001（引用已移除技能、决策已体现于现行设计），AGENTS.md 地图与铁律同步（docs/ 顶层只放用户面文档）；指南：docs/skills.zh-CN.md + docs/skills.md（17 技能逐个通俗详解，双语同构），README 双语入口链接、docs/install.md 技能清单指针、插件 0.11.0→0.11.1。git 侧：Cursor 残留 worktree 移除、4 条已并本地分支删除、6 条未并远端分支先建 archive/ 本地档案再删远端（9 条陈旧远端分支全清）。验证：check-plugin 全 PASS、agent check 通过、harness-builder 脚本测试通过。退休四步：翻行 complete、lessons 无新增（docs/ 边界规则已入 AGENTS.md T1）、本轨道无 plan/Spec 文档（对话执行）、state 同步。
Next: 无（任务 025 已退休；push master 与远端分支删除随收尾执行）。
Limits: 指南是通俗导读非协议（权威在 skills/*/SKILL.md），未对指南与 17 个 SKILL.md 做逐条独立审校（写作时逐一读过原文）；英文版为忠实转写。
