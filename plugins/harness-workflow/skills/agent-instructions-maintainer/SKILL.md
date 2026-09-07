---
name: agent-instructions-maintainer
description: "审计或修订 AGENTS.md、CLAUDE.md 和 Cursor rules，删除过时规则、合并重复内容并验证项目事实。只审计时只读，明确要求修订时直接完成相关修改。"
---

# Agent Instructions Maintainer

这是维护持久指令的 Helper Skill。保留真实项目合同、非显然陷阱和准确验证入口；删减重复常识、过时规则、无用步骤和会话流水。来源与改编记录见 `references/attribution.md`。

## 流程

1. 发现用户指定范围内实际生效的文件，区分全局、项目、子目录及生成镜像。Codex 全局入口为 `$CODEX_HOME/AGENTS.md`（默认 `~/.codex`），还需检查 `AGENTS.override.md`；Claude Code 和 Cursor 使用各自发现机制。
2. 将规则与当前项目代码、配置、运行入口和用户授权对照。区分过时事实、冲突、重复、过宽触发和仍有价值的约束。
3. 以具体位置、后果和建议报告问题。无需强制百分制或为每个文件填写完整质量表。
4. 只要求审计时交付建议；已要求优化/修复时完成范围内的删除、合并、迁移和修订。仅对超出授权或会改变关键合同的取舍询问，不重复确认已经授权的修改。
5. 修改 canonical source，再按项目方式同步镜像。检查路径、命令语义与差异；不为验证文档而执行部署、安装或昂贵训练。

## 判断与输出

- 事实证据说明系统现在如何工作，用户/项目合同说明应该如何工作；发现不一致需报告，不能用现有 bug 覆盖目标合同。
- 不把密码、短期运行状态、模型版本宣传或通用流程塞进常驻指令。
- 精确保留用户指定环境及行为验收边界；模型能力提高不代表这些约束失效。
- 输出问题与修改、验证及未解决项；未发现问题时允许零修改。
- 按需读 `references/quality-criteria.md`、`references/update-guidelines.md`、`references/templates.md`。

## Recommended next skill

- 窄修改已验证：结束。
- 持久恢复结构确有缺口：`recovery-surface-builder`；多类工作台改造：`harness-builder`。
- 用户要求独立审阅或规则变化影响较大：`review`。
