---
name: save-session
description: "当 tracked work 要暂停、交接、压缩前保存现场，且当前 workflow state backend 必须成为真实恢复面时使用。典型触发语：保存现场、先暂停、下次继续、handoff、context compact soon、保存 session。不要创建第二套 handoff；当前 workflow state backend 就是恢复来源，默认是三文件。"
---

# 保存干净交接

本 skill 为 tracked workflow 准备中断后的恢复面。默认不创建额外 handoff 文件；当前 workflow state backend 就是恢复来源。默认 three-file backend 映射如下：

- `task_plan.md`：当前计划、阶段、blocker、next action。
- `progress.md`：append-only evidence 和 session log。
- `findings.md`：accepted spec、decisions、risks、dead ends。

如果当前 backend 无法恢复工作，停止前先修复它或调用 `state-contract` 选择合适 backend。

## Workflow State Contract

本 workflow 依赖的是 `state-contract` 定义的 workflow state，而不是某三个文件本身。默认 backend 是三文件：`task_plan.md` / `progress.md` / `findings.md`。

如果项目在 `AGENTS.md`、`.harness/manifest.yaml` 或 `.harness/state.md` 中声明了其他 backend（lightweight、feature-list、existing），按该 backend 读取 active slice、evidence、decisions、risks 和 handoff。

若 state backend 不存在：简单任务可以轻量执行；非平凡或跨 session 任务先调用 `state-contract` 或 `plan` 建立状态。

## 目的

在暂停或交接前把当前状态写成可恢复文件事实，让下一次会话能直接知道目标、进度、证据、风险、失败和第一步动作。

## 何时使用

### 触发信号

- 用户说「先停」「下次继续」「保存一下」「handoff」。
- Context compaction is likely and current state is non-trivial.
- You are about to leave a long-running task mid-slice.
- Verification failed and the next session needs exact failure context.
- A review or cleanup produced residual risks that must persist.
- Another agent will pick up the work.

### 不要使用

- Work is complete and no future continuation is expected: use `cleanup` final state.
- The active slice is unclear: use `resume` or `plan` first.
- There is no tracked workflow and the task is trivial.
- You want to put temporary notes in `AGENTS.md`; do not do that.

## 先读取这些输入

1. `task_plan.md`
2. latest `progress.md` entries
3. `findings.md`
4. `git status --short`
5. command outputs or logs from this session
6. files touched by the active slice

不要靠记忆总结命令。读取已记录证据，或重新运行轻量状态命令。

## Good Handoff Standard

The next session should answer these in under two minutes:

- What is the goal?
- What is the current active slice?
- What was just changed?
- What is verified?
- What is not verified?
- What failed?
- What should not be retried?
- What exact command should run next?
- Which files are dirty and why?

详细交接闸门见 `references/handoff-checklist.md`。

## 执行流程

### 第 1 步 — Decide Pause State

Pick one:

| State | Meaning |
| --- | --- |
| `paused-clean` | no known broken command; continuation is straightforward |
| `paused-with-risk` | work can continue, but some evidence is missing or stale |
| `blocked` | external decision/tool/data is needed |
| `needs-recovery` | artifacts disagree and must be repaired before coding |

如果用户只是说"先停一下"，优先用本 skill，不需要先跑 `cleanup`。只有已经验证通过并准备真正关闭 batch，才转 `cleanup`。

### 第 2 步 — Update `task_plan.md`

Make it truthful and short:

- current phase status
- active slice
- blocker if any
- next 1-3 actions
- success criteria if they changed

不要把命令 transcript、review findings 或长解释塞进 `task_plan.md`。

### 第 3 步 — Append `progress.md`

Append a timestamped handoff entry:

```md
### YYYY-MM-DDTHH:MMZ
- Intent: Pause after <milestone or attempt>.
- Phase: paused-clean|paused-with-risk|blocked|needs-recovery
- Actions:
  - ...
- Files:
  - ...
- Commands / Checks:
  - <command -> pass|fail|not run>
- Outcome:
  - ...
- Next:
  - ...
```

Never rewrite old progress entries. If old data is wrong, add a correction entry.

### 第 4 步 — Update `findings.md`

Record:

- unresolved risks
- not-run checks
- failures and exact errors
- dead ends not to retry
- capability recommendation if verification was blocked
- links or docs that the next session must read

### 第 5 步 — Report Git State

Summarize:

- related modified files
- related untracked files
- unrelated dirty files left alone
- generated artifacts intentionally kept

不要清理无关文件，除非用户明确要求。

### 第 6 步 — State Resume Command

End with the next skill and first action, for example:

- `resume`, then read three workflow files.
- `diagnose`, then rerun `<failing command>`.
- `implement`, then implement `<next small step>`.

## 输出格式

```text
SESSION SAVED: paused-clean|paused-with-risk|blocked|needs-recovery

Current:
  - Active slice:
  - Phase:

Verified:
  - <command -> result>

Unverified / Risk:
  - ...

Files:
  - related changed:
  - unrelated left alone:

Artifacts updated:
  - task_plan.md:
  - progress.md:
  - findings.md:

Resume:
  - Skill:
  - First action:
```

## 示例

### 示例 1: Pause Clean

当前测试小步已通过，下一步明确。更新 `task_plan.md` next action，追加 progress，记录无 blocker。恢复时进入 `implement`。

### 示例 2: Pause With Risk

Unit tests pass but browser smoke has not run. Record `paused-with-risk`, add Playwright MCP recommendation in `findings.md`, resume with `verify`.

### 示例 3: Blocked

External API credentials are required. Record exact command, error, missing secret name, and safe fallback. Resume after user provides credential or alternate path.

## 常见反模式

- **Creating `session-handoff.md` by default.** This plugin uses three workflow files; do not add a fourth source unless the project already has one.
- **Writing temporary state into `AGENTS.md`.** Stable rules only.
- **Saying "tests passed" without command detail.** Include command and result.
- **Hiding unverified work.** Unknown must be visible.
- **Leaving next action vague.** "Continue" is not a next action.

## 验收标准

- [ ] Pause state is chosen and explicit.
- [ ] `task_plan.md` next action is current and short.
- [ ] `progress.md` has a new timestamped handoff entry.
- [ ] `findings.md` records risks, dead ends, capability gaps, or says none.
- [ ] Git dirty state is summarized without reverting user work.
- [ ] Resume skill and first action are explicit.

## 工件更新

- `task_plan.md`: phase, blocker, next action.
- `progress.md`: append-only handoff entry.
- `findings.md`: unresolved risk, failures, not-run checks, references.
- `AGENTS.md`: do not update unless a durable project rule or recovery pointer changed; if it changed, apply the thin-entry rubric from `bootstrap`.

## 按需读取

- `references/handoff-checklist.md`: complete handoff gate.
- `../resume/SKILL.md`: next session recovery.
- `../cleanup/SKILL.md`: close cleanly before pause when possible.


## State Contract Reference

需要选择、修复或解释 workflow state backend 时，读取 `../state-contract/SKILL.md`。
