# Spec - Harness Workflow Teaching Deck

> Status: draft
> Owner: user / agent
> Date: 2026-05-17
> Source request: 用户反馈旧版 PPT 讲得像 skill 清单和课程符号说明，希望改成面向已会用 Agent 编程者的教学课件，重点讲规范驱动开发和 Harness 工程思想。

## Background

旧版 `docs/decks/harness-workflow-overview.pptx` 已经完成 image-first 生成和 QA，但叙事重点偏向插件结构、skill 列表和 `C1-C10` 方法合同，不能很好帮助读者理解 Harness Workflow 背后的工程思想。

新版 PPT 的教学目标是让已经会用 Codex / Claude Code / Cursor 的读者理解：Agent 编程的难点不是让模型执行命令，而是把需求、计划、初始化、行动、诊断、验证和清理纳入一套规范驱动的开发流程。Harness Workflow 中的 skills 应作为这套工程纪律的落地点出现，而不是作为 PPT 主角。

## Goals

- 产出一份 25 页以上的教学课件型 PPT，帮助读者理解规范驱动开发和 Harness 工程思想。
- 重点解释从“对话驱动”转向“规范驱动”的必要性。
- 系统讲清规划、初始化、行动、诊断、审查、验证、清理等阶段如何组成完整工程闭环。
- 强调 Spec / Plan / Recovery Surface / Fresh Evidence / Cleanup 等概念的实际工程价值。
- 使用 Harness Workflow skills 作为流程职责映射，但不把 PPT 做成 skill 功能说明书。
- 使用克制的科技赛博朋克风格：深色工程控制台、青绿/蓝紫强调、网格、状态灯、流程线、证据链。
- 每页必须有实质性教学内容，不做低信息密度、花哨装饰型页面。

## Non-goals

- 不沿用旧版的 `C1-C10` 显式课程符号标记。
- 不逐页机械介绍每个 skill 的触发条件和字段。
- 不把 `find-skills` 放进主流程，只在能力缺口或 capability fit 处轻量出现。
- 不把 PPT 做成插件营销页或安装说明。
- 不把 Harness 简化成 `AGENTS.md`、prompt 模板或三文件状态。
- 本 Spec 不直接生成新版 PPT；生成应在用户批准 Spec 后交给 `plan` 和后续实现阶段。

## Users / Callers

- 主要读者：已经会使用 Agent 编程工具，但还没有形成系统工程流程的人。
- 典型场景：内部分享、教学课、教程配套课件、方法论讲解。
- 使用入口：后续通过 image-first PPT 工作流重新生成 `docs/decks/` 下的新版本课件。

## Behavior Spec

### Happy Path

- 用户批准本 Spec。
- 下一步 `plan` 把 Spec 拆成新版 PPT 的可执行计划。
- 后续实现阶段生成新的教学课件 PPT，页数不少于 25 页。
- 课件按照“思想 -> 流程 -> 规范 -> 工具落地 -> 案例 -> 误区 -> 总结”的教学顺序展开。
- 每页包含一个明确教学点、结构化内容和一张支持理解的流程图 / 框架图 / 对比图 / 例子图。
- 最终 PPT 能让读者说清：
  - 为什么 Agent 开发需要规范驱动；
  - Harness 工程思想解决的不是 prompt，而是工作环境；
  - Spec、Plan、初始化、行动、诊断、验证、清理各自解决什么失控问题；
  - Harness Workflow skills 如何映射到这套流程。

### Edge Cases

- 如果新版 PPT 仍然像 skill reference，应视为不符合 Spec。
- 如果出现 `C1-C10` 显式标记、课程章节编号或过强课程符号，应视为内容风格偏离。
- 如果页数低于 25 页，需要说明是否有用户批准的缩减原因。
- 如果赛博朋克视觉压过教学内容，应重做视觉策略。
- 如果每页只有口号、标题或大图，没有足够解释内容，应视为低信息密度失败。
- 如果生成式图片中文字不清晰，需要重新生成或调整为更清楚的信息图构图。

### Interfaces / State

- 新 Spec：`docs/specs/2026-05-17--harness-workflow-teaching-deck.md`
- 旧版参考：`docs/decks/harness-workflow-overview.pptx`
- 旧版生产工件：`docs/decks/harness-workflow-overview/`
- 新版后续计划建议放在：`docs/plans/`
- 新版后续 PPT 建议输出到新的 deck 路径，避免覆盖旧版，除非用户明确要求替换。

## Constraints

- 课件语言以中文为主，关键术语可保留英文：Harness、Spec、Plan、Recovery Surface、Fresh Evidence、Cleanup。
- 面向已会用 Agent 编程的人，不需要解释“什么是 Codex / Claude Code / Cursor”。
- 不使用明显课程合同符号如 `C1-C10`。
- 风格为科技赛博朋克，但必须克制、清晰、教学优先。
- 每页要有实质内容，适合读者自学浏览，不依赖口头补充才能理解。
- 如果继续走 image-first 路线，必须保留 protocol、jobs、PNG manifest、QA artifacts。

## Chosen Approach

采用“教学课件 + 方法论主线 + skill 映射落地”的方案。

课件先讲 Agent 开发为什么会失控，再引出规范驱动开发，随后讲 Harness 作为围绕 Agent 的工程环境，接着按开发闭环展开：澄清、规格、计划、初始化、行动、诊断、审查、验证、清理。最后用贯穿案例和误区总结把方法论落回实际使用。

建议新版大纲为 28 页左右：

| 页 | 标题 | 核心教学点 |
| --- | --- | --- |
| 1 | 从会用 Agent 到会驾驭 Agent | 会用工具不等于有工程流程；难点是让 Agent 稳定、可控、可验证地完成复杂任务。 |
| 2 | Agent 开发为什么会失控 | 需求漂移、上下文丢失、目标不清、验证缺失、文档过期，是工程环境问题。 |
| 3 | 对话驱动的局限 | 聊天适合探索，但不适合承载长期任务、边界、验收、状态和责任。 |
| 4 | 规范驱动开发的核心思想 | 把“想让 Agent 做什么”转成可执行、可验证、可恢复的工程规范。 |
| 5 | Harness 到底是什么 | Harness 不是提示词，而是围绕 Agent 的工作台：规则、上下文、状态、工具、验证、收尾。 |
| 6 | 一个可靠 Agent 工作流需要什么 | 入口规则、项目地图、任务规格、执行计划、验证路径、恢复状态、清理纪律。 |
| 7 | 规范驱动闭环总览 | 澄清 -> 规格 -> 计划 -> 初始化 -> 行动 -> 诊断 -> 审查 -> 验证 -> 清理。 |
| 8 | 第一步：不要急着实现 | 模糊需求直接进实现，会让 Agent 自己补全目标并跑偏。 |
| 9 | 澄清需求：把想法变成问题结构 | 目标、用户、边界、非目标、约束、验收方式、风险。 |
| 10 | Spec 的意义：不是文档，是执行合同 | Spec 约束 Agent 行为，也让人类能审查它是否做对。 |
| 11 | 好 Spec 应该包含什么 | 背景、目标、非目标、行为要求、约束、验证策略、残余风险。 |
| 12 | 为什么验证策略必须前置 | 如果一开始不知道怎么证明做对，后面所有“完成”都可能是幻觉。 |
| 13 | 从 Spec 到 Plan：把目标切成可执行切片 | Plan 不是 TODO list，而是 active slice、成功标准、验证路径和 commit 单元。 |
| 14 | Active Slice：一次只做一件可验证的事 | WIP=1 是防止范围膨胀的核心纪律。 |
| 15 | 初始化工作面：让 Agent 进入真实仓库 | 读取项目地图、验证命令、保护路径、已有状态和能力缺口。 |
| 16 | 为什么需要 Recovery Surface | 任务不能只活在聊天里；未来 Agent 要能从仓库工件恢复当前状态。 |
| 17 | 工具与能力不是越多越好 | skills、MCP、hooks、subagents 都应该服务具体缺口，而不是堆能力。 |
| 18 | 行动阶段：小步执行，小步验证 | 实现时保持 scope，改变行为就同步文档或状态。 |
| 19 | 失败阶段：不要盲改 | 失败要复现、最小化、提出单一假设、验证根因。 |
| 20 | Review 和 Verify 的区别 | Review 判断有没有做错；Verify 用新鲜证据证明当前状态可交付。 |
| 21 | Fresh Evidence：旧证据不能证明新结果 | 只要文件变了，之前的测试、截图、口头结论就可能过期。 |
| 22 | Cleanup：工程流程真正闭环的地方 | 清理不是收尾寒暄，而是同步 README、状态、生成物、风险和交接信息。 |
| 23 | 规范驱动下的 Skill 角色映射 | skill 是流程职责落点，不是 PPT 主角。 |
| 24 | 贯穿案例：一个 PPT 需求如何被规范驱动 | 从“帮我做 PPT”到澄清教学目标、写 plan、定 protocol、生图、验证、提交。 |
| 25 | 贯穿案例：如果没有规范会怎样 | 直接生成、内容跑偏、无法验收、无法复用、下次接不上。 |
| 26 | 常见误区 | 把 harness 当 AGENTS.md；把 plan 当 TODO；把 verify 当跑一次命令；把 cleanup 当可选。 |
| 27 | 方法论总结：Agent 不是被命令，而是被约束 | 好流程不是限制 Agent，而是让它在正确边界内发挥能力。 |
| 28 | 最终 Takeaway | 规范驱动开发让 Agent 工作可控、可验、可恢复、可交接。 |

## Rejected Options

- **沿用旧版 skill 清单结构**：会继续把读者注意力放在工具名和触发条件上，无法讲清背后的工程思想。
- **继续使用 `C1-C10` 显式标记**：这会让 PPT 像课程合同或内部编号说明，不符合用户希望的自然教学课件表达。
- **做成产品宣传型 PPT**：会降低信息密度，无法满足“每页有实质内容”的要求。
- **只做 15 页以内精简版**：不适合展开规范驱动开发的多个概念层次，用户已明确希望 25 页以上。

## Verification Strategy

### Baseline Evidence

- 读取本 Spec。
- 读取旧版 PPT 生产工件和 QA：`docs/decks/harness-workflow-overview/README.md`、`qa-pptx.json`、`visual-qa.json`。
- 读取当前方法论来源：`README.md`、`CONTEXT.md`、`docs/harness-method-contract.md`、`skills/*/SKILL.md`。

### Automated Checks

- 如果生成新版 image-first PPT：
  - `validate-deck-protocol`
  - `imagegen-jobs-status`
  - `visual-qa`
  - `imagegen-jobs-to-manifest`
  - `assemble-image-ppt`
  - `qa`
- 仓库结构检查：
  - `node scripts/check-plugin.mjs`

### Smoke / E2E Checks

- 打开或解析最终 PPTX，确认页数不少于 25。
- 确认每页是教学课件页，而不是单纯封面式视觉图。
- 确认核心流程从澄清到清理完整贯穿。
- 确认最终 PPT 不再出现显式 `C1-C10` 课程标记。

### Negative / Boundary Checks

- 搜索最终 protocol / slide script / visible text plan，不应出现 `C1-C10` 作为可见页面结构。
- 检查是否把 PPT 做成 skill 功能清单；如果连续多页以 skill 名称为标题，应重新调整。
- 检查是否存在“对话驱动局限、规范驱动、Spec、Plan、初始化、行动、诊断、验证、清理”这些教学主线。
- 检查赛博朋克视觉是否影响可读性：过暗、过亮、过多装饰或文字不可读都不合格。

### Documentation / State Checks

- 新版 PPT 目录应包含 README，说明最终 PPT、protocol、PNG、manifest、QA 工件。
- 如果保留旧版 PPT，应在新版 README 中说明新旧版本定位不同。
- 不把本次 active slice 或临时讨论写入 `AGENTS.md`。

### Fresh Evidence Required Before Completion

- 最终 generation / assembly / QA 命令必须在最后一次 PPT 或 PNG 改动之后运行。
- `git status --short` 必须检查，且提交范围只包含本次新版 PPT 相关文件。
- 关键里程碑使用中文 commit。

## Capability Gaps

- AI 生成图片中的中文文字可能不稳定，需要通过人工查看或视觉 QA 发现问题。
- 如果继续使用 image-first 路线，PPT 低可编辑性是预期属性；需要保留 protocol 和生成记录作为可追溯源。
- 若需要精确可编辑文字版课件，应改用原生 PPT 生成路线；这会牺牲 image-first 的视觉统一性。

Fallback:

- 如果 imagegen 中文文字效果不稳定，可先生成深色科技风模板图，再用原生 PPT 或图像后处理渲染确定性中文文字；但这需要用户批准从纯 image-first 路线调整为混合或原生文字路线。

## Success Criteria

- 新版 PPT 至少 25 页。
- 新版 PPT 的主线是规范驱动开发和 Harness 工程思想，而不是 skill 清单。
- 可见内容不使用 `C1-C10` 作为章节或课程符号。
- 至少覆盖：需求澄清、Spec、Plan、工作面初始化、Recovery Surface、Capability Fit、行动、诊断、Review、Verify、Fresh Evidence、Cleanup、贯穿案例、常见误区、最终方法论总结。
- 每页至少有一个明确教学点和一个支持理解的结构化信息元素。
- 最终 QA 证明 PPTX 结构符合所选生成路线。
- 读者看完后能用自己的话解释：为什么规范驱动比对话驱动更适合复杂 Agent 开发。

## Residual Risks

- “科技赛博朋克”风格容易变成视觉噪声；后续 plan 应把视觉约束写成“克制工程控制台”，而不是霓虹海报。
- 25 页以上会增加生成成本和 QA 成本；后续 plan 应拆成 protocol review、分组生图、QA 和必要重生。
- 教学内容较多，需避免每页堆满字；应使用流程图、对比表、状态机和案例拆解承载信息密度。

## Plan Handoff

- Active slice: 将本 Spec 转成新版 PPT 的 Executable Plan，定义新版 deck protocol、页组、验证路径和 commit units。
- Suggested next skill: plan
- Planning notes:
  - 优先创建新版 deck 路径，不覆盖旧版：例如 `docs/decks/harness-workflow-teaching-deck/` 和 `docs/decks/harness-workflow-teaching-deck.pptx`。
  - 计划中要明确 protocol review gate，用户确认 protocol 后再生图。
  - 后续如果继续 image-first，25+ 页必须使用 worker dispatch。
