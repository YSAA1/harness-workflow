# Harness Method Contract

本文件定义 `harness-workflow` 的稳定方法论。skill 名可以演进，但 C1-C10 是仓库需要保持一致的契约。

## Glossary

| Term | Meaning |
| --- | --- |
| Harness Builder | 设计或修复项目级 harness、verification entry、Capability Discovery 和 recovery surface 的 skill |
| Harness Charter | `harness-builder` 安装前的短合同，说明目标、非目标、用户可见验收标准、验证路径、证据落点和已有 harness 处理方式 |
| Spec | `brainstorm` 的独立产物，说明要建什么、为什么、如何证明 |
| Executable Plan | `plan` 的产物，说明 active slice、non-goals、success criteria、verification path 和 next actions |
| Recovery surface | 让未来 agent 恢复工作的项目工件，可以是 none、lightweight、three-file、feature-list 或 existing system |
| Knowledge Cleanup | `cleanup` 的目标：防止 docs、生成物、AGENTS.md 和 recovery surface 漂移 |
| Capability Discovery | 为当前任务搜索并评估 skills、MCP、hooks、subagents 或外部 agent 能力 |
| Skill discovery helper | `find-skills`，用于搜索可复用 skills；它辅助 Capability Discovery，不是第九条 workflow lane |
| Research Route | `harness-builder` 在用户明确要求 autoresearch 或开放式研究时生成的项目本地研究 harness，不是第九条 workflow lane |
| Evidence Loop | 有边界地反复提出 iteration hypothesis、修改、验证、记录证据、keep/revert/reset/discard/stop 的研究循环 |
| Research Reset Policy | 失败代码可以在隔离研究分支或 worktree 内清掉，但失败原因、metric 和验证证据必须先保留 |

## C1 Harness As System

Agent 质量来自项目周围的系统：入口、规则、上下文、验证、恢复、能力、收尾纪律，而不只是 prompt。

主要 skill：`harness-builder`、`diagnose`。

## C2 Repository As Truth

仓库工件是真相，聊天记录不是唯一事实来源。非平凡工作应能从 Spec、Executable Plan、docs、issue、three-file backend 或其他 selected recovery surface 恢复。

要求：

- 当前目标、范围、证据和风险必须能从仓库或项目系统中恢复。
- 不把临时 active slice 写进 `AGENTS.md`。
- Three-file backend 可用，但不是唯一恢复面。

主要 skill：all skills。

## C3 Thin Instruction Surface

`AGENTS.md` 是薄入口：项目地图、铁律、验证命令、protected paths、required reading 和 DoD。它不是 changelog、session log 或任务计划。

主要 skill：`harness-builder`、`cleanup`。

## C4 Workbench Before Implementation

当项目入口、验证命令、recovery surface 或能力边界不清楚时，先用 Harness Builder 修工作面；当这些已经清楚时，不要把 Harness Builder 变成强制前置步骤。

要求：

- Harness Builder 不能从空泛意图直接生成模板；必须先有证据支持的 Harness Charter。
- Harness Charter 至少包含 objective、non-goals、user-facing acceptance criteria、verification path、evidence location、selected recovery surface 和 source-of-truth priority。
- 如果这些字段无法从用户请求、已批准 Spec/Plan 或仓库证据推出，应先提问或回到 `brainstorm` / `plan`。
- 已有 harness 的仓库必须先 reconcile：keep、patch、archive/deprecate、reject/remove，再安装新内容。

主要 skill：`harness-builder`。

## C5 Scoped Work

非平凡工作必须有清晰边界。边界来自用户请求、Spec 或 Executable Plan。

要求：

- active slice 唯一。
- non-goals 明确。
- success criteria 可证伪。
- WIP=1。
- 发现范围扩大时回 `plan` 或请求用户确认。
- Research Route 还必须有 hypothesis、baseline、metric、verify、guard、budget 和 stop rule。

主要 skill：`brainstorm`、`plan`、`implement`、`review`。

## C6 Fresh Evidence

Ready claim 必须有当前证据。旧命令、聊天记忆和过期截图不能证明最新工作树。

主要 skill：`verify`、`review`、`diagnose`。

## C7 Observability And Capability Fit

能力配置必须服务当前任务的验证、可观测性、自动化或领域能力。安装或推荐 skills、MCP、hooks、subagents 前必须说明 value、enablement、risk/cost、fallback。

Capability Discovery 要求：

- 对 skills，使用 `$find-skills` 搜索强相关可复用能力。
- 对 MCP、hooks 或外部 agent 能力，使用 targeted web search 查官方文档或成熟实现。
- 不把当前已安装 skills 当作搜索范围上限。
- 不因为"可能有用"就安装能力。
- 用户明确要求 autoresearch 时，先判断是否已有完整 Research Route contract；缺少目标、baseline、metric 或 verify 时，回到 brainstorm / plan，而不是直接循环。

主要 skill：`harness-builder`、`verify`。辅助 skill：`find-skills`。

## C8 Artifact Freshness

代码、命令、README、docs、generated artifacts 和 selected recovery surface 必须描述同一个现实。

要求：

- 改命令、配置、API、用户可见行为时同步相关 docs。
- 生成物只能通过生成器更新。
- 新需求进入已有 harness 时，先声明当前 source of truth，避免旧 active slice 和新需求混写。
- Review 可以指出 drift；系统性 reconciliation 由 Knowledge Cleanup 完成。

主要 skill：`review`、`cleanup`。

## C9 Knowledge Cleanup

收尾不是简单说 done，而是降低知识熵。

要求：

- `AGENTS.md` 保持薄入口。
- README 和 docs 面向读者且不过期。
- selected recovery surface 能回答当前状态、证据、风险和下一步。
- `AGENTS.md` 只接收稳定规则和入口指针；当前任务状态、一次性结论和短期 TODO 必须留在 selected recovery surface。
- 未解决 drift 记录为明确 follow-up。
- 不用 cleanup 隐藏未完成工作。
- 对 Research Route，cleanup 前必须确认失败尝试的证据仍可读，即使失败代码已经 revert 或 reset。

主要 skill：`cleanup`。

## C10 Backend Decoupling

Workflow skills 依赖 recovery surface 的语义字段，不依赖固定文件布局。

Backend options：

- `none`
- `lightweight`
- `three-file`
- `feature-list`
- `existing`

Three-file backend 使用 `task_plan.md`、`progress.md`、`findings.md`，仍适合 rigorous tracked workflow；但它只是 selected backend，不是所有 skill 的概念前提。

主要 skill：`harness-builder`、all skills。

## Skill Responsibility Map

| Skill | Canonical output |
| --- | --- |
| `harness-builder` | project harness, recovery surface policy, Capability Discovery recommendations |
| `brainstorm` | Spec |
| `plan` | Executable Plan |
| `implement` | scoped change with evidence |
| `diagnose` | root cause, minimal fix, regression evidence |
| `review` | findings-first review |
| `verify` | fresh evidence for a claim |
| `cleanup` | Knowledge Cleanup and aligned artifacts |
| `find-skills` | reusable skill discovery and quality screening |
