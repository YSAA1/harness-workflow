# Harness Workflow 教程：让 Codex、Claude Code、Cursor 在真实仓库里少迷路

> 发布提醒：本文只放有信息量的项目图和表格。图片使用 GitHub raw 链接，适合复制到知乎。若你使用 PicGo、SM.MS、七牛云或 GitHub issue 图床，也可以按文末图片表替换链接。

我做这个项目时，真正想解决的不是"让 agent 更听话"这么简单。

更具体一点：我希望 agent 进入一个真实仓库后，能先看清项目，而不是立刻开始改文件。它要知道需求有没有定，计划写在哪里，哪些命令能证明结果，失败以后怎么诊断，压缩上下文后从哪里恢复，做完以后该怎么收拾现场。

这就是 `Harness Workflow` 的定位。它不是一个大而全的提示词，也不是要求每个任务都走重流程。它更像一个项目工作台，把 agent 做事时最容易丢的几件事固定下来：上下文、状态、验证和收尾。

![从全局堆叠到项目适配](https://raw.githubusercontent.com/YSAA1/harness-workflow/master/docs/assets/readme/harness-fit-figure.png)

## 一句话理解

`Harness Workflow` 是一组 workflow skills。它把一次项目工作拆成几条清楚的 lane：

| Lane | 解决的问题 | 产物 |
| --- | --- | --- |
| 想清楚 | 需求还没定，边界和验收也不清楚 | Spec |
| 拆计划 | 需求已经清楚，但还不能直接开工 | Executable Plan |
| 搭工作台 | 仓库缺项目地图、规则、验证入口或恢复面 | 项目级 harness |
| 写代码 | 当前 slice 可以动手实现 | 小范围改动和局部证据 |
| 查故障 | 命令红了，但根因不明 | 复现、假设、根因和回归证据 |
| 评审 | 改动看起来稳定，但还没过结构检查 | findings 和风险判断 |
| 验证 | 准备说 ready，必须拿 fresh evidence | 证据映射 |
| 收尾 | 文档、生成物、状态、残留文件要对齐 | 干净可恢复的项目状态 |

这个项目当前支持三类使用面：

| 环境 | 入口 |
| --- | --- |
| Codex | `.codex-plugin/plugin.json` 指向 `skills/` |
| Claude Code | `.claude-plugin/` 提供插件识别面 |
| Cursor | `scripts/install-cursor.mjs` 把 rules 和 skills 装到目标项目 |

## 为什么我觉得它有必要

很多 agent workflow 看起来都差不多：先讨论，再计划，再实现，再验证。

问题在于，真实仓库不是流程图。真实仓库里经常有这些东西：

| 真实问题 | agent 常见反应 | Harness Workflow 的处理 |
| --- | --- | --- |
| README 写的命令已经过期 | 照着跑，失败后开始猜 | 先读项目入口和验证命令，失败就进 `diagnose` |
| 需求只是几句聊天 | 直接写代码，边界留在上下文里 | 用 `brainstorm` 写独立 Spec |
| 计划只在对话里 | 上下文一压缩，下一轮就忘 | 用 `plan` 写到选定 planning surface |
| 仓库没有 agent 入口 | 每次都重新摸索文件结构 | 用 `harness-builder` 建项目地图、规则和恢复面 |
| 测试过了但文档没改 | 下个 agent 按旧文档继续踩坑 | `cleanup` 把 docs、生成物和状态对齐 |
| "完成了"没有证据 | 只靠模型口头保证 | `verify` 要求 fresh evidence |

我不想把每个小改动都变成仪式。改一个拼写错误，就改完检查一下。可是一旦任务跨文件、跨会话、跨工具，或者有真实风险，就需要比"相信我已经完成了"更硬一点的东西。

![工作流总图](https://raw.githubusercontent.com/YSAA1/harness-workflow/master/docs/assets/readme/harness-workflow-figure.png)

## 这个项目的九个 skill

项目里现在有 9 个 skill，其中 8 个是主 workflow lane，`find-skills` 是辅助能力发现工具。

### 1. `brainstorm`：先把事想明白

适合在需求还没定的时候用。比如你只说"我想做一个恢复系统"，这时直接计划会太早。

它会逼你把几个问题讲清楚：

- 要解决什么问题
- 不做什么
- 谁会用
- 成功标准是什么
- 怎么证明它真的成功
- 哪些能力现在还缺

默认产物是一个独立 Spec，比如：

```text
docs/specs/2026-05-13--agent-recovery.md
```

它不会默认创建三文件，也不会写生产代码。`brainstorm` 的终点是：用户看过 Spec，并明确批准下一步。

用法示例：

```text
$brainstorm 我想给这个仓库加一个更稳的上下文恢复机制，先别写代码，帮我把需求想清楚。
```

### 2. `plan`：把 Spec 变成能执行的计划

`plan` 不负责继续发散想法。它接手的是已经清楚的请求，或者已经批准的 Spec。

它要产出一个 Executable Plan，至少包含：

| 字段 | 作用 |
| --- | --- |
| Objective | 这轮到底完成什么 |
| Active slice | 当前唯一推进的工作面 |
| Non-goals | 明确不碰什么 |
| Success criteria | 什么算过 |
| Verification path | 用什么命令或检查证明 |
| Commit units | 怎么拆成可提交的小块 |
| Handoff | 下一步该交给哪个 skill |

用法示例：

```text
$plan 基于 docs/specs/2026-05-13--agent-recovery.md 写一个可执行计划。
```

一个关键点：`plan` 默认写到 `docs/plans/YYYY-MM-DD--<topic>-plan.md`，不强行创建 `task_plan.md`、`progress.md`、`findings.md`。运行时恢复默认走 `.harness/`，也可以复用 issue、feature list 或项目已有系统；root 三文件只作为旧项目迁移参考。

### 3. `harness-builder`：给项目搭工作台

这是这个插件的核心 skill。

它处理的不是业务功能，而是 agent 工作环境本身。简单说，它会回答：

- 这个仓库的入口在哪里
- 哪些文件是项目规则
- 验证命令是什么
- 下次上下文压缩后从哪里恢复
- 是否需要项目级 skill、hook、MCP 或 subagent
- 哪些能力该装，哪些只是看起来很酷但现在没必要

它的工作模型很朴素：

```text
repo evidence + user intent + Capability Discovery
-> Harness Hypothesis
-> Harness Plan
-> project-local install
-> verification and audit records
```

用法示例：

```text
$harness-builder 这个仓库要长期给 Codex 用，帮我检查工作台缺什么，只装项目真正需要的东西。
```

它最重要的克制是：不从模板开始，不默认动全局配置。先读仓库，再判断缺口。

### 4. `implement`：只推进当前 slice

`implement` 是真正改文件的 lane。

它管三件事：

| 纪律 | 含义 |
| --- | --- |
| WIP=1 | 当前 slice 没验证前，不开新战线 |
| 风险匹配验证 | 小逻辑用 focused check，跨边界就要更强证据 |
| 文档同步 | 命令、配置、API、用户可见行为变了，就同步 docs |

用法示例：

```text
$implement 继续当前 active slice，只改 plan 里这一项。
```

如果同一个地方连续失败两次，它不应该继续瞎试，而是转到 `diagnose`。

### 5. `diagnose`：失败以后别猜

`diagnose` 专门处理 build、test、lint、typecheck、CI 或运行时失败。

它的流程是：

```text
reproduce -> minimize -> hypothesize -> instrument -> fix -> regression-test
```

这听起来像老生常谈，但对 agent 很重要。因为模型最容易在失败后开始"看起来合理"地猜。

`diagnose` 要求每轮只提出一个可证伪假设。假设被证伪也要记录，避免下一轮又走回头路。

用法示例：

```text
$diagnose node scripts/check-plugin.mjs 挂了，先复现并找根因，不要直接改。
```

### 6. `review`：改完先被挑刺

`review` 不等于跑测试。它更像一次结构性检查。

它用五把尺看当前结果：

| 尺子 | 看什么 |
| --- | --- |
| Spec coverage | 有没有漏做，或者做超了 |
| Evidence | 完成声明有没有当前证据 |
| Correctness | 边界、错误处理、兼容性有没有明显问题 |
| Docs | 文档和真实行为是否一致 |
| Entropy | 有没有调试残留、TODO、第二套状态源 |

用法示例：

```text
$review 这个 slice 已经实现了，帮我按 scope、evidence、docs 和 entropy 查一遍。
```

它的输出应该先列 findings，而不是先夸"整体不错"。

### 7. `verify`：ready 之前拿 fresh evidence

`verify` 只做一件事：证明当前 ready claim。

它不修复代码，也不重写计划。如果命令失败，就转 `diagnose`。如果证据不足，就说不足，不把 unknown 当 pass。

它按 Evidence Ladder 选检查：

| 层级 | 示例 |
| --- | --- |
| static parse | JSON、YAML、frontmatter 能不能解析 |
| build | 项目能不能构建 |
| typecheck | 类型检查 |
| lint | 代码风格和静态规则 |
| unit | 单元测试 |
| integration | 跨模块检查 |
| smoke | 最小真实运行 |
| E2E | 浏览器、外部系统或完整用户路径 |
| manual signal | 必要时的人工确认 |

用法示例：

```text
$verify 证明这次插件结构改动已经 ready，按 AGENTS.md 里的验证命令跑。
```

### 8. `cleanup`：别把烂摊子留给下个会话

`cleanup` 做的是知识收尾，不是顺手重构。

它会看：

- README 的命令还真不真
- `AGENTS.md` 有没有膨胀成会话笔记
- 生成物是不是从脚本重建的
- recovery surface 是否和 git diff 矛盾
- 临时文件、截图、日志有没有该清的
- 还有哪些 follow-up 不能假装完成

用法示例：

```text
$cleanup 这轮已经 verify 过了，帮我同步 README、docs、生成物和恢复状态。
```

如果 cleanup 发现行为没做完，它应该把任务打回 `implement`，而不是用文档把未完成包装成完成。

### 9. `find-skills`：只在有真实缺口时找能力

`find-skills` 是辅助 skill。它不属于主 workflow lane。

它用于 Capability Discovery：当当前项目确实缺某种可复用能力时，再去找有没有现成 skill。比如前端可访问性检查、ML 实验 review、文档生成、部署检查等。

用法示例：

```text
$find-skills 我这个项目需要做 Playwright E2E，有没有成熟 skill 能复用？
```

它的原则是：不要因为一个 skill 看起来相关就装。要看它是否解决当前仓库的真实验证、观测、领域工作或重复流程问题。

## 常见路线

下面这张表比"固定流程图"更接近真实使用。

```text
想法不清 -> brainstorm -> plan
项目工作台缺失 -> harness-builder
可以动手 -> implement
失败不明 -> diagnose
改动稳定 -> review -> verify -> cleanup
缺外部能力 -> find-skills -> harness-builder 决定是否安装
```

| 场景 | 推荐路线 |
| --- | --- |
| 小改动 | `implement -> verify` |
| 需求还没定 | `brainstorm -> plan -> harness-builder -> implement -> review -> verify -> cleanup` |
| 任务清楚，但仓库陌生 | `plan -> harness-builder -> implement -> review -> verify` |
| 命令已经红了 | `diagnose -> implement -> verify` |
| 只想检查项目工作台 | `harness-builder -> verify -> cleanup` |
| 做完准备交接 | `review -> verify -> cleanup` |

我平时最常用的判断方式是：

| 如果现在缺的是 | 就走 |
| --- | --- |
| 想法和边界 | `brainstorm` |
| 可执行步骤 | `plan` |
| 项目地图和恢复面 | `harness-builder` |
| 代码变化 | `implement` |
| 失败根因 | `diagnose` |
| 结构把关 | `review` |
| 完成证据 | `verify` |
| 知识收尾 | `cleanup` |
| 可复用外部能力 | `find-skills` |

## 一个小例子

假设我想给某个前端项目加一个设置页。

不推荐这样开场：

```text
直接帮我实现设置页。
```

如果项目小，这句话也许够用。但只要涉及状态、UI、持久化、测试和文档，我更愿意这样走：

```text
$brainstorm 我想加设置页，先确认用户场景、保存方式、非目标和验收方式。
```

Spec 批准后：

```text
$plan 把这个设置页 Spec 拆成 active slice 和验证路径。
```

如果仓库没有清楚的 agent 入口：

```text
$harness-builder 这个前端仓库缺项目地图和验证入口，帮我补最小工作台。
```

实现时：

```text
$implement 只做第一个 slice：设置页入口和静态表单，不接真实持久化。
```

最后：

```text
$review
$verify
$cleanup
```

这套流程的好处不是显得专业，而是减少上下文丢失。下一轮 agent 不需要问"上次做到哪了"，因为它能从项目文件里恢复。

## 安装和验证

Codex:

```bash
codex plugin marketplace add YSAA1/harness-workflow
```

Claude Code:

```bash
claude plugin marketplace add YSAA1/harness-workflow
claude plugin install harness-workflow@harness-workflow
```

Cursor 项目内使用：

```bash
node scripts/install-cursor.mjs --target .
node scripts/check-cursor-install.mjs
```

维护这个插件仓库时，当前推荐验证命令是：

```bash
node scripts/check-plugin.mjs
node scripts/check-claude-code-install.mjs
node scripts/check-cursor-install.mjs
node scripts/install-cursor.mjs --target . --dry-run
```

如果改了 skill flow 生成逻辑，或者改了 `SKILL.md` 结构，还要跑：

```bash
node scripts/generate-skill-flow-html.mjs
node scripts/check-plugin.mjs
```

## 图片发布表

知乎直接粘 Markdown 时，建议用下面这些发布链接。若你的图床有自己的 URL，把 `Markdown URL` 替换掉即可。

| 图片 | 本地路径 | Markdown URL |
| --- | --- | --- |
| 项目适配图 | `docs/assets/readme/harness-fit-figure.png` | `https://raw.githubusercontent.com/YSAA1/harness-workflow/master/docs/assets/readme/harness-fit-figure.png` |
| 工作流总图 | `docs/assets/readme/harness-workflow-figure.png` | `https://raw.githubusercontent.com/YSAA1/harness-workflow/master/docs/assets/readme/harness-workflow-figure.png` |

如果知乎不稳定加载 GitHub raw，可以改用 jsDelivr：

```text
https://cdn.jsdelivr.net/gh/YSAA1/harness-workflow@master/docs/assets/readme/harness-workflow-figure.png
```

把后面的路径替换成对应图片路径即可。注意 jsDelivr 有缓存，图片后续如果要更新，最好换文件名，比如 `harness-workflow-figure-v2.png`。

## 最后说人话

`Harness Workflow` 不会让 agent 突然变聪明。

它做的是更实在的事：让 agent 少靠聊天记忆，多靠项目文件；少说"应该可以了"，多拿当前证据；少把每个项目都套同一个全局流程，多按仓库真实情况装该装的东西。

对我来说，这才是 agent workflow 真正有用的地方。不是把流程写得更漂亮，而是让下一次冷启动、下一次失败、下一次上下文压缩，都还能接得住。
