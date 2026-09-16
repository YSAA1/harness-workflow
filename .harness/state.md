# Current task

Objective: 新增 remove-deadcode-py（按需全仓 Python 死代码清理工具 skill）进仓库与流程：cleanup 路由接线、全枚举面同步（AGENTS/CONTEXT/方法合同/README×2/install/checker/NOTICES/plugin.json 0.6.0）。
Worktree: 本仓 master。
Status: complete
Primary artifact: skills/remove-deadcode-py/SKILL.md
Evidence: 调研笔记 docs/research/2026-09-16--bloat-prevention-research.md（三路：工具面/方法论/skill 生态）；上游 oh-my-openagent 为 Sustainable Use License，仅方法借鉴未复制文本，署名走 THIRD_PARTY_NOTICES。check-plugin.mjs 全 PASS（含 tool skill 计数）；agent/check.sh PASS；test_scripts.py 6/6 OK；~/.agents/skills 本地已同步。
Next: 推送远端；在真实 Python 项目实测协议（vulture/Ruff 命令以官方文档为准）。
Limits: skill 协议未在真实 Python 项目实测（vulture/Ruff 命令以官方文档为准）。
