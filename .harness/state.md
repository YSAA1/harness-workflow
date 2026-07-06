# Harness State（Hot Index）

本文件是热恢复索引，不是追加式报告。

## Objective

把 `harness-builder` 从过厚的多职责入口拆成一个轻 controller 和三个可顶层调用的辅助 skill，同时从活跃产品语义中完全移除 Research Route / autoresearch，并保持 Codex、Claude Code、Cursor 三端表面一致。

## Active slice

Implementation verified; pending milestone commit and push.

## Non-goals

- 不新增第九条 workflow lane。
- 不把 `capability-recommender` 或 `agent-instructions-maintainer` 从零重写。
- 不默认采用 `planning-with-files` 的 root `task_plan.md` / `findings.md` / `progress.md`。
- 不保留 `docs/integrations/autoresearch.md` archive。
- 不绑定 `@Autoresearch-Guard` 或任何外部 research-governance 插件。
- 不修改用户级配置、全局 skills、MCP、hooks 或外部 marketplace。

## Current phase

verified; pending commit and push

## Success criteria

- [x] `harness-builder` 主入口只负责 evidence-first orchestration、Recommendation Plan、USER CHECKPOINT 和 helper routing。
- [x] 顶层辅助 skill 存在并可被发现：`capability-recommender`、`agent-instructions-maintainer`、`recovery-surface-builder`。
- [x] `capability-recommender` 和 `agent-instructions-maintainer` 是 Anthropic 官方 skill 的复制适配版，并包含清楚的来源、license / attribution 处理。
- [x] `recovery-surface-builder` 以当前 `harness-builder` recovery model 为主参考，并吸收 `planning-with-files` 的持久工作记忆纪律，但不默认创建 root 三文件。
- [x] 活跃产品面不再声明内置 Research Route / autoresearch / Evidence Loop / Research Reset Policy。
- [x] 三端结构验证和 Cursor dry-run 通过。

## Verification evidence

- `node scripts/generate-skill-flow-html.mjs` -> PASS，Generated 13 HTML files。
- `node scripts/check-plugin.mjs` -> PASS。
- `node scripts/check-claude-code-install.mjs` -> PASS。
- `node scripts/check-cursor-install.mjs` -> PASS。
- `node scripts/install-cursor.mjs --target . --dry-run` -> PASS，dry-run includes three new helper skills。
- `git diff --check` -> PASS。
- Targeted `rg` over public active docs for removed research tokens -> no matches。
- `python -m unittest skills.harness-builder.tests.test_scripts` -> PASS when rerun outside sandbox; sandbox run failed because Windows user Temp was not writable.
- Official-helper check: Anthropic reference files copied byte-for-byte; adapted `SKILL.md` files are official body plus narrow rename/adaptation/next-skill additions.

## Next actions

- [x] 写入 Spec：`docs/specs/2026-07-06--harness-builder-skill-split.md`
- [x] 写入 Executable Plan：`docs/plans/2026-07-06--harness-builder-skill-split-plan.md`
- [x] 阶段 1：删除 Research Route / autoresearch 活跃产品语义
- [x] 阶段 2：读取官方 helper skill 源码并准备 attribution
- [x] 阶段 3：复制适配 `capability-recommender`
- [x] 阶段 4：复制适配 `agent-instructions-maintainer`
- [x] 阶段 5：抽出 `recovery-surface-builder`
- [x] 阶段 6：`harness-builder` controller 化与文档同步
- [x] 阶段 7：生成物刷新与验证
- [ ] 阶段 8：中文 milestone commit 并 push 到远端

## Risks

- Worktree 仍有任务开始前已存在的 unrelated 改动；commit 必须显式按路径 staging，避免混入。