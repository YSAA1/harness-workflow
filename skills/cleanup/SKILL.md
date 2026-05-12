---
name: cleanup
description: "当 tracked batch 准备完成、阻塞、放弃或做低风险收尾清理，需要 clean-state closure、真实工件和防文档腐烂时使用。典型触发语：收尾、整理一下、finish this phase、make state clean。普通暂停或交接直接用 save-session。验证已跑完后，用它防止 artifact drift 和 leftover noise。"
---

# 诚实收尾

本 skill 收尾 tracked batch，但不隐藏不确定性。它更新状态、清理低风险残留、防止文档腐烂，并让 repo 更容易被下一位 agent 接手。

cleanup 不是重构许可证，它只是一个窄出口闸门。

## Workflow State Contract

本 workflow 依赖的是 `state-contract` 定义的 workflow state，而不是某三个文件本身。默认 backend 是三文件：`task_plan.md` / `progress.md` / `findings.md`。

如果项目在 `AGENTS.md`、`.harness/manifest.yaml` 或 `.harness/state.md` 中声明了其他 backend（lightweight、feature-list、existing），按该 backend 读取 active slice、evidence、decisions、risks 和 handoff。

若 state backend 不存在：简单任务可以轻量执行；非平凡或跨 session 任务先调用 `state-contract` 或 `plan` 建立状态。

## 目的

把一个 batch 诚实地关闭、阻塞、放弃或重新打开，同时清掉低风险残留并确保 workflow state、docs 和 git state 不互相误导。普通暂停和交接由 `save-session` 负责。

## 何时使用

### 触发信号

- `verify` 已通过，slice 可以关闭。
- A failed attempt should be abandoned without leaving misleading state.
- Review found only low-risk entropy or stale documentation.
- 用户说「收尾」「整理」「把状态弄干净」。
- Current artifacts no longer truthfully describe code, commands, evidence, or blockers.

### 不要使用

- Verification has not run and bootstrap is unknown: use `verify`.
- There is an unexplained failing command: use `diagnose`.
- Cleanup would require behavior changes: make a new active slice in `plan`.
- The user asked for implementation, not closure.

## 先读取这些输入

1. workflow state execution contract: phase, blocker, next action, success criteria（默认 `task_plan.md`）。
2. workflow state evidence log: latest commands and actual outcomes（默认 `progress.md`）。
3. workflow state findings area: accepted spec, residual risks, deferred cleanup（默认 `findings.md`）。
4. `git status --short` and `git diff --stat`.
5. README / docs / `AGENTS.md` sections touched by this batch.
6. Generated files, temp files, logs, screenshots, caches, local reports created during the work.

Never delete or rewrite uncertain files. Ask or defer.

## Closure States

Choose exactly one:

| State | Meaning |
| --- | --- |
| `complete` | success criteria met with fresh evidence |
| `blocked` | cannot proceed without external decision or capability |
| `abandoned` | tracked attempt is intentionally stopped |
| `reopen` | cleanup found missing work; go back to execution |

不要写"基本完成"。只能选择一个诚实状态。

## Low-Risk Entropy Cleanup

Allowed without additional design approval when obviously created by this task:

- temp files
- debug logs
- local scratch reports
- unreferenced generated drafts
- accidental console/debug prints
- obsolete comments introduced in this batch
- duplicate task notes already captured in workflow state（默认 `progress.md` / `findings.md`）

不确定是否能清理时读取 `references/entropy-checklist.md`。

## High-Risk Cleanup

不要静默执行：

- behavior changes
- broad refactors
- dependency removals
- public API changes
- deleting files with unclear ownership
- rewriting `AGENTS.md` extensively
- reorganizing docs across directories
- removing tests because they fail

Record these as deferred cleanup in `findings.md` or create a new plan slice.

## Documentation Freshness Check

Before closure, compare docs against actual state:

- README commands match real commands.
- `AGENTS.md` remains a thin entry and points to recovery files.
- task state lives in three workflow files, not durable instructions.
- new user-visible behavior is documented.
- changed environment variables, ports, scripts, package names, CLI flags, or file paths are documented.
- verification path in docs still works or is marked stale.

如果 docs 过期且修复很小，直接修。若修复范围较大，记录为 blocker 或 deferred cleanup。

## 执行流程

### 第 1 步 — Verify Closure Preconditions

Answer:

- What evidence proves the current state?
- What remains unverified?
- What files changed?
- What cleanup is safe?

If no fresh evidence exists, route to `verify`.

### 第 2 步 — Pick Closure State

Choose one state from the table. Update `task_plan.md` only according to that state:

- `complete`: mark current phase complete and set next.
- `blocked`: mark blocker and required external action.
- `abandoned`: mark attempt abandoned and record reason.
- `reopen`: leave phase in progress and route to implementation/fix.

### 第 3 步 — Remove Low-Risk Residue

List candidate cleanup items first. Remove only those that are clearly low risk and created by this task.

### 第 4 步 — Sync Artifacts

- `progress.md`: append cleanup entry with closure state, files touched, commands, remaining risk.
- `findings.md`: record residual risk, deferred cleanup, capability gaps, abandoned paths.
- `task_plan.md`: reflect phase and next action.

### 第 5 步 — Final Git State Summary

Report:

- tracked changed files relevant to this task
- unrelated dirty files left alone
- untracked files intentionally kept
- untracked files removed or deferred

## 输出格式

```text
CLEANUP: complete|blocked|abandoned|reopen

Evidence:
  - <command -> result>

Artifact updates:
  - task_plan.md: ...
  - progress.md: ...
  - findings.md: ...

Entropy cleanup:
  - removed: ...
  - deferred: ...

Docs freshness:
  - README: ok|updated|stale
  - AGENTS.md: ok|updated|stale
  - verification path: ok|stale|unknown

Git state:
  - related changes:
  - unrelated changes left alone:

Next:
  - <done | save-session | implement | diagnose | plan>
```

## 示例

### 示例 1: Complete

Verification passed. Cleanup removes a temporary screenshot and updates `task_plan.md` phase to complete. `progress.md` records commands. Next: done.

### 示例 2: Blocked

Verification is insufficient because browser capability is missing. Cleanup marks the phase blocked only if the user wants to stop the batch; otherwise route to `save-session` with exact capability gap.

### 示例 3: Reopen

Cleanup finds README still documents a command that no longer exists. Since this is part of the current slice, closure becomes `reopen`; route to `implement` to fix docs and rerun verification.

## 常见反模式

- **Using cleanup to hide unfinished work.** If work should simply continue later, use `save-session`; if closure found missing required work, choose `reopen`.
- **Deleting uncertain files.** Preserve or ask.
- **Treating doc drift as minor by default.** Stale commands break future agents.
- **cleanup 时创建新系统。** 不要在这里引入 hooks、MCP 或新的状态文件。
- **Updating `AGENTS.md` with session notes.** Stable rules only; task status belongs in three files.

## 验收标准

- [ ] Closure state is exactly one of complete, blocked, abandoned, reopen.
- [ ] Fresh evidence is recorded or lack of evidence routes away from cleanup.
- [ ] Low-risk cleanup is separated from deferred high-risk cleanup.
- [ ] README/docs/`AGENTS.md` freshness is checked when relevant.
- [ ] `task_plan.md`, `progress.md`, and `findings.md` tell the same truth.
- [ ] Unrelated dirty files are preserved.

## 工件更新

- `progress.md`: append closure entry.
- `findings.md`: residual risk and deferred cleanup.
- `task_plan.md`: phase, blocker, next.
- `AGENTS.md`: only if a stable project rule or recovery pointer changed; otherwise do not touch.

## 按需读取

- `references/entropy-checklist.md`: safe vs unsafe cleanup examples.
- `../save-session/SKILL.md`: use when pausing after cleanup.
- `../bootstrap/references/agents-md-rubric.md`: use when durable AGENTS.md rules or recovery pointers changed.


## State Contract Reference

需要选择、修复或解释 workflow state backend 时，读取 `../state-contract/SKILL.md`。
