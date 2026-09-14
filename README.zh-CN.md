<div align="center">

# Harness Workflow

**面向编码 agent 的任务级工作流技能 —— 入口、状态、验证、恢复与收尾纪律。**

[![CI](https://github.com/YSAA1/harness-workflow/actions/workflows/ci.yml/badge.svg)](https://github.com/YSAA1/harness-workflow/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Plugin](https://img.shields.io/badge/plugin-v0.4.1-blue)](.codex-plugin/plugin.json)

[English](README.md) · [简体中文](README.zh-CN.md) · [项目仓库](https://github.com/YSAA1/harness-workflow)

![Harness Workflow](docs/assets/readme/harness-workflow-icon.png)

支持 **Codex · Claude Code · Cursor · Grok Build · ZCode · Kimi Code** 以及任何读取开放 `SKILL.md` 技能格式的 agent。

</div>

## 为什么需要

agent 的失败多数在流程而非智力：跨会话丢上下文、未验证就宣称"完成"、文档失修、没有恢复路径。本仓库把 [Learn Harness Engineering](docs/harness-method-contract.md) 方法（C1–C10）落成一组可执行技能：

- **按任务需要取用** —— 小任务自审加针对性检查直接完成；复杂任务再引入规划、独立审查和持久恢复。
- **新证据优先于记忆** —— 完成声明对应真实命令输出；相关代码、配置和输入未变时复用既有证据。
- **恢复是一种设计选择** —— 每条任务/轨道一个权威入口；工作确实需要时才建 `.harness/`。
- **收尾是工作的一部分** —— 交付前对齐文档、代码遗留和恢复状态，不是可选的美化。

![工作流总览](docs/assets/readme/harness-workflow-figure.png)

## 安装

### Codex

```text
codex plugin marketplace add YSAA1/harness-workflow
codex plugin add harness-workflow@harness-workflow
```

详见 [Codex 安装](docs/install/codex.md)。

### Claude Code

以用户级插件从本地检出安装，或把单个技能拷入 `~/.claude/skills/`。详见 [Claude Code 安装](docs/install/claude-code.md)。

### Cursor

Cursor 插件面是项目本地的：适配器安装 `.cursor/rules/` 与 `.cursor/skills/`，不安装 Codex 插件，也不使用旧式 `.cursorrules`。

```text
node scripts/install-cursor.mjs --target <project> --dry-run
```

详见 [Cursor 安装](docs/install/cursor.md)。

### Grok Build / ZCode / Kimi Code

三者都读取开放的 `SKILL.md` 格式，一份共享拷贝即可服务全部 CLI：

```bash
git clone https://github.com/YSAA1/harness-workflow.git
cd harness-workflow
mkdir -p ~/.agents/skills
for s in harness-builder brainstorm plan implement diagnose review ship cleanup find-skills capability-recommender agent-instructions-maintainer recovery-surface-builder; do
  cp -r "skills/$s" ~/.agents/skills/
done
```

各端细节（用户级目录、项目级选项、验证提示语）：

- [Grok Build](docs/install/grok.md) —— `~/.grok/skills/` 或共享 `~/.agents/skills/`
- [ZCode](docs/install/zcode.md) —— `~/.zcode/skills/` 或共享 `~/.agents/skills/`
- [Kimi Code](docs/install/kimi.md) —— `~/.kimi/skills/`、项目 `.kimi/skills/` 或共享 `~/.agents/skills/`

`git pull` 后重新拷贝即更新；删除对应技能目录即卸载。

## 工作流

| 技能 | 用途 |
| --- | --- |
| brainstorm | 重要设计取舍与聚焦 Spec |
| plan | 执行依赖与必要持久计划 |
| implement | 范围内修改及按风险验证 |
| diagnose | 根因未知的故障调查 |
| review | 审阅、风险与验收证据（`verify` 是它的触发词别名） |
| ship | 串联 implement、review、cleanup 的端到端交付 |
| cleanup | 本任务知识收尾（文档 + 代码遗留），包括阻塞交接 |
| harness-builder | 跨入口、恢复、验证和配置缺口整合 |
| find-skills | 明确技能缺口的定向发现 |
| capability-recommender | 只读能力选型 |
| agent-instructions-maintainer | 持久指令审计、删减和修订 |
| recovery-surface-builder | 创建/修复最小恢复入口 |

典型路径：

```text
小修改：        implement -> 针对性检查 + 自审 -> 完成
已授权任务：    ship（= implement -> review -> cleanup）
不清晰的功能：  brainstorm -> plan -> harness-builder -> implement -> review -> cleanup
命令坏了：      diagnose -> 证据与建议（授权修复 -> implement）
harness 审计：  harness-builder -> review -> cleanup
```

## 工作约定

- 明确授权执行时，计划后继续；只要审计或建议时保持只读。只问影响结果的重要选择。
- `review` 合并审查与证据判断；`verify` 仅是它的触发词别名，不重复运行一套测试。
- `ship` 将 implement、review、cleanup 串成一次已授权任务的端到端交付，不额外加闸门。
- 复用仍适用的真实证据，相关代码、环境或输入改变后再补查。必要验收未知时不宣称完成。
- 每条任务/轨道一个权威入口，允许多个独立任务 active；已有 tracker 不必新增 `.harness/`。
- 仅整理本次影响的文档与代码遗留，保留复现与验收证据；没有漂移可以零修改结束。

完整方法见 [C1–C10 方法合同](docs/harness-method-contract.md)，变更理由见 [全量审核](docs/reviews/2026-09-07--astra-workflow-audit.md)。

## 开发与验证

编辑 `skills/` 与 `rules/` 源码后，同步打包插件和 Cursor 镜像再验证：

```text
node scripts/check-plugin.mjs
node scripts/check-claude-code-install.mjs
node scripts/check-cursor-install.mjs
node scripts/install-cursor.mjs --target . --dry-run
python -B skills/harness-builder/tests/test_scripts.py
```

结构检查不替代模型行为效果评测；不安装默认 MCP 或 hooks；历史计划仅作版本化证据。第三方归属见 THIRD_PARTY_NOTICES.md。

## 文档

| 文档 | 内容 |
| --- | --- |
| [方法合同](docs/harness-method-contract.md) | 稳定的 C1–C10 方法 |
| [CONTEXT](CONTEXT.md) | 领域术语与边界 |
| 安装指南 | [Codex](docs/install/codex.md) · [Claude Code](docs/install/claude-code.md) · [Cursor](docs/install/cursor.md) · [Grok Build](docs/install/grok.md) · [ZCode](docs/install/zcode.md) · [Kimi Code](docs/install/kimi.md) |
| [教程](docs/tutorials/) | 使用 walkthrough |

## 许可

MIT —— 见 [LICENSE](LICENSE)。
