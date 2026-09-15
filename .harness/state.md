# Current task

Objective: 重构安装面为 skills.sh 一条命令多端可选安装（安装形态对齐 mattpocock/skills 仓库；skills.sh CLI 本体是 Vercel 的 vercel-labs/skills），并落地 cli-delegate 软指针与 review 检查增补；交付后补做独立 subagent 复核并修复发现。
Worktree: 本仓 master。
Status: complete
Primary artifact: docs/install.md
Evidence: check-plugin.mjs 与 scripts/agent/check.sh 全 PASS；stale-token 扫描已扩面到全部 tracked 活 .md（历史证据目录豁免）；harness-builder 6 项 Python 测试 OK；独立只读 subagent 复核（diffs + working tree + 外部文档核验）无 Critical，2 项 Important（skillopt.md 残留已删脚本命令、stale 扫描白名单过窄）与相关 Minor/Nit 已全部修复并复验；marketplace source "./" 语义经 Claude Code 官方文档核验 coherent。
Next: 推送远端后用 `npx skills@latest add YSAA1/harness-workflow` 实测交互安装；批C 剩余项（skills-ref 软闸门、work_index 行数上限）仍未做。
Limits: 端到端 skills.sh 安装未实测（依赖远端推送，master 领先 origin 7 个 commit 未推送）；commit ce02e93 信息中 "mattpocock/skills 方式" 为安装形态类比、CLI 归属已在 state 更正；未跟踪的 11.md、description.md 为用户文件，未纳入提交。
