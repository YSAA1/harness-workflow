# Current task

Objective: autoresearch 0.12.0 发布闭环——重构（任务 026）+ 真实首跑校准（任务 027）。
Status: complete
Primary artifact: skills/autoresearch/SKILL.md
Evidence: 任务 026：施工 commit 9f358ce + 退休 commit 29b39c7（两树协议+模板+lens 重构、六面文档同步、0.12.0、独立审校 F1-F3/G1/G2/G4 全修）。任务 027 首跑两轮（第 2 轮经用户授权安装检验重入，即 `autoresearch <日志>` 续跑入口的实战）：docs/research/2026-09-23--skills-sh-index-gap.md；第 2 轮隔离项目级真实安装 17/17（0.12.0 内容核验）后页面 ≥5 分钟零变化 ⇒ 即时更新与实时计数被驳、页面为批量快照；lessons 条目已更新；canonical 安装面同步完成。验证：check-plugin 全 PASS、agent check 通过、harness-builder 测试 6/6（026 时点）。
Next: 被动等待 skills.sh 页面下次批量更新后复查（老技能计数 3→4 且四缺失同刻出现 ⇒ 事件绑定摄入确认；计数变而仍缺 ⇒ 爬取+过滤）；本机 canonical 面 ~/.agents/skills/autoresearch 已同步 0.12.0（rsync+diff 复核，Claude 侧符号链接自动跟随，/tmp 隔离安装试验已清理）。
Limits: 首跑两轮均为研究型问题，干活段的本地实验路径经 git 时间戳探针触发、implement 子任务路径未经真实触发；第 2 轮审核为降级自审（self，机械二值主源复核，攻击记录已落日志）；平台级收录规则未裁决（n=1 限域）。
