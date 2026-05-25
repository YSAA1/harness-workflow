---
name: verify
description: "用于给具体 ready/done/merge claim 收集 fresh evidence 并映射到成功标准。触发条件：工作准备声明 ready、用户要求验证/最终检查/smoke/E2E，或 review 后缺当前证据。不要在实现仍变化、失败未解释或成功标准不清时使用；verify 不修复。"
---

# 声明 ready 前验证

`verify` 为一个具体 claim 收集 fresh evidence。它不修复、不重做计划、不清理无关文件，只用当前命令或可用 evidence source 证明当前状态，记录证据边界，并把失败路由到正确 skill。

核心规则：**`verify` 是唯一 ready gate；没有 fresh evidence，就不能声明 ready**。

## 路由快照

- **Use when**: 需要证明某个 ready claim，且能列出 success criteria 或 verification path。
- **Do not use when**: 实现仍在变化、命令失败未解释、或 success criteria 写不出来。
- **Route to**: PASS 后转 `cleanup`；失败转 `diagnose`；能力缺口转 `harness-builder`；范围不清转 `plan` / `brainstorm`。

## 目的

- 把"可以结束"转化为可追溯证据。
- 将每条成功标准映射到 fresh command、smoke/E2E、manual signal 或明确 unknown。
- 记录 skipped checks、capability gaps、residual risks 和 ready verdict。

## 何时使用

### 触发信号

- `review` 没有 blocking structural issue，但仍需要最终 fresh evidence。
- 一个 slice 准备从 in-progress 进入 done/ready。
- 用户说「验证一下」「能结束吗」「跑最终检查」「证明它能用」。
- 改动触及 UI、API、auth、persistence、config、build、packaging 或跨组件行为。
- 之前证据在后续文件变化后变 stale。

### 不要使用

- 有未解释的失败命令：用 `diagnose`。
- 实现仍在变化：用 `implement`。
- Spec 或成功标准不清：用 `brainstorm` 或 `plan`。
- 任务是单行非行为编辑，用户不需要 tracked evidence。

## 先读取这些输入

1. ready claim：active slice、success criteria、verification path、verification path status、required capabilities、fallback evidence。
2. selected recovery surface：最近 implementation/review evidence、risks、capability gaps。
3. `git status --short`：确认最后改动后哪些证据已过期。
4. 项目验证入口：README、`AGENTS.md`、package/build/test config。
5. 当前 slice 涉及的 source/test/docs 路径。

## 执行流程

### 第 1 步 — Restate The Claim

写一句话："We are verifying that `<active slice>` is ready because `<success criteria>`." 写不出来就回 `plan` 或 `review`。

### 第 2 步 — Check Freshness

判断既有证据是否晚于最后相关改动、覆盖目标行为、在当前 cwd/env 运行、结果明确。详细 unknown 规则见 `references/unverified-claim-policy.md`。

### 第 3 步 — Select Checks

按风险选择最高价值的最小检查集：syntax、build、typecheck、lint、unit、integration、smoke、E2E、manual signal。详细选择见 `references/evidence-ladder.md`。

### 第 4 步 — Run Or Inspect Evidence

按文档命令运行或检查可用 evidence source。记录 command、cwd、result、输出摘要、freshness 和跳过原因。检查失败就转 `diagnose`。

### 第 5 步 — Map Criteria And Commit Eligibility

把每条成功标准映射到 pass/fail/unknown。多阶段任务还要覆盖 `final_integration_claim`。当 plan 定义 commit unit 时，按 `references/unverified-claim-policy.md` 评估 commit eligibility。

### 第 6 步 — Record And Route

用 `references/verification-record-template.md` 写 verification record。按 selected recovery surface 记录 skipped checks、capability gaps 和 residual risk，然后路由下一步。

## 输出格式

```text
VERIFICATION: PASS|FAIL|INSUFFICIENT

Claim: <ready claim>
Evidence run:
  - <command/smoke/manual signal -> pass|fail|unknown>
Success criteria mapping:
  - <criterion -> pass|fail|unknown>
Skipped high-value checks:
  - <check + reason + risk + fallback>
Commit gate: <eligible|not eligible|no commit unit|deferred>
Ready: <yes|no>
Next: <cleanup|diagnose|harness-builder|plan>
```

Full template: `references/verification-record-template.md`.

## Recommended next skill

Verification should produce the next lane from evidence, not optimism.

| Situation | Recommended next skill |
| --- | --- |
| Required evidence is fresh and passing | `cleanup` |
| Command failed or observed behavior is wrong | `diagnose` |
| Required proof is blocked by missing skill, MCP, hook, service, or smoke runner | `harness-builder` |
| Success criteria, Spec, or active slice does not match the checked behavior | `plan` |
| Only docs or recovery notes are stale after passing checks | `cleanup` |

## 验收标准

- [ ] Active slice and ready claim are stated.
- [ ] Every success criterion is mapped to fresh evidence or marked unknown.
- [ ] Unknown is not treated as pass.
- [ ] Relevant evidence ladder rungs are run or skipped with reasons.
- [ ] Capability gaps are absent or recorded with value/enablement/risk/fallback.
- [ ] selected recovery surface records commands, results, timestamp, and limits when required.
- [ ] Output routes to the next skill.

## 工件更新

- selected recovery surface：verification entry、capability gaps、skipped checks、residual risks、flaky behavior。
- 不修改实现代码；失败转 `diagnose`。

## 按需读取

- `references/evidence-ladder.md`：detailed verification selection rules。
- `references/capability-recommendations.md`：recommendation format and examples。
- `references/verification-record-template.md`：full verification record template。
- `references/unverified-claim-policy.md`：freshness、unknown、commit eligibility 和 anti-patterns。
- `../diagnose/SKILL.md`：route here on failed verification。
- `../cleanup/SKILL.md`：route here after PASS。
