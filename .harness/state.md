# Current task

Objective: 三批重构——清理死功能与历史证据；agent-instructions-maintainer + recovery-surface-builder 合并为 writing-for-agents（中文壳 + 上游英文核心）；implement 改为测试驱动并新增 tdd 纪律 skill。
Worktree: 本仓 master。
Status: complete
Primary artifact: skills/writing-for-agents/SKILL.md
Evidence: 每批后 check-plugin.mjs 全 PASS（技能集、frontmatter、断链扫描、token 一致性）；harness-builder 6 项 Python 测试 OK（evals 删除未影响）；旧技能名活文件零残留（grep 验证）；RSB canonical 政策 7 份迁移至 writing-for-agents/references 并 diff 核对无损。
Next: 推送远端后 `npx skills update` 同步；用户级 ~/.agents/skills 中旧 AIM/RSB 拷贝需自行清理。
Limits: 历史证据目录（plans/specs/reviews/research 等）按用户明确指示删除，git 历史可查；tdd/implement 新协议未在真实任务中实测；11.md、description.md 为用户文件未纳入提交。
