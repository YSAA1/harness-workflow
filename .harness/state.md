# Current task

Objective: 恢复面重设计——plan 成为恢复面出生点（最小面 work_index+state+AGENTS 指针）；.harness 收敛三文件并新增 lessons（种子 10 条）；writing-for-agents 心智模型重写；AGENTS.md.j2 接线恢复面；模板瘦身为 7 个。
Worktree: 本仓 master。
Status: complete
Primary artifact: .harness/lessons.md
Evidence: check-plugin.mjs 全 PASS；test_scripts.py 6/6 OK；validate_harness.py（skill 目录内运行）ok:true 零 issues；全仓 grep 无 .harness/recovery_policy、.harness/progress、.harness/decisions 及已删模板的活引用。
Next: 推送远端；在下一个多阶段任务里实证 plan 建档流程与 lessons 读写。
Limits: plan 建档与 lessons 钩子未在真实任务中实测；.harness/lessons.md 为种子内容，待实际使用检验格式。
