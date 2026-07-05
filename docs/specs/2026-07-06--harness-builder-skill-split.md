# Harness Builder Skill 拆分与 Research Route 移除 Spec

> Status: user-approved
> Owner: user / agent
> Date: 2026-07-06
> Source request: 用户希望优化 `skills/harness-builder`，把当前过厚的 harness-builder 拆成更清晰的顶层辅助 skill；参考 Anthropic 官方 `claude-code-setup`、`claude-md-management` 和 `planning-with-files` 的优秀设计，同时完全移除内置 Research Route / autoresearch 语义。

## Background

当前 `harness-builder` 承担了过多职责：

- 项目级 workbench 总入口；
- AGENTS / CLAUDE / Cursor rules 维护；
- Capability Recommendation；
- recovery surface 选择、安装和修复；
- verification entry 设计；
- hooks / MCP / subagents / plugins / commands 推荐；
- Research Route / autoresearch 相关 gate、模板和 hooks。

这导致主 skill 像一个小型插件内插件：主入口、references、templates、scripts、schemas、evals 都集中在 `skills/harness-builder/`。用户希望改成中间方案：保留 `harness-builder` 作为唯一 workflow lane，同时新增可直接调用的顶层辅助 skill，降低热路径厚度和职责混杂。

本次讨论已经确定：Research Route / autoresearch / evidence loop / research gate 不再属于 `harness-workflow`。本仓库不应绑定任何外部 autoresearch 插件，也不应保留内置 research runtime 或集成说明。

## Goals

- 保留 `harness-builder` 作为 canonical 项目工作台总入口和 workflow lane。
- 新增三个顶层辅助 skill，但明确它们不是新的 workflow lane：
  - `capability-recommender`
  - `agent-instructions-maintainer`
  - `recovery-surface-builder`
- 将 `capability-recommender` 基于 Anthropic 官方 `claude-automation-recommender` 复制后适配。
- 将 `agent-instructions-maintainer` 基于 Anthropic 官方 `claude-md-improver` 复制后适配。
- 将 `recovery-surface-builder` 从当前最新版 `skills/harness-builder/SKILL.md` 的 recovery surface / install / verification 职责中抽出。
- 在 `recovery-surface-builder` 中吸收 `planning-with-files` 的持久工作记忆思想：
  - context window 是易失 RAM；
  - repo-local 文件是可恢复磁盘；
  - 重要 active work、evidence、decision、failure 和 next action 必须落盘。
- 完全移除 `Research Route`、`autoresearch`、`Evidence Loop`、`Research Reset Policy` 作为内置产品语义。
- 更新 README、CONTEXT、method contract、manifest、验证脚本和 generated skill-flow HTML，使三端表面一致。

## Non-goals

- 不新增第九条 public workflow lane。
- 不把 `capability-recommender` 或 `agent-instructions-maintainer` 重新发明成完全不同的本地版本；它们应优先复制官方 skill 内容，再做最小适配。
- 不把 `planning-with-files` 的 root 级 `task_plan.md`、`findings.md`、`progress.md` 作为本项目默认 backend。
- 不保留 Research Route 的 archive 文档。
- 不绑定 `@Autoresearch-Guard` 或任何 autoresearch 插件。
- 不在本 Spec 阶段实现代码、删除文件或重写 skill。
- 不改用户级配置、全局 skills、MCP、hooks 或外部 plugin marketplace。

## Users / Callers

- 用户直接调用 `harness-builder`，想让项目获得可靠 agent workbench。
- 用户直接调用 `capability-recommender`，只想获得项目适配的 automation / capability 推荐。
- 用户直接调用 `agent-instructions-maintainer`，只想审计或维护 `AGENTS.md`、`CLAUDE.md`、Cursor rules。
- 用户直接调用 `recovery-surface-builder`，只想设计或修复 `.harness/` recovery surface 和 verification entry。
- `harness-builder` 内部可把对应部分路由给这些辅助 skill。
- 维护者需要清楚每个 skill 的 ownership、触发词、文档和验证面。

## Behavior Spec

### Happy Path

- 用户要求优化或拆分 `harness-builder`。
- agent 先读取当前 `skills/harness-builder/SKILL.md` 和相关 references/templates/scripts。
- agent 按职责拆分：
  - `harness-builder` 保留 evidence-first orchestration、Harness Recommendation Plan、USER CHECKPOINT 和 next-skill routing。
  - `capability-recommender` 承接 capability discovery / automation recommendation，默认只读，不安装。
  - `agent-instructions-maintainer` 承接 AGENTS / CLAUDE / Cursor rules 的质量审计、去膨胀、去 stale task pointer 和 checkpoint 后修补。
  - `recovery-surface-builder` 承接 recovery surface backend 选择、`.harness/` 布局、recovery policy、work index、state/progress/decisions、verification entry 和 minimal check。
- agent 删除或改写所有活跃产品文档中的 Research Route / autoresearch 语义。
- agent 更新验证脚本，使它不再要求 research tokens、research templates 或 autoresearch integration doc。
- agent 重新生成 skill flow HTML 并跑三端结构验证。

### Edge Cases

- 如果官方 Anthropic skill 的完整内容和本仓库现有 license 不兼容，实现计划必须先记录 license/NOTICE 处理方式，不得静默复制。
- 如果官方 skill 中出现 Claude-only 表面，适配时保留核心判断流程，但把输出表面扩展到 Codex / Claude Code / Cursor。
- 如果 `agent-instructions-maintainer` 需要写文件，必须先输出 audit report 和 `USER CHECKPOINT`；不得在只读审计阶段直接改 `AGENTS.md` 或 `CLAUDE.md`。
- 如果 `recovery-surface-builder` 需要写 `.harness/`、`scripts/agent/check.sh` 或 AGENTS 指针补丁，必须先输出 Recovery Surface Plan 和 `USER CHECKPOINT`。
- 如果一个项目已有可信 issue tracker、roadmap 或外部 task system，`recovery-surface-builder` 应选择 `existing` backend 并生成 project-local pointer / sync policy，而不是强行创建 full `.harness/`。
- 如果存在 legacy root `task_plan.md`、`findings.md`、`progress.md`，不得直接删除；应分类为 keep / migrate / archive / reject，并说明迁移到 `.harness/` 或保留为外部 system 的理由。
- 如果 docs/plans 历史文件提到 Research Route，不作为活跃产品语义处理；只更新 README、CONTEXT、method contract、skill、manifest、check 脚本和 generated docs 等当前表面。

### Interfaces / State

主要新增或重构：

- `skills/capability-recommender/SKILL.md`
- `skills/capability-recommender/references/**`
- `skills/agent-instructions-maintainer/SKILL.md`
- `skills/agent-instructions-maintainer/references/**`
- `skills/recovery-surface-builder/SKILL.md`
- `skills/recovery-surface-builder/references/**`
- `skills/recovery-surface-builder/templates/**`
- `skills/recovery-surface-builder/scripts/**`（仅当现有脚本拆出后确有必要）

主要改写：

- `skills/harness-builder/SKILL.md`
- `skills/harness-builder/README.md`
- `skills/harness-builder/INTEGRATION_NOTES.md`
- `README.md`
- `README.zh-CN.md`
- `CONTEXT.md`
- `docs/harness-method-contract.md`
- `.codex-plugin/plugin.json`
- `.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json`
- `.cursor-plugin/plugin.json`
- `.cursor-plugin/marketplace.json`
- `scripts/check-plugin.mjs`
- `scripts/check-claude-code-install.mjs`
- `scripts/check-cursor-install.mjs`
- `scripts/install-cursor.mjs`
- `scripts/generate-skill-flow-html.mjs`

主要删除：

- `docs/integrations/autoresearch.md`
- `skills/harness-builder/references/research_route_policy.md`
- `skills/harness-builder/templates/research_route/*`
- research-only hook templates, if no non-research owner remains:
  - `templates/hooks/research_branch_push_guard.py.j2`
  - research-only entries in `templates/hooks/hooks.json.j2`
  - research-only behavior in `commit_trailer_enforcer.py.j2` and `commit_convention.md.j2`

## Constraints

- `harness-builder` 仍是 canonical project harness skill；辅助 skill 不能被描述为 workflow lane。
- `capability-recommender` 和 `agent-instructions-maintainer` 必须先复制官方 skill 思路和主体内容，再做适配；不得为了本地风格完全重写。
- 官方复制适配必须保留来源、license 和改动说明。Anthropic 两个参考插件使用 Apache-2.0 license，应在实现计划中处理 NOTICE / attribution。
- `recovery-surface-builder` 必须以当前最新版 `skills/harness-builder/SKILL.md` 和 `references/recovery_surface_policy.md` 为主参考。
- `recovery-surface-builder` 不采用 root-level three-file backend 作为默认；`.harness/` 是本项目 runtime recovery surface。
- 所有写文件能力必须经过 `USER CHECKPOINT`。
- 三端表面必须同步：root canonical skills、Claude plugin、Cursor preview / install surfaces。
- 当前仓库没有通用 `npm test`；验证命令必须使用 AGENTS.md 声明的实际命令。
- 不能混入已有 unrelated dirty worktree 改动。

## Chosen Approach

选择 **一个 lane + 三个顶层辅助 skill**：

```text
workflow lane:
- harness-builder

top-level helper skills:
- capability-recommender
- agent-instructions-maintainer
- recovery-surface-builder
```

`harness-builder` 变成轻 controller：

1. 收集 repo evidence。
2. 判断 workbench 缺口属于哪类。
3. 输出 Harness Recommendation Plan。
4. 能力推荐路由到 `capability-recommender`。
5. agent instructions 维护路由到 `agent-instructions-maintainer`。
6. recovery / verification / workbench 安装路由到 `recovery-surface-builder`。
7. 所有具体写入动作等 `USER CHECKPOINT`。

`capability-recommender` 的实现策略：

- 从 Anthropic `claude-code-setup` 的 `claude-automation-recommender` 复制主体。
- 保留 read-only 属性。
- 把 Claude-only categories 适配为 Codex / Claude Code / Cursor 都能理解的 install surface。
- 推荐 1-2 个高价值候选，而不是铺满 catalog。

`agent-instructions-maintainer` 的实现策略：

- 从 Anthropic `claude-md-management` 的 `claude-md-improver` 复制主体。
- 从只维护 `CLAUDE.md` 扩展为维护：
  - `AGENTS.md`
  - `CLAUDE.md`
  - `.cursor/rules/`
  - project-local instruction pointers
- 保留 report-first 模式，写入前必须 `USER CHECKPOINT`。
- 重点检测 stale task pointer、膨胀的 session notes、过时 commands、和代码/文档不一致。

`recovery-surface-builder` 的实现策略：

- 从当前 `harness-builder` 抽取 recovery surface 职责。
- 支持 backend：
  - `none`
  - `lightweight`
  - `harness`
  - `feature-list`
  - `existing`
- 保留 `.harness/` field model：
  - `objective`
  - `active_slice`
  - `non_goals`
  - `success_criteria`
  - `verification_path`
  - `current_phase`
  - `evidence_log`
  - `decisions`
  - `rejected_options`
  - `risks`
  - `blockers`
  - `next_actions`
- 保留 required files when recovery is not `none`：
  - `.harness/recovery_policy.md`
  - `.harness/work_index.md`
- 根据需要安装或修复：
  - `.harness/state.md`
  - `.harness/progress.md`
  - `.harness/decisions.md`
  - `.harness/manifest.yaml`
  - `scripts/agent/check.sh`
  - AGENTS 的极薄 recovery pointer（完整 AGENTS 维护不在此 skill）

`planning-with-files` 思想的适配：

- 吸收：
  - Session Catchup Pattern
  - Read Before Decide
  - Update After Act
  - Log Failures / No Repeat Failures
  - Completion Gate Lite
  - persistent file-based working memory
- 不照搬：
  - root-level `task_plan.md`
  - root-level `findings.md`
  - root-level `progress.md`
  -强 hook 默认启用
- 映射：
  - `task_plan.md` 的计划作用 → `docs/plans/*` + `.harness/work_index.md`
  - `findings.md` 的发现/决策作用 → `.harness/decisions.md`
  - `progress.md` 的证据作用 → `.harness/progress.md`
  - session recovery → `.harness/recovery_policy.md` + `.harness/state.md`

## Rejected Options

- **只瘦身 `harness-builder`，不拆顶层辅助 skill**：可以减少部分行数，但能力推荐、instructions 维护、recovery 安装仍混在一个入口里，eval 和维护边界不清。
- **把三个辅助 skill 都做成内部 references**：外部 API 更小，但用户无法单独调用窄能力，`harness-builder` 仍然会承担过多心智负担。
- **把 Research Route 改成 AutoResearch Guard integration**：会把本插件和外部 autoresearch 插件绑定，违背用户要求。
- **保留 `docs/integrations/autoresearch.md` 作为 archive**：容易让后续 agent 误以为 autoresearch 仍是产品语义的一部分。
- **照搬 planning-with-files 三文件 root backend**：能快速获得持久计划文件，但和当前 `.harness/` recovery policy、source-of-truth tiers、AGENTS thin entry 设计冲突。
- **让 `recovery-surface-builder` 维护完整 AGENTS.md**：会和 `agent-instructions-maintainer` 职责重叠；只允许极薄 pointer patch。

## Verification Strategy

### Baseline Evidence

实现前重新收集：

```bash
git status --short
Get-Content skills/harness-builder/SKILL.md
rg -n "Research Route|autoresearch|Evidence Loop|Research Reset Policy|research_route" README.md README.zh-CN.md CONTEXT.md docs skills scripts .codex-plugin .claude-plugin .cursor-plugin
rg --files skills/harness-builder
```

同时读取官方参考：

- Anthropic `claude-code-setup` / `claude-automation-recommender`
- Anthropic `claude-md-management` / `claude-md-improver`
- Anthropic plugin LICENSE / NOTICE if present
- `planning-with-files` README / SKILL.md / license

### Automated Checks

实现后至少运行：

```bash
node scripts/check-plugin.mjs
node scripts/check-claude-code-install.mjs
node scripts/check-cursor-install.mjs
node scripts/install-cursor.mjs --target . --dry-run
```

如果修改了 skill flow 生成逻辑或 `SKILL.md` 结构，还要运行：

```bash
node scripts/generate-skill-flow-html.mjs
node scripts/check-plugin.mjs
```

如果移动或修改 `harness-builder` / `recovery-surface-builder` Python helper：

```bash
python skills/harness-builder/scripts/scan_project.py
python scripts/validate_harness.py
```

第二条命令的 cwd 必须按实际脚本位置确认；如果脚本迁移到 `recovery-surface-builder`，计划中必须更新命令。

### Smoke / E2E Checks

- Read-only `harness-builder` prompt：应输出 evidence、mode、Recommendation Plan、next helper skill，但不直接安装。
- `capability-recommender` prompt：应只读扫描并推荐 MCP / skills / hooks / subagents / plugins / commands，不改文件。
- `agent-instructions-maintainer` prompt：应审计 `AGENTS.md` / `CLAUDE.md` / Cursor rules，输出 report 和 checkpoint，不静默写文件。
- `recovery-surface-builder` prompt：应选择 backend，输出 Recovery Surface Plan 和 checkpoint，不直接创建 `.harness/`。
- Research/autoresearch prompt：本插件不应进入 Research Route；应按普通 goal ambiguity 路由到 `brainstorm` / `plan` 或说明不提供内置 research harness。

### Negative / Boundary Checks

- `rg` 不应在活跃产品文档、manifest、check 脚本和 active skills 中发现内置 Research Route / autoresearch product tokens。
- 历史 docs/plans 和 docs/specs 可以保留旧讨论，不作为失败。
- `check-plugin.mjs` 不应再要求 research templates 或 `docs/integrations/autoresearch.md`。
- 辅助 skill 不应被写成 workflow lane。
- `capability-recommender` 不应有写入动作。
- `agent-instructions-maintainer` 和 `recovery-surface-builder` 不应绕过 `USER CHECKPOINT`。
- `recovery-surface-builder` 不应默认创建 root `task_plan.md`、`findings.md`、`progress.md`。

### Documentation / State Checks

- README / README.zh-CN 说明：
  - `harness-builder` 是总入口；
  - 三个 helper skills 可顶层调用；
  - helper skills 不是 workflow lane；
  - Research Route / autoresearch 不再是内置能力。
- CONTEXT.md 更新 domain language：
  - 删除 Research Route / Evidence Loop / Research Reset Policy；
  - 增加或修正 `Agent Instructions Maintainer`、`Capability Recommender`、`Recovery Surface Builder` 术语。
- docs/harness-method-contract.md 更新方法论契约。
- docs/install/* 如列出 bundled skills，需要同步。
- generated HTML 重新生成。

### Fresh Evidence Required Before Completion

最终 ready 前必须有：

- 最新 `git status --short`，证明只包含预期文件。
- 三端验证命令输出。
- `rg` negative check 输出，证明活跃产品面不再保留 Research Route / autoresearch 语义。
- 官方复制适配的 license / attribution 处理证据。
- `docs/skill-flow-review/*.html` 已重新生成并通过 placeholder / route 检查。

## Capability Gaps

- 需要从 GitHub 获取 Anthropic 官方 skill 的完整源码和 reference 文件；网络失败时不能凭 README 重写，必须等能获取官方内容或记录 blocker。
- 需要确认 Anthropic 官方插件的 license / NOTICE 要求；当前已确认参考插件 LICENSE 为 Apache-2.0，后续实现需处理派生文件 notice。
- 需要确认 `planning-with-files` 当前 license；如果只吸收思想而不复制代码，license 风险较低，但文档仍应保留来源链接。
- 需要更新验证脚本避免对旧 Research Route token 的强依赖。
- 需要处理三端 skill 数量变化带来的 install/check 脚本调整。

## Success Criteria

- `harness-builder` 主入口职责明显变薄，只负责 evidence-first orchestration、Recommendation Plan、checkpoint 和 helper routing。
- `capability-recommender` 和 `agent-instructions-maintainer` 是官方 Anthropic skill 的复制适配版，并保留清楚的 attribution / license 处理。
- `recovery-surface-builder` 以当前最新版 `harness-builder` recovery surface 模型为主参考，并吸收 `planning-with-files` 的持久工作记忆纪律。
- Research Route / autoresearch / Evidence Loop / Research Reset Policy 不再是本插件的活跃产品语义。
- `docs/integrations/autoresearch.md` 和 research route assets 被删除，不保留 archive。
- README、CONTEXT、method contract、manifest、install docs、check scripts、generated HTML 与新职责边界一致。
- 三端结构验证通过。
- 所有写入型 helper skill 都要求 `USER CHECKPOINT`。
- 未混入用户已有 unrelated dirty worktree 改动。

## Residual Risks

- 官方 skill 完整复制可能引入 license / NOTICE 维护要求。缓解：实现计划先处理 attribution 文件和 modified notices。
- 辅助 skill 增多可能让用户误以为 workflow lane 增多。缓解：README、method contract 和 manifest 中明确 helper vs lane。
- `recovery-surface-builder` 可能和 `agent-instructions-maintainer` 在 AGENTS 指针补丁上重叠。缓解：前者只允许极薄 recovery pointer，后者负责完整 instruction maintenance。
- 移除 Research Route 可能让历史文档中的旧计划和当前产品语义不一致。缓解：只更新活跃产品面，历史 plan/spec 保留为历史记录。
- 吸收 planning-with-files 思想时可能滑回 root three-file backend。缓解：negative check 明确禁止默认 root `task_plan.md` / `findings.md` / `progress.md`。

## Plan Handoff

- Active slice: 实施 `harness-builder` 拆分第一阶段：删除内置 Research Route 语义，新增三个 helper skill scaffold，并同步文档/验证。
- Suggested next skill: plan
- Planning notes:
  - 先做 Research Route removal，降低旧语义干扰。
  - 再复制适配官方 `capability-recommender` 和 `agent-instructions-maintainer`。
  - 再抽出 `recovery-surface-builder`，迁移当前 recovery references/templates/scripts。
  - 最后瘦身 `harness-builder` 成 controller，并更新 check scripts / generated HTML。
- Suggested milestones:
  - Milestone 1: Research Route / autoresearch 活跃语义删除。
  - Milestone 2: 官方 `capability-recommender` 复制适配。
  - Milestone 3: 官方 `agent-instructions-maintainer` 复制适配。
  - Milestone 4: `recovery-surface-builder` 从当前 harness-builder recovery 模型抽出。
  - Milestone 5: `harness-builder` controller 化和三端文档/验证同步。
- Per-milestone acceptance hints:
  - M1: active docs / skills / manifests / check scripts 不再要求 Research Route。
  - M2: capability recommender read-only smoke 通过，并有官方来源/许可证说明。
  - M3: instructions maintainer audit-first checkpoint smoke 通过，并有官方来源/许可证说明。
  - M4: recovery builder 能输出 backend decision、field map、checkpoint，并不创建 root three-file backend。
  - M5: `node scripts/check-plugin.mjs`、Claude/Cursor checks、Cursor dry-run 和 generated HTML 检查通过。
