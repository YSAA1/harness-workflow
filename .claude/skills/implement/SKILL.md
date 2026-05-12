---
name: implement
description: "当 scoped feature、bugfix 或 refactor 已经可以实现，且项目工作面足够清楚时使用。典型触发语：实现这个、开始写代码、修 bug、让测试通过、加这个函数、接线这个功能。读取用户请求、Spec、Executable Plan 和当前 recovery surface；不要求三文件存在。失败连续两次转 diagnose；稳定后转 review，再转 verify。"
---

# 带证据执行

`implement` 是 scoped work 的实现入口。它在三件事上严格：**WIP=1 一次只推进一个 slice**、**按风险选择验证强度**、**修改行为时同步相关 docs 和 selected recovery surface**。

## 目的

- 当前 active slice 没拿到证据前，不开新 slice。
- 修代码就同步命令、文档或 recovery surface，否则下次会话恢复会失真。
- 验证强度按风险匹配，不机械要求覆盖率。
- 失败了不靠猜，转 `diagnose`。

## 何时使用

### 触发信号

- 用户请求、Spec 或 Executable Plan 能解析出恰好一个 active slice。
- 项目入口、验证命令和 protected paths 足够清楚。
- 用户说「实现」「写代码」「修这个 bug」「让测试过」「让它跑起来」。
- 已经在循环中且当前 slice 还未 verified。

### 不要使用

- 需求或成功标准不清：先 `brainstorm`。
- active slice 或 planning surface 不清：先 `plan`。
- 项目工作面、验证入口或 recovery surface 不清：先 `harness-builder`。
- 失败已经发生且根因不清：转 `diagnose`。
- 用户其实在问「应该怎么做」：转 `brainstorm`。

### 路由规则

| 状态 | 下一步 |
| --- | --- |
| 实现失败、根因不清 | `diagnose` |
| 当前 slice 稳定，需评审 | `review` |
| 准备声明 ready | `verify` |
| 范围变模糊 | `plan` 或 `brainstorm` |
| 工作面不清 | `harness-builder` |

## 先读取这些输入

1. 用户请求、Spec 或 Executable Plan：确认 active slice、non-goals、success criteria、verification path。
2. selected recovery surface：读取上次进度、决策、风险和 blockers；没有就轻量执行，不强制创建。
3. 与 active slice 直接相关的源代码、测试、配置和 docs。
4. `AGENTS.md` 和 README：确认项目规则、验证命令和 protected paths。
5. `git status --short`：避免和未提交改动相互覆盖。

## 执行纪律

### WIP=1 的硬规则

- 当前 slice 未 verified 或 blocked 前，不允许扩大改动范围。
- 顺手清理只允许发生在当前 slice 相关路径上；跨 slice 清理记录为 deferred cleanup。
- 发现必须扩大范围时，停下，回 `plan` 或问用户是否扩展 active slice。

### TDD 循环

经典 RED -> GREEN -> REFACTOR 是默认骨架，但强度匹配风险：

| 风险 | 推荐验证强度 |
| --- | --- |
| 局部纯逻辑 | unit 或 focused check |
| API / 状态 / 配置边界 | integration 或 targeted regression |
| UI / 多步骤用户路径 | smoke 或 E2E |
| auth / payment / trust boundary | review + 更强验证 + security lane |
| 大规模重构 | 行为对照 + diff 审视 |

详细决策见 `references/verification-intensity.md`。

## 执行流程

### 第 1 步 — 重新对账 active slice

实现前确认 active slice、non-goals 和验证路径仍然成立。若不成立，回 `plan`。

### 第 2 步 — 选定本次最小步

把 active slice 切成一个能在一次 RED -> GREEN 内完成的最小步。

### 第 3 步 — 写测试或最小可执行检查

按风险选验证强度。结果应该是失败的或当前缺失的；如果一开始就过，确认它是否真的覆盖目标行为。

### 第 4 步 — 最小实现

写最少的代码让检查通过。不要顺便做无关 refactor。

### 第 5 步 — 跑相邻验证

运行同模块或相邻边界的检查；必要时跑 build、typecheck、lint 或 smoke。

### 第 6 步 — 重构

只在绿灯下重构。每次 refactor 后再跑相关检查。

### 第 7 步 — 同步 docs 与 recovery surface

用户可见行为、命令、配置、API、环境变量或验证入口变化时，更新 README/docs。只有 selected recovery surface 要求时记录进度、决策或风险。

### 第 8 步 — 决定下一步

稳定后转 `review`；准备宣布 ready 转 `verify`；连续两次失败转 `diagnose`。

## 输出格式

```text
EXECUTION STEP DONE

Active slice: <一句话>
This step: <一句话>
Risk tier: <unit|integration|smoke|E2E|security>
Tests run:
  - <command -> result>
Docs synced: yes|no|n/a
Recovery surface updated: yes|no|n/a
Files changed:
  - ...
Next: <repeat|review|verify|diagnose|plan>
```

## 常见反模式

- **顺手清理无关代码。** 那是 scope creep；写到 deferred cleanup。
- **跳测试直接改源码。** 即使是 1 行修复，也至少留一个 reproduction 案例；写不出就转 `diagnose`。
- **改命令但不改 README。** 下一次冷启动会迷路。
- **机械追求覆盖率。** 风险低的代码不需要厚测试；风险高的代码只看百分比也不够。
- **失败两次还接着试。** 转 `diagnose`。

## 验收标准

- [ ] active slice 仍是唯一当前工作且未越界。
- [ ] 测试或等价 focused check 覆盖本步行为。
- [ ] 改完后检查为绿，且相邻验证未 regress。
- [ ] 文档和 selected recovery surface 已按需同步。
- [ ] 下一步 skill 已显式标注。

## 工件更新

- 源代码 + tests：当前最小步。
- README/docs：命令、配置、API 或用户可见行为改变时同步。
- selected recovery surface：仅在项目要求时记录 evidence、decisions、risks 或 blockers。

## 按需读取

- `references/verification-intensity.md`：验证强度的细化决策树。
- 失败诊断：`../diagnose/SKILL.md`
- 准备声明 ready：`../verify/SKILL.md`
- 阶段评审：`../review/SKILL.md`
