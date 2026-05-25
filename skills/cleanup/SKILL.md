---
name: cleanup
description: "当一个 batch 准备完成、阻塞、放弃或需要知识收尾时使用。典型触发语：收尾、整理一下、finish this phase、make state clean、同步文档、知识清理。聚焦 Knowledge Cleanup：防止文档过期、AGENTS.md 膨胀、生成物不一致和 recovery surface 漂移；除非用户要求，不做行为改动。"
---

# Knowledge Cleanup

`cleanup` 是知识和工件的收尾闸门。它对齐 docs、代码、生成物和 selected recovery surface，防止项目知识腐化。它不是重构许可证，也不是单独的暂停/恢复 lane。

## 目的

- 保持 `AGENTS.md` 是薄规则手册，不写 changelog、临时状态或会话叙事。
- 确保 README、docs、generated artifacts 和验证命令描述当前真实项目。
- 检查 recovery surface 是否漂移、膨胀或与 git diff 矛盾。
- 把未解决的 doc drift 和 residual risk 记录成明确 follow-up。

## 何时使用

### 触发信号

- `verify` 已通过，slice 可以关闭。
- Review 发现文档漂移、知识腐化或低风险 residue。
- 用户说「收尾」「整理」「同步文档」「把状态弄干净」。
- 当前 artifacts 不再真实描述代码、命令、证据或 blockers。
- 需要交接卫生，但不应该保留单独交接 lane。

### 不要使用

- Verification 尚未运行且 ready claim 需要证据：用 `verify`。
- 有未解释失败：用 `diagnose`。
- Cleanup 需要行为变化：回 `plan` 或 `implement`。
- 用户要求继续实现，而不是 closure。

### 路由规则

| 状态 | 下一步 |
| --- | --- |
| 文档和 artifacts 已对齐 | done |
| 发现缺失行为或测试 | `implement` |
| 发现失败或不明根因 | `diagnose` |
| 发现 plan/scope 漂移 | `plan` |
| 发现项目级 recovery surface 缺口 | `harness-builder` |

## 先读取这些输入

1. `AGENTS.md`、README、docs 目录和相关 generated artifacts。
2. selected recovery surface：phase、blocker、next、evidence、risks、deferred cleanup。
3. `git status --short` and `git diff --stat`。
4. 生成物来源脚本，例如 flow HTML 只能由 generator 更新。
5. 本 batch 创建的 temp files、logs、screenshots、local reports。

Never delete or rewrite uncertain files. Ask or defer.

## Knowledge Freshness Check

- README commands match real commands.
- `AGENTS.md` remains a thin entry and points to durable docs or recovery surface.
- Task status lives in selected recovery surface, not durable instructions.
- User-visible behavior, config, env vars, ports, scripts, CLI flags, file paths are documented.
- Generated artifacts are regenerated from scripts, not hand-edited.
- Removed or renamed skills are not still advertised as active.
- 当 plan 定义了 commit unit 时：所有 eligible commit unit 是否已提交；recovery surface 的阶段状态是否与 git log 一致；没有"已 verify PASS 但未提交"的遗漏。

## Low-Risk Entropy Cleanup

Allowed when obviously created by this task:

- temp files
- debug logs
- local scratch reports
- unreferenced generated drafts
- accidental console/debug prints
- obsolete comments introduced in this batch
- duplicate task notes already captured in selected recovery surface

不确定是否能清理时读取 `references/entropy-checklist.md`。

## 执行流程

### 第 1 步 — Enumerate Docs And Artifacts

修改前列出相关 docs、generated files、recovery artifacts 和 dirty files。不要凭记忆改。

### 第 2 步 — Compare Truth Sources

比较代码、README、docs、generated artifacts、`AGENTS.md` 和 selected recovery surface。找出 drift、膨胀、重复和过期命令。当 plan 有 commit unit 时，比较 plan 的阶段状态、recovery surface 的 milestone 记录和 git log，找出不一致。

### 第 3 步 — Pick Closure State

选择一个状态：

| State | Meaning |
| --- | --- |
| `complete` | success criteria met with fresh evidence |
| `blocked` | cannot proceed without external decision or capability |
| `abandoned` | tracked attempt intentionally stopped |
| `reopen` | cleanup found missing work; go back to execution |

### 第 4 步 — Apply Knowledge Cleanup

小幅修正 docs、README、generated artifacts 或 recovery surface。把历史叙事从 `AGENTS.md` 迁出或删除，只保留稳定规则和指针。

### 第 5 步 — Regenerate Generated Artifacts

生成物只能通过生成器更新。不要手改 `docs/skill-flow-review/*.html`。

### 第 6 步 — Record Residual Drift

未解决的 drift 写成明确 follow-up：位置、风险、建议下一步、是否阻塞 ready。

### 第 7 步 — Final Git State Summary

报告 related changes、unrelated dirty files left alone、removed/deferred residue。报告 milestone commits 完成情况。

## 输出契约

```text
CLEANUP: complete|blocked|abandoned|reopen

Evidence:
  - <command -> result>

Knowledge cleanup:
  - README: ok|updated|stale
  - AGENTS.md: ok|updated|stale
  - docs: ok|updated|stale
  - generated artifacts: ok|regenerated|stale
  - recovery surface: ok|updated|stale

Entropy cleanup:
  - removed: ...
  - deferred: ...

Git state:
  - related changes:
  - unrelated changes left alone:

Next:
  - <done | implement | diagnose | plan | harness-builder>
```

## Recommended next skill

Cleanup is normally the closing lane. Recommend another skill only when the cleanup pass found real unfinished work.

| Situation | Recommended next skill |
| --- | --- |
| Artifacts, docs, recovery surface, and git state are clean enough | stop |
| Deferred follow-up is concrete and planned work is needed | `plan` |
| A small leftover fix is in scope and safe | `implement` |
| Cleanup found a failing command or unexplained drift | `diagnose` |
| Cleanup found a missing recovery surface, capability, hook, MCP, or project rule | `harness-builder` |

## 常见反模式

- **Using cleanup to hide unfinished work.**
- **Deleting uncertain files.**
- **Treating doc drift as minor by default.**
- **在 cleanup 中创建新系统。** 不引入 hooks、MCP 或新的状态文件。
- **Updating `AGENTS.md` with session notes.**

## 验收标准

- [ ] Closure state is exactly one of complete, blocked, abandoned, reopen.
- [ ] Fresh evidence is recorded or lack of evidence routes away from cleanup.
- [ ] `AGENTS.md`、README、docs、generated artifacts 和 recovery surface 已比较。
- [ ] Low-risk cleanup is separated from deferred high-risk cleanup.
- [ ] Generated artifacts are regenerated, not hand-edited.
- [ ] Unrelated dirty files are preserved.

## 工件更新

- README/docs/`AGENTS.md`：只做知识保鲜和薄入口修正。
- generated artifacts：只通过生成器更新。
- selected recovery surface：closure state、residual risk、deferred cleanup、handoff hygiene。

## 按需读取

- `references/entropy-checklist.md`：safe vs unsafe cleanup examples。
- `references/handoff-hygiene.md`：pause/close handoff hygiene checklist。
- `../harness-builder/references/recovery_surface_policy.md`：recovery surface drift repair。
