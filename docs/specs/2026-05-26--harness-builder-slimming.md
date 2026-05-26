# Harness Builder 瘦身与资产降噪 Spec

> Status: user-approved
> Owner: user / agent
> Date: 2026-05-26
> Source request: 用户希望优化当前 workflow，重点深度分析 `harness-builder` 主 skill、references、templates、scripts 等附带资产是否过度设计，并在保留核心思想可落地的前提下降低噪音。

## Background

当前 `harness-workflow` 的主流程大体成立，核心 lane 包括 `brainstorm`、`plan`、`harness-builder`、`implement`、`diagnose`、`review`、`verify`、`cleanup`，并通过 Codex、Claude Code、Cursor 三套表面分发。

问题集中在 `harness-builder`：

- `skills/harness-builder/SKILL.md` 已经接近 300 行，入口 skill 偏重。
- `skills/harness-builder/` 下包含大量 references、templates、scripts、schemas、evals。
- 现有验证主要证明文件存在、镜像同步、关键词保留，但不能充分证明每个 reference/template/script 会被正确读取、触发或使用。
- 一些内容可能属于 AI 已经能自行处理的通用常识、理念重复、低频场景或历史保留资产，继续放在核心 skill 包里会增加噪音。

本 Spec 的目标不是大砍功能，而是按实际价值重新审计 `harness-builder`：保留能支撑用户 harness engineering 思路落地的核心能力，删除、合并、降级或归档不必要噪音。

## Goals

- 保持现有主要 workflow 路由和方法论不受影响。
- 保留 `harness-builder` 的核心实践能力：
  - 项目入口与 project map；
  - selected recovery surface；
  - verification entry 与 fresh evidence；
  - Capability Discovery；
  - anti-entropy；
  - Research Route；
  - hooks / MCP / subagents / project-local skills 的按需决策。
- 将 `harness-builder/SKILL.md` 收敛成更像 controller 的入口文件，只保留触发条件、硬门禁、执行骨架、输出契约和关键路由。
- 对 references、templates、scripts、schemas、evals 做资产审计，给出 `keep / merge / downgrade / archive / delete` 分类。
- 降低 agent 运行时噪音：减少重复解释、低价值模板、无 owner gate 的资产、AI 常识型规则。
- 增加最小的资产 ownership / reachability 验证，防止未来继续堆积“存在但不会被用”的文件。

## Non-goals

- 不重写整个 `harness-workflow` 工作流。
- 不新增第九条 public workflow lane。
- 不取消 `harness-builder` 作为重点 skill 的定位。
- 不移除用户的核心 harness engineering 思想。
- 不为了行数好看而删除功能。
- 不默认改用户级配置、hooks、MCP 或外部 marketplace。
- 不把所有 reference/template 强行合并成一个巨大文件。
- 本 Spec 不直接修改 skill 正文或删除资产；后续实现需另走 `plan`。

## Users / Callers

- Codex 使用者：通过插件和 skill routing 调用 `harness-builder`。
- Claude Code 使用者：通过对应插件表面使用同一套 workflow 语义。
- Cursor 使用者：通过 project rules 和 `.cursor/skills/` 预览面使用。
- 维护者：需要判断哪些资产是核心能力，哪些只是历史噪音。

## Behavior Spec

### Happy Path

- 用户或维护者发起 `harness-builder` 瘦身工作。
- agent 先读取当前 root canonical skill、packaged plugin skill、Cursor preview skill 和验证脚本。
- agent 建立资产审计表，对每个 `harness-builder` 附属资产判断：
  - 它服务哪个 gate 或 coverage row；
  - 它是否必须在核心 skill 包中存在；
  - 它是否可以被 AI 常识、短 policy、已有 docs 或 pack 替代；
  - 它是否有明确触发场景；
  - 它是否有验证或生成路径。
- agent 输出候选分类：
  - `keep`: 核心能力依赖，保留。
  - `merge`: 内容有用但过碎，合并到更少的 policy 或 README。
  - `downgrade`: 从核心路径降级为 docs、示例、pack 内部参考或非必读材料。
  - `archive`: 低频但可能有历史价值，移出核心加载路径。
  - `delete`: 无明确 owner、重复、AI 常识型、无验证价值或已被其他文件覆盖。
- 后续实现时先瘦主 skill，再处理资产层，再更新验证脚本和三端镜像。

### Edge Cases

- 如果某个资产低频但支撑重要能力，例如 Research Route 或 subagent policy，不因低频直接删除；优先降级或放到明确按需路径。
- 如果某个模板暂时没有脚本消费，但表达的是核心输出契约，需要先判断能否合并或补 owner，而不是直接删除。
- 如果删除会让 Codex / Claude / Cursor 三端行为不一致，必须阻止并改为同步修改。
- 如果某个文件只是为了防止历史回退而存在，优先把约束转成 `check-plugin.mjs` 或更小的 regression check，而不是保留长文档。
- 如果无法证明资产无用，默认先标为 `archive` 或 `downgrade`，不冒险删除核心能力。

### Interfaces / State

主要涉及：

- `skills/harness-builder/SKILL.md`
- `skills/harness-builder/references/**`
- `skills/harness-builder/templates/**`
- `skills/harness-builder/scripts/**`
- `skills/harness-builder/schemas/**`
- `skills/harness-builder/evals/**`
- `plugins/harness-workflow/skills/harness-builder/**`
- `.cursor/skills/harness-builder/**`
- `scripts/check-plugin.mjs`
- `scripts/check-cursor-install.mjs`
- `scripts/check-claude-code-install.mjs`
- `docs/skill-flow-review/**`

可能新增或更新：

- 资产审计表或 routing manifest，例如 `skills/harness-builder/references/asset-routing.md`。
- 资产 ownership / reachability 校验逻辑。

## Constraints

- 主要流程必须保留，不能因为瘦身破坏用户当前使用方式。
- 三端表面必须保持一致：root canonical、`plugins/harness-workflow/`、`.cursor/skills/`。
- 删除、归档、降级必须有理由和替代路径。
- `AGENTS.md` 仍保持薄入口，不塞一次性任务状态。
- 验证必须基于 fresh evidence，不用聊天记忆证明当前工作树。
- 当前 repo 没有通用 `npm test`；不能虚构测试命令。
- 大改前必须先有明确计划和可回滚的 commit unit。

## Chosen Approach

选择 **保能力、减噪音的分层瘦身**：

1. 先把 `harness-builder/SKILL.md` 重新定位为 controller。
2. 再对资产层做逐项审计，按 `keep / merge / downgrade / archive / delete` 分类。
3. 把保留资产绑定到明确 gate、coverage row、read_when 和验证路径。
4. 把无法绑定但有历史价值的内容降级或归档。
5. 把明显重复、AI 常识型、无 owner gate 的内容删除。
6. 用最小 validator 防止后续资产继续失控。

这个方案保留 `harness-builder` 的方法论和能力，同时把过度设计从核心路径移开。

## Rejected Options

- 全量保留，只增加 asset routing：  
  能改善可达性证明，但不能解决噪音和过度设计问题。

- 激进大删，只保留一个短 `SKILL.md`：  
  能降行数，但风险是把 Research Route、Capability Discovery、recovery surface、anti-entropy 等核心能力隐性砍掉。

- 把所有 reference 合并成一个大 policy：  
  文件数会减少，但按需读取能力变差，主 skill 也更难维护。

- 把 `harness-builder` 拆成多个 public skills：  
  会增加路由复杂度，违背当前“harness-builder 是重点 skill”的设计方向。

## Verification Strategy

### Baseline Evidence

后续实现前必须重新收集：

- `git status --short`
- `git rev-parse HEAD origin/master`
- `wc -l skills/harness-builder/SKILL.md`
- `find skills/harness-builder -type f | wc -l`
- 当前 `skills/harness-builder/` 文件清单
- 当前三端同步状态

### Automated Checks

实现后至少运行：

```bash
node scripts/check-plugin.mjs
node scripts/check-claude-code-install.mjs
node scripts/check-cursor-install.mjs
node scripts/install-cursor.mjs --target . --dry-run
```

如果修改了 skill-flow 生成逻辑或 `SKILL.md` 结构，还要运行：

```bash
node scripts/generate-skill-flow-html.mjs
node scripts/check-plugin.mjs
```

如果修改 `harness-builder/scripts/**`，还要运行对应 Python helper 的最小校验，例如：

```bash
python skills/harness-builder/scripts/scan_project.py
python scripts/validate_harness.py
```

其中第二条命令需在 `skills/harness-builder/` 目录下运行，或在实现计划中明确 cwd。

### Smoke / E2E Checks

- 抽查 `docs/skill-flow-review/harness-builder.html` 能反映瘦身后的真实入口结构。
- 用一个 read-only prompt 场景检查新 `harness-builder` 是否仍会输出：
  - evidence；
  - Harness Charter；
  - Coverage Matrix；
  - Capability Discovery；
  - User Checkpoint；
  - Verification Design。
- 用一个“只需要轻量 harness”的场景检查它不会默认安装重资产。

### Negative / Boundary Checks

- 删除或降级资产后，`check-plugin.mjs` 不应只靠关键词误判通过。
- 没有 owner gate 的新增 reference/template/script 应被 validator 报出。
- `harness-builder` 不应把 vague product requirement 静默变成 harness 计划。
- `harness-builder` 不应绕过 user checkpoint 写文件。
- Research Route、Capability Discovery、recovery surface 的核心能力不应丢失。

### Documentation / State Checks

- README、`docs/skill-routing.md`、`docs/harness-method-contract.md` 如涉及语义变化，必须同步。
- `AGENTS.md` 只有稳定项目规则，不写本次临时审计状态。
- 若新增资产 routing 文档，它应作为维护规则，而不是一次性任务记录。

### Fresh Evidence Required Before Completion

最终 ready 前必须有：

- 三端验证命令的最新输出。
- `git status --short` 证明只剩预期改动。
- 资产审计分类结果。
- 删除 / 合并 / 降级 / 归档清单及替代路径。
- 对核心能力未丢失的抽查证据。

## Capability Gaps

- 现有验证缺少资产 ownership / reachability 检查。
- 现有检查偏关键词和文件存在，无法证明某个 reference/template/script 会被正确使用。
- 需要新增或改造一个轻量 validator：
  - 检查每个核心资产是否有 owner gate；
  - 检查每个模板是否绑定 coverage row 或 pack component；
  - 检查每个 helper script 是否有调用路径、文档入口或验证入口；
  - 对 archive/delete 候选提供清单，而不是静默忽略。

Fallback：

- 如果暂时不实现 validator，至少在 PR 中提交人工资产审计表，并把后续 validator 作为明确 follow-up。

## Success Criteria

- 主要 workflow 路由和用户思想实践能力不受影响。
- `harness-builder` 仍能支持：
  - project harness 设计；
  - recovery surface 选择；
  - verification path 设计；
  - Capability Discovery；
  - Research Route；
  - anti-entropy；
  - hooks / MCP / subagents / skills 的按需判断。
- 主 `SKILL.md` 噪音减少，入口更短、更像 controller。
- reference/template/script 数量和内容更聚焦，没有明显“AI 已经懂但硬塞成文件”的资产。
- 每个保留资产都有明确 owner、触发场景或验证价值。
- 删除、合并、降级、归档不会造成隐性功能丢失；每项都有理由和替代路径。
- 三端结构验证通过。
- 新增或更新的检查能防止无主资产继续堆积。

## Residual Risks

- 过度瘦身可能让低频但重要的能力变得不易发现。缓解：低频重要能力优先降级或归档，不直接删除。
- 资产 ownership validator 可能变成新的维护负担。缓解：只检查最小字段，不做复杂工作流引擎。
- 主 skill 缩短后，模型可能漏掉某些细节。缓解：保留硬门禁和明确 read_when 路由。
- 三端镜像同步容易漏。缓解：继续依赖 recursive parity checks。

## Plan Handoff

- Active slice: 设计并实施 `harness-builder` 瘦身审计，先主 skill，后资产层，最后验证脚本。
- Suggested next skill: plan
- Planning notes:
  - 先锁定当前资产清单和分类标准。
  - 再改 `SKILL.md`，避免先删资产导致语义断裂。
  - 资产处理要小批次提交，方便回滚。
  - 最后更新 root / packaged / Cursor preview 三端表面。
- Suggested milestones:
  - Milestone 1: 建立资产审计表和分类规则。
  - Milestone 2: 瘦身 `harness-builder/SKILL.md`。
  - Milestone 3: 合并、降级、归档或删除冗余 references/templates/scripts。
  - Milestone 4: 增加或更新资产 ownership / reachability 检查。
  - Milestone 5: 同步三端表面并跑完整验证。
- Per-milestone acceptance hints:
  - M1: 每个资产都有初步分类和理由。
  - M2: 主 skill 保留硬门禁、执行骨架和输出契约。
  - M3: 每个删改资产都有替代路径或删除理由。
  - M4: validator 能发现无 owner 的新增资产。
  - M5: 现有三端检查和新增检查通过。
