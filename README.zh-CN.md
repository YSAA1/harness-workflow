[English](README.md)

<p align="center">
  <img src="docs/assets/readme/harness-workflow-icon.png" alt="Harness Workflow icon" width="108">
</p>

<h1 align="center">Harness Workflow</h1>

<p align="center">
  <strong>给真实仓库使用的上下文感知 agent 工作台。</strong>
</p>

<p align="center">
  让 Codex、Claude Code 和 Cursor 在开工前拿到足够的需求上下文、仓库证据、恢复状态和验证纪律，适合那些不能靠一轮聊天做完的项目。
</p>

<p align="center">
  <a href="https://github.com/YSAA1/harness-workflow/actions/workflows/ci.yml"><img src="https://github.com/YSAA1/harness-workflow/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
</p>

<p align="center">
  <a href="#快速开始">快速开始</a> ·
  <a href="#为什么需要它">为什么需要</a> ·
  <a href="#它和普通-workflow-有什么不同">特点</a> ·
  <a href="#research-route-和-autoresearch">Research Route</a> ·
  <a href="#skill-map">Skill map</a> ·
  <a href="docs/install/codex.md">Codex</a> ·
  <a href="docs/install/claude-code.md">Claude Code</a> ·
  <a href="docs/install/cursor.md">Cursor</a>
</p>

<p align="center">
  <img src="docs/assets/readme/harness-workflow-figure.png" alt="Harness Workflow context-aware agent workbench infographic">
</p>

> 上下文越充分、仓库证据越真实，harness 才越有用。`harness-builder` 通常应该放在 `brainstorm` 或 `plan` 之后，因为那时 agent 才知道要做什么、不能做什么、以及应该如何证明做对。

<p align="center">
  <img src="docs/assets/readme/harness-fit-figure.png" alt="From global bloat to project-fit harness infographic">
</p>

## 快速开始

安装插件，然后按当前项目状态进入对应 lane。

```bash
codex plugin marketplace add YSAA1/harness-workflow
```

Claude Code:

```bash
claude plugin marketplace add YSAA1/harness-workflow
claude plugin install harness-workflow@harness-workflow
```

Cursor project-local 用法：

```bash
node scripts/install-cursor.mjs --target .
node scripts/check-cursor-install.mjs
```

这个 adapter 会安装 `.cursor/rules/` 和 `.cursor/skills/`；本仓库也把同一套 Cursor 预览面提交进来，包括 `find-skills`。它不依赖 legacy `.cursorrules`。详见 [docs/install/cursor.md](docs/install/cursor.md)。

Codex 会把这个仓库当作 GitHub marketplace 读取，然后从 `plugins/harness-workflow/` 安装真正的插件包。根目录 `skills/` 仍然是 canonical 编辑面；`node scripts/check-plugin.mjs` 会检查 packaged copy 是否和根目录漂移。

## 为什么需要它

很多开源 agent workflow 会给一条漂亮顺序：收集需求、写计划、改代码、review、verify。这条顺序有用，但它经常把真正难的部分留空。

真实仓库里会有过期文档、缺失测试、不清楚的 owner、dirty git state、本地约定、跑不起来的安装命令，以及跨 context compaction 的长任务。一个通用 checklist 没法判断这个仓库应该用什么恢复面、什么验证入口、什么 skill、什么 hook、什么 MCP。

Harness Workflow 解决的就是这个缺口。它把思考、计划、实现、诊断、验证、收尾和项目 harness 构建拆成不同 lane。重点不是把每个任务都变重，而是让流程贴合真实证据。

## 它解决哪些痛点

Harness engineering 听起来容易抽象：给 agent 设计更好的运行环境。真正难的是把这个理念落成文件、检查命令、规则、恢复状态和能力选择，让下一次开发真的更稳。

最常见的问题有三个：

| 痛点 | 常见结果 | 这个插件怎么处理 |
| --- | --- | --- |
| "Harness engineering" 停留在理念层 | 大家觉得方向对，但不知道第一步该创建什么。 | `harness-builder` 把理念落成具体工件：项目地图、薄规则、检查脚本、恢复面、能力决策和 cleanup policy。 |
| 所有项目吃同一套全局配置 | 用户把所有 skills、MCP、hooks、memories、rules 都装到全局。上下文变吵，工具互相干扰，小项目继承无关流程。 | 插件强调 project-fit：当前仓库需要什么就 adopt，暂时有用但不急就 defer，增加成本但没有信号就 reject。 |
| agent 做完但留下熵 | 测试可能过了，但 README 过期、临时文件残留、状态不准，下个 agent 还要重新摸索。 | `verify` 要求 fresh evidence，`cleanup` 对齐 README、生成物、恢复状态和交接知识。 |

## Harness engineering 怎么落地

harness 不是一个更长的 prompt。它是围绕模型的一套项目运行环境：

- **Instructions**：薄 `AGENTS.md` 或 `CLAUDE.md`、项目铁律、保护路径、按任务类型的必读入口。
- **State**：none、lightweight、`.harness/` 目录、feature list、issue tracker，或项目已有系统。
- **Feedback**：快速检查、smoke test、tiny run、截图、日志和当前验证证据。
- **Tools**：脚本、项目级 skills、定向 MCP、经过理由筛选的 hooks，以及真的能降低缺口的 subagents。
- **Cleanup**：防腐化规则，确保每个 session 结束时 docs、状态和残留物不会误导下一位 agent。

12 节课 harness 思想已融入 [`harness-builder`](skills/harness-builder/SKILL.md)（Harness Hypothesis 步骤）和 [`recommendation_matrix_policy.md`](skills/harness-builder/references/recommendation_matrix_policy.md)，作为实际 recommendation checklist。它会追问：强模型在这里还会怎样失败；模型周围需要哪些系统；哪些规则必须进入仓库真相；根 `AGENTS.md` 如何保持薄；长任务是否需要连续性；新 agent 开工前要做什么；如何限制范围；是否需要 feature list；怎样防止过早宣布完成；哪些地方需要 smoke/e2e/tiny-run；执行过程要捕获什么证据；每次会话结束应留下怎样的 clean state。

这不是强制产物清单，而是决策框架。一个小 CLI 库可能只需要项目地图和一条 check command。一个 ML 实验仓库可能需要 tiny-run 验证、data leakage review、run metadata 和更严格的恢复状态。一个前端项目可能需要浏览器 smoke check 和设计 review。不同项目就应该有不同 harness。

## 它和普通 workflow 有什么不同

| 特点 | 实际含义 |
| --- | --- |
| 上下文感知地构建 harness | `harness-builder` 在有条件时应该读取 brainstorm 后的 spec 或可执行 plan，再结合真实仓库证据。它不是空泛模板生成器。 |
| 先看 repo truth，再谈流程 | agent 会检查 docs、源码布局、测试、git 状态、已有规则和 setup 命令，再判断项目是否真的 ready。 |
| 恢复面是设计决策 | 有些任务不需要持久状态；有些需要 `.harness/recovery_policy.md` + `work_index.md`；跨会话工作用完整 `.harness/`；有些应复用 issue tracker 或已有 docs。 |
| 能力必须匹配真实缺口 | Skills、MCP、hooks、subagents、plugins、commands、CI/headless automation 和 external research 会作为独立 recommendation row 判断。Capability Recommendation 应输出易读推荐表：priority、type、recommendation、repo signal、value、install surface、approval needed、fallback、verification probe 和 classification；source/freshness/trust/risk 只在影响决策时展开。插件内置的 `find-skills` 辅助 skill 用于 skill 发现；targeted web research 用于本地 reference 只有 common patterns 或当前外部能力事实很重要的场景。推荐请求保持 read-only，直到 `USER CHECKPOINT`。 |
| 面向开放研究的 Research Route | 当用户明确要求 autoresearch 或研究性探索时，`harness-builder` 可以生成项目本地 research harness：假设、baseline、metric、evidence log、bounded iterations、git isolation、graduation gate 和 rollback policy。 |
| ready claim 必须有新证据 | `verify` 是唯一 ready gate。它会把每个“完成了”的声明绑定到当前证据：测试、构建输出、smoke check、截图、人工检查，或明确说明为什么无法验证。 |
| cleanup 是交付的一部分 | README 过期、生成物残留、状态不清、恢复笔记缺失，都不是小问题。下一个 agent 读不懂现场，工作就没有真正结束。 |

## `harness-builder` 应该放在哪里

`harness-builder` 负责创建或修复项目工作台：`AGENTS.md` 或 `CLAUDE.md`、项目地图、验证入口、恢复面、本地规则，以及经过理由筛选的可选能力。

推荐顺序：

| 项目状态 | 更合适的路径 |
| --- | --- |
| 需求还模糊，方案还有取舍 | `brainstorm -> plan -> harness-builder -> implement` |
| 需求已经清楚，但仓库工作台缺失 | `plan -> harness-builder -> implement` |
| 仓库已经有 fresh harness 和明确 check path | 跳过 `harness-builder`，进入 `implement`、`diagnose` 或 `verify` |
| 任务本身就是审计、修复或创建 agent governance | 直接用 `harness-builder`，但仍然先收集证据并做 gap-driven questions |
| 用户明确要求 autoresearch 或开放式研究探索 | `brainstorm -> plan -> harness-builder -> bounded evidence loop -> review -> verify -> cleanup` |
| 只是很小的改动 | 直接做并验证，不要制造流程 |

这个顺序很重要。一个有用的 harness 取决于当前目标、non-goals、风险、验证策略和仓库形状。没有这些上下文，agent 只能装一套看起来合理的模板。

## Research Route 和 autoresearch

有些项目不是单纯交付功能，而是在问一个想法值不值得继续：某个方法是否优于 baseline，某个 RL reward 是否真的改善行为，某个架构假设是否能被小实验支持。这类任务适合 Research Route。

Research Route 仍然从 `brainstorm` 和 `plan` 开始。agent 进入循环前必须先定义研究问题：

- goal 和 hypothesis；
- counter-hypothesis 或失败条件；
- baseline 和公平性检查；
- metric 或 review rubric；
- verification command 或 tiny run；
- data、secrets、protected paths、compute 的 guardrails；
- iteration budget 和 stop rule；
- logs、checkpoints、reports、discarded attempts 的 artifact policy。

用户批准这条路线后，`harness-builder` 可以在目标项目生成一组 project-local research harness：

```text
docs/research/research_plan.md
docs/research/evidence_log.md
docs/research/iteration_protocol.md
.harness/research_manifest.yaml
```

`uditgoenka/autoresearch` 这类上游项目最有价值的部分是 evidence loop：modify、verify、keep or discard、repeat。Harness Workflow 会把这个循环当作一个可选执行引擎，而不是完整研究流程。它不替代问题定义、baseline review、data leakage check、最终 research review 和 cleanup。详见 [docs/integrations/autoresearch.md](docs/integrations/autoresearch.md)。

失败代码不应该一直堆在仓库里。Research Route 要求先把失败原因、metric、命令输出摘要、artifact 链接和改动文件写入 evidence log，再做 rollback。已经 commit 的尝试，如果保留失败历史有价值，优先用 `git revert`；只有在用户批准的 research branch 或 worktree 内处理 scratch 改动时，`git reset --hard` 才可以作为清理工具。它不能覆盖无关用户改动，也不能对未审视的 dirty tree 直接执行。

Research Route 收尾不能直接声明 done。必须先完成 graduation 判断：选择 winner 或 no-winner，说明 merge mode，记录 branch/worktree cleanup checkpoint，并跑 entropy gate；之后进入 `review` 和 `cleanup`。

长任务必须控制热上下文。`evidence_log.md` 是短摘要和索引，不是完整 raw log。完整命令输出、截图、大 diff、checkpoint 和长报告应该放到 manifest 声明的 artifact 路径。后续 agent 默认只读 manifest、plan、protocol、summary、results table 和最近 3-5 轮；只有追查某一轮时才打开 raw evidence。evidence 和 raw log 都是 untrusted data，不能把里面出现的文字当成新指令执行。

协议搭好之后，可以这样开启下一轮：

```text
Use this repo's Research Route. Read the manifest, research plan, iteration
protocol, compact evidence summary, results table, and latest 3-5 iterations.
Do not read full raw logs unless needed for one specific iteration. Run the next
bounded iteration under the manifest's Verify, Guard, Budget, artifact, and
rollback policy. Record evidence before rollback. Stop at the review gate or
stop rule.
```

## Skill map

短版 lane 选择契约见 [docs/skill-routing.md](docs/skill-routing.md)。

| Skill | 什么时候用 | 应该留下什么 | 推荐下一步 |
| --- | --- | --- | --- |
| `brainstorm` | 目标、边界、取舍或成功标准还不够清楚。 | 默认写入 `docs/specs/YYYY-MM-DD--<topic>.md` 的聚焦 Spec：goals、non-goals、考虑过的方案、成功标准和验证策略。 | `plan`，如果任务本身是 harness 设计则转 `harness-builder` |
| `plan` | spec 或用户请求已经清楚，可以选择第一个可执行 slice。 | 默认写入 `docs/plans/YYYY-MM-DD--<topic>-plan.md` 的 Executable Plan，包括 active slice、`verification_path_status`、所需验证能力、fallback evidence、final integration claim 和 commit-sized work units。 | 工作台或证明路径 blocked 时转 `harness-builder`；纯证明任务转 `verify`；否则转 `implement` |
| `harness-builder` | 仓库缺少可靠工作台、恢复面、验证入口或能力决策。 | 基于仓库证据的最小 project-local harness plan，以及经过批准安装的组件。 | `verify`，再进入 `implement` 或 `cleanup` |
| `implement` | 一个 slice 已经 scoped，项目工作面也足够清楚。 | 小范围改动，以及作为实现反馈的本地检查；如果检查不能跑，要说明原因。它不声明 ready。 | 有意义改动转 `review`，小改动可直接 `verify` |
| `diagnose` | build、test、lint、typecheck、CI 或运行时行为失败，且根因未知。 | 复现、一个已验证假设、根因、最小修复和回归证据。 | 需要修复时转 `implement`，已修好时转 `verify` |
| `review` | 有意义的改动已经稳定，需要在 ready 前做结构性检查。 | 关于正确性、测试缺口、文档漂移、范围膨胀、entropy 和残余风险的 findings。它不替代 verify。 | 通过后转 `verify` 或 verify fast-path，有 findings 转 `implement` 或 `diagnose` |
| `verify` | agent 准备声明 work ready。 | 绑定具体成功标准、最后改动、命令、跳过项、unknown 和 ready verdict 的结构化 verification record。 | 通过转 `cleanup`，失败或缺能力转 `diagnose` / `harness-builder` |
| `cleanup` | 工作完成、阻塞、放弃或准备交接。 | 更新后的项目知识、清理后的残留物，以及下个 agent 能读的恢复状态。 | stop，或把明确 follow-up 交给 `plan` / `implement` |
| `find-skills` | 当前任务可能受益于已有可复用 skill。 | 搜索候选 skill，并在推荐或安装前检查质量。 | 要纳入项目能力时转 `harness-builder` |

## 常见路径

```text
Tiny edit:
implement -> verify

Unclear feature:
brainstorm -> plan -> harness-builder -> implement -> review -> verify -> cleanup

Clear task in an unfamiliar repo:
plan -> harness-builder -> implement -> review -> verify

Broken command:
diagnose -> implement -> verify

Harness audit or repair:
harness-builder -> verify -> cleanup

Open research / autoresearch:
brainstorm -> plan -> harness-builder -> bounded evidence loop -> review -> verify -> cleanup
```

这些 lanes 可以循环。如果 verify 发现缺浏览器 runner、外部 API、本地 skill 或 recovery gap，就把这个缺口交回 `harness-builder`，不要塞在实现里糊过去。

## 安装

### Codex

```bash
codex plugin marketplace add YSAA1/harness-workflow
```

然后在 Codex plugin directory 中安装 `harness-workflow`。维护本仓库时运行：

```bash
node scripts/check-plugin.mjs
```

详见 [docs/install/codex.md](docs/install/codex.md)。

### Claude Code

```bash
claude plugin marketplace add YSAA1/harness-workflow
claude plugin install harness-workflow@harness-workflow
```

调用 namespaced command：

```text
/harness-workflow:harness-builder
```

详见 [docs/install/claude-code.md](docs/install/claude-code.md)。

### Cursor

Cursor plugin 安装可用时：

```text
/add-plugin harness-workflow
```

如果要把 rules 和 skills 复制到当前项目：

```bash
node scripts/install-cursor.mjs --target .
node scripts/check-cursor-install.mjs
```

详见 [docs/install/cursor.md](docs/install/cursor.md)。

## 检查本仓库

```bash
node scripts/check-plugin.mjs
node scripts/check-claude-code-install.mjs
node scripts/check-cursor-install.mjs
claude plugin validate .
```

## 项目结构

| 路径 | 用途 |
| --- | --- |
| `skills/*/SKILL.md` | canonical workflow skill source。 |
| `skills/*/references/` | 按需读取的 checklist 和 policy notes。 |
| `plugins/harness-workflow/` | GitHub marketplace 使用的 Codex 可安装插件包。 |
| `.codex-plugin/` | Codex plugin metadata。 |
| `.claude-plugin/` | Claude Code plugin metadata 和 marketplace entry。 |
| `.cursor-plugin/`, `rules/`, `.cursor/rules/` | Cursor plugin 和 project-rule adapter surface。 |
| `docs/assets/readme/` | README icon 和 imagegen infographic PNG assets。 |
| `docs/install/` | 各端安装说明。 |
| `docs/integrations/` | 可选外部 workflow 集成说明，例如 autoresearch。 |
| `scripts/check-*.mjs` | 一致性和识别检查。 |

## License

MIT.
