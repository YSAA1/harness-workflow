# AGENTS.md

## 项目概览

本项目是 `harness-workflow` agent workflow skills 仓库，把 Learn Harness Engineering 的方法落成一组可执行 workflow skills；安装面以 skills.sh 为主（一条命令多端可选：选择目标 agent 与要装的技能），Claude Code 另有托管插件路径，未列入 skills.sh 的 CLI 手动拷贝。核心目标是让 agent 工作具备项目入口、状态协议、验证闸门、恢复路径和收尾纪律。

## 项目地图

- `.claude-plugin/`: Claude Code plugin manifest 和 marketplace catalog（source 指向仓库根）。
- `.harness/`: 运行时 recovery 三文件（work_index、state、lessons）。
- `README.md` / `README.zh-CN.md`: 用户入口，说明安装（skills.sh 多端可选）、workflow 分层、使用场景和验证命令。
- `CONTEXT.md`: 术语和边界澄清。
- `docs/harness-method-contract.md`: Harness Method Contract，解释 C1-C10 稳定方法论。
- `docs/install.md`: 统一安装指南（skills.sh、Claude Code 插件路径、Grok/ZCode/Kimi 手动拷贝）。
- `docs/specs/`: `brainstorm` 默认 Spec 产物目录，允许多份独立 Spec（目录按需重建）。
- `docs/plans/`: `plan` 默认 Executable Plan 产物目录，允许多份独立计划和恢复记录（目录按需重建）。
- `docs/adr/`: 架构决策记录。
- `.github/workflows/ci.yml`: GitHub Actions，运行结构检查、README 资产检查、Claude 插件可选校验与 harness-builder 脚本测试。
- `scripts/check-plugin.mjs`: 仓库结构与安装面一致性的快速验证脚本。
- `scripts/agent/check.sh`: agent-facing 快速验证入口，串联默认结构检查。
- `skills/*/SKILL.md`: 每个 active workflow skill 的主入口和执行协议。
- `skills/*/references/`: 按需读取的细节政策、检查表和参考资料。
- `skills/*/templates/`: skill 使用或 backend 生成时复用的模板。

## 快速开始

- 快速验证：`node scripts/check-plugin.mjs`
- Agent 快速验证：`bash scripts/agent/check.sh`
- Skill 脚本测试：`python3 -B skills/harness-builder/tests/test_scripts.py`
- 当前没有 package install 或测试框架配置；不要虚构 `npm test`、`npm install` 或不存在的 agent 脚本。

## 项目铁律

- 这是 skills 仓库；安装面以 skills.sh 为主、Claude Code 插件为辅；所有改动必须保持 `README.md`（含 zh-CN）、`docs/install.md`、`.claude-plugin/`、`docs/harness-method-contract.md` 和 `skills/*/SKILL.md` 之间语义一致。
- Active workflow skills 只有 `harness-builder`、`brainstorm`、`plan`、`implement`、`diagnose`、`review`、`ship`、`cleanup`、`autoresearch`；`verify` 只是 `review` 的历史触发词别名，不再是独立 skill；`autoresearch` 是研究循环编排总控（同 `ship` 只编排底层阶段，自带轮次授权档位与预算规则，研究日志为保留交付物）；`find-skills`、`capability-recommender`、`writing-for-agents` 是辅助 skill，不是额外 workflow lane；`tdd` 是被 `implement` 驱动的纪律 skill；`remove-deadcode-py` 是按需全仓 Python 死代码清理的工具 skill，`sweep` 是按需全仓对账的工具 skill，均由 `cleanup` 路由或显式触发，不做任务收尾。
- `AGENTS.md` 只做薄入口（T1）；临时计划、会话摘要、active slice 和当前任务 plan/Spec 路径不要写进这里。
- 本插件仓库使用 `.harness/`；生成到目标项目时按所选 backend 复用恢复入口，不强制迁移已有系统。
- `harness-builder` 是 canonical 项目 harness skill；"bootstrap" 只能作为历史别名或触发词出现。
- 每个 `SKILL.md` 必须保留 YAML frontmatter，并让 `name` 与目录名匹配。
- 没有 fresh verification，不声明插件结构、流程图或方法论覆盖已经可用。
- 关键里程碑必须使用 Git commit，commit 信息使用中文，清晰简洁。

## 恢复面（Recovery surface）

Selected recovery surface: `harness`（`.harness/` = work_index + state + lessons 三文件）

会话入口 — 按顺序读取：

1. 本文件（`AGENTS.md`）— T1 durable rules only
2. `.harness/lessons.md` — 项目已踩过的坑与非显然经验，动手前先读
3. `.harness/work_index.md` → 打开 `active` 行的 primary artifact
4. `.harness/state.md`

不要在 `AGENTS.md` 里写当前任务名或某个 plan/Spec 路径。新任务由 `plan` 建立最小恢复面并只更新 Work Index；已有恢复面项目里 `brainstorm` 自第一轮 frontier 起可预登记本轨道行，Spec 落盘即指向 Spec（细节见其 SKILL.md）。
按阶段变化、关键决定和交接更新恢复面，只修当前任务相关记录；实际证据放 state 的 Evidence 行、链接工件或 git。
架构级不可逆决策走 `docs/adr/`（brainstorm 会提议）；过程与环境坑记入 lessons，失效即删。

写侧纪律：

- 翻行即退休：谁把 work_index 行翻出 active（complete/abandoned/blocked/换轨），谁在同一 commit 内走完四步——翻行 → lessons 继承 → 删本轨道 plan/Spec 文档，含未批准与放弃件（git 历史即归档）→ state 同步翻转 Status。
- 删文档前置＝改动已 commit 进主树且 lessons 继承完成；只删唯一入边来自本退休轨道的文档，多入边翻指针不删；ADR 不删，补 superseded-by。
- 文档活判据＝可达性：活 ⟺ 被 `.harness/` 状态文件出链或持久入口（AGENTS.md、根 README）引用；不可达即孤儿。
- `node scripts/check-plugin.mjs` 的恢复面一致性检查是闸门，状态矛盾或 plans/specs 孤儿即红。

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
- 修改 recovery surface 语义：读 `skills/writing-for-agents/SKILL.md` 与 `skills/writing-for-agents/references/recovery_surface_policy.md`。
- 修改验证、ready 或 evidence 规则：读 `skills/review/SKILL.md` 和 `docs/harness-method-contract.md`。
- 修改安装面、manifest 或能力声明：同步检查 `.claude-plugin/`、`README.md`/`README.zh-CN.md`、`docs/install.md` 和 `scripts/check-plugin.mjs`。

## Protected Paths

- `.claude-plugin/plugin.json` 与 `marketplace.json`: 改 name、source 或 version 前必须确认影响面并跑验证。
- 用户级配置、全局 skills、MCP、hooks、外部 plugin marketplace：只有用户明确要求时才能修改。

## 验证

默认验证命令：

```bash
node scripts/check-plugin.mjs
```

在 Windows PowerShell 中运行命令时，若用户 profile 因 execution policy 报错但目标命令成功，要把 profile 报错作为环境噪声说明，不把它当成项目验证失败。

## Definition of Done

- 改动范围能对应用户请求或当前 active slice（见 `.harness/state.md`）。
- 相关文档、manifest、脚本和生成物保持一致。
- 已运行最窄有意义验证，或明确说明无法验证的原因。
- `git status` 已检查，未混入无关改动。
- 关键里程碑已提交中文 commit。
