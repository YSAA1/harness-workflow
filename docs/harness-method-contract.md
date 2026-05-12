# Harness Method Contract

本文档是 Harness Workflow plugin 的用户地图。运行时细节在各个 `SKILL.md` 中；这里只说明稳定方法论。

## 三层结构

| 层级 | 内容 | 放在哪里 |
| --- | --- | --- |
| 全局实践规则 | 所有 workflow 都应遵守的不变量 | README、本文档、必要时项目 `AGENTS.md` |
| 用户入口 skill | 明确用户意图和可验收产物 | `skills/*/SKILL.md` |
| 状态协议 | active slice、evidence、decisions、risks 等字段如何落盘 | `state-contract` |
| 能力配置 | MCP、hooks、额外 skill 或外部工具 | bootstrap / verification 记录中的 required / recommended capability |

## C1. Harness-first diagnosis

失败时先问 harness 哪里坏了，而不是先归因模型能力。

检查层：

- 任务：需求、边界、non-goals 是否清楚。
- 上下文：项目地图、入口、约束是否可读。
- 工具：命令、依赖、权限、MCP 或浏览器能力是否可用。
- 状态：workflow state 是否真实。
- 验证：证据是否 fresh，覆盖是否足够。
- 生命周期：是否 WIP 过多、提前收尾或恢复入口缺失。

主要 skill：`diagnose`、`bootstrap`。

## C2. Repository as truth

仓库工件是真相。聊天记录、隐藏 runtime state、口头结论都不能成为唯一事实来源。

默认 rigorous backend 是三文件：

- `task_plan.md`：当前执行合同。
- `progress.md`：追加式进度和验证证据。
- `findings.md`：需求、已接受规格、拒绝方案、风险、引用和根因。

但三文件不是唯一状态来源。其他 skill 依赖的是 `state-contract` 定义的 workflow state fields。

需求尚未收敛时，独立 spec 也是仓库真相的一部分。`brainstorm` 默认写 `docs/specs/YYYY-MM-DD--<topic>.md`。`plan` 必须从已批准 spec 或明确请求映射执行合同，不在 planning 阶段重新发明需求。

主要 skill：`state-contract`、`plan`、`resume`、`save-session`。

## C3. Thin instruction surface

`AGENTS.md` 是薄入口，不是百科全书。

应放：

- 项目概览。
- 项目地图。
- 项目铁律。
- 快速开始和验证命令。
- harness map / workflow state 指针。
- protected paths。
- Definition of Done。

不应放：

- 临时 TODO。
- 会话摘要。
- 一次性实现细节。
- 当前 active slice 或本阶段 non-goals 的具体内容。
- 长篇教程。

主要 skill：`bootstrap`、`cleanup`。

## C4. Workbench before implementation

非平凡实现前先确认项目工作面是否能承载实现。

新版 `bootstrap` 直接使用 harness-builder v3：

1. collect repo evidence;
2. gap-driven brainstorm;
3. optional read-only subagents;
4. Harness Hypothesis;
5. course coverage check;
6. Harness Plan;
7. project-local install;
8. verify and record.

它至少考虑：

- 项目入口和关键目录是否清楚。
- `AGENTS.md` 是否有项目概览、项目地图、项目铁律、harness map。
- workflow state backend 是否声明。
- 验证命令和 smoke/E2E/tiny-run 候选是否明确。
- 依赖、setup 命令和至少一条 baseline 验证是否真实可用。
- required MCP / capability 是否已项目级配置，或是否有明确 blocker。
- git root、dirty worktree、baseline checkpoint 是否足够支持恢复和 review。
- 是否需要项目级 skill、hooks、subagents 或 MCP policy。

主要 skill：`bootstrap`。

## C5. Scope discipline

默认 WIP=1。一个 active slice 到 verified 或 blocked 之前，不开启无关工作。

要求：

- `brainstorm` 先收敛 spec，包含 goals、non-goals、success criteria、verification strategy、capability gaps 和 plan handoff。
- active slice 和 non-goals 必须能从 workflow state 中读取。
- 默认三文件 backend 下，`task_plan.md` 的 `范围合同` 是执行真相。
- 创建计划、重新规划、修复阶段状态都归 `plan` / `state-contract`。
- executor 不扩大范围。

主要 skill：`brainstorm`、`state-contract`、`plan`、`implement`。

## C6. Evidence before completion

没有 fresh evidence 不声称完成。

证据阶梯：

1. static / syntax
2. build
3. typecheck
4. lint
5. unit tests
6. integration tests
7. smoke
8. E2E
9. manual / external signal

任务不一定每层都跑，但跳过必须说明原因。

`brainstorm` 阶段必须先设计验证策略。`verify` 负责最后跑 fresh evidence，不负责临时设计整套验证流程。

主要 skill：`brainstorm`、`review`、`verify`。

## C7. Observability and capability fit

当 agent 自身验证能力不足时，不硬装自信。

当前 spec/plan 必需的能力应作为 `required` capability 进入项目级配置；非必需增强才作为 `recommended`。

例子：

- Web app：推荐 Playwright MCP 或浏览器 E2E 工具。
- API / SDK 变更：推荐官方 docs/search 能力。
- issue-driven repo：推荐 issue tracker / GitHub 能力。
- 实验或训练项目：推荐日志、trace、health check 或运行状态工具。

required capability 要说明状态：configured / blocked / none。需要 secret、登录或外部服务时，只记录 env/secret 入口和 blocker，不把 secret 写进仓库。

主要 skill：`brainstorm`、`bootstrap`、`verify`。

## C8. Documentation freshness

文档过期比没有文档更危险。

规则：

- 改了代码、命令、验证路径、用户可见行为，就同步相关 README / docs / workflow state。
- reviewer 要检查文档、计划和证据缺口是否与实现脱节。
- cleanup 要删除或改写误导性说明，而不是继续堆新段落。
- `AGENTS.md` 仍保持薄入口，详细内容放邻近 docs、本地 AGENTS 或 project-local skills。

主要 skill：`implement`、`review`、`cleanup`。

## C9. Entropy control and clean state

会话结束时不能增加项目熵。

检查：

- 临时文件、调试输出是否留在仓库。
- 陈旧 TODO、重复规则、过期状态是否误导后续 agent。
- workflow state 是否能恢复当前状态。
- `AGENTS.md` 是否仍是薄入口。
- 未验证内容和残余风险是否明确。

主要 skill：`cleanup`、`save-session`。

## C10. State backend decoupling

所有 workflow skill 依赖的是 `state-contract`，不是固定文件布局。

Backend：

- `none`：简单一次性任务。
- `lightweight`：中等任务，少量范围合同和证据。
- `three-file`：默认 rigorous tracked workflow。
- `feature-list`：多功能/产品型项目。
- `existing`：复用项目已有 issue/docs/PROJECT.md 状态系统。

三文件依然是默认强模式，但不是所有 skill 的硬前提。

主要 skill：`state-contract`。

## 12 节课映射

| 课程思想 | Contract | 插件承载 |
| --- | --- | --- |
| 模型能力不等于执行可靠 | C1 | `diagnose` |
| Harness 是外部工程系统 | C1 / C4 / C7 | `bootstrap` + diagnosis |
| 仓库是事实来源 | C2 / C10 | workflow state |
| 拆分指令文件 | C3 | `bootstrap` / `cleanup` |
| 跨会话连续性 | C2 / C9 / C10 | resume / save |
| 初始化是独立阶段 | C4 | `bootstrap` |
| 任务边界 | C5 | planning / execution |
| 功能清单是状态原语 | C10 | feature-list backend |
| 防止提前宣告完成 | C6 | review / verify |
| E2E 改变结果 | C6 / C7 | verify + capability recommendation |
| 可观测性属于 harness | C7 | bootstrap / verify |
| 每次会话留下干净状态 | C8 / C9 | cleanup / save |
