# Current task

Objective: brainstorm 按 Matt grilling 深度重构——拷问纪律六机制全文进 SKILL.md 主文件（设计树/frontier 轮/分支与压力/事实归 agent 决策归用户/每轮重塑树/判空对账），删 clarification-loop、clarification-coverage、design-grill 三 references 双树六文件，Coverage 八维矩阵与计分线收缩为 Framing/4，保留 028 的判空对账与轻量入口三锚点。
Status: complete
Primary artifact: skills/brainstorm/SKILL.md
Evidence: 上游原文核验（mattpocock/skills：grilling 纪律全文+grill-me/grill-with-docs 薄入口+两篇用户文档）；中英双树 SKILL.md 全文重写并删六 references；spec-drafting 双树 blocking dimensions→framing essentials；docs/skills 双语补事实归 agent 与防被动两句；插件 0.12.0→0.13.0（README 双语徽章同步，check-plugin 抓出后已修）；check-plugin 全 PASS（17/17 镜像、167 文件 stale 扫描、恢复面一致）。
Next: 无待办。首跑观察点升级：round 应按 frontier 整批编号（题干可多段带选项）、事实自查不问用户、判空附八支对账、误并轮漏支须重开受影响分支。安装面 ~/.agents/skills/brainstorm 同步（rsync --delete+diff 复核）随本 commit 后执行。
Limits: 纸面重构非真实首跑，两期退化均为结构诊断推因；对抗复核（非平凡 Spec 判空独立只读 subagent）仍未纳入；Matt 的 wayfinder/prototype 家族组合未评估是否引入。
