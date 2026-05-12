# AGENTS.md

## 项目概览

本项目是 `harness-workflow` 本地 Codex plugin，把 Learn Harness Engineering 的方法落成一组可执行 workflow skills。核心目标是让 agent 工作具备项目入口、状态协议、验证闸门、恢复路径和收尾纪律。

## 项目地图

- `.codex-plugin/plugin.json`: plugin manifest，声明插件元数据和 skills 入口。
- `README.md`: 用户入口，说明 workflow 分层、使用场景和验证命令。
- `docs/harness-method-contract.md`: Harness Method Contract，解释 C1-C10 稳定方法论。
- `docs/skill-flow-review/`: 由脚本生成的 skill 流程审阅 HTML。
- `scripts/check-plugin.mjs`: 插件结构和方法论覆盖的快速验证脚本。
- `scripts/generate-skill-flow-html.mjs`: 从各个 `SKILL.md` 生成流程审阅 HTML。
- `skills/*/SKILL.md`: 每个 workflow skill 的主入口和执行协议。
- `skills/*/references/`: 按需读取的细节政策、检查表和参考资料。
- `skills/*/templates/`: skill 使用或 bootstrap 生成时复用的模板。
- `skills/bootstrap/references/legacy-bootstrap/`: 旧版 bootstrap 的历史参考，不是当前主路径。

## 快速开始

- 快速验证：`node scripts/check-plugin.mjs`
- 重新生成 skill flow HTML：`node scripts/generate-skill-flow-html.mjs`
- 当前没有安装步骤或测试框架配置；不要虚构 `npm test`、`npm install` 或不存在的 agent 脚本。

## 项目铁律

- 这是 plugin 仓库；所有改动必须保持 `.codex-plugin/plugin.json`、`README.md`、`docs/harness-method-contract.md` 和 `skills/*/SKILL.md` 之间语义一致。
- `AGENTS.md` 只做薄入口；临时计划、会话摘要、active slice 和一次性结论不要写进这里。
- Workflow skills 依赖 `state-contract` 的字段语义，不要把所有任务强绑死到三文件。
- `bootstrap` 当前代表 harness-builder v3；旧版只在 `skills/bootstrap/references/legacy-bootstrap/` 中作为历史参考。
- 每个 `SKILL.md` 必须保留 YAML frontmatter，并让 `name` 与目录名匹配。
- 不要默认加入 hooks、MCP 配置或用户级配置；此插件默认只声明 `Read` / `Write` 能力。
- 没有 fresh verification，不声明插件结构、流程图或方法论覆盖已经可用。
- 关键里程碑必须使用 Git commit，commit 信息使用中文，清晰简洁。

## Workflow State

本仓库维护自身时，默认使用 lightweight state：简单改动可直接以用户请求和 Git diff 为准；跨多步、跨会话或高风险改动再创建三文件 `task_plan.md` / `progress.md` / `findings.md`。

若当前任务进入 tracked workflow：

- active slice 和 success criteria 写入 `task_plan.md`。
- 命令证据追加到 `progress.md`。
- 设计决策、拒绝方案、风险和 root cause 写入 `findings.md`。

不要在仓库根部并行创建第二套恢复面。

## Required Reading By Task Type

- 修改 skill 行为：先读对应 `skills/<skill>/SKILL.md`，再按需读同目录 `references/`。
- 修改 bootstrap：先读 `skills/bootstrap/SKILL.md`，再读相关 `skills/bootstrap/references/*.md`。
- 修改 state backend 语义：读 `skills/state-contract/SKILL.md` 和 `skills/state-contract/references/`。
- 修改验证、ready 或 evidence 规则：读 `skills/verify/SKILL.md`、`skills/review/SKILL.md` 和 `docs/harness-method-contract.md`。
- 修改生成的 HTML：优先改 `scripts/generate-skill-flow-html.mjs`，再重新生成 `docs/skill-flow-review/*.html`。
- 修改 manifest 或能力声明：同步检查 `.codex-plugin/plugin.json`、`README.md` 和 `scripts/check-plugin.mjs`。

## Protected Paths

- `.codex-plugin/plugin.json`: 改 name、skills path、capabilities 或 prompt 前必须确认影响面并跑验证。
- `skills/bootstrap/references/legacy-bootstrap/`: 历史参考区，除非任务明确要求迁移或修订旧资料，否则不要改。
- `docs/skill-flow-review/*.html`: 生成物；不要手改，改生成脚本后重建。
- 用户级配置、全局 skills、MCP、hooks、外部 plugin marketplace：只有用户明确要求时才能修改。

## 验证

默认验证命令：

```bash
node scripts/check-plugin.mjs
```

如果修改了 skill flow 生成逻辑或任何 `SKILL.md` 的结构，还要运行：

```bash
node scripts/generate-skill-flow-html.mjs
node scripts/check-plugin.mjs
```

在 Windows PowerShell 中运行命令时，若用户 profile 因 execution policy 报错但目标命令成功，要把 profile 报错作为环境噪声说明，不把它当成项目验证失败。

## Definition of Done

- 改动范围能对应用户请求或当前 active slice。
- 相关文档、manifest、脚本和生成物保持一致。
- 已运行最窄有意义验证，或明确说明无法验证的原因。
- `git status` 已检查，未混入无关改动。
- 关键里程碑已提交中文 commit。
