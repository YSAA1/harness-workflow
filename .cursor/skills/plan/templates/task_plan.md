# 任务计划：[任务名称]

> 来源：基于 `OthmanAdi/planning-with-files` 的中文 `planning-with-files-zh/templates/task_plan.md` 改造。
> 许可证：MIT。改造目标：适配 Harness Workflow 的三文件模型、active slice、验证命令和成功标准。

## 目标

[用一句话描述最终可验证状态]

## 范围合同

- Active slice：[当前唯一推进的最小可验证切片]
- Non-goals：[本轮明确不做的事情]
- Success criteria：[如何判断 active slice 完成]
- Verification path：[需要运行的命令、smoke / E2E 或人工信号]
- Verification path status：`runnable | blocked`
- Required capabilities：[验证所需脚本、服务、浏览器、MCP、人工检查等]
- Fallback evidence：[完整验证不可用时，用户接受的替代证据；没有则写 `none`]
- Final integration claim：[多阶段或多 commit unit 的最终整体验收声明；不适用写 `none`]
- Project map：[项目地图位置，例如 `docs/project-map.md` 或 `AGENTS.md#项目地图`]

## 当前阶段

阶段 1 - [阶段名称]：`in_progress`

## 总成功标准

- [可观察的完成标准 1]
- [可观察的完成标准 2]
- [需要 fresh evidence 的验证标准，必须对应 Verification path]
- [多阶段任务的 final integration claim 已被最终 verify 覆盖]

## 阶段

### 阶段 1 - 需求与边界

状态：`in_progress`

- [ ] 明确用户意图、约束和 non-goals。
- [ ] 将已接受规格、拒绝选项和风险记录到 `findings.md`。
- [ ] 定义 active slice、验证路径、验证路径状态、能力缺口和完成标准。

### 阶段 2 - 项目工作面准备

状态：`pending`

- [ ] 确认项目地图、入口和相关文件。
- [ ] 确认 `AGENTS.md`、三文件或等价状态入口可用。
- [ ] 确认验证命令、smoke / E2E 候选、fallback evidence 和能力缺口。
- [ ] 如果 verification path blocked 且没有用户接受的 fallback，先转 `harness-builder`。

### 阶段 3 - 实现

状态：`pending`

- [ ] 按 active slice 小步实现，不扩大范围。
- [ ] 修改代码、命令或用户可见行为时同步相关文档和三文件。
- [ ] 记录 RED / GREEN / REFACTOR 或等价验证证据到 `progress.md`。

### 阶段 4 - 评审与验证

状态：`pending`

- [ ] 对照 accepted spec、风险和 non-goals 做 structural review。
- [ ] 用 `verify` 运行相关验证命令，记录 fresh evidence。
- [ ] 如果验证能力不足，记录 recommended capability 和替代路径。

### 阶段 5 - 收尾与交接

状态：`pending`

- [ ] 清理低风险临时工件、陈旧 TODO、重复规则和过期状态。
- [ ] 更新 `progress.md` 和 `findings.md` 的最终证据与残余风险。
- [ ] 确认下一次会话能从仓库工件恢复。

## 关键问题

1. [待回答问题]
2. [待回答问题]

## 已做决策

| 决策 | 理由 | 证据 / 来源 |
| --- | --- | --- |
|  |  |  |

## 遇到的错误

| 错误 | 尝试次数 | 解决方案 | 状态 |
| --- | --- | --- | --- |
|  | 1 |  |  |

## 阻塞项

- [当前阻塞项或 `none`]

## 下一步

- [最高优先级的 1-3 个动作]

## 备注

- 只允许一个阶段处于 `in_progress`。
- `范围合同` 是 WIP=1 的事实来源；不要只把 active slice 和 non-goals 写在聊天里。
- 重大决策和 rejected options 放入 `findings.md`，不要堆进本文件。
- 执行历史和命令结果放入 `progress.md`。
