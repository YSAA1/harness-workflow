# Progress / Evidence

## 2026-06-24

- 用户确认：①非平凡 Design Grill 强制 ②Work Index 必填 ③统一 `.harness/` ④dogfood + 验证
- 更新 `recovery_surface_policy.md`、`recovery_policy.md`、`plan/SKILL.md`、`CONTEXT.md`
- 待验证：`check-plugin.mjs`、`check-cursor-install.mjs`

## 2026-06-24 — harness-builder slimming review fix

- 用户担忧：`harness-builder` 默认流程太沉，legacy root three-file 模板仍可能误导 agent，`.harness` 运行时纪律需要更硬。
- 改动：`skills/harness-builder/SKILL.md` 增加 Quick repair / Full recommendation 分流；`recommendation_matrix_policy.md` 限制 Quick repair 默认矩阵行；`plan/SKILL.md` 将 root three-file 降级为迁移输入。
- 同步：`plugins/harness-workflow/skills/`、`.cursor/skills/`、`docs/skill-flow-review/*.html` 已同步。
- 验证：
  - `node scripts/generate-skill-flow-html.mjs` -> PASS，生成 9 个 HTML 文件
  - `node scripts/check-plugin.mjs` -> PASS
  - `node scripts/check-claude-code-install.mjs` -> PASS
  - `node scripts/check-cursor-install.mjs` -> PASS
  - `node scripts/install-cursor.mjs --target . --dry-run` -> PASS
  - `bash scripts/agent/check.sh` -> PASS
  - `git diff --check` -> PASS
- Review：已启动只读隔离 reviewer `019ef979-e693-7682-8b01-37c0899cac3c`，等待结果。
- Review result：`CONDITIONAL`，Important findings 指向 `plan` 把 `.harness sync` 混成 Planning Surface，以及按需读取误指 `../harness-builder/templates/`；Minor finding 指向 Quick repair 矩阵范围两套说法。
- Follow-up fixes：`plan/SKILL.md` 改为 Planning Surface 只包含 `docs plan | issue | feature-list | existing`，`.harness` 作为 runtime sync；按需读取改为使用本 `SKILL.md` 的 Executable Plan 字段结构；`recommendation_matrix_policy.md` 改为 Quick repair 省略 out-of-scope rows。
- Re-verification：
  - `node scripts/generate-skill-flow-html.mjs` -> PASS，生成 9 个 HTML 文件
  - `node scripts/check-plugin.mjs` -> PASS
  - `node scripts/check-claude-code-install.mjs` -> PASS
  - `node scripts/check-cursor-install.mjs` -> PASS
  - `node scripts/install-cursor.mjs --target . --dry-run` -> PASS
  - `bash scripts/agent/check.sh` -> PASS
  - targeted `rg` for stale `.harness sync` planning surface / default three-file / stale `findings.md` fallback -> only explicit prohibition or historical decision entries remain

## 2026-06-24 — remove legacy plan templates

- 用户要求：没用的 legacy root three-file plan templates 直接删除，保持清爽。
- 改动：删除 `skills/plan/templates/*`、`plugins/harness-workflow/skills/plan/templates/*`、`.cursor/skills/plan/templates/*`；`scripts/check-plugin.mjs` 改为验证这些 legacy templates 不存在。
- 文档同步：`plan/SKILL.md`、`docs/harness-method-contract.md`、`docs/tutorials/zhihu-harness-workflow-guide.md` 改为说明旧 root 三文件只作为迁移输入，不再提供模板。

## 2026-06-24 — strengthen brainstorm Design Grill

- 用户要求：当前 `brainstorm` 第二阶段 grill 偏保守，参考 `$grill-me` 增强。
- 改动：`design-grill.md` 改为 relentless interview；每轮先查 repo/docs，提出 working recommendation，用单个 accept/correct/reject 问题压一个具体 stress scenario；Gate 不再允许只靠 coverage label 通过。
- 同步：`skills/brainstorm/SKILL.md`、`rules/brainstorm.mdc`、`plugins/harness-workflow/skills/brainstorm/*`、`.cursor/rules/brainstorm.mdc`、`.cursor/skills/brainstorm/*`、`docs/skill-flow-review/*.html`。
- 验证：
  - `node scripts/generate-skill-flow-html.mjs` -> PASS，生成 9 个 HTML 文件
  - `node scripts/check-plugin.mjs` -> PASS
  - `node scripts/check-claude-code-install.mjs` -> PASS
  - `node scripts/check-cursor-install.mjs` -> PASS
  - `node scripts/install-cursor.mjs --target . --dry-run` -> PASS
  - `bash scripts/agent/check.sh` -> PASS
  - targeted `rg` for Design Grill tokens -> root/package/Cursor surfaces all include stronger grill rules

## 2026-06-25 — harness-builder check.sh 协议加固（防 fragile 断言）

- 真实项目证据：`scripts/agent/check.sh` 退化成"历史快照断言机"，600+ 行硬编码 run_id、`289 passed, 2 warnings`、`author_800k=5.968893`、recovery surface 字段值字面镜像；用户已在项目本地修复成动态检查。
- 协议根因：`verification_policy.md` 只约束 fast，没约束 stable-against-progress；`check.sh.j2` 只说 "Keep short"；`anti_entropy.md` 有 "must not mirror recovery state" 原则但没落到 check.sh 生成环节。
- 改动：
  - `skills/harness-builder/references/verification_policy.md` 新增 "Fragile check patterns" 段 + "Size budget" 段，明确禁止 run_id 字面值、测试计数、实验数值、recovery surface 字段值镜像、文件系统镜像式 required_files、长结论镜像；要求用 jq/python/awk 动态提取断言谓词。
  - `skills/harness-builder/templates/check.sh.j2` 顶部注释加结构性禁令（7 条）。
  - `skills/harness-builder/references/anti_entropy.md` 新增 "`check.sh` mirroring test" 段，把 no-mirror 原则落成 3 条可执行判定 + repair 指引。
  - `scripts/check-plugin.mjs` 新增 3 组 token 断言：verification_policy 7 token、check.sh.j2 7 token、anti_entropy 3 token，防止约束被无声删掉。
- 同步：`plugins/harness-workflow/skills/`、`.cursor/skills/` 已同步（用 `install` 而非 `cp`，因为当前 shell 的 `cp` 被覆盖成只 unset proxy 的空操作函数）。
- 验证：
  - `node scripts/generate-skill-flow-html.mjs` -> PASS，生成 9 个 HTML 文件
  - `node scripts/check-plugin.mjs` -> PASS（含新 token 断言）
  - `node scripts/check-claude-code-install.mjs` -> PASS
  - `node scripts/check-cursor-install.mjs` -> PASS
  - `node scripts/install-cursor.mjs --target . --dry-run` -> PASS
  - `bash scripts/agent/check.sh` -> PASS

## 2026-06-29 — 中文默认 + 可打勾计划文件

- 用户要求：`plan` 和 `harness-builder` 生成/维护的计划与恢复类文档默认中文，并用 Markdown checkbox `- [ ]` / `- [x]` 表示完成状态。
- 改动：
  - `plan/SKILL.md` 改为要求 `## 工作项` 下使用 checkbox 工作项，状态不再靠 `Status: completed` 这类文本字段表达。
  - `harness-builder` 用户可见模板默认语言从 `en` 改为 `zh`，但保留显式非中文分支。
  - `state.md.j2` 的 next actions 改为 checkbox 工作项块。
  - README、方法契约、checker、当前 `.harness` 和 `docs/plans/2026-06-29--checkbox-chinese-plan-docs-plan.md` 已同步。
  - `plugins/harness-workflow/skills/` 与 `.cursor/skills/` 已同步。
- 验证：
  - `node scripts/generate-skill-flow-html.mjs` -> PASS
  - `node scripts/check-plugin.mjs` -> PASS
  - `node scripts/check-claude-code-install.mjs` -> PASS
  - `node scripts/check-cursor-install.mjs` -> PASS
  - `node scripts/install-cursor.mjs --target . --dry-run` -> PASS
  - `bash scripts/agent/check.sh` -> PASS
  - `git diff --check` -> PASS
  - `diff -qr skills/plan plugins/harness-workflow/skills/plan`、`diff -qr skills/plan .cursor/skills/plan`、`diff -qr skills/harness-builder plugins/harness-workflow/skills/harness-builder`、`diff -qr skills/harness-builder .cursor/skills/harness-builder` -> PASS
- Review：
  - isolated reviewer attempt: `reviewer` subagent `019f110d-94d9-7c52-9f81-dff4c39fd697` -> timed out after 300000 ms and was closed
  - packet fallback self-review -> PASS，无 Critical / Important / Minor findings
- Commit：final milestone commit，exact hash from `git log -1 --oneline`

## 2026-06-29 — plan skill 主文件瘦身

- 用户要求：使用 `$write-a-skill` 与 `$skill-creator` 优化 `plan` skill 的 `SKILL.md`，当前 200 多行过于冗余；随后补充要求不要极限瘦到 100 行以内，避免信息丢失影响 skill 性能。
- 改动：
  - `skills/plan/SKILL.md` 从 251 行压缩到 147 行。
  - 保留核心契约和性能关键细节：Executable Plan、默认中文、Planning Surface、blocked verification 分流、checkbox 工作项、验证路径、fallback、`final_integration_claim`、commit unit、recovery sync、常见反模式和下一 skill 路由。
  - 同步 `plugins/harness-workflow/skills/plan/SKILL.md` 与 `.cursor/skills/plan/SKILL.md`。
  - 重新生成 `docs/skill-flow-review/index.html` 与 `docs/skill-flow-review/plan.html`。
- 验证：
  - `node scripts/generate-skill-flow-html.mjs` -> PASS
  - `node scripts/check-plugin.mjs` -> PASS
  - `node scripts/check-claude-code-install.mjs` -> PASS
  - `node scripts/check-cursor-install.mjs` -> PASS
  - `node scripts/install-cursor.mjs --target . --dry-run` -> PASS
  - `bash scripts/agent/check.sh` -> PASS

## 2026-07-06 — harness-builder skill 拆分计划

- 用户批准 `docs/specs/2026-07-06--harness-builder-skill-split.md` 进入计划阶段。
- 写入 Executable Plan：`docs/plans/2026-07-06--harness-builder-skill-split-plan.md`。
- Runtime recovery sync：
  - `.harness/work_index.md` 新增 `005` active row；
  - 旧 `004` 从 `active` 改为 `blocked`，原因是其 state 显示 `verified; pending commit`，本轮不能替旧任务声明 complete；
  - `.harness/state.md` 更新为当前 active slice。
- 当前仅完成计划产物；未进入 implementation。

## 2026-07-06 — harness-builder skill 拆分实施验证

- 完成拆分：`harness-builder` 瘦身为 controller；新增 `capability-recommender`、`agent-instructions-maintainer`、`recovery-surface-builder` 三个顶层 helper。
- 官方复制约束：`capability-recommender` 基于 Anthropic 官方 `claude-automation-recommender`；`agent-instructions-maintainer` 基于官方 `claude-md-improver`；两者 references 直接复制官方 raw 文件，并新增 attribution。
- Recovery builder：从当前 `harness-builder` recovery model 抽出，复制 recovery 参考/模板，并加入 planning-with-files 的 read-before-decide / update-after-act 持久化纪律，不默认 root three-file backend。
- 移除：删除 active product surface 的 built-in research-governance gate、模板、reference、hook、integration doc 和 manifest/doc/checker 引用；历史 specs/plans 不改写。
- 同步：Codex、Claude Code、Cursor manifests、install docs、rules、packaged plugin、`.cursor/skills`、skill-flow HTML 已同步。
- 验证：
  - `node scripts/generate-skill-flow-html.mjs` -> PASS，Generated 13 HTML files
  - `node scripts/check-plugin.mjs` -> PASS
  - `node scripts/check-claude-code-install.mjs` -> PASS
  - `node scripts/check-cursor-install.mjs` -> PASS
  - `node scripts/install-cursor.mjs --target . --dry-run` -> PASS，包含三个新 helper
  - `git diff --check` -> PASS
  - public-doc removed-token `rg` -> no matches
  - `python -m unittest skills.harness-builder.tests.test_scripts` -> sandbox Temp permission failed first, rerun with escalation -> PASS
- Review：self-review 无 Critical / Important findings；剩余风险是 worktree 存在 unrelated dirty files，提交需按路径 staging。

## 2026-07-06 — harness-builder 拆分提交与远端同步

- Milestone commit: `d0afa41 拆分 harness-builder helper skill`。
- Push: `git push origin master` 命令超时，但本地 `origin/master` 已更新；随后 `git ls-remote origin refs/heads/master` 确认远端 master 指向 `d0afa417663efce145a9518878e5c91adb74b23c`。
- Unrelated dirty files intentionally left unstaged: `.gitignore`、旧 plugin-eval plan/PDF、`skills/brainstorm` 及其 Cursor/package mirror、`docs/skill-flow-review/brainstorm.html`、`.codex/`、`.review-artifacts/`、`revise_plan.md`。

## 2026-07-09 — harness-builder controller rewrite

- Rewrote `skills/harness-builder/SKILL.md` as thin controller with Helper routing table + completion criteria.
- Added `references/controller_discipline.md`; tightened helper descriptions; synced README/CONTEXT/method contract/rules/mirrors.
- Updated eval metric pack emitter + checker for controller semantics; removed obsolete research-route required ids.
- Evidence: `bash scripts/agent/check.sh` PASS; `node scripts/check-plugin-eval-metric-pack.mjs` PASS.

## 2026-08-12 — SSY-1 工作流优化收尾验证

- SSY-1 umbrella（brainstorm / review+verify / cleanup 三阶段）已完成，本 run 做收尾。
- 三项优化均已实现且 artifact 齐全：
  - brainstorm Phase A 统一 Grill（D-002）；`design-grill.md` 单场 interview + stress scenario。
  - review/verify/cleanup（task 006）：`verify_handoff_cases` 在 verify 显式消费、verify capability 简化 route harness-builder、review 隔离三端通用 + 风险分级 fallback、Cold Verification Pass（`cold-verifier-prompt.md`）、攻击分类法（`attack-taxonomy.md`）、evidence ladder 场景映射、deferred cleanup registry、共享反模式（`cross-cutting-anti-patterns.md`）。
- 验证：
  - live workdir `bash scripts/agent/check.sh` -> 唯一 FAIL：运行时 `.claude/skills`（Multica runtime 注入），非项目缺陷。
  - clean checkout（`git archive HEAD`）：check-plugin / check-claude-code-install / check-cursor-install / install-cursor dry-run / metric pack 全 PASS。
  - `node scripts/generate-skill-flow-html.mjs` -> PASS，Generated 13 HTML files，与 HEAD 无 diff。
- 恢复面同步：`.harness/work_index.md` 新增 `008` complete 行；`.harness/state.md` 重写为 SSY-1 收尾状态。
- 未提交运行时文件（CLAUDE.md Multica block、`.claude/`、`.multica/`、`.agent_context/`、`description.md`）。

## 2026-08-12 — Workflow lane slim

- Spec: `docs/specs/2026-08-12--workflow-lane-slim.md`
- Research: `docs/research/2026-08-12--workflow-lane-slim-research.md`
- Evidence: check-plugin / check-claude / check-cursor / generate-skill-flow-html PASS
