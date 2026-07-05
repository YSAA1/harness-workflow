# Harness Builder Skill 拆分与 Research Route 移除 Executable Plan

> Spec source: `docs/specs/2026-07-06--harness-builder-skill-split.md`
> Planning surface: docs plan
> Runtime recovery sync: `.harness`
> Date: 2026-07-06

## Objective

把 `harness-builder` 从过厚的多职责入口拆成一个轻 controller 和三个可顶层调用的辅助 skill，同时从活跃产品语义中完全移除 Research Route / autoresearch，并保持 Codex、Claude Code、Cursor 三端表面一致。

## Active slice

先完成 Research Route / autoresearch 活跃语义删除与验证脚本解绑，再进入官方 helper skill 复制适配。第一阶段必须只删除当前产品面和强制检查里的 research 语义，不改写历史 plan/spec 记录。

## Non-goals

- 不新增第九条 workflow lane。
- 不把 `capability-recommender` 或 `agent-instructions-maintainer` 从零重写；必须基于 Anthropic 官方 skill 复制适配。
- 不默认采用 `planning-with-files` 的 root `task_plan.md` / `findings.md` / `progress.md`。
- 不保留 `docs/integrations/autoresearch.md` archive。
- 不绑定 `@Autoresearch-Guard` 或任何外部 autoresearch 插件。
- 不修改用户级配置、全局 skills、MCP、hooks 或外部 marketplace。
- 不混入当前 worktree 中已有的 unrelated 改动。

## Success criteria

- `harness-builder` 主入口只负责 evidence-first orchestration、Recommendation Plan、USER CHECKPOINT 和 helper routing。
- 顶层辅助 skill 存在并可被发现：`capability-recommender`、`agent-instructions-maintainer`、`recovery-surface-builder`。
- `capability-recommender` 和 `agent-instructions-maintainer` 是 Anthropic 官方 skill 的复制适配版，并包含清楚的来源、license / attribution 处理。
- `recovery-surface-builder` 以当前 `harness-builder` recovery model 为主参考，并吸收 `planning-with-files` 的持久工作记忆纪律，但不默认创建 root 三文件。
- 活跃产品面不再声明内置 Research Route / autoresearch / Evidence Loop / Research Reset Policy。
- `docs/integrations/autoresearch.md`、`skills/harness-builder/references/research_route_policy.md`、`skills/harness-builder/templates/research_route/*` 和 research-only hook 行为被删除或解除绑定。
- README、CONTEXT、method contract、install docs、manifest、check scripts、generated HTML 与新职责边界一致。
- 三端结构验证和 Cursor dry-run 通过。

## Verification path

```powershell
node scripts/check-plugin.mjs
node scripts/check-claude-code-install.mjs
node scripts/check-cursor-install.mjs
node scripts/install-cursor.mjs --target . --dry-run
node scripts/generate-skill-flow-html.mjs
node scripts/check-plugin.mjs
git diff --check
rg -n "Research Route|autoresearch|Evidence Loop|Research Reset Policy|research_route" README.md README.zh-CN.md CONTEXT.md docs\harness-method-contract.md docs\install skills scripts .codex-plugin .claude-plugin .cursor-plugin
```

`rg` negative check 允许 `docs/specs/**`、`docs/plans/**` 等历史记录保留旧词；最终实现时应使用排除路径或人工解释历史命中。

## Verification path status

`runnable`

本地 Node 验证路径可运行。官方 skill 复制适配依赖能读取 Anthropic 官方 GitHub 源码；若实现阶段无法获取官方 skill 完整内容，M2/M3 必须阻塞，不允许凭 README 重写。

## Required capabilities

- GitHub / web read access for Anthropic official plugin skill source and license files.
- Local Node runtime for `scripts/check-*.mjs` and skill-flow generation.
- Local PowerShell / git for Windows path handling and scoped commits.
- Manual license review for Apache-2.0 attribution / modified-source notes.

## Fallback evidence

- 官方 skill 源码不可获取时：不实现 M2/M3；记录 blocker 和已尝试的 source URL。
- `planning-with-files` license 不明时：只引用思想来源，不复制代码或模板。
- 某个 smoke prompt 无法自动化时：保留 read-only transcript / generated output excerpt as manual evidence，并明确 residual risk。

## Final integration claim

`final_integration_claim`: Harness Workflow 暴露一个 project workbench workflow lane (`harness-builder`) 和三个顶层 helper skills；内置 Research Route / autoresearch 语义已移除；三端插件表面、文档、检查脚本和 generated skill flow 对新边界一致，且验证命令有 fresh PASS evidence。

## 工作项

- [x] 阶段 0：Spec 锁定与 baseline context
  - acceptance_criteria: `docs/specs/2026-07-06--harness-builder-skill-split.md` 存在，状态为 `user-approved`，并记录 helper skill、Research removal、official copy adaptation、planning-with-files 思想吸收边界。
  - verification_commands: `Get-Content docs\specs\2026-07-06--harness-builder-skill-split.md`; `git status --short`
  - success_definition: 需求边界足够清楚，可以进入实施计划，不再回到 brainstorm。
- [ ] 阶段 1：Research Route / autoresearch 活跃语义删除（当前）
  - acceptance_criteria: 活跃产品文档、manifest、`harness-builder`、check scripts 不再把 Research Route / autoresearch 作为内置能力；research route templates/reference/integration doc 删除；历史 docs/plans/specs 不作为失败。
  - verification_commands: `rg -n "Research Route|autoresearch|Evidence Loop|Research Reset Policy|research_route" README.md README.zh-CN.md CONTEXT.md docs\harness-method-contract.md docs\install skills scripts .codex-plugin .claude-plugin .cursor-plugin`; `node scripts/check-plugin.mjs`
  - success_definition: 旧 research 语义从当前产品面消失，检查脚本不再强制旧 assets。
- [ ] 阶段 2：官方 helper skill 源码获取与 attribution 准备（下一步）
  - acceptance_criteria: Anthropic `claude-automation-recommender` 与 `claude-md-improver` 的官方 `SKILL.md` 和必要 references 已读取；license / NOTICE / attribution 处理方式写入对应 skill 或 docs。
  - verification_commands: `rg -n "Anthropic|Apache-2.0|claude-automation-recommender|claude-md-improver" skills docs README.md`
  - success_definition: 后续复制适配有官方来源证据和 license 边界。
- [ ] 阶段 3：`capability-recommender` 复制适配
  - acceptance_criteria: 新 skill 可顶层调用，保持 read-only，覆盖 MCP / skills / hooks / subagents / plugins / commands / CI-headless automation，输出 install surface / approval boundary / verification probe，不写文件。
  - verification_commands: `Get-Content skills\capability-recommender\SKILL.md`; `node scripts/check-plugin.mjs`
  - success_definition: capability recommendation 从 `harness-builder` 热路径中拆出，且保留官方推荐器主体能力。
- [ ] 阶段 4：`agent-instructions-maintainer` 复制适配
  - acceptance_criteria: 新 skill 可顶层调用，审计 `AGENTS.md` / `CLAUDE.md` / `.cursor/rules/`，report-first，写入前必须 `USER CHECKPOINT`，能识别 stale task pointers 和膨胀 session notes。
  - verification_commands: `Get-Content skills\agent-instructions-maintainer\SKILL.md`; `node scripts/check-plugin.mjs`
  - success_definition: instruction maintenance 从 `harness-builder` 中拆出，且保留官方 CLAUDE.md 管理器主体能力。
- [ ] 阶段 5：`recovery-surface-builder` 抽出
  - acceptance_criteria: 新 skill 可顶层调用，支持 `none | lightweight | harness | feature-list | existing` backend，维护 `.harness/recovery_policy.md`、`.harness/work_index.md`、state/progress/decisions field model、verification entry 和 minimal check；明确吸收 `planning-with-files` 思想但禁止默认 root 三文件。
  - verification_commands: `Get-Content skills\recovery-surface-builder\SKILL.md`; `rg -n "task_plan.md|findings.md|progress.md|planning-with-files|work_index|recovery_policy" skills\recovery-surface-builder`
  - success_definition: recovery surface 设计/安装职责从 `harness-builder` 中抽出，和 AGENTS maintenance / capability recommendation 不重叠。
- [ ] 阶段 6：`harness-builder` controller 化与文档同步
  - acceptance_criteria: `harness-builder` 只保留总入口、模式选择、Recommendation Plan、helper routing、checkpoint 和 next skill；README、README.zh-CN、CONTEXT、method contract、install docs、plugin manifests、Claude/Cursor marketplace 描述同步新边界。
  - verification_commands: `node scripts/check-plugin.mjs`; `node scripts/check-claude-code-install.mjs`; `node scripts/check-cursor-install.mjs`
  - success_definition: 用户能从文档看懂一个 lane + 三 helper 的模型，三端 metadata 不再宣传 Research Route。
- [ ] 阶段 7：生成物刷新、smoke、最终验证与提交
  - acceptance_criteria: `docs/skill-flow-review/*.html` 刷新；三端结构验证、Cursor dry-run、`git diff --check`、Research negative check 均有 fresh evidence；提交只包含本任务相关文件。
  - verification_commands: `node scripts/generate-skill-flow-html.mjs`; `node scripts/check-plugin.mjs`; `node scripts/check-claude-code-install.mjs`; `node scripts/check-cursor-install.mjs`; `node scripts/install-cursor.mjs --target . --dry-run`; `git diff --check`; `git status --short`
  - success_definition: 可以声明拆分 ready，并按项目规则生成中文 commit。

## Commit units

| Unit | Work items | Scope | Commit preconditions | Suggested message |
| --- | --- | --- | --- | --- |
| CU1 | 阶段 1 | 删除 Research Route / autoresearch 活跃语义和旧强制检查 | 阶段 1 验证通过，review 无 Critical | `移除内置研究路线语义` |
| CU2 | 阶段 2-4 | 官方 helper skill 源码复制适配与 attribution | 官方源码读取完成，两个 helper smoke 通过 | `拆出能力推荐与指令维护助手` |
| CU3 | 阶段 5 | 抽出 recovery surface builder | recovery builder smoke 和 root 三文件 negative check 通过 | `拆出恢复面构建助手` |
| CU4 | 阶段 6-7 | controller 化、文档、manifest、generated HTML、全量验证 | 三端验证、dry-run、negative check、diff check 通过 | `收敛工作台拆分边界` |

每个 commit 前置条件：对应实现完成 + review 无 Critical + verify PASS + `git status --short` 确认未混入无关改动。

## Known risks / blockers

- Anthropic 官方 skill 完整源码或 license 文件如果无法获取，M2-M4 不能继续。
- 官方复制适配可能引入 Apache-2.0 notice 维护要求；计划阶段不假设可以无 attribution 复制。
- 当前 worktree 已有 unrelated 改动，实施和提交必须显式按路径 staging，避免混入。
- `harness-builder`、README、method contract、check-plugin 的 Research token 当前交织较多，阶段 1 可能需要同步多个文件才能通过检查。
- 新增 helper skill 数量会影响 Claude/Cursor install checks 和 generated skill-flow，需要更新所有枚举。

## Next skill

`implement`

Reason: active slice 清楚，验证路径可运行，下一步是按阶段 1 做 scoped implementation。
