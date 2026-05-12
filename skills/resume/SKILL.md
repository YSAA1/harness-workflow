---
name: resume
description: "当 compaction、暂停、交接或新会话后恢复 tracked workflow，必须从当前 workflow state backend、AGENTS.md 和 git state 重建上下文时使用。典型触发语：继续、接着做、恢复上下文、上次到哪了、after compact、resume。不要相信聊天记忆。"
---

# 从工件恢复上下文

本 skill 从仓库工件恢复当前工作上下文。它不写代码、不重写计划、不从聊天历史猜意图。它只回答：**现在什么是真的，什么过期了，下一步应该做什么**。

如果工件无法回答这些问题，正确结果是修复建议，而不是猜测式继续。

## Workflow State Contract

本 workflow 依赖的是 `state-contract` 定义的 workflow state，而不是某三个文件本身。默认 backend 是三文件：`task_plan.md` / `progress.md` / `findings.md`。

如果项目在 `AGENTS.md`、`.harness/manifest.yaml` 或 `.harness/state.md` 中声明了其他 backend（lightweight、feature-list、existing），按该 backend 读取 active slice、evidence、decisions、risks 和 handoff。

若 state backend 不存在：简单任务可以轻量执行；非平凡或跨 session 任务先调用 `state-contract` 或 `plan` 建立状态。

## 目的

让新会话或压缩后的 agent 先从仓库事实恢复，而不是依赖聊天记忆，避免重复旧路、覆盖用户改动或基于过期证据继续执行。

## 何时使用

### 触发信号

- Context compaction happened or the session was resumed.
- 用户说「继续」「接着做」「恢复上下文」「上次到哪了」。
- workflow state exists but the current phase is unclear.
- Chat memory conflicts with repository state.
- Another agent left a handoff and you need to verify it.
- There are dirty files and you need to determine whether they belong to the tracked slice.

### 不要使用

- You are in the middle of a fresh uninterrupted step and all relevant context is already loaded.
- The user asks for a simple one-off command or explanation.
- The active slice is clear and the next action is to implement; use `implement`.
- A command is failing and root cause is unknown; use `diagnose`.

## 先读取这些输入

Read in this order:

1. 当前 workflow state backend 的 execution contract（默认 `task_plan.md`）
2. 当前 workflow state backend 的 evidence log（默认 `progress.md`，尤其最新 2-5 个 timestamp sections）
3. 当前 workflow state backend 的 findings area（默认 `findings.md`，尤其 accepted spec、risks、failures、references、rejected options）
4. `AGENTS.md`
5. `git status --short`
6. `git diff --stat`
7. Files directly related to the current active slice
8. Recent relevant logs or command outputs referenced by `progress.md`

识别 active slice 之前不要全仓库乱读。先读工件，再只检查相关文件。

## 执行流程

### 第 1 步 — Recover The Claimed State

From workflow state execution contract（默认 `task_plan.md`）, extract:

- objective
- current phase
- active slice
- success criteria
- blockers
- next actions

If more than one phase is `in_progress`, mark the plan stale and recommend `plan`.

### 第 2 步 — Recover The Actual Recent State

From workflow state evidence log（默认 `progress.md`）, extract:

- last completed action
- last commands and results
- files touched
- stated next action
- unresolved failures or not-run checks

Use timestamps. If entries are out of order or vague, call that out.

### 第 3 步 — Recover Decisions And Risk

From `findings.md`, extract:

- accepted spec
- non-goals
- rejected options not to retry
- root causes already found
- residual risks
- external references or capability recommendations

不要重新打开已拒绝的方案，除非有新证据。

### 第 4 步 — Compare With Git State

Use `git status --short` and `git diff --stat` to check:

- dirty files that match the active slice
- dirty files that look unrelated
- generated files or temp files
- deleted files
- untracked artifacts that may be useful or accidental

不要 revert 任何文件。若存在无关 dirty files，保留并单独说明。

### 第 5 步 — Detect Staleness

当工件互相矛盾时读取 `references/staleness-checklist.md`。常见漂移信号：

- `task_plan.md` says phase is active, but `progress.md` shows it completed.
- `progress.md` claims tests passed before the latest source edit.
- `findings.md` accepted spec conflicts with current code or user request.
- `AGENTS.md` points to missing commands or stale recovery files.
- Next action is vague, such as "continue cleanup".

### 第 6 步 — Choose The Next Skill

| Recovered state | Next skill |
| --- | --- |
| Need to create or repair plan files | `plan` |
| Plan exists but workbench not ready | `bootstrap` |
| Active slice clear and ready to edit | `implement` |
| Failure root cause unknown | `diagnose` |
| Stable change needs review | `review` |
| Ready claim needs proof | `verify` |
| Finished or pausing | `cleanup` / `save-session` |

## 输出格式

```text
RESUME CONTEXT

当前状态:
  - Objective:
  - Active slice:
  - Current phase:
  - Success criteria:

最近变化:
  - ...

Fresh Evidence:
  - <command -> result -> fresh|stale>

开放风险 / Blockers:
  - ...

What Not To Retry:
  - ...

Staleness / Drift Notes:
  - ...

Git Working State:
  - Related dirty files:
  - Unrelated dirty files:
  - Untracked files:

推荐下一步 Skill:
  - <skill>
  - Reason:
```

## 示例

### 示例 1: Clear Resume

`task_plan.md` has phase 2 in progress, `progress.md` latest entry says unit test is red, and diff shows the expected test file. Next: `implement`.

### 示例 2: Artifacts Disagree

`task_plan.md` says phase 3 in progress, but `progress.md` says phase 3 verified and phase 4 started. Next: `plan` to repair phase state before editing.

### 示例 3: Dirty Files From Another Task

`git status` shows active slice files plus unrelated `.omc/` state changes. Mention unrelated files and ignore them unless they affect current work.

## 常见反模式

- **Trusting chat memory over files.** Repository artifacts are the recovery source.
- **Continuing without checking git state.** Dirty files may belong to the user.
- **Treating stale evidence as fresh.** Commands before the latest edit do not prove the current state.
- **Reopening rejected decisions.** Respect `findings.md` unless new evidence changes the decision.
- **Implementing during resume.** Resume ends by choosing a lane; it does not sneak in code changes.

## 验收标准

- [ ] Current state, active slice, and phase are recovered or marked unknown.
- [ ] Latest relevant `progress.md` evidence is classified fresh or stale.
- [ ] Known blockers, residual risks, and rejected paths are surfaced.
- [ ] Git dirty state is separated into related and unrelated.
- [ ] Artifact drift is named, not hidden.
- [ ] A single next skill and reason are given.

## 工件更新

Normally this skill is read-only. Update artifacts only when:

- the user asked to repair stale files;
- the recovery itself proves a simple artifact correction is needed;
- the next lane requires it and the user has approved.

如需写入，只追加 `progress.md`，不要改写历史。

## 按需读取

- `references/staleness-checklist.md`: artifact drift patterns.
- `../plan/SKILL.md`: repair stale plan state.
- `../save-session/SKILL.md`: create a clean handoff before pause.


## State Contract Reference

需要选择、修复或解释 workflow state backend 时，读取 `../state-contract/SKILL.md`。
