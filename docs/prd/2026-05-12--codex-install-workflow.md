# PRD：Codex 安装与识别 workflow

## 背景

`harness-workflow` 当前已经是 Codex plugin 形态：仓库根部包含 `.codex-plugin/plugin.json`，active skills 位于 `skills/*/SKILL.md`。本 PRD 负责把 Codex 线做成公开 GitHub 仓库可安装、可识别、可验证的 canonical 发布形态。

本线的原则是 **不重写核心 workflow 内容**。Codex 版本应继续以当前 `skills/` 为真源，围绕公开发布补齐 marketplace/install/recognition 验证，而不是复制一份会漂移的新 skill 树。

## 官方依据

- Codex plugin 手工结构：插件目录包含 `.codex-plugin/plugin.json`，skills 位于 `skills/<skill-name>/SKILL.md`。
- Codex plugin 使用：安装后可以让 Codex 自动选择插件能力，也可以显式调用插件或其 bundled skills。
- Codex app server 暴露 plugin/list、plugin/read、plugin/install、skills/list 等识别面，可用于后续自动化验证。

## 问题陈述

当前仓库能通过项目自带 `node scripts/check-plugin.mjs` 验证 plugin shape，但还缺少面向公开发布的 Codex 安装说明、安装识别检查、以及和 Claude Code / Cursor 适配线共享的“信息不丢失”约束。用户要求最终成功标准不是 README 写得像样，而是 Codex 能正确安装并识别到插件和 skills。

## 目标

- 保持 `.codex-plugin/plugin.json` 是 Codex canonical manifest。
- 保持 `skills/` 是 Codex canonical skill source。
- 补齐 Codex 安装文档，覆盖本地路径安装、GitHub 远端安装或 marketplace 注册路径。
- 补齐 Codex 识别验证脚本或验证命令，能检查插件 manifest、active skills、frontmatter 和 Codex 识别入口。
- 和三端总 README 对齐：Codex 是完整 plugin runtime，Claude Code 是 plugin/skill runtime，Cursor 是 rules runtime。
- 不引入默认 MCP、hooks 或用户级配置。

## 非目标

- 不修改用户级 `~/.codex/config.toml`，除非最终发布验证阶段由主 agent 明确执行。
- 不把 Claude Code 或 Cursor 的适配文件混入 Codex manifest。
- 不新增未请求的 hooks、MCP servers、apps 或 connectors。
- 不改变 8 个 workflow skill 的行为语义。

## Canonical 内容保留要求

Codex 线必须完整保留下列信息：

- 8 个 active skills：`harness-builder`、`brainstorm`、`plan`、`implement`、`diagnose`、`review`、`verify`、`cleanup`。
- Harness Builder 的 project harness、recovery surface、Capability Discovery、fresh verification、anti-entropy 语义。
- Brainstorm 输出 Spec，不默认写三文件。
- Plan 输出 Executable Plan，不默认创建三文件。
- Implement 的 WIP=1 和 scoped change 纪律。
- Diagnose 的 reproduce -> hypothesis -> root cause -> minimal fix -> evidence loop。
- Review 的 correctness/scope/design/test/spec-plan consistency 检查。
- Verify 的 fresh evidence claim 验证。
- Cleanup 的 Knowledge Cleanup 和 documentation freshness 纪律。
- Three-file backend 是可选 recovery surface，不是所有 skill 的强制依赖。

## 用户故事

1. 作为 Codex 用户，我可以从公开 GitHub 仓库安装 `harness-workflow` plugin。
2. 作为 Codex 用户，我安装后能看到插件名 `harness-workflow`。
3. 作为 Codex 用户，我安装后能看到 8 个 workflow skills。
4. 作为 Codex 用户，我可以显式调用插件 skill，或让 Codex 根据任务自动选择。
5. 作为维护者，我可以运行一个验证命令确认 Codex manifest、skill tree、frontmatter、README 安装说明一致。
6. 作为维护者，我可以在发布前发现被删除的旧 skill 是否重新暴露。
7. 作为维护者，我能确认 Codex 线没有添加默认 MCP、hooks 或用户级配置。

## 文件改动范围

Codex worker 只负责以下范围：

- `.codex-plugin/plugin.json`
- `skills/**` 中 Codex 必需的小范围兼容调整
- `scripts/check-plugin.mjs`
- 可新增 `scripts/check-codex-install.mjs` 或合并到统一验证脚本
- `docs/install/codex.md`
- `README.md` / `README.zh-CN.md` 中 Codex 相关片段

不要修改：

- `.claude/**`
- `.cursor/**`
- Claude Code 专属 docs
- Cursor 专属 docs
- generated HTML，除非改动影响 skill structure 且主 agent 同意重新生成

## 实现方案

### 1. Manifest 审计

检查 `.codex-plugin/plugin.json`：

- `name` 必须为 `harness-workflow`。
- `skills` 必须指向 `./skills/`。
- capabilities 只保留 `Read` / `Write`，除非有明确新增能力需求。
- defaultPrompt 不得引用 `bootstrap`、`state-contract`、`resume`、`save-session` 作为 active skill。
- 描述应体现 Codex plugin，不声称 Cursor/Claude 也使用此 manifest。

### 2. Codex 安装文档

新增 `docs/install/codex.md`，至少包含：

- 适用对象：Codex plugin runtime。
- 前置条件：Codex CLI/App 支持 plugins/skills。
- 从 GitHub 安装的推荐路径。
- 本地开发验证路径。
- 安装后如何识别：plugin name、8 个 skill name、显式调用方式。
- 卸载/更新提示。
- Windows PowerShell 噪声说明：profile execution policy 报错不等于项目验证失败。

### 3. 识别验证

实现或补齐一个验证面，最低要求：

- 读取 `.codex-plugin/plugin.json` 并确认 JSON 有效。
- 读取 `skills/` 并确认 8 个 active skill 均存在。
- 检查每个 `SKILL.md` YAML frontmatter 存在、`name` 与目录匹配、`description` 存在。
- 检查 removed skills 不存在。
- 检查 docs/install/codex.md 包含安装、识别、更新、验证信息。
- 如本机 Codex CLI 支持可用命令，则记录 live recognition 验证命令；若无法在 worker worktree 内执行安装，则脚本应给出明确 manual verification steps。

### 4. README 接口

主 README 的 Codex 片段只保留用户入口，不堆完整细节：

- 一行定位：Codex is the native plugin target.
- Quick install。
- Recognition command/check。
- 链接到 `docs/install/codex.md`。

## 验收标准

- `node scripts/check-plugin.mjs` 通过。
- Codex 安装文档存在，并能指导用户完成安装和识别。
- Codex 识别验证脚本或 check-plugin 扩展能证明：
  - manifest 可解析；
  - plugin name 正确；
  - active skills 完整；
  - removed skills 未暴露；
  - 不存在默认 MCP/hooks。
- README 的 Codex 内容与 docs/install/codex.md 不冲突。
- 没有修改 Claude Code 或 Cursor 适配文件。

## Worker 执行要求

- 创建独立 worktree：`../harness-workflow-codex`。
- 分支名建议：`agent/codex-install-workflow`。
- 只在本 PRD 的文件范围内修改。
- 完成后运行最窄验证命令。
- 最终回复列出修改文件、验证命令和是否存在无法 live-install 的原因。

