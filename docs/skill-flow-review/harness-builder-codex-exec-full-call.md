只读 Harness Recommendation Mode 调用完成。没有写文件、没有安装 MCP/hooks/subagents/plugins，也没有改 user-global config。
`No user questions needed`：本次目标已明确为“能力/安装推荐”，不是执行安装。

**Codebase Profile**
- Type: `harness-workflow` agent workflow plugin；Node 脚本工具；Codex / Claude Code / Cursor 三端适配仓库。
- Existing agent surfaces: `AGENTS.md`、`CLAUDE.md`、root `skills/`、`plugins/harness-workflow/skills/`、`.cursor/rules/`、`.cursor/skills/`、plugin manifests。
- Verification entry: `bash scripts/agent/check.sh`，本次只读运行通过；它覆盖 Codex/Claude/Cursor 结构检查和 Cursor dry-run。
- Risk signals: 当前 git dirty；存在 `.env`；有生成物 `docs/skill-flow-review/*.html`；root/plugin/Cursor 多镜像面容易漂移。
- No web research needed: 本次推荐基于本 repo 当前 `harness-builder` reference library 和本地证据；没有需要确认版本变化的外部框架/API。

**Existing Harness**
- Keep: `AGENTS.md` 薄入口、`scripts/agent/check.sh`、CI、SkillOpt deterministic eval、三端 plugin manifests、Cursor rules/skills adapter。
- Patch candidate: 只建议后续加“生成物/镜像漂移”更强 gate，不建议现在改。
- Defer: MCP、hooks、subagent files、外部 plugin 安装；都有明确 approval boundary。
- Reject: 默认 `.mcp.json`、默认 hooks、默认 `.codex/config.toml`、全局 skill/plugin/cache 修改。

**Recommendation Summary**

| Priority | Type | Recommendation | Value | Where/install surface | Approval |
| --- | --- | --- | --- | --- | --- |
| High | commands/CI/headless automation | 增加 generated artifact ratchet：CI 中运行 `node scripts/generate-skill-flow-html.mjs` 后检查 `docs/skill-flow-review` 是否无 diff | 防止 `SKILL.md` 改了但 HTML 未同步 | `.github/workflows/ci.yml` 或独立 workflow | USER CHECKPOINT |
| High | commands/headless automation | 固化一个只读 `codex exec` smoke prompt/command，用来验证 `harness-builder` Recommendation Mode 输出契约 | 复现你这次要求的真实调用，避免只靠静态 eval | `docs/` 说明或 `scripts/agent/` 只读脚本 | USER CHECKPOINT |
| Medium | hooks | Defer protected-path hook：保护 `.env`、生成物、plugin mirror 面，先用 CI/script gate 替代 | 防误改敏感/生成/镜像文件 | Claude `.claude/settings.json` hooks 或项目脚本 fallback | Explicit approval |
| Medium | MCP | Defer GitHub MCP：只在需要实时 PR/Actions/issue truth 时启用 | 减少 CI/PR 状态漂移；但需凭据 | project MCP config / Claude `.mcp.json` / Codex supported surface | Explicit approval |
| Low | MCP | Reject default Context7/Fetch MCP | 当前无外部框架/API stack signal，本地 docs 足够 | 不安装 | No approval |
| Medium | skills | Keep bundled `find-skills`；defer 新外部 skill 搜索 | 当前已有 workflow skills 和 SkillOpt scripts；无明确新 domain gap | root/plugin/Cursor skill surfaces | No approval now |
| Medium | skills | Defer `skillopt-operator` project skill | SkillOpt 操作可能复用，但目前 scripts/docs 已够用；过早变 skill 会污染 runtime skill | `.agents/skills` 或 plugin skill surface | USER CHECKPOINT |
| Medium | subagents | Recommend runtime-only `harness-plan-reviewer` / `verification-scout` for large diffs | 多镜像/生成物变更时隔离审查更有价值 | runtime delegation policy；Claude `.claude/agents` only if approved | Explicit approval |
| Low | plugins | Defer `plugin-dev` / `skill-creator` external plugin | 仓库确实是 plugin/skill 开发，但现有本地 workflow 已覆盖主要路径 | Codex/Claude/Cursor plugin install/cache | Explicit approval |
| Low | plugins | Reject broad code-review plugin by default | 已有 `review` skill 和 CI；容易重复并增加噪音 | 不安装 | No approval |
| Medium | CI | Keep SkillOpt no-secret eval workflow | 已覆盖 `harness-builder`、`brainstorm`、`plan`、`implement` canary eval | `.github/workflows/skillopt-evals.yml` | No approval |

**Details**
- Generated artifact ratchet: repo signal 是 `docs/skill-flow-review/*.html` 为生成物，且 `scripts/generate-skill-flow-html.mjs` 已存在；fallback 是人工运行生成脚本；verification probe 是 CI 中 `git diff --exit-code docs/skill-flow-review`; risk 是生成脚本会改工作区，适合 CI workspace，不适合 post-edit hook。
- `codex exec` smoke: repo signal 是当前 skill 明确支持 Recommendation Mode，且本机 check 输出检测到 `codex-cli 0.136.0`；fallback 是现有 deterministic eval；verification probe 是 read-only `codex exec` 产出可读报告；risk 是耗时/成本和本机权限差异，不应做 hard CI gate。
- Hooks: repo signal 是 `.env`、protected/generated paths、多镜像面；fallback 是 `scripts/agent/check.sh` 和 CI；verification probe 是 seeded forbidden path edit 被拦截；risk 是误拦正常恢复，所以 defer。
- GitHub MCP: repo signal 是 GitHub remote 和 workflows；fallback 是 `gh`/网页/CI badge/本地 workflow 文件；verification probe 是只读列出 workflow run；risk 是凭据和外部权限。
- Skills: `find-skills` 已存在且适合 future Capability Recommendation；本次没有跑 `npx skills find`，因为没有具体 React/DB/test/deploy 等外部 domain gap，且本次禁止安装。
- Subagents: repo signal 是 meaningful diff 常跨 root/plugin/Cursor/generated surfaces；fallback 是 `codex exec` reviewer packet；verification probe 是 reviewer 输出覆盖 git status、untracked、mirror drift；risk 是平台 subagent surface 不稳定，先 runtime-only。
- Plugins: repo 自身已是 plugin；外部 plugin 只在要标准化 plugin/skill 开发工具链时再评估；risk 是全局/cache 变更和重复能力。

**Next Choices**
1. 最小推荐：只批准 generated artifact CI ratchet。
2. 验证增强：批准 read-only `codex exec` smoke command/docs。
3. 自动化增强：等出现重复误改后，再批准 protected-path hook。
4. 外部能力：只有需要实时 GitHub Actions/PR truth 时，再审批 GitHub MCP。
5. 当前不建议安装任何 MCP/hooks/subagents/plugins/global config。
