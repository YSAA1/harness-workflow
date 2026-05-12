# Claude Code 安装与识别

本仓库同时提供两种 Claude Code 使用面：

- **Project skills**：`.claude/skills/*`，适合把 workflow skills 随项目一起提交，进入仓库后直接使用短命令。
- **本地 plugin**：仓库根目录的 `skills/*` 加 `.claude-plugin/plugin.json`，适合用 Claude Code 的 plugin namespace 做发布前本地验证。

Claude Code 不读取 `.codex-plugin/plugin.json`。Codex 入口仍由 `.codex-plugin/plugin.json` 管理，Claude Code 入口由 `.claude/skills/` 和 `.claude-plugin/plugin.json` 管理。

## 方式 A：Project Skills

当前仓库已经包含 project skills copy：

```text
.claude/
└── skills/
    ├── harness-builder/
    ├── brainstorm/
    ├── plan/
    ├── implement/
    ├── diagnose/
    ├── review/
    ├── verify/
    └── cleanup/
```

把本仓库作为普通项目打开后启动 Claude Code：

```bash
claude
```

然后直接调用：

```text
/harness-builder
/brainstorm
/plan
/implement
/diagnose
/review
/verify
/cleanup
```

也可以问：

```text
List all available Skills
```

期望看到 8 个 workflow skills。若 Claude Code 会话已经在 `.claude/skills/` 创建前启动，重启 Claude Code 后再检查。

## 方式 B：本地 Plugin

本仓库也包含 Claude Code plugin manifest：

```text
.claude-plugin/plugin.json
skills/
```

在仓库根目录用本地 plugin 方式启动：

```bash
claude --plugin-dir .
```

plugin skills 使用 namespace，调用方式是：

```text
/harness-workflow:harness-builder
/harness-workflow:brainstorm
/harness-workflow:plan
/harness-workflow:implement
/harness-workflow:diagnose
/harness-workflow:review
/harness-workflow:verify
/harness-workflow:cleanup
```

进入 Claude Code 后可用 `/help` 或 `List all available Skills` 确认 namespace 下的 8 个 skills。

## 识别验证

仓库内静态验证：

```bash
node scripts/check-claude-code-install.mjs
```

这个脚本检查：

- `.claude/skills/` 存在 8 个 active skills。
- 每个 `SKILL.md` 有 YAML frontmatter、`description`，且 `name` 与目录名匹配。
- canonical `skills/` 下的 supporting files 在 `.claude/skills/` copy 中没有丢失。
- `references/`、`templates/`、`scripts/` 文件数保持一致。
- `.claude-plugin/plugin.json` 可解析，plugin namespace 是 `harness-workflow`。
- Claude Code 文档没有把 Codex manifest 误写成 Claude Code 入口。

真实识别需要本机已安装并可启动 Claude Code。手动检查：

```bash
claude --plugin-dir .
```

启动后运行：

```text
/help
List all available Skills
/harness-workflow:harness-builder
```

Project skills 检查：

```bash
claude
```

启动后运行：

```text
/harness-builder
List all available Skills
```

Windows 上 `~/.claude` 对应 `%USERPROFILE%\.claude`。本仓库不会自动写入用户级 `%USERPROFILE%\.claude`，除非维护者手动复制或用户明确要求。

## 与 Codex / Cursor 的差异

| 维度 | Claude Code | Codex | Cursor |
| --- | --- | --- | --- |
| 项目 skills | `.claude/skills/<skill>/SKILL.md` | 通过 Codex plugin 或已安装 skills 暴露 | 取决于 Cursor 适配面 |
| Plugin manifest | `.claude-plugin/plugin.json` | `.codex-plugin/plugin.json` | Cursor 专属配置，不在本 PRD 范围 |
| 调用方式 | `/skill-name` 或 `/harness-workflow:skill-name` | `$skill` 或 Codex skill 触发 | Cursor 适配文档定义 |
| Supporting files | skill 目录内的 `references/`、`templates/`、`scripts/` | 同样依赖 progressive disclosure | 需要 Cursor 线单独验证 |
| 权限模型 | Claude Code settings、workspace trust、可选 `allowed-tools` | Codex sandbox、approval 和 plugin capabilities | Cursor 权限模型另行说明 |
| 当前仓库状态 | 已提供 project skills 与本地 plugin manifest | canonical source | 不由本文件声明支持 |

## 更新

维护时先改 canonical `skills/`，再同步 `.claude/skills/` copy：

```powershell
$skills = @('harness-builder','brainstorm','plan','implement','diagnose','review','verify','cleanup')
foreach ($skill in $skills) {
  Copy-Item -LiteralPath (Join-Path 'skills' $skill) -Destination '.claude\skills' -Recurse -Force
}
```

如果对 Claude Code copy 做了必要的调用文案适配，重新检查这些差异仍是有意的，然后运行：

```bash
node scripts/check-claude-code-install.mjs
node scripts/check-plugin.mjs
```

## 卸载

Project skills 卸载：删除项目内 `.claude/skills/<skill-name>/`，或删除整个 `.claude/skills/`。

本地 plugin 启动方式没有持久安装状态；停止使用 `claude --plugin-dir .` 即可。若未来通过 marketplace 安装，则用 Claude Code 的 `/plugin` 管理命令卸载对应 plugin。

不要为了卸载本仓库适配而删除 `%USERPROFILE%\.claude`。那是用户级 Claude Code 配置目录，可能包含其他项目或个人 skills。
