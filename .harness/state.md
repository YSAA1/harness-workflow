# Current task

Objective: 按已批准 Spec 执行 17 技能全量双语（两套目录树）+ 安装语言选择 + README 技能地图（M1 管线 → M2 批量 → M3 收口）。
Status: active
Primary artifact: docs/plans/2026-09-23--bilingual-skills-m1m3-plan.md
Evidence: Spec 已 user-approved（2026-09-23）：docs/specs/2026-09-23--bilingual-readme-invocation.md；Q1-Q6 拍板＝17 技能双语／两套目录树／全量一步到位／隐触发不补（三档调查结论：Claude 用 disable-model-invocation、Codex 用 agents/openai.yaml、其余无此选项）；push 时机＝完工一起推（0.10.0 的 f70e42e/781fac4 与 0.11.0 一波）。
Next: M1 执行中——check-plugin 扩展（en 树合法性+子集检查）+ brainstorm/review/writing-for-agents 三代表技能全量翻译（子代理并行）+ 负向试验 + 中文 commit。
Limits: skills.sh 只发现 skills/（英文树走手动拷贝，install.md 将如实声明）；翻译质量靠 M3 独立审校轮兜底（自译自校=generator/evaluator 未分离）。
