# Current task

Objective: 按调研结论补强 12 个 skill 的执行协议（批A/批B），并推进 cli-delegate 集成与 git stack / 高吞吐 PR 工作流调研讨论。
Worktree: 本仓 master，基于 e924488。
Status: 批A/批B 已落地并提交；批C（安装面/软闸门）与 cli-delegate 集成待用户决策。
Primary artifact: docs/research/2026-09-15--agent-harness-landscape-research.md
Evidence: 四项结构验证全 PASS（check-plugin / check-claude-code / check-cursor-install / install-cursor dry-run），三层镜像（root / plugins / .cursor）一致。
Next: 用户确认 cli-delegate 集成方式（软指针 vs 收编为第 13 个 skill）与 stacked PR 工作流采用范围后执行批C。
Limits: 11.md 与 description.md 为用户未跟踪文件，未纳入任何提交；skills-ref 软闸门与 skills.sh 安装文档未做。
