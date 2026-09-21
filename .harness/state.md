# Current task

Objective: 落地恢复面闭环批1：check-plugin.mjs 并入恢复面一致性 lint（状态矛盾 + docs/plans、docs/specs 孤儿，两项 hard fail），并 dogfood 修复 019/004、登记 020。
Worktree: 本仓 master。
Status: active
Primary artifact: docs/specs/2026-09-18--recovery-surface-loop.md
Evidence: lint 基线即抓到现存双漂移（019 active vs state complete；本 Spec 孤儿）；负样本复现：019 临时改回 active 报 contradiction、docs/plans 临时孤儿文件报 orphan，均退出非零，恢复后全绿。004 翻 complete 依据 bba516c「瘦身 plan skill 主文件」已落地（c260c33 换轨时误留 blocked），后续 1b0ea87/c2a2aee/6c1c8e5 持续精简至 33 行。019 翻 complete 依据 84fa0ab 与前份 state 快照 complete。
Next: 批2（退休契约写进 AGENTS.md 主落点 + plan/ship/cleanup 补充落点 + recovery_surface_policy 生命周期合同与 lessons 写法纪律）。
Limits: 019 遗留未了项：master 领先 origin 未推送（推送远端待用户执行）；remove-deadcode-py 协议未在真实 Python 项目实测（vulture/Ruff 命令以官方文档为准）。
