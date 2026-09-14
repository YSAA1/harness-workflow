# Harness Workflow

[English](README.md) · [项目仓库](https://github.com/YSAA1/harness-workflow)

按任务需要选择工作流。小任务直接修改、自审和验证；复杂任务再使用规划、独立审查和恢复记录。

## 本次优化后的约定

- 明确授权执行时，计划后继续；只要审计或建议时保持只读。只问影响结果的重要选择。
- `review` 合并审查与证据判断；`verify` 仅作别名，不重复运行一套测试。
- 复用仍适用的真实证据，相关代码、环境或输入改变后再补查。必要验收未知时不宣称完成。
- 每条任务/轨道一个权威入口，允许多个独立任务 active；已有 tracker 不必新增 `.harness/`。
- 仅整理本次影响的文档，保留复现与验收证据；没有漂移可以零修改结束。
- 技能原有显式/隐式调用设置保留，不因本次优化扩大自动触发范围。

## 技能

| 技能 | 用途 |
| --- | --- |
| brainstorm | 重要设计取舍与聚焦 Spec |
| plan | 执行依赖与必要持久计划 |
| implement | 范围内修改及按风险验证 |
| diagnose | 根因未知的故障调查 |
| review | 审阅、风险与验收证据 |
| verify | review 的兼容别名 |
| cleanup | 本任务知识收尾，包括阻塞交接 |
| harness-builder | 跨入口、恢复、验证和配置缺口整合 |
| find-skills | 明确技能缺口的定向发现 |
| capability-recommender | 只读能力选型 |
| agent-instructions-maintainer | 持久指令审计、删减和修订 |
| recovery-surface-builder | 创建/修复最小恢复入口 |

## 安装与维护

参见 [Codex](docs/install/codex.md)、[Claude Code](docs/install/claude-code.md)、[Cursor](docs/install/cursor.md)。
源码在 `skills/` 与 `rules/`，安装包和 Cursor 预览由它们同步。

```text
node scripts/check-plugin.mjs
node scripts/check-claude-code-install.mjs
node scripts/check-cursor-install.mjs
node scripts/install-cursor.mjs --target . --dry-run
python -B skills/harness-builder/tests/test_scripts.py
```

修改技能后运行 `node scripts/generate-skill-flow-html.mjs`。
完整方法见 [C1–C10](docs/harness-method-contract.md)，变更理由见 [全量审核](docs/reviews/2026-09-07--astra-workflow-audit.md)。结构检查不替代模型行为效果评测，历史计划不再定义现行流程。
