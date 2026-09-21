# Current task

Objective: 落地恢复面闭环批3：新增 sweep 工具 skill（六档对账，档位依据 TienKung-Lab 只读实测）并完成全枚举面同步与 version bump。
Worktree: 本仓 master。
Status: complete
Primary artifact: docs/specs/2026-09-18--recovery-surface-loop.md
Evidence: 批3 已完成：skills/sweep/SKILL.md 新建（恢复面探测含降级声明、内联对账清单、六档分类含 TienKung 校准〔成对产物成组裁决、僵尸三形态、半翻行含 complete-未退休、untracked 二选一出口、worktree 高危、归档仅标记、超本分蒸馏〕、假阳守卫三条、退休四步、仿 remove-deadcode-py 汇报格式）；cleanup SKILL.md 与 entropy-checklist 加 sweep 路由；AGENTS.md 铁律登记 sweep；README×2、CONTEXT.md、docs/install.md、docs/harness-method-contract.md（含 seven→eight 过期计数修正）同步；plugin.json 0.6.0→0.7.0 并同步 description；check-plugin.mjs toolSkills 加 sweep。批3 复核修复：③半翻行纳入 complete-未退休形态（Spec:72 六档措辞回写对齐）；check-plugin.mjs 补 active/blocked 行 primary artifact 存在性检查（兑现 Spec:63 双判据，负样本 A 双处缺失报红、负样本 B 注册 worktree 内存在不误报、负样本 C marketplace description 不一致报红，三负样本均实测后恢复现场）；SKILL.md 清单标题去本仓路径直引（方法仓 lint 同判据）并标注 untracked 为 sweep 独有；marketplace.json 两处 description 对齐 plugin.json 并加 lint 一致性检查。验证（本批提交前全绿）：node scripts/check-plugin.mjs（2 tool skills 计数+存在性+恢复面一致）、bash scripts/agent/check.sh、python3 -B skills/harness-builder/tests/test_scripts.py（6 tests OK）。
Next: 无（任务 020 已退休，快照保留至新任务替换）。
Limits: 020 遗留未了项：master 领先 origin 未推送（推送远端待用户执行）；remove-deadcode-py 协议未在真实 Python 项目实测（vulture/Ruff 命令以官方文档为准）；sweep 档位依据来自 TienKung-Lab 只读实测，skill 协议本身尚未在目标项目完整执行过一轮；退休四步已由 020 收尾首次真实演练（本 commit：翻行 → lessons 继承 3 条 → 删 Spec → state 同步）。
