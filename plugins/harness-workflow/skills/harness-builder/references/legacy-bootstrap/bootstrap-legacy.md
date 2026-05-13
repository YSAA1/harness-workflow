---
name: bootstrap
description: "当 spec/plan 之后项目工作面还不清楚，或从空项目/陌生仓库启动非平凡实现时使用。典型触发语：准备开工、检查项目工作面、搭项目地图、补 AGENTS.md、创建三文件、确认验证路径、git 初始化、baseline commit、阶段提交规则、安装依赖、配置项目 MCP、推荐 Playwright MCP 或其他能力。进入 implement 前必须能说明薄 AGENTS.md、三文件、项目地图、验证路径、依赖/MCP、git/root/dirty 状态、恢复入口和能力缺口；若这些已有且未漂移，可跳过本 skill。"
---

> Historical reference only. Do not install or expose this file as a skill.
> The active entry is `skills/harness-builder/SKILL.md`.

# 项目工作面准备

本 skill 把"准备好动工"从隐性默契变成显式项目工作面检查。它通常在 `brainstorm` 的 spec 被批准、`plan` 写好之后、`implement` 之前运行；如果仓库是空项目或刚接手的陌生项目，也可以先用它搭起最小 harness 工作面，再回到 `plan` 补执行计划。若项目工作面已有 fresh evidence 且未漂移，`implement` 可以复用现状并在 `progress.md` 说明，不必重复跑全套 audit。

它**不**重新讨论需求，**不**写业务实现。它要把开工必需的项目工作面准备好：依赖、验证命令、项目级 MCP / capability、git 初始化和阶段提交规则。可选增强只记录为 recommendation；当前 spec/plan 必需的能力应尽量配置到项目里。

## 目的

这个 skill 专门处理一种常见失败：agent 还没弄清项目入口、状态文件、验证路径和恢复方式，就直接进入实现。接手一个仓库时，最常见的故障不是模型不会写代码，而是：

- 找不到入口文件、不知道运行命令、不知道测试在哪
- `AGENTS.md` 要么不存在、要么膨胀成无法消化的百科全书
- 没有 fresh evidence 的位置，进度只活在聊天里
- 目录看起来像仓库但不是有效 git root，或没有 baseline commit，后续无法可靠恢复 / review / checkpoint
- dirty worktree 没有分类，agent 容易把用户改动混进自己的提交
- 缺少真实依赖或验证能力（例如 Web app 需要浏览器但项目没有 Playwright / Playwright MCP），却没人安装、配置或写成 blocker
- "实现"和"初始化"被压成一步，结果实现写到一半才发现验证路径不存在

本 skill 做一次 cold-start workbench audit，必要时最小修复工作面，然后再交给执行 lane。它只产出项目脚手架、项目地图、验证入口和推荐能力，不重新规划需求，不写业务实现。

## 何时使用

### 触发信号

调用本 skill 当下列任一条件成立：

- `brainstorm` 已经收敛出 accepted spec，或 `plan` 已经写出三文件计划，准备进入实现
- 用户说「开始做了」「开干」「启动这个项目」「上手这个仓库」「准备 onboard」「初始化项目」「bootstrap 一下」「git 初始化」「先建 baseline commit」「提交规则」
- 空项目刚开始，已经有大致目标，需要先放置薄 `AGENTS.md`、三文件、项目地图、依赖入口、项目级 MCP 配置、git 初始化和验证入口
- 接手陌生仓库或长期未碰的项目，第一次启动 tracked workflow
- `AGENTS.md` 缺失、`AGENTS.md` 明显膨胀成百科全书、或 `AGENTS.md` 与代码事实严重漂移
- 三文件不存在或与当前 active slice 完全脱节
- 验证路径找不到、smoke/E2E 候选不明、能力匹配未审过

### 不要使用

- 需求或目标仍模糊：回到 `brainstorm`
- 没有可执行计划，且不是空项目首次搭 harness：先用 `plan`
- 一行翻译、单点修字、问答类小任务：直接执行，不进 bootstrap lane
- 之前 PASS 过 bootstrap 且工作面没明显漂移：复用上次 bootstrap report，不重复全套 audit

### 路由规则

| 入站状态 | 该用的 skill |
| --- | --- |
| 需求或方案不清 | `brainstorm` |
| 方案清、计划缺 | `plan` |
| 方案清、计划在、工作面缺 | **本 skill** |
| 方案清、计划在、工作面齐 | `implement` |
| 空项目需要先搭 harness | **本 skill**，然后回 `plan` |
| 接手陌生仓库做 audit | **本 skill** |
| 大改之后只想做 cleanup | `cleanup` |

## 先读取这些输入

按顺序读，不要跳：

1. `task_plan.md`、`progress.md`、`findings.md`，如果存在
2. `AGENTS.md`，记录长度、章节、是否含临时状态
3. `README.md` / `CONTRIBUTING.md` / `CHANGELOG.md` 等顶层说明
4. 包/构建配置：`package.json`、`pyproject.toml`、`Cargo.toml`、`go.mod`、`build.gradle` 等
5. 测试配置：`vitest.config.*`、`jest.config.*`、`pytest.ini`、`Makefile` 中的 test 入口
6. 关键入口：`src/main.*`、`src/index.*`、`cmd/*/main.go`、`bin/*` 等
7. 与当前 active slice 直接相关的代码、docs、issue
8. Git 状态：`git rev-parse --show-toplevel`、`git status --short`、`git log --oneline -20`；如果不是 git repo，greenfield 项目默认初始化 git
9. 项目级配置：`.codex/config.toml`、`.mcp.json`、现有 MCP / tool 配置（如果存在）

如果其中任何一条读不到（仓库太大或权限不足），把它写进 bootstrap gap，不要假装读过。

## 执行流程

### 第 0 步 — Pre-flight

回答以下问题；任何一个 No 都意味着**本 skill 不是当前正确入口**：

- 需求是否已经明确到可以定义"完成"？
- 是否已经存在或刚生成可执行计划？如果是空项目，是否至少有项目目标和初始边界？
- 任务是否非平凡、值得跑 bootstrap？

如果是 No，明确返回到对应 skill，不要因为已经被调用就硬走流程。

### 第 1 步 — 收集事实

读上面的 Inputs 列表，记录每一项：存在/不存在、明显过时与否、是否有断链。生成一张极简事实表（不写进任何文件，先在脑内对账）。

### 第 2 步 — 五子系统 Audit

对照五子系统逐项打分（PASS / WARN / FAIL）。详细问题清单见 `references/five-subsystem-audit.md`。简表如下：

| 子系统 | 必答问题 | 典型 FAIL 信号 |
| --- | --- | --- |
| 指令 | `AGENTS.md` 是薄入口吗？目标、边界、验证入口、恢复指针在不在？ | 没有文件、>500 行的混合文件、写满任务级 TODO |
| 工具 / 环境 | 依赖、install / run / test / lint / build 的命令是不是真实存在并能跑？ | 命令在 README 但仓库已重构、依赖装不上、需要登录 |
| 状态 | 三文件或等价工件能否回答"我们现在做到哪"？ | 三文件不存在、过期、和 git 状态严重背离 |
| 验证 / 反馈 | baseline check、smoke、E2E 候选在哪？fresh evidence 写哪里？ | 完全靠"我手动跑过"、没有 reproducible 命令 |
| 生命周期 / 范围 | active slice、non-goals、blocker、下一步是不是清晰？git checkpoint 策略是否安全？ | 多处声称在做、范围隐性蔓延、没人指 next、没有有效 git root 或 baseline checkpoint |

不要为了凑 PASS 把"WARN/FAIL 但很轻"提成 PASS。就绪状态必须由证据决定。

### 第 3 步 — 决定最小修复集

按以下原则收敛要做的修复：

- 优先修最低分子系统，而不是均匀覆盖
- 只修阻塞实现的项；锦上添花放进 deferred
- 任何超过"薄修复"的改动（重写 AGENTS.md 大段、引入新规则、扩 README）必须先和用户确认
- 不在 bootstrap 阶段写业务代码

### 第 4 步 — 应用最小初始化修复

默认直接做最小初始化修复，因为 bootstrap 的职责就是把项目工作面准备好。只有高风险或不可逆动作才停下来说明风险：重写大段 `AGENTS.md`、改写历史、删除分支、清理用户 dirty files、写入需要 secret 的配置。

允许产物：

- 薄 `AGENTS.md`（参考 `templates/AGENTS.template.md`）或精确 diff
- 项目地图：默认写到 `docs/project-map.md`；如果项目已有惯用位置，可在 `AGENTS.md` 写指针，不要把完整地图塞进 `AGENTS.md`
- 三文件：复用 `../plan/templates/task_plan.md`、`../plan/templates/progress.md`、`../plan/templates/findings.md`，**不**在本 skill 维护第二份模板
- 验证路径草稿（unit / lint / build / smoke / E2E 候选 + 命令）
- 依赖工作面：识别 package manager / runtime / lockfile，运行或记录 install/setup 命令，确认依赖是否真实可用
- bootstrap report：参考 `templates/bootstrap-report.template.md`，但折叠写入 `progress.md` / `findings.md`，不要默认创建第四份状态文件
- 项目级 MCP / capability：参考 `references/capability-catalog.md`；当前 spec/plan 验证必需的 MCP 应配置到项目级 `.codex/config.toml` 或项目既有配置，认证/secret 缺失时记录 blocker；可选增强才写 recommended capability 清单
- Git 工作面：参考 `references/git-readiness.md`；greenfield 项目默认 `git init`，建立 `.gitignore`、baseline commit、feature branch / worktree 规则和阶段提交规则；禁止 destructive cleanup / history rewrite

写入前必跑 `git rev-parse --show-toplevel` 和 `git status --short`，区分用户已有改动。保留所有用户已有内容；不做"顺手清理"。如果 `git rev-parse` 失败且这是 greenfield 项目，执行 `git init` 并记录；如果是嵌套目录或不该初始化的路径，把无 git 作为 blocker。

### 第 4.25 步 — Git readiness

Git 是工作面的一部分，不是收尾才想的事。按 `references/git-readiness.md` 检查：

- 是否在真实 git root 内；空 `.git/` 占位不算，必须以 `git rev-parse --show-toplevel` 为准。
- greenfield 项目默认需要 `git init`；只有路径不确定、嵌套 repo 风险或用户明确不要 git 时才阻塞。
- `.gitignore` 是否覆盖本项目的运行时目录、依赖目录、构建产物、secrets、本地 agent state（如 `.codex/`、`.omc/`、`.worktrees/`，按项目实际决定）。
- 是否已有干净 baseline commit；没有时，bootstrap 应在脚手架、三文件、验证入口和依赖/MCP 工作面就绪后建立 baseline commit。
- dirty worktree 是否可分为 related / unrelated / generated；不清楚时阻塞提交。
- 本轮是否需要 feature branch 或项目内 `.worktrees/<feature>`；风险高、并行或长期任务优先建议隔离。
- commit 规则是否清楚：按照 `task_plan.md` 的阶段提交；每个阶段完成且验证成功后提交；未验证成功不提交；消息写明行为和原因；不提交 secrets / runtime state / unrelated dirty files。

Git 修复默认属于 bootstrap apply 范围：greenfield `git init`、`.gitignore`、baseline checkpoint、阶段提交规则应被建立。仍然禁止 reset、rebase、force push、删除分支、清理用户 dirty files 等破坏性动作。

### 第 4.3 步 — Dependency / MCP readiness

按 `references/dependency-mcp-readiness.md` 检查：

- 识别真实 package manager、runtime、lockfile 和 install/setup 命令。
- 能安装就安装或运行项目标准 setup；不能安装时记录 blocker，不把未安装依赖当 PASS。
- 将 spec/plan 的验证策略映射到必需 capability：例如浏览器 E2E、官方 docs、GitHub issue、长任务 runner、外部服务。
- 必需 MCP / capability 要配置到项目级工作面（优先 `<project>/.codex/config.toml` 或项目已有 MCP 配置）；可选能力才写 recommended。
- MCP 配置不能写入 secrets；需要登录或 token 时写明 env/secret 入口和 blocker。
- 配置后记录需要新 Codex 会话生效，且在 `progress.md` 写明已配置 / 未配置 / blocked。

### 第 4.5 步 — 项目地图预设

项目地图不是目录树转储，而是冷启动索引。默认文件是 `docs/project-map.md`；如果项目已经有 `ARCHITECTURE.md`、`CONTEXT.md` 或类似文件，可以复用并在 `AGENTS.md` 指向它。按项目类型选择最接近的预设，再替换成真实路径；详细模板见 `references/project-map-presets.md`：

| 项目类型 | 地图最少包含 |
| --- | --- |
| 空项目 | 预期源码目录、文档目录、三文件位置、验证入口占位、暂不创建的目录 |
| Web / Frontend | app 入口、路由、组件、样式、测试、构建配置、E2E 入口 |
| API / Backend | 服务入口、路由/handler、domain/service、数据层、配置、测试、迁移 |
| Python / Research | 主脚本、包目录、实验配置、数据/输出约定、notebooks、测试/评估入口 |
| CLI / Tooling | bin/entry、命令定义、核心库、fixtures、测试、发布/打包配置 |
| Docs / Course | 内容源、站点配置、资源目录、构建命令、预览/校验入口 |

如果项目类型不明，只写已证实路径和 `unknown` gap。不要为了地图好看而发明目录。

### 第 5 步 — 生成 Bootstrap Report

不论 PASS/WARN/FAIL 都要输出一份 report。它本身不是独立 durable artifact（不进 `AGENTS.md`，也不默认创建 `bootstrap-report.md`），而是作为 `progress.md` 的一条 entry，并把 unresolved gap 写进 `findings.md`。

### 第 6 步 — Capability Setup / Recommendation

用户场景常见映射见 `references/capability-catalog.md`。分两类处理：

- **required capability**：当前 spec/plan 的验证策略离不开它；bootstrap 应配置到项目级工作面，或记录 blocker。
- **recommended**：不是本轮完成条件，但能提高后续质量；写价值 / 启用方式 / 风险 / 替代路径。

- Web app → recommended: Playwright MCP / browser E2E 工具
- API/SDK 行为不确定 → recommended: 官方 docs/search 能力
- issue-driven repo → recommended: GitHub / issue tracker MCP
- 长任务 / 训练 / 实验 → recommended: 日志、trace、health-check 工具

每条能力必须标注 `required` 或 `recommended`。如果不需要任何额外能力，明确写 `capabilities: none`。

### 第 7 步 — Hand off

写完 report 后只做一件事：明确告诉用户接下来该走哪个 skill。

| bootstrap 结果 | 推荐下一步 |
| --- | --- |
| PASS | `implement` |
| WARN，可执行但有 deferred gap | `implement`，gap 写进 `findings.md` |
| FAIL | 不进入实现；先回 planning lane、修复 gap，或 `save-session` blocked |

## 输出格式

```text
PROJECT BOOTSTRAP: PASS|WARN|FAIL

Scope:
  - Active slice: <最小可验证切片>
  - Non-goals: <显式排除的事>

Artifacts:
  - AGENTS.md: <thin|missing|bloated|drifted>
  - task_plan.md: <ok|missing|stale>
  - progress.md: <ok|missing|stale>
  - findings.md: <ok|missing|stale>
  - Project map: <docs/project-map.md 或既有地图位置>
  - Git: <repo root|not a repo|baseline missing|dirty classified>

Verification:
  - Baseline: <command -> 状态>
  - Smoke / E2E candidate: <列举>
  - Fresh evidence location: <progress.md 的哪一段>

Git readiness:
  - Root: <git rev-parse 结果或 not a repo>
  - Dirty state: <clean | related/unrelated/generated 分类>
  - Baseline checkpoint: <exists | created | blocked>
  - Commit rule: <每个 plan 阶段验证成功后提交；未验证不提交>

Dependency / MCP readiness:
  - Dependency setup: <command -> 状态>
  - Required capabilities: <configured | blocked | none>
  - Project MCP config: <path | none | blocked>

Recommended capabilities:
  - <可选增强：价值 / 启用方式 / 风险 / 替代路径，或 'recommended: none'>

Changes made:
  - <最小 diff 清单或 'blocked: <reason>'>

Blockers:
  - <硬阻塞项>

Next:
  - Skill: <implement | plan | brainstorm | save-session>
  - Reason: <一句话>
```

## 示例

### 示例 1: 用户刚通过 plan 拿到三文件计划，准备实现

输入信号：用户说「计划写完了，开始做吧」。

audit 结果：`AGENTS.md` 不存在；三文件齐全且新；`npm test` 可用；这是个 Electron 桌面应用，没有 Playwright。

输出（节选）：

```text
PROJECT BOOTSTRAP: WARN

Artifacts:
  - AGENTS.md: missing -> proposing thin entry pointing to docs/ + 三文件
  - 三文件: ok (just written by plan)

Verification:
  - Baseline: npm run check -> pass; npm test -> pass
  - Smoke candidate: 启动 Electron 主窗口，验证文档列表渲染
  - Fresh evidence location: progress.md (append-only)

Recommended capabilities:
  - Playwright MCP: 价值=Electron renderer E2E；启用=安装 @playwright/test 并接入 MCP；风险=Electron 需要 spectron 或 playwright-electron 适配；替代=手动启动 + 截图比对

Next:
  - Skill: implement
  - Reason: AGENTS.md 草稿已就位，三文件齐，依赖已安装；E2E 所需 Playwright MCP 已写入项目级配置或记录为 blocker
```

### 示例 2: 用户说「上手这个老项目，看看能不能加个功能」

audit 结果：`AGENTS.md` 是 800 行的混合手册；三文件全无；测试有但跑不动（依赖陈旧）。

输出（节选）：

```text
PROJECT BOOTSTRAP: FAIL

Artifacts:
  - AGENTS.md: bloated (812 lines, mixed durable/transient)
  - 三文件: missing

Verification:
  - Baseline: npm test -> fail (vitest@<v1 不兼容 node@20)

Blockers:
  - 测试 baseline 不绿，无法判断后续改动 regress
  - AGENTS.md 太厚，agent 难以一次摄入

Next:
  - Skill: plan（先把"修复 baseline + 拆 AGENTS.md"作为第一个 active slice）
  - Reason: 当前不具备非平凡实现条件
```

## 常见反模式

- **把 bootstrap 做成需求讨论。** 一旦发现需求模糊就回 `brainstorm`，不要在 bootstrap 里反复推演 spec
- **静默大改 AGENTS.md。** 即使现状很糟，也只做薄入口最小 diff；大段重写要先说明风险
- **造第二套模板。** 三文件模板只允许在 `plan/templates/` 维护
- **把 required MCP 写成可选建议。** 如果 spec/plan 的验证离不开它，就要项目级配置或记录 blocker
- **凑 PASS。** WARN 是合法状态；不要把 WARN 包装成 PASS 来加快进度
- **跳过 git status。** 用户在仓库里有未提交改动是常态；不区分会污染他们的工作
- **把目录当成 git repo。** 必须用 `git rev-parse --show-toplevel` 验证；空 `.git/` 或父目录误判都会让后续 checkpoint 失真
- **阶段未验证就提交。** 提交跟着 plan 阶段走，验证不成功不提交
- **把用户 dirty 改动混进 checkpoint。** 先分类 related / unrelated / generated；不确定就阻塞提交
- **写业务代码。** bootstrap 阶段一行业务代码都不写

## 验收标准

完成本 skill 时必须满足：

- [ ] 五子系统每项都有 PASS/WARN/FAIL 判断与一句证据
- [ ] active slice、non-goals、verification、recovery 路径都已明确写下
- [ ] git root、dirty state、baseline checkpoint、commit/branch 规则已明确；greenfield 项目已 `git init` 或记录为什么不能初始化
- [ ] 依赖已按项目标准安装/验证，或 blocker 写入 `findings.md`
- [ ] 当前 spec/plan 必需 MCP / capability 已项目级配置，或 blocker 写入 `findings.md`
- [ ] 所有写入都是 bootstrap 最小初始化修复；高风险动作已记录 blocker
- [ ] optional capability recommendation 含价值/启用/风险/替代，或显式 `none`
- [ ] bootstrap report 折叠写入了 `progress.md`，未解决 gap 写入了 `findings.md`，没有默认创建第四份状态文件
- [ ] 已明确标注下一步 skill 与触发理由

## 工件更新

- `progress.md`：追加一条 bootstrap entry，包含 audit 结果、修复清单、命令证据、推荐能力
- `findings.md`：写入未解决 bootstrap gap、residual risk、dependency / MCP blocker 和 optional recommendation 详情
- `.codex/config.toml` 或项目既有 MCP 配置：仅在 spec/plan 需要项目级 MCP 时写；不写 secrets
- Git：greenfield 默认初始化；baseline commit 在 bootstrap 工件、依赖、验证入口就绪后创建；后续每个 `task_plan.md` 阶段验证成功后提交，未验证不提交
- `task_plan.md`：仅当 active slice、non-goals、blocker、next action 因 bootstrap 改变时更新
- `AGENTS.md`：只做最小 diff，不重写；只放项目地图指针，不复制当前 active slice

## 按需读取

- `references/five-subsystem-audit.md`：五子系统逐项审计问题清单与典型 FAIL 信号
- `references/agents-md-rubric.md`：薄 `AGENTS.md` 判断标准；创建或压缩 AGENTS.md 时读取
- `references/project-map-presets.md`：空项目、Web、API、Research、CLI、Docs 项目地图预设
- `references/git-readiness.md`：git 初始化、baseline commit、branch/worktree、dirty worktree 和提交规则
- `references/dependency-mcp-readiness.md`：依赖安装、项目级 MCP 配置和 required / recommended capability 判定
- `references/capability-catalog.md`：常见项目类型 → 推荐能力映射
- `templates/AGENTS.template.md`：薄 `AGENTS.md` 起始模板
- `templates/bootstrap-report.template.md`：bootstrap report 详细模板
- 三文件 canonical 模板：`../plan/templates/`
