# Current task

Objective: 重构安装面，完全对齐 mattpocock/skills 的安装方式（skills.sh 一条命令多端可选安装），并落地已批准的 cli-delegate 软指针与 review 检查增补。
Worktree: 本仓 master。
Status: complete
Primary artifact: docs/install.md
Evidence: check-plugin.mjs 与 scripts/agent/check.sh 全 PASS（skill 集合、frontmatter、无陈旧安装面、.claude-plugin 解析、README/install 文档覆盖）；harness-builder 6 项 Python 测试 OK；全仓活文件无旧安装面残留引用（历史 plans/specs/prd/reviews/progress 按版本化证据惯例保留）。
Next: 推送远端后用 `npx skills@latest add YSAA1/harness-workflow` 实测交互安装；批C 剩余项（skills-ref 软闸门、work_index 行数上限）仍未做。
Limits: 未实测 skills.sh 对本仓库的交互安装（依赖远端推送，未推送）；`.harness/progress.md` 历史记录保留旧命令名；未跟踪的 11.md、description.md 为用户文件，未纳入提交。
