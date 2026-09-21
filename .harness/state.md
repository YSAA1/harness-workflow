# Current task

Objective: 落地恢复面闭环批3：新增 sweep 工具 skill（六档对账，档位依据 TienKung-Lab 只读实测）并完成全枚举面同步与 version bump。
Worktree: 本仓 master。
Status: active
Primary artifact: docs/specs/2026-09-18--recovery-surface-loop.md
Evidence: 批3 已完成：skills/sweep/SKILL.md 新建（恢复面探测含降级声明、内联与 lint 同判据对账清单、六档分类含 TienKung 校准〔成对产物成组裁决、僵尸三形态、资源冲突半翻、untracked 二选一出口、worktree 高危、归档仅标记、超本分蒸馏〕、假阳守卫三条、退休四步、仿 remove-deadcode-py 汇报格式）；cleanup SKILL.md 与 entropy-checklist 加 sweep 路由；AGENTS.md 铁律登记 sweep；README×2、CONTEXT.md、docs/install.md、docs/harness-method-contract.md（含 seven→eight 过期计数修正）同步；plugin.json 0.6.0→0.7.0 并同步 description；check-plugin.mjs toolSkills 加 sweep。验证（本批提交前全绿）：node scripts/check-plugin.mjs（2 tool skills 计数+恢复面一致）、bash scripts/agent/check.sh、python3 -B skills/harness-builder/tests/test_scripts.py（6 tests OK）。
Next: 任务 020 收尾：按退休契约四步演练（翻 complete → lessons 继承 → 删 Spec → state 同步），元验证闭环。
Limits: 019 遗留未了项：master 领先 origin 未推送（推送远端待用户执行）；remove-deadcode-py 协议未在真实 Python 项目实测（vulture/Ruff 命令以官方文档为准）；sweep 档位依据来自 TienKung-Lab 只读实测，skill 协议本身尚未在目标项目完整执行过一轮。
