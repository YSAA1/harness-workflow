# 进度日志

> 来源：基于 `OthmanAdi/planning-with-files` 的中文 `planning-with-files-zh/templates/progress.md` 改造。
> 许可证：MIT。改造目标：适配 Harness Workflow 的 append-only evidence log。

本文件只追加记录重要进展、验证证据、失败和恢复信息。不要重写历史，除非是在修正明显错误并记录原因。

### YYYY-MM-DDTHH:MMZ

- Intent: [这次行动的目的]
- Phase: [planning | bootstrap | implementation | review | verification | cleanup | paused | complete]
- Actions:
  - [执行了什么]
- Files:
  - [创建或修改的文件]
- Commands / Checks:
  - `[命令]` -> pass|fail|not run，原因或摘要
- Outcome:
  - [现在已经真实成立的事情]
- Next: [下一次最先做什么]

## 测试结果

| 时间 | 检查 | 输入 / 范围 | 结果 | 状态 |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

## 错误日志

| 时间 | 错误 | 尝试次数 | 解决方案 | 状态 |
| --- | --- | --- | --- | --- |
|  |  | 1 |  |  |

## 五问恢复检查

| 问题 | 答案 |
| --- | --- |
| 我在哪里？ | [当前阶段 / active slice] |
| 我要去哪里？ | [下一阶段 / 目标] |
| 目标是什么？ | [可验证目标] |
| 我学到了什么？ | 见 `findings.md` |
| 我做了什么？ | 见上方进度记录 |

## 备注

- 每完成一个阶段、遇到错误、验证失败、暂停或收尾时追加一条记录。
- 只记录 fresh evidence；不要把未运行的验证写成通过。
- 如果有验证限制，写明跳过原因和残余风险。
