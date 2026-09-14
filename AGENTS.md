# AGENTS.md

## 项目概览

本项目是 `harness-workflow` agent workflow plugin，把 Learn Harness Engineering 的方法落成一组可执行 workflow skills，并提供 Codex、Claude Code 和 Cursor 三套适配面。核心目标是让 agent 工作具备项目入口、状态协议、验证闸门、恢复路径和收尾纪律。

## 项目地图

- `.codex-plugin/plugin.json`: Codex plugin manifest，声明插件元数据和 skills 入口。
- `.agents/plugins/marketplace.json`: Codex marketplace catalog。
- `.claude-plugin/`: Claude Code plugin manifest 和 marketplace catalog。
- `.cursor-plugin/`: Cursor plugin metadata。
- `.cursor/rules/`: Cursor project-preview rules。
- `.cursor/skills/`: Cursor project-preview skills，必须和根目录 `skills/` 保持一致。
- `.harness/`: 运行时 recovery（Recovery Policy、Work Index、state、progress、decisions）。
- `rules/`: Cursor project rules 原始编辑面，由 adapter 同步到 `.cursor/rules/`。
- `README.md`: 用户入口，说明 workflow 分层、使用场景和验证命令。
- `CONTEXT.md`: 术语和边界澄清。
- `docs/harness-method-contract.md`: Harness Method Contract，解释 C1-C10 稳定方法论。
- `docs/install/`: Codex、Claude Code、Cursor 安装和识别说明。
- `docs/specs/`: `brainstorm` 默认 Spec 产物目录，允许多份独立 Spec。
- `docs/plans/`: `plan` 默认 Executable Plan 产物目录，允许多份独立计划和恢复记录。
- `docs/prd/`: 历史 PRD / 旧本地需求文档；不要作为新 Spec 或 Plan 的默认写入面。
- `docs/adr/`: 架构决策记录。
- `docs/tutorials/`: 使用教程和指南。
- `docs/integrations/`: 可选外部工作流集成说明（如 SkillOpt）。
- `.github/workflows/ci.yml`: GitHub Actions，运行三端安装/结构检查和 Cursor dry-run。
- `scripts/check-plugin.mjs`: 插件结构和方法论覆盖的快速验证脚本。
- `scripts/check-claude-code-install.mjs`: Claude Code 安装面验证脚本。
- `scripts/check-cursor-install.mjs`: Cursor rules、skills 和 adapter 验证脚本。
- `scripts/install-cursor.mjs`: 将 rules 和 skills 复制到目标项目 `.cursor/` 的 project adapter。
- `scripts/agent/check.sh`: agent-facing 快速验证入口，串联默认结构检查。
- `skills/*/SKILL.md`: 每个 active workflow skill 的主入口和执行协议。
- `skills/*/references/`: 按需读取的细节政策、检查表和参考资料。
- `skills/*/templates/`: skill 使用或 backend 生成时复用的模板。

## 快速开始

- 快速验证：`node scripts/check-plugin.mjs`
- Agent 快速验证：`bash scripts/agent/check.sh`
- 三端结构验证：`node scripts/check-plugin.mjs && node scripts/check-claude-code-install.mjs && node scripts/check-cursor-install.mjs`
- Cursor adapter dry-run：`node scripts/install-cursor.mjs --target . --dry-run`
- 当前没有 package install 或测试框架配置；不要虚构 `npm test`、`npm install` 或不存在的 agent 脚本。

## 项目铁律

- 这是 plugin 仓库；所有改动必须保持 `.codex-plugin/plugin.json`、`README.md`、`docs/harness-method-contract.md` 和 `skills/*/SKILL.md` 之间语义一致。
- Active workflow skills 只有 `harness-builder`、`brainstorm`、`plan`、`implement`、`diagnose`、`review`、`ship`、`cleanup`；`verify` 只是 `review` 的历史触发词别名，不再是独立 skill；`find-skills`、`capability-recommender`、`agent-instructions-maintainer`、`recovery-surface-builder` 是辅助 skill，不是额外 workflow lane。
- `AGENTS.md` 只做薄入口（T1）；临时计划、会话摘要、active slice 和当前任务 plan/Spec 路径不要写进这里。
- 本插件仓库使用 `.harness/`；生成到目标项目时按所选 backend 复用恢复入口，不强制迁移已有系统。
- `harness-builder` 是 canonical 项目 harness skill；"bootstrap" 只能作为历史别名或触发词出现。
- 每个 `SKILL.md` 必须保留 YAML frontmatter，并让 `name` 与目录名匹配。
- 没有 fresh verification，不声明插件结构、流程图或方法论覆盖已经可用。
- 关键里程碑必须使用 Git commit，commit 信息使用中文，清晰简洁。

## 恢复面（Recovery surface）

Selected recovery surface: `harness`（`.harness/` 目录）

会话入口 — 按顺序读取：

1. 本文件（`AGENTS.md`）— T1 durable rules only
2. `.harness/recovery_policy.md`
3. `.harness/work_index.md` → 打开 `active` 行的 primary artifact
4. `.harness/state.md`

不要在 `AGENTS.md` 里写当前任务名或某个 plan/Spec 路径。新任务只更新 Work Index。

## 真相源优先级（Source-of-truth priority）

| Tier | 内容 |
| --- | --- |
| T1 | `AGENTS.md` — 地图、铁律、验证、本表 |
| T2 | `CONTEXT.md`、`docs/adr/` |
| T3 | `.harness/work_index.md` |
| T4 | 当前 Spec / Plan（`docs/specs/`、`docs/plans/`）、`.harness/state.md` |
| T5 | 命令输出、CI、git log |

事实冲突按来源和适用性核对；新证据只能纠正过期事实，不能覆盖指令权限、用户目标或项目验收合同。

## Required Reading By Task Type

- 修改 skill 行为：先读对应 `skills/<skill>/SKILL.md`，再按需读同目录 `references/`。
- 修改 harness builder：先读 `skills/harness-builder/SKILL.md`（总控 / Helper routing），再按需读 `references/recommendation_matrix_policy.md`、`install_policy.md`、`decision_matrix.md`。
- 修改 recovery surface 语义：读 `skills/recovery-surface-builder/SKILL.md` 与 `skills/recovery-surface-builder/references/recovery_surface_policy.md`。
- 修改验证、ready 或 evidence 规则：读 `skills/review/SKILL.md` 和 `docs/harness-method-contract.md`。
- 修改 manifest 或能力声明：同步检查 `.codex-plugin/`、`.claude-plugin/`、`.cursor-plugin/`、`README.md`、`docs/install/` 和对应 `scripts/check-*.mjs`。

## Protected Paths

- `.codex-plugin/plugin.json`: 改 name、skills path、capabilities 或 prompt 前必须确认影响面并跑验证。
- `docs/skill-flow-review/*.html`: 生成物；不要手改，改生成脚本后重建。
- 用户级配置、全局 skills、MCP、hooks、外部 plugin marketplace：只有用户明确要求时才能修改。

## 验证

默认验证命令：

```bash
node scripts/check-plugin.mjs
node scripts/check-claude-code-install.mjs
node scripts/check-cursor-install.mjs
node scripts/install-cursor.mjs --target . --dry-run
```


在 Windows PowerShell 中运行命令时，若用户 profile 因 execution policy 报错但目标命令成功，要把 profile 报错作为环境噪声说明，不把它当成项目验证失败。

## Definition of Done

- 改动范围能对应用户请求或当前 active slice（见 `.harness/state.md`）。
- 相关文档、manifest、脚本和生成物保持一致。
- 已运行最窄有意义验证，或明确说明无法验证的原因。
- `git status` 已检查，未混入无关改动。
- 关键里程碑已提交中文 commit。
