# Project Workbench Report

> 用法：不要默认把本模板保存成独立长期文件。将“结论 / 五子系统检查 / 初始化动作 / 推荐能力”折叠写入 `progress.md` 的 bootstrap entry；把未解决 gap、风险和能力缺口写入 `findings.md`。

## 输入

- Spec / plan 来源：
- 当前 active slice：
- 目标项目：
- 项目地图位置：`docs/project-map.md` 或既有地图文件
- Git root：
- 当前分支 / 最近提交：
- Dependency setup：
- Project MCP config：

## 五子系统检查

| 子系统 | 状态 | 证据 | 缺口 |
| --- | --- | --- | --- |
| 指令 | pass/warn/fail |  |  |
| 工具 / 环境 | pass/warn/fail |  |  |
| 状态 | pass/warn/fail |  |  |
| 验证 / 反馈 | pass/warn/fail |  |  |
| 生命周期 / 范围 / Git | pass/warn/fail |  |  |

## Git readiness

- Repo root: `git rev-parse --show-toplevel` -> [path / not a repo]
- Dirty state: [clean / related / unrelated / generated / unknown]
- Baseline checkpoint: [exists / created / missing / blocked]
- Commit rule: [每个 plan 阶段验证成功后提交；未验证不提交]
- Branch / worktree rule: [current branch ok / recommend feature branch / recommend `.worktrees/<feature>`]
- Git actions: [none / git init / .gitignore / baseline commit / feature branch / worktree]

## Dependency / MCP readiness

- Dependency command: [command -> pass/fail/blocked]
- Baseline command: [command -> pass/fail/blocked]
- Required capabilities: [configured / blocked / none]
- Project MCP config: [path / none / blocked]
- New Codex session needed: [yes/no]

## 初始化动作

- [ ] 薄 `AGENTS.md`
- [ ] 项目地图
- [ ] 三文件或等价状态入口
- [ ] 验证命令
- [ ] smoke / E2E 候选
- [ ] Git 初始化 / baseline checkpoint / 阶段提交规则（如适用）
- [ ] 依赖安装 / setup
- [ ] Required MCP / capability 项目级配置

## Capabilities

| 能力 | required/recommended | 状态 | 价值 | 启用方式 | 风险 | 替代路径 |
| --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |  |

## 结论

- Ready: yes/no
- Blockers:
- Next:
