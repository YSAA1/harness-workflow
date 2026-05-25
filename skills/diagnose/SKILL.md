---
name: diagnose
description: "用于把 build/test/lint/typecheck/CI 或运行时失败诊断成可复现 root cause。触发条件：命令红、行为坏、flaky 或本地/CI 不一致且根因未知。不要在 RED->GREEN 的已知失败或根因已清楚时使用；修复前必须先复现和验证单一假设。"
---

# 构建与失败诊断

`diagnose` 把失败转化为 **reproduce -> minimize -> hypothesize -> instrument -> fix -> regression-test**，而不是盲改循环。

## 路由快照

- **Use when**: 失败存在且 root cause 不能由单一证据解释。
- **Do not use when**: 这是实现中的预期 RED、根因已知、或问题其实是需求/范围不清。
- **Route to**: 根因明确且修复直接转 `implement`；修复稳定转 `review` 或 `verify`；命令链路缺口转 `harness-builder`。

## 目的

- 没有可复现失败，不提修复结论。
- 没有 root cause 证据，不算诊断完成。
- 不在 build/test/lint 已红的状态下推进 implementation。
- 修复必须最小、单一、可验证。
- 三轮 hypothesis 仍找不到根因，升级为 blocker。

## 何时使用

### 触发信号

- `implement` 中一个明确假设循环仍无法解释失败，或同一命令两次返回不同错误。
- `npm test` / build / lint / typecheck 等命令红，且错误不能直接对应刚改的几行。
- 本地和 CI 结果不一致。
- 构建突然慢、卡住、内存爆。
- 用户说「为什么报这个错」「再试一下还是不行」「flaky 了」「CI 红了」。

### 不要使用

- 这是 RED->GREEN 流程里刚写的测试在红：回 `implement`。
- 这是已知 Spec 变化导致旧测试失效：先回 `plan`。
- 失败根因已经清楚，只差最小修改：回 `implement`。
- 用户在问方案而不是失败原因：转 `brainstorm`。

### 路由规则

| 状态 | 下一步 |
| --- | --- |
| 根因已找到、修复直接 | `implement` |
| 根因影响多文件或范围 | `plan` |
| 根因揭示需求边界错 | `brainstorm` |
| 修复稳定 | `review` 或 `verify` |
| 根因是已提交里程碑的回归 | 记录到 recovery surface + `implement` 修复 + 重新 verify |
| 三轮诊断未果 | 记录 blocker 并向用户升级 |
| 命令链路本身坏 | `harness-builder` |

## 先读取这些输入

1. 失败命令的真实输出：完整 stderr、stack trace、退出码。
2. selected recovery surface：最近成功状态、风险、dead ends、capability gaps。
3. `git status --short` 和相关 diff：确认变化面。
4. 与失败直接相关的源文件、测试、配置。
5. README / `AGENTS.md`：确认命令入口是否真实。

## 执行流程

### 第 1 步 — 捕获事实

记录命令、cwd、退出码、失败输出、时间戳、git HEAD 和最近相关命令序列。

### 第 2 步 — 稳定复现

跑同样命令两次，确认结果一致。若 flaky，先把 flaky 当根因方向诊断。

### 第 3 步 — 定位变化面

查看最近提交、本地 diff、相关配置和已知能跑通的锚点。当失败出现在已提交里程碑的范围内时，先确认是否该里程碑引入了回归，查看该 commit 的 diff 和对应的 verify 证据是否仍有效。

### 第 4 步 — 提出单一 hypothesis

每轮只一个可证伪命题，不并发猜多个原因。

### 第 5 步 — 用最小检查验证 hypothesis

用 focused test、日志、独立脚本或配置对照回答 H1 是否成立。

### 第 6 步 — 命名 root cause

只有当证据支持某个 hypothesis 时，才写 root cause。被证伪的 hypothesis 也记录到 selected recovery surface，避免下次重走。

### 第 7 步 — 最小修复

修复改动尽可能小且单一。不顺手 refactor，不用注释测试、catch-all 或忽略类型错误隐藏失败。

### 第 8 步 — fresh 验证

先跑 reproduction 命令，再跑相邻验证。失败则继续诊断；通过后转 `review` 或 `verify`。

## 输出契约

```text
BUILD FIX REPORT

Failure command:
  - <command -> output>
Reproduction:
  - <minimal command>
Hypotheses tried:
  - H1: <statement> -> <falsified|supported>
Root cause: <一句话>
Evidence: <command + output|trace>
Fix: <一句话 + 文件清单>
Verification:
  - <command -> result>
Risks / residual: <一句话>
Recovery surface updated: yes|no|n/a
Next: <implement | review | verify | blocker>
```

## Recommended next skill

Route based on what the diagnosis proved; do not keep debugging after a single root cause is established.

| Situation | Recommended next skill |
| --- | --- |
| Root cause is proven and the fix still needs code changes | `implement` |
| Fix was applied and the change is meaningful | `review` |
| Fix was applied and only fresh proof remains | `verify` |
| Root cause points to missing tooling, environment, MCP, hook, or recovery surface | `harness-builder` |
| Diagnosis changes task scope or success criteria | `plan` |

## 常见反模式

- **多假设并发。** 每轮只一个 hypothesis。
- **基于现象猜根因不验证。** "应该是 X"必须用命令证伪或证实。
- **用 try/catch、注释测试、`@ts-ignore` 把 bug 藏起来。**
- **修着修着越界。** 这破坏 WIP=1。
- **不记 dead end。** 下次会走同一路。

## 验收标准

- [ ] 失败有最小复现命令。
- [ ] hypotheses 序列被记录，被证伪的也保留。
- [ ] root cause 一句话能讲清，且有命令级证据。
- [ ] 修复最小、单一、未越界。
- [ ] reproduction 命令由红转绿，相邻验证未 regress。
- [ ] 下一步 skill 已显式标注。

## 工件更新

- selected recovery surface：记录失败事实、hypotheses、root cause、dead ends、修复、验证和残余风险。
- 源码/tests/docs：仅做 root cause 所需的最小修复。

## 按需读取

- `references/harness-layer-patterns.md`：五子系统失败信号与修复 lane。
- 修复后回归 RED->GREEN：`../implement/SKILL.md`
- 准备声明 ready：`../verify/SKILL.md`
