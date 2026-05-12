# AGENTS.md 薄入口标准

用于 `bootstrap` 和 `cleanup`。当创建、压缩或小幅修正项目级 `AGENTS.md` 时读取。

## 应该包含

- 项目目标：1-3 句。
- 项目地图：关键目录和入口。
- 工作流恢复：指向 `task_plan.md` / `progress.md` / `findings.md` 或项目既有恢复文件；当前任务边界只写指针，不复制内容。
- 验证入口：常用 install / test / build / lint / smoke 命令。
- 边界：不要做什么、破坏性操作护栏。
- 深层文档指针：README、架构文档、API 文档。

## 不应该包含

- 当前任务下一步。
- 当前 active slice 或本阶段 non-goals 的具体内容。
- session summary。
- 临时 TODO。
- review findings。
- 命令 transcript。
- 长篇教程。
- README 的完整复制。
- secrets。

## 判断

PASS:
- 冷启动 agent 能定位项目、状态、命令、边界。
- 文件可扫描，通常不超过几百行。

WARN:
- 有少量重复或旧路径，但不误导当前任务。

FAIL:
- 混入任务状态。
- 命令明显错误。
- 内容过长导致核心入口不可见。
