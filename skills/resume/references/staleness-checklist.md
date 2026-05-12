# 状态漂移检查清单

用于 `resume`。当三文件和真实仓库状态不一致时读取。

## 使用方式

1. 先读三文件和 `git status --short`。
2. 找出是哪两个来源不一致。
3. 判断哪个来源更新、更可靠。
4. 用 append-only 方式在 `progress.md` 写一条修正记录。
5. 不重写历史，不回滚用户改动。

## 计划 / 进度漂移

| 漂移 | 信号 | 处理 |
| --- | --- | --- |
| 多个 in_progress | `task_plan.md` 有多个活跃阶段 | 回 `plan` 修计划 |
| 计划说完成但无验证 | phase complete 但 `progress.md` 无命令证据 | 转 `verify` |
| active slice 与实际文件不符 | diff 在另一个功能路径 | 停下，重写 plan 或放弃旁路 |
| Next 太模糊 | "continue" / "fix bugs" | 重新写具体下一步 |
| blocker 已解除但计划没改 | 后续命令已经通过 | 修 plan 并引用证据 |

## 进度 / 决策漂移

| 漂移 | 信号 | 处理 |
| --- | --- | --- |
| rejected option 又被尝试 | `findings.md` 已拒绝，但 progress 又走了 | 停止重试，记录原因 |
| 风险已发生但没记录 | 出现失败，findings 没风险 | 补 risk / root cause |
| capability gap 被隐含跳过 | 因缺工具没跑验证 | 写 recommendation |
| accepted spec 与代码冲突 | spec 说 X，代码做 Y | 回 brainstorm 或 plan |

## 文件 / 仓库漂移

| 漂移 | 信号 | 处理 |
| --- | --- | --- |
| progress 引用不存在文件 | 文件被改名或删除 | 修引用，追加 correction |
| untracked 文件来源不明 | 可能是旧尝试产物 | 保留并标为 uncertain |
| generated 文件意外出现 | dist / coverage / trace | 不自动删，交给 cleanup 判断 |
| 近期 commit 未进 progress | 其他 agent 或人工改动 | 追加 synthetic progress entry |

## 命令 / 证据漂移

| 漂移 | 信号 | 处理 |
| --- | --- | --- |
| 证据过期 | 测试时间早于最后代码改动 | 重跑相关检查 |
| 命令路径变了 | README 命令不存在 | 修 docs；若影响冷启动入口，转 `bootstrap` |
| cwd 不一致 | 上次在子目录跑 | 记录 cwd 并重跑 |
| flaky 被当 pass | 两次结果不同 | 当作 fail 处理 |

## 修正模板

```md
### YYYY-MM-DDTHH:MMZ — drift correction
- Detected: <漂移类别和一句话描述>
- Evidence: <文件/命令/时间戳>
- Authoritative source: <哪个来源为准，为什么>
- Patch:
  - <file>: <old -> new>
- Risk introduced: <none|...>
- Next: <skill or action>
```

## 反模式

- 用聊天记忆静默改 `task_plan.md`。
- 把旧命令当 fresh evidence。
- 为了 cleanup 回滚用户未提交改动。
- 把 drift 写进 `AGENTS.md`。
