---
name: brainstorm
description: "当需求、边界、方案取舍、成功标准或验证策略还没收敛时使用。典型触发语：帮我想想、我有个想法但不确定、先讨论方案、这个架构怎么做、需求还没定、不要直接写代码、先落 spec。必须在 plan 之前通过多轮澄清、方案比较、验证策略设计和用户批准，写出独立 spec 文档并把摘要写入当前 workflow state 的 findings area（默认 `findings.md`）。"
---

# 规格构思

本 skill 把开放想法收敛成可被计划、实现和验证的 spec。它不写生产代码，不创建业务实现，不生成具体实施计划。终点是一个用户批准过的规格文档，然后交给 `plan`。

默认 spec 位置：`docs/specs/YYYY-MM-DD--<topic>.md`。如果项目已有 `docs/product-specs/`、`docs/design-docs/`、`specs/` 或 issue tracker 规范，沿用项目惯例。当前 workflow state 的 findings area（默认 `findings.md`）只保存 spec 摘要、拒绝方案、风险和引用，不替代 spec 文档。

## Workflow State Contract

本 workflow 依赖的是 `state-contract` 定义的 workflow state，而不是某三个文件本身。默认 backend 是三文件：`task_plan.md` / `progress.md` / `findings.md`。

如果项目在 `AGENTS.md`、`.harness/manifest.yaml` 或 `.harness/state.md` 中声明了其他 backend（lightweight、feature-list、existing），按该 backend 读取 active slice、evidence、decisions、risks 和 handoff。

若 state backend 不存在：简单任务可以轻量执行；非平凡或跨 session 任务先调用 `state-contract` 或 `plan` 建立状态。

## 目的

本 skill 解决三个问题：

- 想法太早进入实现，导致边界、non-goals 和成功标准靠聊天记忆维持。
- agent 只问一个问题就收敛，实际没有确认用户、范围、约束、失败模式和验收信号。
- spec 只描述要做什么，却没有设计验证流程，到了 `verify` 才发现没有可运行证据。

`brainstorm` 必须先把"要建什么"和"如何证明建对"一起说明白。`plan` 只负责把已批准 spec 拆成阶段和执行合同。

## 何时使用

### 触发信号

- 用户描述还停留在意图层面：「我想让它...」「我们要...」
- 用户明确说「先 brainstorm」「先讨论」「先落 spec」「需求还没定」
- 多个方案都合理，需要比较取舍
- 成功标准、验收方式、测试/E2E/smoke 路径不清楚
- 现有 spec 漂移，计划或实现已经无法回答"到底验什么"
- 任务包含 UI、架构、状态模型、外部工具、权限、安全或跨模块行为

### 不要使用

- 用户已经给出完整 spec 且验证策略清楚：直接 `plan`
- 任务是可直接完成的小补丁：直接执行，并按当前 state backend 按需记录 evidence（默认 `progress.md`）
- 用户明确只要快速事实回答、翻译、格式整理
- 已有 spec 只需要拆实施阶段：不要在 brainstorm 里重新设计

### 路由规则

| 状态 | 下一步 |
| --- | --- |
| 需求、边界或验证策略未定 | **本 skill** |
| spec 已写但用户未批准 | 继续本 skill |
| spec 已批准 | `plan` |
| spec 已批准、计划已写、工作面缺失 | `bootstrap` |
| 只是单点小改 | 退出 brainstorm |

## 先读取这些输入

1. 既有 spec：`docs/specs/`、`docs/product-specs/`、`docs/design-docs/`、issue、PRD、README。
2. `findings.md`：读取已接受规格、拒绝方案、残余风险，避免重走旧路。
3. `task_plan.md`：若存在，只作为当前上下文，不把旧 active slice 当成新 spec。
4. `AGENTS.md`、README、相关代码和测试：确认项目惯例、验证命令和工作面限制。
5. `git status --short`、`git log --oneline -10`：确认是否已有未提交方向或近期设计趋势。
6. 用户给出的链接、截图、设计稿或外部约束。

## 执行流程

### 第 0 步 — 建立问题框架

先用不超过 5 句话复述项目现实和当前想法，然后判断是否需要拆分。

如果请求包含多个独立子系统，先让用户选择第一个 spec 的子项目。不要用一个 spec 覆盖平台级大杂烩。每个独立子项目走自己的 brainstorm -> plan -> implement。

### 第 1 步 — 多轮澄清，不许一问收敛

每次只问一个问题，但不是只问一个问题。至少覆盖这些维度，除非用户已经在材料中明确回答：

- 目的：这个能力为谁解决什么问题？
- 范围：本轮必须包含什么，明确不包含什么？
- 用户/调用者：谁会使用它，入口在哪里？
- 行为：输入、输出、状态变化、错误处理是什么？
- 约束：依赖、性能、兼容、安全、数据、时间或迁移限制是什么？
- 成功标准：什么现象说明 spec 成功，什么现象说明失败？
- 验证策略：用哪些测试、命令、smoke、E2E、人工检查或外部信号证明？
- 能力缺口：当前 agent 是否能自己验证；是否需要 Playwright MCP、docs/search、issue tracker、真实服务或人工确认？

优先用选择题降低用户负担，但保持一条消息一个问题。只有当上述维度已经足够回答，才进入方案比较。

### 第 2 步 — 设计验证流程

在提出实现方案前，先构建验证策略。至少写清：

- 基线证据：开始前要读哪些测试、命令、日志或现有行为。
- 单元/集成验证：哪些可自动化检查覆盖核心行为。
- 端到端或 smoke：用户可见路径如何确认。
- 负例和边界：什么输入、权限、异常或退化路径必须验证。
- 文档/状态验证：README、AGENTS、三文件、spec 是否需要同步。
- Fresh evidence 要求：最终完成前哪些命令必须重新跑。
- 无法验证项：当前环境做不到什么，如何记录风险或推荐能力。

验证策略是 spec 的一部分，不是 `verify` 阶段才临时想。

### 第 3 步 — 比较 2-3 个方案

每个方案必须包含：

- 一句话定位
- 关键取舍：复杂度、可维护性、验证成本、用户价值
- 失败模式：什么情况下会做偏或做不完
- 验证影响：该方案让验证更容易还是更难

如果只有一个方案真正合理，仍要写出被拒绝的替代方案和拒绝理由。推荐方案必须说明为什么更适合当前 active slice。

### 第 4 步 — 分段呈现设计并获得确认

不要一次甩完整长文。按复杂度分段确认：

1. 目标和范围
2. 行为与接口
3. 状态、数据或架构边界
4. 验证策略和能力缺口
5. 非目标、拒绝方案和残余风险

每段后询问是否正确；如果用户修改，回到对应段落。不要把用户沉默当批准。

### 第 5 步 — 写 spec 文档

使用本 skill 自带模板 `templates/spec.md`。不要从 `plan` skill 借模板；brainstorm 的 spec 是独立产物。

写入默认路径：

```text
docs/specs/YYYY-MM-DD--<topic>.md
```

如果项目已有惯例，优先沿用。spec 文件必须覆盖：

- 背景和问题
- Goals
- Non-goals
- 用户/调用者
- 行为规格
- 约束
- 方案选择和拒绝方案
- Verification strategy
- Capability gaps
- Success criteria
- Residual risks
- Plan handoff

### 第 6 步 — spec 自审

写完后按 `references/spec-review-checklist.md` 自审并直接修复：

- 是否还有 TBD、TODO、占位符或空章节？
- Goals、non-goals、行为和验证策略是否互相矛盾？
- 是否大到需要拆成多个 spec？
- 成功标准是否可证伪？
- 验证策略是否包含 baseline、自动化、smoke/E2E、负例、fresh evidence？
- capability gap 是否记录到 spec，而不是藏在聊天里？

复杂或高风险 spec 可以派 reviewer subagent 做只读审阅；如果环境不适合派 subagent，至少执行同一 checklist。

### 第 7 步 — 写 findings 摘要

在 `findings.md` 追加一段摘要，包含：

- spec 文件路径
- accepted goals / non-goals
- 关键约束
- verification strategy 摘要
- capability gaps
- rejected options
- residual risks

如果没有 `findings.md`，可以用 `plan/templates/findings.md` 创建，但不要把完整 spec 塞进去。

### 第 8 步 — 用户 review gate

最后必须停下来让用户审阅 spec 文件：

```text
Spec written: <path>
Please review and approve or request changes before I create the implementation plan.
Next skill after approval: plan
```

用户批准前不要调用 `plan`，不要写 `task_plan.md`，不要实现。

## 输出格式

```text
BRAINSTORM SPEC READY

Spec: <docs/specs/YYYY-MM-DD--topic.md>
Question solved: <一句话>
Chosen approach: <一句话>
Verification strategy: <一句话>

Needs user review:
  - Approve -> plan
  - Request changes -> revise spec and re-run self-review
  - Pause -> save-session
```

## 示例

### 示例 1: 只问一个问题还不够

用户：「我想给项目加一个导入功能。」

错误做法：问「导入 CSV 还是 JSON？」然后直接写计划。

正确做法：

1. 先确认用户和目的：谁导入，导入后解决什么问题？
2. 再确认范围：本轮支持 CSV、JSON、还是只支持一种？
3. 再确认行为：重复数据、错误行、部分成功、回滚怎么处理？
4. 再确认验证：用 fixture、单元测试、CLI smoke、UI E2E 还是人工检查？
5. 比较方案：一次性批处理 / 流式解析 / 先 mock pipeline。
6. 写 spec，并让用户批准后才交给 `plan`。

### 示例 2: 验证策略改变设计

用户：「给 Web app 加设置页。」

如果没有 Playwright 或浏览器能力，spec 应记录：

- 自动化层：组件测试或路由测试覆盖状态保存。
- smoke 层：人工打开设置页并保存一次。
- capability gap：推荐 Playwright MCP 或项目原有 E2E 命令。

这会影响方案选择：如果当前阶段只需要验证状态持久化，active slice 可以先做最小设置页和保存路径，不把完整视觉 polish 放进本轮。

## 常见反模式

- **只问一个问题就收敛。** 一条消息只问一个问题，不等于整个 brainstorm 只能问一个问题。
- **把 spec 写进 `findings.md` 就结束。** `findings.md` 是决策索引；spec 必须有独立文档。
- **先选实现方案，后补验证。** 验证策略要参与方案取舍。
- **写成计划。** spec 描述要建什么和如何证明；阶段、任务、commit unit 属于 `plan`。
- **跳过用户 review gate。** spec 未批准前不要生成 task_plan。
- **遗漏 rejected options。** 后续 agent 会重新讨论旧路。
- **遗漏 capability gap。** 无法验证的内容必须早暴露。

## 验收标准

- [ ] 已读取项目现实、既有 spec / findings / plan / docs / 相关代码。
- [ ] 已通过多轮澄清覆盖目的、范围、行为、约束、成功标准和验证策略。
- [ ] 已比较 2-3 个方案，或明确记录被拒绝替代方案。
- [ ] 已写独立 spec 文档，默认位于 `docs/specs/YYYY-MM-DD--<topic>.md`。
- [ ] spec 含 Verification strategy、Capability gaps、Success criteria、Plan handoff。
- [ ] 已按 `references/spec-review-checklist.md` 自审并修复问题。
- [ ] `findings.md` 已追加 spec 摘要和 rejected options。
- [ ] 已请求用户批准 spec；未批准前没有调用 `plan` 或写实现代码。

## 工件更新

- `docs/specs/YYYY-MM-DD--<topic>.md`：本次重点产物。
- `findings.md`：追加 spec 摘要、拒绝方案、风险、验证策略索引。
- `progress.md`：可追加 brainstorm entry，记录 spec 路径和待批准状态。
- `task_plan.md`：不在本 skill 中创建或改写；批准后交给 `plan`。

## 按需读取

- spec 模板：`templates/spec.md`
- spec 自审：`references/spec-review-checklist.md`
- 收敛后下一步：`../plan/SKILL.md`
- 如果发现需要先准备工作面：`../bootstrap/SKILL.md`
