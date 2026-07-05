# Harness State（Hot Index）

本文件是热恢复索引，不是追加式报告。

## Objective

把 `harness-builder` 从过厚的多职责入口拆成一个轻 controller 和三个可顶层调用的辅助 skill，同时从活跃产品语义中完全移除 Research Route / autoresearch，并保持 Codex、Claude Code、Cursor 三端表面一致。

## Active slice

先完成 Research Route / autoresearch 活跃语义删除与验证脚本解绑，再进入官方 helper skill 复制适配。第一阶段必须只删除当前产品面和强制检查里的 research 语义，不改写历史 plan/spec 记录。

## Non-goals

- 不新增第九条 workflow lane。
- 不把 `capability-recommender` 或 `agent-instructions-maintainer` 从零重写。
- 不默认采用 `planning-with-files` 的 root `task_plan.md` / `findings.md` / `progress.md`。
- 不保留 `docs/integrations/autoresearch.md` archive。
- 不绑定 `@Autoresearch-Guard` 或任何外部 autoresearch 插件。
- 不修改用户级配置、全局 skills、MCP、hooks 或外部 marketplace。

## Current phase

planned; ready for implementation phase 1

## Success criteria

- `harness-builder` 主入口只负责 evidence-first orchestration、Recommendation Plan、USER CHECKPOINT 和 helper routing。
- 顶层辅助 skill 存在并可被发现：`capability-recommender`、`agent-instructions-maintainer`、`recovery-surface-builder`。
- `capability-recommender` 和 `agent-instructions-maintainer` 是 Anthropic 官方 skill 的复制适配版，并包含清楚的来源、license / attribution 处理。
- `recovery-surface-builder` 以当前 `harness-builder` recovery model 为主参考，并吸收 `planning-with-files` 的持久工作记忆纪律，但不默认创建 root 三文件。
- 活跃产品面不再声明内置 Research Route / autoresearch / Evidence Loop / Research Reset Policy。
- 三端结构验证和 Cursor dry-run 通过。

## Verification path

```bash
node scripts/check-plugin.mjs
node scripts/check-claude-code-install.mjs
node scripts/check-cursor-install.mjs
node scripts/install-cursor.mjs --target . --dry-run
node scripts/generate-skill-flow-html.mjs
git diff --check
rg -n "Research Route|autoresearch|Evidence Loop|Research Reset Policy|research_route" README.md README.zh-CN.md CONTEXT.md docs\harness-method-contract.md docs\install skills scripts .codex-plugin .claude-plugin .cursor-plugin
```

## Next actions

- [x] 写入 Spec：`docs/specs/2026-07-06--harness-builder-skill-split.md`
- [x] 写入 Executable Plan：`docs/plans/2026-07-06--harness-builder-skill-split-plan.md`
- [ ] 阶段 1：删除 Research Route / autoresearch 活跃产品语义
- [ ] 阶段 2：读取官方 helper skill 源码并准备 attribution
- [ ] 阶段 3：复制适配 `capability-recommender`
- [ ] 阶段 4：复制适配 `agent-instructions-maintainer`
- [ ] 阶段 5：抽出 `recovery-surface-builder`
- [ ] 阶段 6：`harness-builder` controller 化与文档同步
- [ ] 阶段 7：生成物刷新、验证与提交

## Risks

- Anthropic 官方 skill 完整源码或 license 文件如果无法获取，helper copy-adapt 阶段必须阻塞。
- 当前 worktree 已有 unrelated 改动，实施和提交必须显式按路径 staging，避免混入。
- Research token 当前分散在 README、CONTEXT、method contract、manifest、check-plugin 和 generated docs 中，阶段 1 需要同步处理。
