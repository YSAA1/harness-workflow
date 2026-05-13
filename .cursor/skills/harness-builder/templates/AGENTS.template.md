# AGENTS.md

## 项目概览

[用 1-3 句话说明项目类型、运行环境和主要目标]

## 项目地图

- `src/`: 源代码
- `tests/`: 测试
- `docs/`: 项目文档
- `scripts/agent/`: agent-facing 验证与启动脚本
- `.harness/`: harness 状态、决策、manifest、progress、handoff
- `.agents/skills/`: 项目级可复用 skills
- `.codex/`: Codex 专属配置、hooks、subagents

## 快速开始

- 安装：[待确认]
- 测试：[待确认]
- 快速验证：`bash scripts/agent/check.sh`

## 项目铁律

- 仓库是真相来源；聊天不是唯一恢复面。
- 保持 `AGENTS.md` 薄入口；临时状态写入 workflow state backend。
- 先诊断 harness 层：任务、上下文、工具、状态、验证、生命周期。
- WIP=1：一个 active slice verified 或 blocked 前，不开无关工作。
- 没有 fresh evidence，不声明 ready/done。
- 文档随行为、命令、配置和验证路径变化同步。
- 收尾要降低熵，不留下误导状态。

## Workflow state

本项目使用当前声明的 workflow state backend。默认 rigorous backend 是三文件：

- `task_plan.md`: active slice、non-goals、success criteria、verification path
- `progress.md`: append-only evidence log
- `findings.md`: accepted spec、decisions、risks、root causes、rejected options

如 `.harness/manifest.yaml` 或 `.harness/state.md` 声明其他 backend，按该 backend 读取和写入状态。

## Harness map

- `AGENTS.md`: 项目入口、项目地图、项目铁律
- `scripts/agent/check.sh`: 快速验证入口
- `docs/agent/`: 项目上下文、workflow、verification、risk docs
- `.harness/`: manifest、decisions、state、progress、handoff
- `.agents/skills/`: 项目级高频流程

## 验证

运行：

```bash
bash scripts/agent/check.sh
```

未运行或失败时，不要声称成功。

## 完成标准

- 改动符合 active slice / 用户请求。
- 相关验证已运行或失败已诚实记录。
- workflow state 已更新。
- 残余风险明确。
