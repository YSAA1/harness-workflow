# 安装指南

## 一条命令：选择 agent、选择技能

用 [skills.sh](https://skills.sh) 安装，交互式选择目标 agent 与要装的技能：

```bash
npx skills@latest add YSAA1/harness-workflow
```

- 支持 20+ agent：Claude Code、Cursor、Codex、GitHub Copilot、Gemini CLI、OpenCode、Goose、Windsurf、Cline、AMP、Roo、Trae、VS Code、Zed 等。
- 可以整组装，也可以只挑需要的技能（例如只装 `review` + `cleanup`）。
- 项目级或用户级安装均可选择。
- 更新：`npx skills update`；不做任何背后的自动变更。
- 卸载：删除对应 agent skills 目录下的技能文件夹。

## Claude Code 插件路径（可选）

Claude Code 也可以走官方 marketplace 托管插件（只读、自动更新）：

```text
/plugin marketplace add YSAA1/harness-workflow
/plugin install harness-workflow@harness-workflow
```

## 未列入 skills.sh 的 CLI（Grok Build / ZCode / Kimi Code）

三者都读取开放 `SKILL.md` 格式，一份共享拷贝服务全部 CLI：

```bash
git clone https://github.com/YSAA1/harness-workflow.git
cd harness-workflow
mkdir -p ~/.agents/skills
for s in harness-builder brainstorm plan implement diagnose review ship cleanup find-skills capability-recommender writing-for-agents tdd remove-deadcode-py sweep; do
  cp -r "skills/$s" ~/.agents/skills/
done
```

| CLI | 用户级目录 | 项目级目录 |
| --- | --- | --- |
| Grok Build | `~/.grok/skills/` 或共享 `~/.agents/skills/` | `.grok/skills/` |
| ZCode | `~/.zcode/skills/` 或共享 `~/.agents/skills/` | — |
| Kimi Code | `~/.kimi/skills/` 或共享 `~/.agents/skills/` | `.kimi/skills/` |

`git pull` 后重新拷贝即更新；删除对应技能目录即卸载。

## 安装后识别验证

1. 问 agent「列出当前可用的 workflow skills」，应出现 8 个车道技能、3 个辅助、1 个纪律 skill（tdd）与 2 个工具 skill（remove-deadcode-py、sweep）。
2. 测试提示语：`Use Harness Workflow to plan a scoped implementation.`
3. 需要跨会话恢复面时，在目标项目里让 `harness-builder` 按需初始化 `.harness/`，不默认创建。

## 技能清单

| 技能 | 用途 |
| --- | --- |
| `harness-builder` | 跨入口、恢复、验证和配置的项目工作台总控 |
| `brainstorm` | 模糊需求收敛为用户批准的 Spec（frontier grill） |
| `plan` | 多阶段任务的可执行计划与恢复入口 |
| `implement` | 范围明确的修改，行为改动在商定 seams 测试驱动 |
| `diagnose` | 根因未知的故障证据化调查 |
| `review` | 审阅与验收证据判定（`verify` 是触发别名） |
| `ship` | implement → review → cleanup 的端到端交付编排 |
| `cleanup` | 任务收尾整理：文档、代码遗留、恢复状态 |
| `find-skills` | 明确技能缺口的定向发现（含第三方技能安全审计） |
| `capability-recommender` | 只读能力选型推荐 |
| `writing-for-agents` | 写并维护 agent 消费的面：skills、持久指令、恢复/状态面 |
| `tdd` | 先红后绿的测试纪律，由 implement 在商定 seams 驱动 |
| `remove-deadcode-py` | 按需全仓 Python 死代码清除（工具检测 + 证据定罪 + 分批原子删除） |
| `sweep` | 按需全仓对账：六档分类盘点 + 证据定罪 + 用户裁决（工具 skill） |
