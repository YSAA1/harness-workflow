# Harness Workflow

`harness-workflow` 是本地 Codex plugin，把 Learn Harness Engineering 的稳定方法落成一组独立 workflow skills。它的重点不是固定线性流程，而是让 agent 工作具备项目入口、清晰边界、验证闸门、恢复路径和知识收尾纪律。

## Canonical Skill Set

暴露的 active skills 只有 8 个：

- `harness-builder`：设计或修复项目级 harness 和 recovery surface。历史说法 "bootstrap" 只作为触发词或别名。
- `brainstorm`：把不清楚的需求收敛成独立 **Spec**。
- `plan`：把已批准 Spec 或明确请求写成 **Executable Plan**。
- `implement`：按 WIP=1 推进 scoped change，并按风险做 RED -> GREEN -> REFACTOR。
- `diagnose`：复现失败、验证 hypothesis、命名 root cause、做最小修复。
- `review`：检查正确性、范围、设计风险、缺失测试和 Spec/plan 不一致。
- `verify`：为具体 ready claim 收集 fresh evidence。
- `cleanup`：做 **Knowledge Cleanup**，对齐 README、AGENTS.md、docs、生成物和 recovery surface。

`state-contract`、`resume`、`save-session` 不再作为暴露 skill。它们的有用思想已经迁入 Harness Builder recovery policy 和 Cleanup handoff hygiene。

## Workflow Map

- 需求不清：`brainstorm` -> Spec。
- Spec 已批准或请求足够明确：`plan` -> Executable Plan。
- 项目入口、验证命令、Capability Discovery 或 recovery surface 不清：`harness-builder`。
- 可以动手：`implement`。
- 失败根因不清：`diagnose`。
- 改动稳定但未宣布 ready：`review`。
- 需要证明 ready：`verify`。
- 收尾、防文档腐化、同步生成物：`cleanup`。

这些 skill 是条件路由，不是强制全局顺序。简单任务可以直接实现并验证；非平凡任务再选择合适的 recovery surface。

## Recovery Surface

Recovery surface 是让未来 agent 不依赖聊天记录也能恢复工作的项目工件。Three-file backend 仍然保留，但只是一个选项：

- `none`：简单一次性任务。
- `lightweight`：只需要范围和关键证据。
- `three-file`：多步、高风险、跨会话或多 agent 工作，使用 `task_plan.md` / `progress.md` / `findings.md`。
- `feature-list`：多个产品 feature 独立推进。
- `existing`：复用项目已有 issue、roadmap、PROJECT.md 或内部任务系统。

其他 skills 读取的是 selected recovery surface 中的语义字段：`active_slice`、`non_goals`、`success_criteria`、`verification_path`、`evidence_log`、`decisions`、`risks`、`blockers`、`next_actions`。不要把这些语义强绑到某三个文件。

## Capability Discovery

Harness Builder 先判断当前任务需要什么能力，再做 discovery：

- skill 能力：调用 `$find-skills` 搜索强相关可复用 skills，不把当前已安装目录当成边界。
- MCP、hooks、外部 agent 能力：用 targeted web search 查官方文档、成熟实现或任务相关方案。
- 只有当能力对验证、可观测性、自动化或领域能力明显有价值时，才进入 `Required` 或 `Recommended`。
- 不确定或只是可能有用的能力记录为 `Deferred`，不安装。

## Method Contract

| Contract | Meaning | Primary skills |
| --- | --- | --- |
| C1 Harness as system | agent performance comes from surrounding systems, not prompts alone | `harness-builder`, `diagnose` |
| C2 Repository as truth | repository artifacts and recovery surface are the durable truth | all skills |
| C3 Thin instruction surface | `AGENTS.md` stays a thin rule entry | `harness-builder`, `cleanup` |
| C4 Workbench before implementation | project map, verification entry and recovery path must be clear when needed | `harness-builder` |
| C5 Scoped work | work is bounded by Spec, Executable Plan and WIP=1 | `brainstorm`, `plan`, `implement` |
| C6 Fresh evidence | ready claims require current evidence | `review`, `verify`, `diagnose` |
| C7 Capability fit | add skills, MCP, hooks or subagents only when value beats risk | `harness-builder`, `verify` |
| C8 Artifact freshness | docs, commands and generated files must match code | `review`, `cleanup` |
| C9 Knowledge Cleanup | close work by reducing drift and entropy | `cleanup` |
| C10 Backend decoupling | recovery surface is semantic; three-file is optional | `harness-builder`, all skills |

## Verification

默认验证命令：

```bash
node scripts/check-plugin.mjs
```

修改 skill graph、`SKILL.md` 结构或 flow 生成逻辑后运行：

```bash
node scripts/generate-skill-flow-html.mjs
node scripts/check-plugin.mjs
```

`docs/skill-flow-review/*.html` 是生成物，不要手改。

## Repository Map

- `.codex-plugin/plugin.json`：plugin metadata 和 default prompts。
- `skills/*/SKILL.md`：active workflow skill 入口。
- `skills/*/references/`：按需读取的 policy 和 checklist。
- `skills/plan/templates/`：three-file backend 模板，只有选中该 backend 时使用。
- `docs/harness-method-contract.md`：C1-C10 方法契约。
- `docs/skill-flow-review/`：由生成脚本创建的 skill flow HTML。
- `scripts/check-plugin.mjs`：插件结构和术语一致性检查。
- `scripts/generate-skill-flow-html.mjs`：重新生成 skill flow HTML。
