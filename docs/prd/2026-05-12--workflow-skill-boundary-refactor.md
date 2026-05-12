# PRD：Workflow Skill 边界重构

## 问题陈述

当前 Harness Workflow 暴露了过多 workflow lane，并且把太多行为绑定到了 `state-contract`、`bootstrap` 和 three-file backend 上。结果是概念耦合：workflow skills 虽然宣称不依赖具体 backend，但很多 skill 仍然直接读取或写入 `task_plan.md`、`progress.md`、`findings.md`；`state-contract` 作为独立 skill 存在，但 recovery surface 的设计本应属于项目级 harness；`bootstrap` 实际承担项目 harness 构建职责，却仍使用偏初始化的名称；`resume` 和 `save-session` 重复了本应由 `AGENTS.md`、活文档和已选择 recovery surface 提供的恢复能力。

用户需要这个插件成为一组更干净、更独立的 workflow skills。每个 skill 应专注自身职责，不依赖强制全局顺序，并且只在当前任务确实需要 durable state 时使用项目恢复工件。

## 目标

- 将 canonical 项目 harness 构建 skill 从 `bootstrap` 改名为 **Harness Builder**。
- 删除作为暴露 skill 的 `state-contract`、`resume`、`save-session`。
- 保留被删除 skills 中有价值的思想，并迁移到 Harness Builder references、Cleanup references 和项目文档中。
- 让 `brainstorm` 产出 **Spec**，而不是 workflow state。
- 让 `plan` 产出 **Executable Plan**，而不是默认创建三文件。
- 让 `cleanup` 聚焦 **Knowledge Cleanup**：防止文档过期、`AGENTS.md` 膨胀、生成物不一致和 recovery surface 漂移。
- 保留 three-file backend 作为一种可选 workflow state backend，但不再把它视为所有 skill 的概念依赖。
- 更新 plugin metadata、验证脚本、生成 HTML、README、Method Contract、AGENTS.md 和相关模板，使它们描述同一个模型。

## 方案

围绕 `CONTEXT.md` 和 ADR 0001 中已经记录的五个稳定概念重构插件：

- **Harness Builder**：设计或修复项目级 harness 和 recovery surface。
- **Skill Independence**：每个 workflow skill 根据任务条件运行，而不是依赖固定全局顺序。
- **Spec**：`brainstorm` 的产物。
- **Executable Plan**：`plan` 的产物。
- **Knowledge Cleanup**：`cleanup` 的目的。

实现时应移除旧 workflow lane，而不是把它们保留为 legacy 入口。兼容性通过 description 中的触发词处理，而不是继续暴露旧 skill 目录。

## 用户故事

1. 作为插件用户，我希望 `harness-builder` 成为可见的项目 harness skill，这样名称能匹配它的真实职责。
2. 作为插件用户，我希望 `bootstrap` 只作为历史别名或触发词保留，这样旧说法仍能正确路由，但不会保留旧概念。
3. 作为插件用户，我希望移除 `state-contract` skill，这样 state backend 选择不会成为单独 workflow lane。
4. 作为插件用户，我希望 recovery surface 设计归 Harness Builder 负责，这样恢复能力被视为项目 harness 设计的一部分。
5. 作为插件用户，我希望移除 `resume` skill，这样普通会话恢复由 `AGENTS.md` 和活文档驱动。
6. 作为插件用户，我希望移除 `save-session` skill，这样交接卫生属于 cleanup 和 recovery policy，而不是单独 lane。
7. 作为插件用户，我希望 `brainstorm` 产出独立 spec，这样它能在任何 state backend 存在之前运行。
8. 作为插件用户，我希望 `brainstorm` 不默认写入 `findings.md` 或 `progress.md`，这样它能跨项目复用。
9. 作为插件用户，我希望 `plan` 产出 executable plan artifact，这样 planning 不等同于三文件初始化。
10. 作为插件用户，我希望 `plan` 只在已选择的 recovery surface 使用 three-file backend 时写三文件。
11. 作为插件用户，我希望 `implement` 只读取它需要的上下文，这样任务清楚时不会因为缺少三文件而阻塞实现。
12. 作为插件用户，我希望 `diagnose` 聚焦复现、hypothesis、root cause、修复和证据，这样调试不依赖某个特定 state backend。
13. 作为插件用户，我希望 `review` 检查正确性、范围、设计风险和缺失测试，这样 review 不会和文档清理混淆。
14. 作为插件用户，我希望 `verify` 为一个具体 claim 收集 fresh evidence，这样 ready 判断基于当前命令或检查。
15. 作为插件用户，我希望 `cleanup` 对齐 docs、代码和生成物，这样项目知识不会腐化。
16. 作为未来 agent，我希望 `AGENTS.md` 保持薄入口和规则导向，这样我能快速理解项目约束，而不用读一份 changelog。
17. 作为未来 agent，我希望 README、docs、生成 HTML、manifest prompts 和验证脚本保持一致，这样我不会收到互相矛盾的 workflow 指引。
18. 作为维护者，我希望被删除 skill 的有效内容迁移到聚焦的 references 中，这样 recovery 和 backend policy 指导不会丢失。
19. 作为维护者，我希望旧的暴露 skill 名重新出现时验证失败，这样简化后的模型不会回退。
20. 作为维护者，我希望用新流程重建 skill-flow HTML，这样审阅工件能反映插件真实形态。
21. 作为维护者，我希望重构完成后有一个干净的 Git commit，这样结构迁移可以作为一个整体被 review 或 revert。

## 实现决策

- 暴露的 skill 集合应变为：`harness-builder`、`brainstorm`、`plan`、`implement`、`diagnose`、`review`、`verify`、`cleanup`。
- `bootstrap` 应在 skill identity 层面改名为 `harness-builder`，不能只改文案。
- `bootstrap` 只应作为 description 中的别名或触发词保留。
- `state-contract`、`resume`、`save-session` 应作为暴露 skill 目录删除。
- `state-contract` 中的 backend taxonomy 应迁移到 Harness Builder references，作为 recovery surface policy。
- `resume` 和 `save-session` 中有价值的 checklist 应迁移到 Harness Builder recovery policy 和 Cleanup knowledge cleanup policy。
- `brainstorm` 应删除默认 Workflow State Contract 章节，替换为简短 persistence note：先写 spec；只有当前 recovery surface 要求时才记录摘要。
- `plan` 应删除 three-file identity 语言，并将输出定义为 executable plan。
- `plan` 应支持多种存储目标：plan document、issue、feature-list entry、既有项目系统或 three-file backend。
- `cleanup` 应围绕知识保鲜、防腐化、防膨胀和不同读者层级重写，并以 `neat-freak` 为参考模型。
- `review`、`verify`、`implement`、`diagnose` 应引用 spec、executable plan、evidence log、recovery surface、project docs 等语义输入，而不是硬编码三文件路径。
- `scripts/check-plugin.mjs` 应验证新的 required skill set 和新术语。
- `scripts/generate-skill-flow-html.mjs` 应从 skill 顺序和 route map 中移除 `state-contract`、`resume`、`save-session`。
- `docs/skill-flow-review/` 中的生成 HTML 必须重新生成，不能手改。
- `.codex-plugin/plugin.json` 应描述 Harness Builder 和简化后的 skill 集合。
- `README.md`、`docs/harness-method-contract.md`、`AGENTS.md`、`CONTEXT.md` 和 ADRs 应使用同一套 canonical terms。

## 模块和文件改动计划

### Plugin Manifest

更新 plugin manifest，使 default prompts 不再把 `state-contract`、`resume`、`save-session` 或 `bootstrap` 作为 canonical skills 提及。prompt 应引导用户：项目 harness 和 recovery surface 工作使用 Harness Builder；spec 使用 Brainstorm；executable plan 使用 Plan；fresh evidence 使用 Verify；knowledge cleanup 使用 Cleanup。

### Skill 目录结构

将 active `bootstrap` skill 重命名为 `harness-builder`。迁移有价值内容后删除 `state-contract`、`resume`、`save-session` 目录。不要保留 legacy skill 目录，因为可见 legacy 入口会继续保留旧心智模型。

### Harness Builder

Harness Builder 应拥有项目级 harness 职责：

- project map 和薄 `AGENTS.md`
- recovery surface 选择与修复
- recovery policy
- verification entry point
- project-local skills
- justified hooks、subagents 和 MCP policy
- capability recommendations
- anti-entropy guardrails

它不能变成 Brainstorm 或 Plan 前后的强制步骤。只有当 project-level workbench、recovery surface、verification entry 或 capability setup 不清楚时，才应调用它。

### Brainstorm

Brainstorm 应围绕独立 spec 创建重写：

- 输入：用户想法、既有 docs、代码、issues、README、context glossary 和相关约束。
- 输出：放在项目合适位置的 spec 文档。
- 不默认写入 three-file state。
- 不默认依赖 Harness Builder。
- 只有 spec 获得批准后才路由到 Plan。
- 只有 project-level context 或 recovery surface 缺口阻碍高质量 spec 工作时才路由到 Harness Builder。

### Plan

Plan 应成为 write-plan 风格的 skill：

- 输入：已批准 spec 或足够明确的用户请求。
- 输出：executable plan。
- 默认输出不应是三文件。
- 应写入已选择的项目 planning surface：docs plan、issue、feature list、existing system 或 three-file backend。
- 除非用户要求继续，否则产出 plan 后应停止。
- 应条件路由：project workbench 不清楚时到 Harness Builder；可以实现时到 Implement；已知失败存在时到 Diagnose。

### Implement

Implement 应聚焦 scoped changes：

- 读取当前 spec、executable plan 或用户请求。
- 如果存在 project recovery surface，则尊重它。
- 不要求 `task_plan.md` 存在。
- 只有 selected recovery surface 要求时才记录 durable notes。
- 重复失败时路由到 Diagnose。
- 稳定后路由到 Review 和 Verify。

### Diagnose

Diagnose 应聚焦 failure analysis：

- reproduce
- minimize
- hypothesize
- instrument
- name root cause
- apply minimal fix
- rerun fresh evidence

如果 selected recovery surface 存在，应把 root cause 和 dead ends 记录进去，但不应要求 `findings.md`。

### Review

Review 应检查：

- correctness
- scope discipline
- design risk
- missing tests
- 与 spec 或 executable plan 的不一致

它不应作为主要文档同步流程。文档漂移可以成为 review finding，但 Cleanup 负责 reconciliation。

### Verify

Verify 应为特定 claim 收集 fresh evidence：

- static checks
- build
- typecheck
- lint
- unit tests
- integration tests
- 相关时执行 smoke 或 E2E checks
- evidence insufficient 时记录 capability gaps

它不应依赖 `progress.md`；应使用当前命令和任何可用 evidence source。

### Cleanup

Cleanup 应参考 `neat-freak` 模型重构：

- 先检查 `AGENTS.md`、README、docs 和 recovery artifacts 的尺寸与膨胀
- 修改前枚举项目 docs
- 比较代码、docs、生成物、README、AGENTS 和 recovery surface
- 从 `AGENTS.md` 删除或迁移历史叙事
- 保持 `AGENTS.md` 是薄规则手册
- 保持 docs 面向读者且处于最新状态
- 生成物只能通过生成器更新
- 将未解决的 doc drift 记录为明确 follow-up
- 除非用户要求 cleanup 包含行为改动，否则避免行为变化

Cleanup 应吸收 `save-session` 中有价值的 handoff hygiene，但不能变成单独 pause/resume lane。

### Method Contract

更新 contract，使稳定原则不再绑定到被删除的 skill 名。具体要求：

- C2 应引用 repository artifacts 和 recovery surface，而不只是 workflow state。
- C3 应继续保护薄 `AGENTS.md`。
- C4 应引用 Harness Builder，而不是 bootstrap。
- C5 应引用 executable plans 和 scoped work。
- C8 和 C9 应显式体现 Knowledge Cleanup。
- C10 应保留 backend decoupling 作为原则，而不是 `state-contract` skill。

### README 和 AGENTS.md

重写公开 workflow map：

- 移除 `state-contract`、`resume`、`save-session`
- 引入 Harness Builder 作为 canonical 项目 harness skill
- 用独立职责描述 Brainstorm、Plan、Implement、Diagnose、Review、Verify、Cleanup
- 说明 three-file state 是可选项
- 说明默认验证命令
- 保持 `AGENTS.md` 简洁、规则导向

### 验证脚本

更新检查逻辑以强制新模型：

- required skills list 使用 `harness-builder`
- removed skills 必须不存在
- docs 不得把 `state-contract`、`resume`、`save-session` 宣传为 active skills
- `bootstrap` 只允许作为 alias/history 出现，不能作为 canonical active skill
- three-file templates 如果仍作为 backend templates 使用可以保留，但验证不能把它们当成全局依赖
- 只为 active skills 生成 HTML

### Skill Flow HTML

基于新的 skill graph 重新生成 HTML 审阅页面。主视图应展示条件路由，而不是强制线性流程。

## 测试决策

- 结构性改动后运行 `node scripts/check-plugin.mjs`。
- skill 名称、route map 或 `SKILL.md` 结构变化时运行 `node scripts/generate-skill-flow-html.mjs`。
- 重新生成后再次运行 `node scripts/check-plugin.mjs`。
- 验证 removed skill names 不再作为 active required skills 出现在 plugin manifest、check script、generated flow、README、Method Contract 或 AGENTS.md 中。
- 验证旧术语只作为 historical aliases、ADR context 或 legacy archive references 出现。
- 验证每个 active `SKILL.md` 都有有效 frontmatter，且 skill name 匹配。
- 验证 active skills 有对应生成 HTML 页面；已删除 skills 没有页面，除非被明确保留为历史文档。
- 本项目的好测试应检查插件外部行为和文档一致性，而不是内部措辞细节。
- check script 应作为 plugin shape 的主要回归测试。

## 不在范围内

- 修改用户级 Codex 配置。
- 发布或安装插件到本地 Codex marketplace。
- 在本次重构中新增 hooks、MCP config 或 subagents。
- 大幅重写 legacy bootstrap archive；只更新避免 active-skill 混淆所需的引用。
- 实现完整 issue tracker workflow。
- 修改本仓库外的实际项目 memory system。
- 完全删除 three-file backend templates。

## 验收标准

- `harness-builder` 是 canonical active skill name。
- `bootstrap` 不再是 active skill name，只能作为历史别名措辞出现。
- `state-contract`、`resume`、`save-session` 不再作为 skills 暴露。
- 有用的 state backend 和 recovery guidance 已迁移到 Harness Builder 和 Cleanup references。
- Brainstorm 文档描述 spec output，且不默认写 workflow state。
- Plan 文档描述 executable plan output，且不默认创建三文件。
- Cleanup 文档以 knowledge cleanup 和 documentation freshness 为中心。
- Review、Verify、Implement、Diagnose 使用 recovery-surface-aware wording，而不是硬编码 three-file dependency。
- README、Method Contract、AGENTS.md、plugin manifest、validation script、flow generator 和 generated HTML 保持一致。
- `node scripts/generate-skill-flow-html.mjs` 成功。
- `node scripts/check-plugin.mjs` 成功。
- 完成重构后用中文 Git commit 记录。

## 补充说明

本 PRD 有意移除暴露的 workflow lane，而不是保留兼容目录。即使这会让第一轮重构范围更大，迁移后的概念负担也会更低。

PRD 创建时本仓库未配置 issue tracker，因此本文档作为本地项目文档存放在 `docs/prd/` 下。
