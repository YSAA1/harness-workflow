# PRD：Claude Code 安装与识别 workflow

## 背景

用户希望 `harness-workflow` 不只是 Codex plugin，也能作为 Claude Code 可安装、可识别的 workflow skill/plugin。Claude Code 的配置模型和 Codex 不完全相同：Claude Code 支持 `.claude/skills/<skill>/SKILL.md` 项目 skills，也支持 plugin 目录中的 `skills/`，plugin skill 使用 `plugin-name:skill-name` namespace。

本 PRD 负责 Claude Code 线。核心策略是 **copy 当前 canonical skill 内容，再针对 Claude Code 调用方式和限制做最小改造**，确保不丢失 workflow 信息。

## 官方依据

- Claude Code skills 由包含 YAML frontmatter 和 Markdown 内容的 `SKILL.md` 定义。
- Project skills 可放在 `.claude/skills/<skill-name>/SKILL.md`。
- Plugin skills 可放在 `<plugin>/skills/<skill-name>/SKILL.md`，启用后使用 plugin namespace。
- Claude Code plugin 适合团队共享、公开发布、版本化 release 和跨项目复用。
- Skills 可以带 supporting files；`SKILL.md` 应引用这些文件，避免一次性塞入过长内容。

## 问题陈述

当前仓库的 `skills/` 是 Codex plugin 可用的 skill tree，但公开发布时不能假设 Claude Code 会读取 `.codex-plugin/plugin.json`。Claude Code 用户需要明确的安装入口、可识别的 skill 目录/插件结构、以及针对 `/skill-name` 或 `/harness-workflow:skill-name` 的使用说明。成功标准必须是 Claude Code 能识别到 skills，而不是 README 中声称支持。

## 目标

- 为 Claude Code 增加明确安装面，优先支持 project skills 或 Claude plugin structure。
- 从 canonical `skills/` copy 8 个 workflow skills，避免信息损失。
- 针对 Claude Code 修改调用文案：显式调用从 Codex `$skill` 思路转为 Claude `/skill-name` 或 `/harness-workflow:skill-name`。
- 保留 references/templates/scripts 支持文件，不能只复制 `SKILL.md` 摘要版。
- 增加 Claude Code 识别验证脚本或验证命令。
- 增加 `docs/install/claude-code.md`。

## 非目标

- 不修改用户本机 `~/.claude/settings.json`。
- 不要求用户安装企业 managed settings。
- 不新增 Claude hooks、MCP servers 或 agents，除非只是文档说明 optional。
- 不改变 canonical Codex `skills/` 的语义。
- 不把 Claude Code 的设置写进 `.codex-plugin/plugin.json`。

## Canonical 内容保留要求

Claude Code 线 copy 后必须保留：

- 8 个 active skills 的完整 workflow protocol。
- 每个 skill 的 YAML frontmatter。
- 所有被 `SKILL.md` 引用且对执行有意义的 `references/`、`templates/`、`scripts/`。
- Harness Method Contract 的 C1-C10 术语。
- recovery surface backend taxonomy。
- fresh evidence、WIP=1、Knowledge Cleanup、Capability Discovery 等核心纪律。

允许针对 Claude Code 修改：

- 调用方式：`$skill`、Codex plugin wording 转换为 Claude Code wording。
- 安装说明：`.claude/skills` 或 Claude plugin。
- 权限说明：Claude Code permissions/settings 与 Codex capabilities 分开说明。
- 技术限制：动态 context injection、allowed-tools 等仅在 Claude Code 支持时使用，不为了炫技新增。

## 用户故事

1. 作为 Claude Code 用户，我可以把公开仓库安装为 Claude Code plugin，或复制为 project skills。
2. 作为 Claude Code 用户，我能通过 `/harness-builder` 或 plugin namespace 调用 workflow skill。
3. 作为 Claude Code 用户，我能看到 8 个 skills，不需要阅读 Codex manifest。
4. 作为 Claude Code 用户，我能理解 Claude Code 版本和 Codex 版本的差别。
5. 作为维护者，我能运行脚本检查 `.claude/skills` 或 Claude plugin skill tree 与 canonical `skills/` 没有信息丢失。
6. 作为维护者，我能确认 Claude Code 线没有遗漏 references/templates/scripts。

## 文件改动范围

Claude Code worker 只负责以下范围：

- `.claude/**` 或 `claude-code/**` 适配目录，按最终结构选择一种清晰方案
- 可新增 `scripts/check-claude-code-install.mjs`
- `docs/install/claude-code.md`
- `README.md` / `README.zh-CN.md` 中 Claude Code 相关片段

如需读取 canonical source，可读：

- `skills/**`
- `docs/harness-method-contract.md`
- `.codex-plugin/plugin.json`

不要修改：

- `.codex-plugin/plugin.json`
- canonical `skills/**`，除非发现明确跨端 bug 并在最终说明中标出
- `.cursor/**`
- Cursor 专属 docs

## 实现方案

### 1. 选择 Claude Code 发布形态

优先级：

1. 若能构造 Claude Code plugin structure，则以 plugin 为公开发布主路径。
2. 同时提供 project skills copy 作为最直接可验证路径。
3. 如果 Claude plugin manifest 字段不确定，不伪造不确定 schema；保留 project skills 作为可靠安装路径，并把 plugin marketplace 留为后续发布扩展。

最终文档必须清楚说明采用哪一种。

### 2. Copy canonical skills

复制 `skills/` 到 Claude Code 可发现位置时：

- 目录名保持一致。
- `SKILL.md` frontmatter `name` 保持与目录一致。
- `description` 可微调以适配 Claude Code trigger。
- 保留 references/templates/scripts。
- 将明显 Codex-only invocation wording 转成 Claude Code wording。
- 不删减 workflow steps。

### 3. Claude Code 安装文档

新增 `docs/install/claude-code.md`，至少包含：

- 安装方式 A：project skills copy 到 `.claude/skills/`。
- 安装方式 B：plugin 方式，如本仓库实现了 Claude plugin structure。
- 识别方式：启动 Claude Code 后直接调用 `/harness-builder` 或 `/harness-workflow:harness-builder`。
- 如何确认 8 个 skills。
- 和 Codex 的差异表。
- 更新和卸载说明。
- Windows 路径提醒：`~/.claude` 在 Windows 下是 `%USERPROFILE%\.claude`。

### 4. 识别验证

新增或扩展验证脚本：

- 确认 Claude Code skill tree 存在。
- 确认 8 个 active skills 存在。
- 确认每个 `SKILL.md` 有 YAML frontmatter、description、name 匹配。
- 确认 supporting files 未丢失。
- 对比 canonical `skills/` 中的 `references/`、`templates/`、`scripts/` 是否在 Claude copy 中存在。
- 检查 Claude docs 中没有错误声称 `.codex-plugin/plugin.json` 会被 Claude Code 读取。

如当前环境无法实际启动 Claude Code 或安装插件，worker 必须说明 blocker，并留下 manual recognition 命令。

## 验收标准

- Claude Code 适配目录存在且结构清晰。
- 8 个 workflow skills 可被 Claude Code 以 project skill 或 plugin skill 形态识别。
- Claude Code 适配没有丢失 canonical supporting files。
- `docs/install/claude-code.md` 包含安装、识别、更新、卸载、三端差异。
- 验证脚本能在本仓库检查 Claude Code skill tree。
- 没有修改 Codex manifest 或 Cursor 适配文件。

## Worker 执行要求

- 创建独立 worktree：`../harness-workflow-claude-code`。
- 分支名建议：`agent/claude-code-install-workflow`。
- 只在本 PRD 的文件范围内修改。
- 完成后运行最窄验证命令。
- 最终回复列出修改文件、验证命令、Claude Code live recognition 是否完成。

