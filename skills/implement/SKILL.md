---
name: implement
description: "当 tracked feature、bugfix 或 refactor 已经可以实现，且项目工作面已确认时使用。典型触发语：实现这个、开始写代码、修 bug、让测试通过、加这个函数、接线这个功能。要求 workflow state 能解析出唯一 active slice（默认从 task_plan.md 读取）；失败连续两次转 diagnose；稳定后转 review，再转 verify。"
---

# 带证据执行

本 skill 是 tracked workflow 的实现入口。它在三件事上严格：**WIP=1 一次只推进一个 slice**、**按风险选择验证强度**、**修改代码时同步文档与 workflow state**。

它**不是**机械的 80% 覆盖率打卡，也**不是**自由发挥。它是一种受约束的小步前进：每一步都有诚实证据，且证据的强度匹配它要承担的风险。

## Workflow State Contract

本 workflow 依赖的是 `state-contract` 定义的 workflow state，而不是某三个文件本身。默认 backend 是三文件：`task_plan.md` / `progress.md` / `findings.md`。

如果项目在 `AGENTS.md`、`.harness/manifest.yaml` 或 `.harness/state.md` 中声明了其他 backend（lightweight、feature-list、existing），按该 backend 读取 active slice、evidence、decisions、risks 和 handoff。

若 state backend 不存在：简单任务可以轻量执行；非平凡或跨 session 任务先调用 `state-contract` 或 `plan` 建立状态。

## 目的

本 skill 把实现压成小步、可验证、可恢复的循环：

- 当前 active slice 没拿到证据前，不开新 slice
- 修代码就同步文档/命令/workflow state，否则下次会话恢复就会失真
- 验证强度按风险匹配，不机械要求覆盖率
- 失败了不"猜一下再试"，转 `diagnose`

## 何时使用

### 触发信号

- workflow state 能解析出恰好一个 active slice；默认 three-file backend 要求 `task_plan.md` 的 `范围合同` 写清 active slice、non-goals、success criteria 和 verification path
- 项目工作面已确认；如果没有 recent bootstrap/workbench 记录，但入口、验证、恢复路径都清楚，可以继续并在 `progress.md` 说明复用现有工作面
- 用户说「实现」「写代码」「修这个 bug」「让测试过」「让它跑起来」
- 已经在循环中且当前 slice 还未 verified

### 不要使用

- workflow state 不存在或 active slice 不明：先 `state-contract` / `plan`
- 工作面缺入口、验证、恢复路径或项目地图：先 `bootstrap`
- 失败已经发生且根因不清：转 `diagnose`
- 用户其实在问「应该怎么做」而不是「请做」：转 `brainstorm`

### 路由规则

| 状态 | 下一步 |
| --- | --- |
| 实现失败、根因不清 | `diagnose` |
| 当前 slice 稳定，需评审 | `review` |
| 准备宣布 ready | `verify` |
| 范围变模糊 | `plan` 或 `brainstorm` |
| 需要暂停 | `save-session` |

## 先读取这些输入

1. `task_plan.md`：确认 `范围合同` 中的 active slice、non-goals、success criteria、verification path
2. `progress.md` 最新 entry：上次做到哪
3. `findings.md`：accepted spec、rejected options、约束
4. 与 active slice 直接相关的源代码、测试、配置
5. `git status --short`：避免和未提交改动相互覆盖

## 执行纪律

### WIP=1 的硬规则

- 当前 slice 未 verified（`verify`）或 blocked 前，不允许扩大改动范围
- 顺手清理只允许在和当前 slice 相关的代码路径上发生；跨 slice 的清理写 `findings.md` 的 deferred cleanup 而不是顺手做
- 出现"做着做着发现别处也得改"时，停下，记 `findings.md`，问用户是否扩展 active slice

### TDD 循环（按风险选择强度）

经典 RED → GREEN → REFACTOR 是默认骨架，但**强度匹配风险**才是真正的纪律：

| 风险 | 推荐验证强度 | 例子 |
| --- | --- | --- |
| 局部纯逻辑 | unit 或等价 focused check | 字符串处理、数据转换、纯函数 |
| API / 状态 / 配置边界 | integration 或 targeted regression | 数据库访问、HTTP 客户端、IPC 通道 |
| UI / 多步骤用户路径 | smoke 或 E2E | 表单提交、跨页流程、Electron 主+渲染 |
| auth / payment / trust boundary | review + 更强验证 + security lane | 登录、支付、权限、加密 |
| 大规模重构 | 行为对照 + diff 审视 | 框架升级、模块拆分 |

详细决策见 `references/verification-intensity.md`。

### Bugfix 路径

修已有 bug 时优先写 reproduction test：

1. 用最小测试复现 bug（**红**）
2. 改源码（**绿**）
3. 跑相邻场景的回归测试，避免局部修复破坏邻接

如果 reproduction test 写不出来（依赖外部状态、不可重现），转 `diagnose` 先做 root cause investigation。

### 文档保鲜

任何下面这种改动**必须**同步更新对应文档：

- 改启动命令、构建命令、测试命令 → README / docs；只有稳定验证入口变化才小幅同步 `AGENTS.md`
- 改 IPC 通道、API 形状、配置键 → 类型定义 / API doc / 三文件 findings
- 改用户可见行为（界面、文案、快捷键、CLI 输出）→ README / 用户指南
- 改环境变量 / 依赖 / 端口 → README / `.env.example`；只有稳定冷启动入口变化才小幅同步 `AGENTS.md`

如果改动涉及上面任一项但 docs 没动，本次 slice **不算 verified**。

## 执行流程

### 第 1 步 — 重新对账 active slice

实现前最后一次确认：active slice 是不是仍是当前最该做的事？如果上次会话结束后情况变了，回 `plan`。

### 第 2 步 — 选定本次最小步

把 active slice 切成一个能在一次 RED→GREEN 内完成的最小步。不要试图一次 commit 完整 slice。

### 第 3 步 — 写测试或最小可执行检查

按上面的强度表选。结果应该是失败的（RED）。如果一开始就过，说明它没在测真东西。

### 第 4 步 — 最小实现

写最少的代码让它过。不要顺便做 refactor。

### 第 5 步 — 跑相邻验证

- 同一模块的其他单测
- 紧邻边界的 integration / smoke
- 全量 lint / typecheck / build（如果项目有这些）

### 第 6 步 — 重构（可选）

只在测试是绿的前提下做。每次 refactor 后再跑测试。

### 第 7 步 — 同步 docs 与 workflow state

按"文档保鲜"部分的清单确认是否要更新文档；命令变化先改 README / docs，只有稳定验证入口或恢复指针变化才改 `AGENTS.md`。

### 第 8 步 — 写 `progress.md` entry

```md
### YYYY-MM-DDTHH:MMZ
- Intent: 实现 <小步描述>
- Phase: in_progress
- Actions:
  - 写测试 X
  - 改源码 Y
  - 同步 docs Z
- Files:
  - src/...
  - tests/...
  - README.md
- Commands / Checks:
  - npm test -- src/foo.test.ts -> pass
  - npm run lint -> pass
- Outcome:
  - <一句话事实>
- Next:
  - 下一个最小步 / review / verify
```

### 第 9 步 — 决定下一步

| 当前情况 | 路径 |
| --- | --- |
| 还在同一 slice，但有更小步 | 回 第 2 步 |
| 当前 slice 完成且稳定 | `review` |
| 准备宣布 ready | `verify` |
| 失败连续 2 次 | `diagnose` |
| 需要暂停 | `save-session` |

## 输出格式

```text
EXECUTION STEP DONE

Active slice: <一句话>
This step: <一句话>
Risk tier: <unit|integration|smoke|E2E|security>
Tests run:
  - <command -> result>
Docs synced: yes|no|n/a
Files changed:
  - ...
progress.md updated: yes
Next: <repeat|review|verify|diagnose|save-session>
```

## 示例

### 示例 1: 给 IPC 通道加超时

active slice：`document:list` 的 IPC 调用要加 5s 超时。

- 第 3 步：写一个 vitest，模拟主进程 30s 不回应；预期 5s 内 reject（RED）
- 第 4 步：在 preload 包装里加 `Promise.race`（GREEN）
- 第 5 步：跑 `documentService` 相邻 integration test，确保正常路径未坏
- 第 7 步：更新 `src/shared/types.ts` 注释；README 增加"IPC 超时" FAQ；`findings.md` 记录设计决策
- 第 8 步：`progress.md` 追加 entry

### 示例 2: 修一个 off-by-one bug

报错：分页返回少一条。

- 如果可以：写 reproduction test 让最后一条出现（RED）
- 改 `pagination.ts` 的 `<` 为 `<=`（GREEN）
- 跑相邻 integration：边界为 0、1、N-1、N、N+1
- 不需要改 docs（用户不可见）；只在 `findings.md` Risks 段记下"曾经的 off-by-one"

### 示例 3: 重构需要更强的对照

active slice：把 documentService 拆成 reader + writer。

- 升一档验证强度：先跑全量测试存 baseline；重构每一步后跑同一套；diff 行为
- 不允许同时改行为；行为变化要单独做下一个 slice

## 常见反模式

- **顺手清理无关代码。** 那是 scope creep；写到 deferred cleanup
- **跳测试直接改源码。** 即使是 1 行修复，也至少留一个 reproduction 案例（除非确实写不出，转 `diagnose`）
- **改命令但不改 README。** 下一次冷启动会迷路
- **机械追求 80% 覆盖率。** 风险低的代码不需要厚测试；风险高的代码 80% 也不够
- **失败两次还接着试。** 转 `diagnose`，否则会变成猜谜
- **把多个最小步合成一条 progress entry。** 颗粒度丢失，回滚成本上升

## 验收标准

每个 step 完成时：

- [ ] active slice 仍是 in_progress 且未越界
- [ ] 测试或等价 focused check 在改之前是失败/未存在的
- [ ] 改完之后是绿的，且相邻验证未 regress
- [ ] 文档 / 命令 / workflow state 已经同步
- [ ] `progress.md` 有 entry，时间戳与命令真实
- [ ] 下一步 skill 已显式标注

## 工件更新

- `progress.md`：每个 step 一条 entry
- `findings.md`：新增 root cause、约束、风险、deferred cleanup
- `task_plan.md`：仅在 phase / focus / blocker / next 改变时更新
- 源代码 + docs：按上述 step 同步

## 按需读取

- `references/verification-intensity.md`：验证强度的细化决策树
- 失败诊断：`../diagnose/SKILL.md`
- 准备宣布 ready：`../verify/SKILL.md`
- 阶段评审：`../review/SKILL.md`


## State Contract Reference

需要选择、修复或解释 workflow state backend 时，读取 `../state-contract/SKILL.md`。
