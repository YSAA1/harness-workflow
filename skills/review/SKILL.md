---
name: review
description: "当一段有意义的代码或文档改动已稳定、准备声明 ready/done/merge 前使用。典型触发语：review 一下、检查我的改动、commit 前看下、phase 完成了、spec 已实现、sanity check、有没有漏。通常在 verify 之前、diagnose 修复之后使用；WIP 未稳定时不要使用。"
---

# 工作流评审

工作流评审 是 tracked workflow 的纠偏入口。它的目标是 **findings-first**:把 spec 漂移、premature completion、under-finish、entropy、文档失真这些隐患在 phase 切换或 ready 声明之前抓出来,而不是事后救火。

它不是\"看起来不错\"的鼓励性总结,也不是把 lint 当成 review。它假设作者有盲点,所以坚持用 spec、non-goals、active slice、fresh evidence 这四把尺去量当前结果。

## Workflow State Contract

本 workflow 依赖的是 `state-contract` 定义的 workflow state，而不是某三个文件本身。默认 backend 是三文件：`task_plan.md` / `progress.md` / `findings.md`。

如果项目在 `AGENTS.md`、`.harness/manifest.yaml` 或 `.harness/state.md` 中声明了其他 backend（lightweight、feature-list、existing），按该 backend 读取 active slice、evidence、decisions、risks 和 handoff。

若 state backend 不存在：简单任务可以轻量执行；非平凡或跨 session 任务先调用 `state-contract` 或 `plan` 建立状态。

## 目的

review 必须同时检查\"做超了\"和\"做欠了\"。输出必须落到 workflow state（默认 `findings.md` / `progress.md`），不能只留在聊天框。缺 fresh evidence 时，review 仍要完成结构性判断，并把 evidence gap 标成 Important 后路由到 `verify`。

## 何时使用

### 触发信号

- `implement` 完成一个 slice、即将转下一阶段
- `diagnose` 修复稳定、要回主流程
- 用户说「review 一下」「这样可以吗」「能不能合并」「commit 前检查」「phase 一完事了」「sanity check」
- 准备调用 `verify` 之前的最后一道结构性把关
- 多 agent 协作时上一个 agent 刚交付,本 agent 接手前

### 不要使用

- 工作还在 WIP 中、active slice 未稳定 → 继续 `implement`
- 工作完全没有稳定到可审状态 → 继续 `implement`
- 用户其实在问\"行不行\"想要架构建议 → `brainstorm`
- 失败已经在发生 → `diagnose`

### 路由规则

| 状态 | 下一步 |
| --- | --- |
| review 通过或仅有 evidence gap | `verify` |
| review 找出 critical/important findings | 回 `implement` 修复(最严重的先) |
| review 发现 spec 漂移 | `brainstorm` 或 `plan` |
| review 通过、准备暂停 | `save-session` |
| review 全部 minor | 直接进入 `verify` 或合并 |

## 先读取这些输入

1. **scope / diff / 文件列表**:`git diff <base>...HEAD --stat` + 实际改动文件
2. **accepted spec 与 non-goals**:从 workflow state 的 findings area 读；没有就先回 `brainstorm`
3. **active slice 与成功标准**:从 workflow state 的 execution contract 读（默认 `task_plan.md`）
4. **fresh evidence**:workflow state evidence log 最近 entry（默认 `progress.md`） 的 Commands / Checks 段；缺失时记录为 finding，不中止 review
5. **风险面**:`findings.md` 的 Risks / Open questions
6. 与本次 slice 相关的源文件、测试、配置(确认改动\"对得上 spec\")
7. README / `AGENTS.md` 的相关段(确认文档与代码同步)

如果 spec、active slice 或 diff 缺失,review 不能完成；如果只是 fresh evidence 缺失,继续审结构并把证据缺口写成 Important。

## 检查重点(四把尺)

### 尺 1:对 spec(C5 + C6)

- 是否实现了 accepted spec 的全部 goals?
- 是否越过 non-goals 或扩大了 active slice?
- 是否声称完成了未在 spec 中的功能(silent feature creep)?

### 尺 2:对 evidence(C6)

- 每个声称\"完成\"的项,有没有命令级 fresh evidence?
- 测试是否覆盖了 spec 中提到的关键路径?
- smoke / E2E 在多步骤或 trust boundary 上有没有跑?
- 跨边界(IPC、HTTP、子进程、文件系统)是否有 integration 验证?

### 尺 3:对 docs / artifacts(C8 + C2)

- README、`AGENTS.md`、API 注释、配置说明是否与代码同步?
- 启动 / 构建 / 测试命令变化时,验证入口段是否同步?
- `findings.md` 是否记录了本次的 technical decisions / rejected options?
- `progress.md` entry 是否真实(时间戳、命令、结果一致)?
- `task_plan.md` 的 phase / blocker / next 是否反映现状?

### 尺 4:对 entropy(C9)

- 临时文件、调试输出、`console.log`、`TODO`、注释代码、未使用 import 是否清理?
- 重复 docs 或 stale 注释是否还在?
- 是否引入了未批准的第二套状态来源? 如果是产品型项目主动选择 feature-list profile，检查它是否与三文件映射清楚，而不是直接判为 entropy。
- 是否引入了非必要依赖、新的 lint 抑制、`@ts-ignore`?

## 执行流程

### 第 1 步 — 重述 scope

一句话回答:本次 review 的是哪个 active slice、改动了哪些文件、声称解决了什么。如果说不出来,先停下来读 `task_plan.md` 与 `progress.md`。

### 第 2 步 — 用四把尺逐项过

对每一条问题给:

- 状态(满足 / 不满足 / 不适用)
- 证据(diff 行号、命令输出、文件路径)
- 严重级(Critical / Important / Minor)

### 第 3 步 — 分级 findings

按下面的分级判定严重性,不要凭感觉打分:

| 级别 | 含义 | 处置 |
| --- | --- | --- |
| **Critical** | 正确性错误、安全漏洞、数据丢失、核心行为破坏、违反 accepted spec | 必须修复才允许声明完成 |
| **Important** | 设计缺陷、健壮性缺口、关键测试缺失、文档严重失真 | 应该修;暂时不修必须写进 `findings.md` deferred |
| **Minor** | 风格、可读性、非阻塞清理、注释优化 | 可选;若不修不需要登记 |

### 第 4 步 — 列 Open Questions / Residual Risks

不是所有发现都能立刻判明。把不确定项明确列出,例如:

- \"未验证此函数在并发下行为\"
- \"`tsconfig.json` 的某项变化原因不明\"
- \"E2E 在 Windows 上未跑过\"

让用户决定是阻塞 ready 还是放进 risks。

### 第 5 步 — 给出 Assessment

最后一段必须明确:

- **Pass**:无 Critical;Important 已写进 deferred;允许进入 `verify` 或合并
- **Conditional**:有 Important 必须先修;给出修复 lane
- **Block**:有 Critical;必须回 `implement` 或 `diagnose`

不要写\"看起来不错\"\"基本可以\"这种含糊话。含糊结论会把 premature completion 包装成通过。

### 第 6 步 — 同步 artifacts

- blocking findings(Critical / Important)写进 `findings.md`
- review 结果与下一步动作写进 `progress.md`
- 必要时调整 `task_plan.md` 的 phase / next
- 不写进 `AGENTS.md`(那是稳定规则,不是本次 review 结论)

## 输出格式

```text
REVIEW: PASS | CONDITIONAL | BLOCK

Scope:
  - Active slice: <一句话>
  - Files reviewed: <list 或 git stat>
  - Fresh evidence base: <progress.md timestamp>

Findings:
  Critical:
    - <一句话> (file:line) — <evidence>
  Important:
    - <一句话> (file:line) — <evidence>
  Minor:
    - <一句话>

Open Questions / Residual Risks:
  - ...

Assessment:
  - Spec coverage: <ok|partial|miss>
  - Evidence sufficiency: <ok|gap|missing>
  - Docs sync: <ok|drift>
  - Entropy: <ok|residue>

Next:
  - Skill: <implement | diagnose | verify | cleanup>
  - Reason: <一句话>
```

## 示例

### 示例 1: 隐性 scope creep

active slice = \"在 IPC 调用上加 5s 超时\"。

- diff 显示:超时实现了,但顺手把 `documentService.parseAll` 改成了流式
- 流式重写未在 spec、未在 plan、无 fresh evidence
- 判:**Important**(scope creep + missing evidence)
- assessment:Conditional — 把流式重写回滚到独立 slice,或扩 active slice 后补测试

### 示例 2: premature completion

active slice = \"实现书签持久化\"。

- progress.md 写\"完成\";但只跑了一个 happy-path test
- 没测:重启后恢复、超大书签数、并发写、磁盘满异常
- 文档:README 没提持久化路径
- 判:**Important × 2**(测试不足 + 文档失真)
- assessment:Conditional — 升档 verification 到 integration,补 README

### 示例 3: pass with deferred

active slice = \"为 Q&A 面板加加载状态\"。

- 实现完整、覆盖 happy path、loading/error/empty 三态都有 unit
- 文档已同步;无临时文件
- 一个 minor:动画时长 hardcode,可 token 化
- assessment:Pass;minor 写进 deferred cleanup

## 常见反模式

- **鼓励性总结,无证据。** \"代码看起来很整洁\"不是 review,是噪声
- **只看 diff 表面、不对 spec。** 实现得很漂亮但漂离了 active slice 也不行
- **把缺测试当成\"以后补\"。** evidence gap 是 Important,不是 Minor
- **review 与 verify 混淆。** review 抓结构与 spec、verify 抓行为;两者顺序不要倒
- **改 `AGENTS.md` 写本次结论。** 稳定规则才进 AGENTS.md;一次性结论进 `findings.md` 与 `progress.md`
- **跳过 entropy 检查。** `console.log`、注释代码、`@ts-ignore` 留下来就是下次的债
- **不写 Open Questions。** 把不确定项装作\"我懂了\",会让风险静默累积

## 验收标准

- [ ] 至少检查了 spec / evidence / docs / entropy 四把尺
- [ ] 每条 Critical / Important finding 有文件路径或命令级证据
- [ ] Open Questions 与 Residual Risks 至少回答\"还有没有不确定的\"
- [ ] Assessment 是 Pass / Conditional / Block 之一,不留含糊语
- [ ] blocking findings 写入 `findings.md`
- [ ] review entry 写入 `progress.md`(append-only)
- [ ] 下一步 skill 与原因显式

## 工件更新

- `progress.md`:append review entry,含 scope、findings 数量、assessment、next
- `findings.md`:Critical / Important findings + Open Questions / Residual Risks
- `task_plan.md`:仅在 phase / blocker / next 改变时更新
- `AGENTS.md`:不动

## 按需读取

- `references/premature-completion-patterns.md`:常见伪完成模式与识别信号
- 行为级验证:`../verify/SKILL.md`
- 失败诊断:`../diagnose/SKILL.md`
- 三文件维护:`../plan/SKILL.md`


## State Contract Reference

需要选择、修复或解释 workflow state backend 时，读取 `../state-contract/SKILL.md`。
