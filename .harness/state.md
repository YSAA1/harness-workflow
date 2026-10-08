# Current task

Objective: 任务 031——吸收 mattpocock/skills 09-24→10-08（b0618bc）更新，插件 0.15.0：A 小补丁（brainstorm 答是即采纳、tdd seam 抓/漏、implement 引用复述、handoff 临时目录顺序、install 命名空间）；B diagnose 反馈回路闸门+明示豁免；C review 规范源+坏味基线；D plan 任务图切片+ship 并行模式；E cleanup 环境改进；F 方针（观察到的失败铁律、docs/out-of-scope、首跑观察信号）；G 收口。
Status: complete
Primary artifact: skills/ship/SKILL.md
Evidence: 7 个批次 commit（83b06bd…9869555）；中英双树逐条同构（复核确认行数与条款一致）；check-plugin 12 项全 PASS、agent/check.sh PASS、harness-builder 脚本测试 OK；独立只读 subagent 复核 0 Critical/2 Important/8 Minor，Important 全修、Minor 修 7；模拟退休后 check 仍过。全部改动标注「上游实证、本仓未首跑」。
Next: 首跑观察（按 docs/skills「运转正常的信号」）：在代码项目用 ship 跑 ≥3 项带依赖边计划，看多子代理同时跑、合并全 fast-forward、只一次全面 review、集成分支回流主分支后再 cleanup；diagnose 跑一次真实故障，看变红命令是否先于任何假设出现；review 输出是否列出规范源且坏味只作 Minor。
Limits: 全部未在本仓首跑；ship 并行模式依赖宿主后台子代理+worktree，未实测；docs/out-of-scope 条目仅中文（EN README 指向）；未同步 ~/.agents/skills 安装面（用户级路径，需明确要求）。
