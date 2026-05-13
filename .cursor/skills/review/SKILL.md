---
name: review
description: "当一段有意义的代码或文档改动已稳定、准备声明 ready/done/merge 前使用。典型触发语：review 一下、检查我的改动、commit 前看下、phase 完成了、Spec 已实现、sanity check、有没有漏。通常在 verify 之前、diagnose 修复之后使用；WIP 未稳定时不要使用。"
---

# 工作流评审

`review` 用 **Spec / scope / evidence / docs / entropy** 五把尺检查当前结果。它抓正确性、范围、设计风险和缺失测试；文档漂移可以成为 finding，但系统性 reconciliation 属于 `cleanup`。

## 目的

review 必须同时检查"做超了"和"做欠了"。缺 fresh evidence 时，review 仍可完成结构判断，并把 evidence gap 标成 Important 后路由到 `verify`。

## 何时使用

### 触发信号

- `implement` 完成一个 slice、即将转下一阶段。
- `diagnose` 修复稳定，要回主流程。
- 用户说「review 一下」「这样可以吗」「能不能合并」「commit 前检查」「sanity check」。
- 准备调用 `verify` 之前的结构性把关。
- 多 agent 协作时上一个 agent 刚交付，本 agent 接手前。

### 不要使用

- 工作还在 WIP 中、active slice 未稳定：继续 `implement`。
- 工作完全没有稳定到可审状态：继续 `implement`。
- 用户要架构建议：转 `brainstorm`。
- 失败正在发生：转 `diagnose`。

### 路由规则

| 状态 | 下一步 |
| --- | --- |
| review 通过或仅有 evidence gap | `verify` |
| review 找出 Critical/Important findings | `implement` |
| review 发现 Spec 漂移 | `brainstorm` 或 `plan` |
| 发现项目工作面缺口 | `harness-builder` |
| 文档/知识漂移需要整理 | `cleanup` |

## 先读取这些输入

1. scope / diff / 文件列表：`git diff --stat` 和实际改动文件。
2. accepted Spec、Executable Plan 或用户请求。
3. selected recovery surface：active slice、success criteria、evidence、risks。
4. 与本次 slice 相关的源文件、测试、配置。
5. README / `AGENTS.md` 的相关段，确认文档与代码同步。

## 检查重点

- **Spec coverage**：是否实现 goals，是否越过 non-goals。
- **Evidence**：每个完成声明是否有 fresh evidence，缺口是否明确。
- **Correctness and design risk**：边界、错误处理、数据、并发、兼容性是否合理。
- **Docs/artifacts**：命令、配置、用户可见行为、API 是否同步。
- **Entropy**：调试输出、TODO、未使用代码、未批准依赖或第二套状态来源。

## 执行流程

### 第 1 步 — 重述 scope

一句话回答本次 review 的 active slice、改动文件和完成声明。

### 第 2 步 — 用五把尺逐项过

对每条问题给状态、证据和严重级。

### 第 3 步 — 分级 findings

| 级别 | 含义 | 处置 |
| --- | --- | --- |
| Critical | 正确性错误、安全漏洞、数据丢失、核心行为破坏、违反 accepted Spec | 必须修复 |
| Important | 设计缺陷、关键测试缺失、文档严重失真、scope creep | 应修或明确 deferred |
| Minor | 风格、可读性、非阻塞清理 | 可选 |

### 第 4 步 — 列 Open Questions / Residual Risks

把无法判断的项明确列出，不把不确定伪装成通过。

### 第 5 步 — 给出 Assessment

结论只能是 Pass / Conditional / Block。

### 第 6 步 — 按需同步 artifacts

blocking findings 和 residual risks 写入 selected recovery surface；不把一次性 review 结论写进 `AGENTS.md`。

## 输出格式

```text
REVIEW: PASS | CONDITIONAL | BLOCK

Scope:
  - Active slice: <一句话>
  - Files reviewed: <list 或 git stat>
  - Fresh evidence base: <command or missing>

Findings:
  Critical:
    - <一句话> (file:line) - <evidence>
  Important:
    - <一句话> (file:line) - <evidence>
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
  - Skill: <implement | diagnose | verify | cleanup | plan>
```

## Recommended next skill

Use review findings to route the next lane; review itself should not quietly become implementation.

| Situation | Recommended next skill |
| --- | --- |
| Pass, but fresh evidence is missing or stale | `verify` |
| Pass and evidence is already fresh | `cleanup` |
| Correctness, docs, or scope findings need edits | `implement` |
| A finding needs root-cause work before a fix | `diagnose` |
| The implementation no longer matches the plan or Spec | `plan` |
| Missing verification capability blocks confidence | `harness-builder` |

## 常见反模式

- **鼓励性总结，无证据。**
- **只看 diff，不对 Spec。**
- **把缺测试当成以后补。**
- **review 与 verify 混淆。**
- **改 `AGENTS.md` 写本次结论。**

## 验收标准

- [ ] 至少检查了 Spec / evidence / docs / entropy。
- [ ] 每条 Critical / Important finding 有文件路径或命令级证据。
- [ ] Open Questions 与 Residual Risks 明确。
- [ ] Assessment 是 Pass / Conditional / Block 之一。
- [ ] blocking findings 按需写入 selected recovery surface。
- [ ] 下一步 skill 与原因显式。

## 工件更新

- selected recovery surface：Critical / Important findings、Open Questions、Residual Risks、review entry。
- `AGENTS.md`：不动；稳定规则漂移交给 `cleanup`。

## 按需读取

- `references/premature-completion-patterns.md`：常见伪完成模式与识别信号。
- 行为级验证：`../verify/SKILL.md`
- 失败诊断：`../diagnose/SKILL.md`
