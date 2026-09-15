# Current task

Objective: 三批重构（清理死功能与历史证据、三合一 writing-for-agents、implement TDD 化 + tdd）+ 独立复核修复 + 推送。
Worktree: 本仓 master。
Status: complete
Primary artifact: skills/writing-for-agents/SKILL.md
Evidence: 独立只读 subagent 复核三 commit（复跑验证命令、md5 对比迁移文件、上游 revision 逐行 diff、全树残留 grep）：声明 A/B/C pass、D partial（远端 CI 待推送触发）；2 项 Important（verbatim 未钉版本、Apache 归属丢失）与 M-2/M-3/M-4 及 Nit 已修复并复验，check-plugin / agent check / 6 项 Python 测试全绿；实删文件数修正为 187（此前口头表述约 210 偏高）；RSB 7 份政策迁移核对无损（living_docs_discipline 一句技能名重定向）。
Next: 推送 origin master 后由远端 CI 验证；在目标 agent 上 `npx skills@latest add YSAA1/harness-workflow` 实测安装；用户级 ~/.agents/skills 旧 AIM/RSB 拷贝需自行清理。
Limits: tdd/implement 新协议未在真实任务中实测；11.md、description.md 为用户文件未纳入提交。
