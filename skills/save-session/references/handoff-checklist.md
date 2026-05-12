# 交接检查清单

用于 `save-session`。目标是让下一次会话两分钟内恢复，不需要再问"上次到哪了"。

## 使用方式

1. 保存前逐项检查。
2. 缺信息就补到三文件。
3. 不知道就写 unknown，不要假装已知。
4. 不新增第四个 handoff 文件，除非项目本来就有。

## A. 目标清晰

| 问题 | 位置 |
| --- | --- |
| 当前 active slice 是什么？ | `task_plan.md` |
| 怎么判断完成？ | `task_plan.md` success criteria |
| 用户是否批准 scope change？ | `findings.md` |

缺 A1/A2 时不要保存，先 `plan`。

## B. 状态清晰

| 问题 | 位置 |
| --- | --- |
| 最后一个具体动作是什么？ | `progress.md` 最新 entry |
| 结果是 pass / fail / partial？ | `progress.md` |
| 改了哪些文件？ | `progress.md` Files |
| working tree 是否 dirty？ | `progress.md` 或最终回复 |

如果写 pass 但没有命令，证据不成立。

## C. 验证状态

| 问题 | 位置 |
| --- | --- |
| 已验证什么？ | `progress.md` Commands / Checks |
| 未验证什么？ | `findings.md` |
| 是否 flaky？ | `findings.md` |
| 是否有失败命令？ | `findings.md` |
| 是否缺工具能力？ | `findings.md` capability recommendation |

## D. Blocker / 风险

| 问题 | 位置 |
| --- | --- |
| 是否需要外部输入？ | `task_plan.md` blocker |
| 解锁条件是什么？ | `task_plan.md` blocker |
| 不要重试什么？ | `findings.md` rejected options / dead ends |
| 下次要验证什么假设？ | `findings.md` |

## E. 恢复动作

| 问题 | 位置 |
| --- | --- |
| 下次先用哪个 skill？ | `task_plan.md` Next 或 `progress.md` |
| 第一动作是什么？ | `task_plan.md` Next |
| 先读哪个文件/目录？ | `progress.md` |
| 哪个命令要重跑？ | `progress.md` / `findings.md` |

"continue" 不是恢复动作。

## 暂停状态

| 状态 | 含义 |
| --- | --- |
| `paused-clean` | 已知信息完整，证据新鲜 |
| `paused-with-risk` | 可继续，但存在未验证或风险 |
| `blocked` | 缺外部输入 |
| `needs-recovery` | 三文件不一致，先恢复上下文 |

## progress.md 模板

```md
### YYYY-MM-DDTHH:MMZ
- Intent: Pause after <milestone or attempt>.
- Phase: paused-clean|paused-with-risk|blocked|needs-recovery
- Actions:
  - <last concrete action>
- Files:
  - <modified files>
- Commands / Checks:
  - <command> -> <result>
- Outcome:
  - <one-line summary>
- Resume:
  - Skill: <skill-name>
  - First action: <concrete step>
  - Read first: <file or directory>
```

## 反模式

- "都好了"但没有命令证据。
- blocker 写得太虚。
- 用过期测试声明通过。
- 暂停时还有两个 in_progress。
- 把临时状态写进 `AGENTS.md`。
