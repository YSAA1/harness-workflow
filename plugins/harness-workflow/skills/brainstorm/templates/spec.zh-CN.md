# Spec - [标题]

> 状态 / Status: draft | user-approved | superseded
> Owner: [user / agent]
> Date: YYYY-MM-DD
> 来源请求 / Source request: [短链接或对话摘要]

## 背景

[当前有什么问题、谁受影响、为什么现在要解决。]

## 目标

- [实现后必须达到的可观察结果]

## 非目标（Non-goals）

- [本 Spec 明确不做的事情]

## 用户 / 调用者（Users / Callers）

- [谁会使用这个能力，通过什么入口调用]

## 行为规格（Behavior Spec）

### 正常路径（Happy Path）

- [输入 / 动作]
- [期望输出 / 状态变化]

### 边界情况（Edge Cases）

- [错误、空输入、权限、部分成功、迁移、回滚等]

### 接口 / 状态（Interfaces / State）

- [文件、API、命令、UI 面、数据结构、状态文件]

## 约束（Constraints）

- [兼容性、依赖、安全、性能、迁移、时间、用户偏好]

## 选定方案（Chosen Approach）

[选定方案，以及它为什么适合当前切片。]

## 拒绝方案（Rejected Options）

- [方案]：[拒绝原因，尤其是验证成本或范围成本]

## 验证策略（Verification Strategy）

### 基线证据（Baseline Evidence）

- [修改前要检查的现有命令、测试、行为、日志、文档或 fixture]

### 自动检查（Automated Checks）

- [unit / integration / lint / typecheck / build 命令]

### Smoke / E2E 检查

- [用户可见路径、CLI smoke、浏览器流程、人工确认]

### 负向 / 边界检查（Negative / Boundary Checks）

- [失败案例、非法输入、权限边界、降级模式]

### 文档 / 状态检查（Documentation / State Checks）

- [README、AGENTS.md、docs、`.harness/`、issue tracker、项目已有系统、项目地图]

### 完成前所需 fresh evidence

- [声明 ready 前必须重新运行的命令或检查]

## 能力缺口（Capability Gaps）

- [agent 无法独立验证的内容]
- [推荐能力，例如 Playwright MCP、docs/search、issue tracker、真实服务或人工检查]
- [能力未启用时的 fallback]

## 成功标准（Success Criteria）

- [可证伪条件，不写感觉描述]

## 残余风险（Residual Risks）

- [已知剩余不确定性和缓解方式]

## Plan 交接（Plan Handoff）

- 当前切片 / Active slice: [下一步最小可验证实现切片]
- 建议下一 skill / Suggested next skill: plan
- 计划提示 / Planning notes: [阶段提示、依赖顺序、已知 blocker]
- 建议里程碑 / Suggested milestones: [粗粒度阶段建议，帮助 plan 定义阶段划分；简单任务可写 `none`]
- 里程碑验收提示 / Per-milestone acceptance hints: [每个建议里程碑的验收标准提示，不是完整定义，留给 plan 细化；简单任务可写 `none`]
