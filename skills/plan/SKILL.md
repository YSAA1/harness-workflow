---
name: plan
description: "当非平凡任务已有明确请求或用户批准过的 spec，需要创建或重写 workflow state 执行合同时使用（默认 three-file backend: task_plan.md / progress.md / findings.md）。典型触发语：写计划、重新规划、调整阶段、创建 workflow state、创建三文件、生成三文件、列 commit unit、把 spec 变成实施计划、设置跟踪。需求、边界或验证策略还不清楚时先用 brainstorm；计划写好后通常进入 bootstrap。"
---

# 写入 Workflow State 计划

本 skill 把已经明确的请求或已批准的 spec 物化成 workflow state 执行合同。默认使用 three-file backend。它的产物不是"会议纪要"，而是后续 `implement`、`review`、`resume` 都会读、都会改、都会信任的事实来源。

`plan` 不负责发散需求，也不替代 spec review。来自 `brainstorm` 的 spec 应已经说明 goals、non-goals、行为、约束、成功标准、verification strategy、capability gaps 和 plan handoff；本 skill 只把这些内容拆成阶段、active slice、验证路径和下一步动作。

## Workflow State Contract

本 workflow 依赖的是 `state-contract` 定义的 workflow state，而不是某三个文件本身。默认 backend 是三文件：`task_plan.md` / `progress.md` / `findings.md`。

如果项目在 `AGENTS.md`、`.harness/manifest.yaml` 或 `.harness/state.md` 中声明了其他 backend（lightweight、feature-list、existing），按该 backend 读取 active slice、evidence、decisions、risks 和 handoff。

若 state backend 不存在：简单任务可以轻量执行；非平凡或跨 session 任务先调用 `state-contract` 或 `plan` 建立状态。

## 目的

这个 skill 解决"计划只活在聊天里"的问题。如果计划不进入 workflow state，三件事会同时坏掉：

- agent 被压缩或新会话开启后丢失"为什么这样做"
- 多人/多 agent 协作时，没人能从仓库回答"现在做到哪"
- 范围会在追加讨论中悄悄扩张，第一个 active slice 永远收不了尾

`plan` 强制把这些信息搬到 workflow state。默认映射是 `task_plan.md`（执行合同）/ `progress.md`（追加证据）/ `findings.md`（决策与风险），并使用从 `OthmanAdi/planning-with-files` vendored 过来的中文模板，使三文件结构在所有项目里一致、可恢复。

## 何时使用

### 触发信号

- `brainstorm` 写出并经用户批准的 spec，需要变成可执行计划
- 用户给出明确请求且任务非平凡（多步、多文件、跨边界、需要验证）
- 现有 workflow state 已经过期：阶段全部 done 却没收尾、active slice 名不副实、blocker 还在但 next 没改
- state backend 中有真相但执行合同没同步
- 用户说「写计划」「列阶段」「拆任务」「定义 active slice」「写 commit unit」

### 不要使用

- 需求、边界或验证策略仍模糊：先 `brainstorm`
- 任务是单点改动（typo、单测试、一个常量），三文件反而是噪声
- 已有 workflow state 仍真实、active slice 与 next 一致——只需要按 backend 追加 evidence，不需要 replan

### 路由规则

| 状态 | 下一步 |
| --- | --- |
| spec 已明确，workflow state 缺 | **本 skill** |
| workflow state 齐，工作面缺 | `bootstrap` |
| workflow state 齐，工作面齐 | `implement` |
| spec 不清，或没有验证策略 | `brainstorm` |
| 仅小补丁 | 直接执行并在 `progress.md` 追加证据；如果阶段、blocker 或 next 失真，仍用本 skill 重写计划 |

## 先读取这些输入

1. 已批准 spec：优先读取 `docs/specs/`、`docs/product-specs/`、`docs/design-docs/` 或用户指定文件。没有 spec 时，确认用户请求是否已经足够清楚且包含验证策略。
2. 当前 `task_plan.md`、`progress.md`、`findings.md`（如果存在）。把它们当作既有事实，不要随手清空。
3. `AGENTS.md`：是否已经写下"三文件就是事实来源"和恢复入口。
4. 与请求直接相关的代码与 docs，确认 spec 的可行性。
5. `git status --short` 与 `git log --oneline -10`：避免计划与已有改动相互踩。
6. 任何用户附上的需求文档、讨论纪要、issue 链接。

## 三文件职责

| 文件 | 角色 | 内容指纹 |
| --- | --- | --- |
| `task_plan.md` | 执行合同 | 目标、范围合同(active slice / non-goals / success criteria / verification path)、当前阶段、总成功标准、3-7 个阶段、关键问题、已做决策、Errors/Blockers、Next 1-3 项 |
| `progress.md` | 追加日志 | `### YYYY-MM-DDTHH:MMZ` 时间戳节，记录 Intent / Phase / Actions / Files / Commands+result / Outcome / Next |
| `findings.md` | 决策与风险 | accepted spec、constraints、technical decisions、rejected options、risks、references、root cause |

模板源：

- `templates/task_plan.md`
- `templates/progress.md`
- `templates/findings.md`

来源：`OthmanAdi/planning-with-files` 的 `skills/planning-with-files-zh/templates`，已按本插件的三文件工作流改造（中文为主、active slice 显式、不带上游 hooks/automation）。许可证记录见 `templates/README.md`。**不要**在其他 skill 里维护第二套模板。

## 执行流程

### 第 -1 步 — spec readiness gate

先判断是否可以进入 planning：

- spec 文件存在且用户已批准？→ 继续。
- 没有独立 spec，但用户请求已明确、任务中等复杂且验证策略清楚？→ 可以写轻量计划，并在 `findings.md` 记录 accepted spec 摘要。
- goals、non-goals、success criteria、verification strategy 或 capability gaps 缺失？→ 回 `brainstorm`，不要用计划弥补规格缺口。
- spec 太大，包含多个独立子系统？→ 先回 `brainstorm` 拆 spec。

planning 的输入必须能回答：做什么、不做什么、如何证明做对、哪些验证能力不足。

### 第 0 步 — 判断 first plan 还是 replan

读完三文件后回答：

- 三文件缺一个或多个？→ first plan：用模板创建缺失文件
- 三文件齐但 active slice 与现状对不上？→ replan：保留 `findings.md` 的历史决策章节，重写 `task_plan.md` 的执行合同
- 三文件齐且仍真实？→ 不重写计划；只在 `progress.md` 追加必要证据并退出

### 第 1 步 — 写 `task_plan.md`

硬约束：

- 阶段数 3-7 个；少于 3 通常意味着颗粒度太粗，多于 7 意味着不是当前 slice
- **恰好一个**阶段是 `in_progress`；其余是 `pending` / `complete` / `blocked`
- 每个阶段必须有可执行动作 + 验证含义；不允许"想想 X"这种动词
- 总成功标准必须可证伪，例如"`npm test` 全绿"而不是"质量良好"
- `范围合同` 必须显式写出 active slice、non-goals、success criteria、verification path 和 project map 指针
- active slice、non-goals、success criteria 和 verification path 必须从 spec 或明确请求中映射而来；不要在 plan 阶段重新发明需求
- `Next` 字段最多 1-3 项，按优先级排序
- **禁止**在 `task_plan.md` 里塞 cookbook、长 SQL、代码片段；那些放 `findings.md` 或专门 docs

### 第 2 步 — 写 `progress.md`

追加一条本次 planning entry：

```md
### YYYY-MM-DDTHH:MMZ
- Intent: 写计划 / 重写计划 / 调整阶段
- Phase: planning
- Actions:
  - 读取了 ...
  - 决定阶段 1..N
- Files:
  - task_plan.md
  - findings.md
- Commands / Checks:
  - <如有 baseline check>
- Outcome:
  - <三文件已就位 | 仅 task_plan.md 重写>
- Next:
  - <bootstrap | implement>
```

`progress.md` 永远是 append-only。即使要纠正之前记录，新增一条更正 entry，而不是改历史。

### 第 3 步 — 写 `findings.md`

至少包含：

- **Accepted spec / 已接受规格**：用户或上游同意的最终需求
- **Spec source / 规格来源**：独立 spec 文件路径，或说明为什么本任务足够小、不需要独立 spec
- **Constraints / 约束**：必须遵守的边界、性能、安全、依赖限制
- **Technical decisions / 技术决策**：选了什么、为什么；引用 PR / issue / docs
- **Rejected options / 拒绝方案**：避免后人重走老路
- **Verification strategy / 验证策略**：从 spec 承接 baseline、自动化、smoke/E2E、负例和 fresh evidence 要求
- **Capability gaps / 能力缺口**：无法由当前 agent 或环境验证的内容和 fallback
- **Risks / 风险**：已知风险与缓解
- **References / 引用**：文档、上游、社区资源链接

### 第 4 步 — 熵增控制

写完之前清理一遍：

- 删除已经过时的阶段；不要"以防万一保留"
- 把不再 active 的 blocker 标记 resolved 并移到 `findings.md`
- 已过时的"已做决策"压缩成一句话引用，详细叙述放 `findings.md`
- `Next` 段重新挑 1-3 个最高优先级动作

### 第 5 步 — Hand off

明确告诉用户接下来该走哪个 skill。常见路由：

- 工作面不齐 → `bootstrap`
- 工作面齐、可以开工 → `implement`
- 失败已经在发生 → `diagnose`

## 输出格式

完成本 skill 时输出：

```text
PLAN WRITTEN

Files:
  - task_plan.md: created|rewritten|left as-is
  - progress.md: appended (timestamp)
  - findings.md: created|appended

Spec source: <path | explicit small-task exception>
Active slice: <一句话>
Total success criteria: <可证伪条件>
Next skill: <bootstrap | implement | diagnose>
Reason: <一句话>
```

## 示例

### 示例 1: spec 刚批准

用户：「方案我同意了，把它写成计划吧」

行动：读取已批准 spec → 确认 verification strategy 存在 → 检查发现三文件全无 → 用模板创建，写入 5 个阶段、active slice 是"实现导入解析"，`findings.md` 写 spec 路径、accepted spec 摘要、验证策略、capability gap 与拒绝的 alternative 库。

`progress.md` 追加：

```md
### 2026-05-09T07:30Z
- Intent: 把 accepted spec 写成执行合同
- Phase: planning
- Actions: 创建三文件，确定 5 阶段，标记阶段 2 in_progress
- Files: task_plan.md, progress.md, findings.md
- Outcome: 三文件就位
- Next: bootstrap（确认验证路径与 capability gap）
```

### 示例 2: replan

`task_plan.md` 还在，但阶段 1-3 都已经做完，阶段 4 in_progress 但 `progress.md` 显示已经在做阶段 5。

行动：把阶段 1-3 标 complete，阶段 4 改 complete，阶段 5 改 in_progress，新增阶段 6/7 反映新 follow-up；过时的 cookbook 段从 `task_plan.md` 移到 `findings.md` 的 Technical decisions 段。

## 常见反模式

- **把 spec 长篇塞进 `task_plan.md`。** 计划是合同，不是 Wikipedia；详细叙述去 `findings.md`
- **用 plan 补问需求。** 如果 goals、non-goals 或 verification strategy 不清楚，回 `brainstorm`
- **多个阶段同时 in_progress。** 这会让 active slice 失效；只保留一个
- **跳过 `findings.md`。** 没写 accepted spec / rejected options，一旦会话压缩，下次会重做相同选择
- **改写 `progress.md` 的历史 entry。** 永远 append；纠正用新 entry
- **创建第二套模板。** 三文件模板只在 `templates/` 维护
- **忘了 hand off。** 不指明下一步 skill，会让 agent 默认继续在 planning lane 里磨

## 验收标准

- [ ] `task_plan.md` 含目标、范围合同、当前阶段、总成功标准、3-7 阶段、关键问题、已做决策、Errors/Blockers、Next（1-3）
- [ ] 已读取并引用用户批准的 spec；若没有独立 spec，已说明为什么该任务足够小且验证策略已明确
- [ ] 恰好一个阶段是 in_progress
- [ ] `progress.md` 追加一条 planning/replanning entry，时间戳准确
- [ ] `findings.md` 含 spec source、accepted spec、constraints、verification strategy、capability gaps、technical decisions、rejected options、risks、references
- [ ] 模板取自 `templates/` 而非另写
- [ ] 没有 `feature_list.json` 或第二套状态模型被默认引入；如产品型项目确实需要机器可读功能门控，只记录为可选 profile 候选，不把它判成 entropy
- [ ] 已显式给出下一步 skill

## 工件更新

- `task_plan.md`：本次重点产物
- `progress.md`：append-only，至少一条
- `findings.md`：决策与风险一次性写齐；后续可追加
- `AGENTS.md`：不动；如需项目地图、验证入口或恢复指针，交给 `bootstrap` 或收尾时由 `cleanup` 小幅同步

## 按需读取

- `templates/README.md`：三文件模板来源、许可证、本地改造说明
- `templates/task_plan.md`、`templates/progress.md`、`templates/findings.md`：canonical 模板
- 工作面初始化：`../bootstrap/SKILL.md`


## State Contract Reference

需要选择、修复或解释 workflow state backend 时，读取 `../state-contract/SKILL.md`。
