# Cursor 安装与识别

`harness-workflow` 的 Cursor 支持是 **Project Rules adapter**。Cursor 不会安装 Codex plugin，也不会读取 `.codex-plugin/plugin.json` 作为 runtime；它会把仓库中的 `.cursor/rules/*.mdc` 当作可版本控制的 Project Rules。

## 安装

1. Clone 或复制本仓库到目标项目。
2. 确认仓库根目录存在 `.cursor/rules`。
3. 用 Cursor 打开该仓库。
4. 在 Cursor Settings > Rules 或 Agent 侧栏中查看 Project Rules。应能看到 Harness Workflow overview 和 8 个 workflow rules。

`AGENTS.md` 是简单 fallback；`.cursor/rules` 是 Cursor 主路径，因为它能提供更结构化、可拆分、可作用域的持久上下文。

## 识别验证

在 Cursor Agent 中输入测试 prompt：

```text
Use Harness Workflow to plan a scoped implementation for a small README change.
```

预期行为：

- Agent 识别应先选择 `plan` 或在任务足够小时说明可直接实现。
- 如果进入实现，应保持 WIP=1。
- 如果准备声明完成，应要求 fresh evidence。
- 如果需要收尾，应提到 Knowledge Cleanup。

命令行结构检查：

```bash
node scripts/check-cursor-install.mjs
```

该脚本只能验证仓库规则文件、覆盖 token 和安装文档内容；Cursor UI 是否真正显示规则仍需要在 Cursor 中手动确认。

## 更新

- 修改 canonical `skills/*/SKILL.md` 后，同步检查 `.cursor/rules/*.mdc` 是否仍保留触发条件、核心步骤、交付物和 done 标准。
- 修改 Cursor rules 后运行：

```bash
node scripts/check-cursor-install.mjs
node scripts/check-plugin.mjs
```

## 卸载

删除 `.cursor/rules` 即可移除 Cursor Project Rules。不要用 legacy `.cursorrules` 作为主路径。

## 三端差异

| 端 | 主入口 | 能力形态 | 安装含义 |
| --- | --- | --- | --- |
| Codex | `.codex-plugin/plugin.json` + `skills/` | plugin runtime + skills | 安装本地 Codex plugin |
| Claude Code | Claude 侧规则或技能适配 | agent instructions / skills adapter | 按 Claude Code 支持面接入 |
| Cursor | `.cursor/rules/*.mdc` | persistent project context | clone 后作为 Project Rules 读取 |

## 限制

- Cursor rules 是 prompt context，不是完整 plugin runtime。
- Cursor 不会自动执行 Codex manifest、Codex skills frontmatter 或 Claude Code 专属配置。
- 本仓库默认不新增 Cursor MCP、extensions、hooks 或用户设置。
- Three-file backend 只是可选 recovery surface；Cursor rules 依赖的是 active slice、success criteria、verification path、evidence log、decisions、risks、blockers、next actions 等语义字段。
