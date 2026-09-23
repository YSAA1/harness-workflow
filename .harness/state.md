# Current task

Objective: autoresearch 0.12.0 发布闭环——重构（任务 026）+ 真实首跑校准（任务 027）。
Status: complete
Primary artifact: skills/autoresearch/SKILL.md
Evidence: 任务 026：施工 commit 9f358ce + 退休 commit 29b39c7（两树协议+模板+lens 重构、六面文档同步、0.12.0、独立审校 F1-F3/G1/G2/G4 全修）。任务 027 首跑校准（新协议完整走一遍：立项摸底→研究→干活→审核→蒸馏→终态）：docs/research/2026-09-23--skills-sh-index-gap.md，独立红队 6 发现（C1-C3/I1-I3）全部处置，时间戳探针同时修正原结论与攻击者前提；终态 inconclusive，领先解释=安装事件驱动摄入；lessons 继承一条（新技能发布后需一次 CLI 安装触发收录）。验证：check-plugin 全 PASS、agent check 通过、harness-builder 测试 6/6（026 时点）。
Next: 待用户授权一次 `npx skills add` 后复查 skills.sh 仓库页（预计 17/17 即裁决收录机制）；本机 ~/.agents/skills/autoresearch 安装副本为旧版，需重装同步。
Limits: 首跑为单轮研究型问题，干活段的动手实验路径（本地实验/implement 子任务）未经真实触发；单上下文宿主自审降级削弱对抗独立性（G3 既知取舍，本轮用独立子代理未降级）；平台级收录规则未裁决（n=1 限域）。
