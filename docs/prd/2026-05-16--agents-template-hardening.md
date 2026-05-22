# AGENTS Template Hardening Executable Plan

## Objective

修正 `harness-builder` 的 `AGENTS.md` 模板和配套辅助脚本，让它们符合当前仓库已经声明的 `selected recovery surface` 语义，而不是继续默认一套固定 `.harness/ + scripts/agent/check.sh` 安装形态。

## Planning Surface

- Surface: `plan document`
- Artifact: `docs/prd/2026-05-16--agents-template-hardening.md`
- Spec source: 用户已明确指出当前 `AGENTS.md` 模板不如参考方案，并要求先列计划再动手；当前仓库 `AGENTS.md`、模板文件、辅助脚本和审查结果已经足够定义边界。

## Active Slice

先把这次 `AGENTS` 模板改造的范围、顺序、验证和同步风险固定下来，再进入实现。

## Non-goals

- 不重写整个 `harness-builder` skill 主流程。
- 不新增 hooks、MCP、subagents 或用户级配置。
- 不把本仓库强行改成 `.harness` 重状态仓库。
- 不顺手重构无关 skill。

## Success Criteria

- `AGENTS.md.j2` 和 `AGENTS.template.md` 不再把固定 `.harness/*` 和 `scripts/agent/check.sh` 写成默认必选事实。
- 模板会明确：薄入口、source-of-truth priority、selected recovery surface、verification entry、protected paths、required reading、DoD。
- `validate_harness.py` 能区分 `plugin/lightweight/full` 之类的最小模式，不再对本仓库这类 plugin repo 误报缺 `.harness`。
- `scan_project.py` 能识别当前仓库是 plugin repo，并发现真实验证命令与多表面结构。
- `generate-skill-flow-html.mjs` 生成的 `harness-builder.html` 不再大面积出现“未抽取到条目”。
- 修改后相关验证通过，并保持 root / packaged / Cursor preview surface 一致。

## Verification Path

- 快速结构检查：
  - `node scripts/check-plugin.mjs`
  - `node scripts/check-claude-code-install.mjs`
  - `node scripts/check-cursor-install.mjs`
  - `node scripts/install-cursor.mjs --target . --dry-run`
- 生成物检查：
  - `node scripts/generate-skill-flow-html.mjs`
  - 抽查 `docs/skill-flow-review/harness-builder.html`
- Python helper 检查：
  - `python3 skills/harness-builder/scripts/scan_project.py`
  - `python3 skills/harness-builder/scripts/validate_harness.py <mode if added>`

## Work Items

### Phase 1 - Reconfirm implementation baseline

Purpose:
在真正进入实现前，再确认一次当前工作树、目标文件和镜像同步面，避免基线漂移。

Target files:
- `skills/harness-builder/scripts/scan_project.py`
- `plugins/harness-workflow/skills/harness-builder/scripts/scan_project.py`
- `.cursor/skills/harness-builder/scripts/scan_project.py`
- `scripts/check-plugin.mjs`
- `skills/harness-builder/templates/AGENTS.md.j2`
- `skills/harness-builder/templates/AGENTS.template.md`

Actions:
- 再次检查 `git status --short`。
- 重新读取目标模板和辅助脚本，锁定这次实现的 write set。
- 确认 root / packaged / Cursor preview 三套表面都在本次范围内。

Acceptance:
- 当前工作树状态清楚。
- 后续改造的 write set 清楚，不会遗漏镜像同步面。

### Phase 2 - Redesign AGENTS templates

Purpose:
把模板从“固定安装清单”改成“薄入口 + 恢复面声明 + 验证入口声明”。

Target files:
- `skills/harness-builder/templates/AGENTS.md.j2`
- `skills/harness-builder/templates/AGENTS.template.md`
- 对应 packaged / Cursor 镜像文件

Actions:
- 重写 Harness map，让它区分固定入口和可选/按项目选择的恢复面。
- 增加 source-of-truth priority、selected recovery surface、verification entry 的模板语言。
- 保持 root `AGENTS.md` 薄，不把活状态塞进去。
- 保留对 full harness 项目的兼容表达，但不再默认强绑 `.harness/*`。

Acceptance:
- 模板可用于 plugin repo、lightweight repo 和 full harness repo。
- 模板正文不再误导 agent 认为 `.harness/*` 永远存在。

### Phase 3 - Align helper scripts

Purpose:
让辅助脚本和新模板契约一致，不再用旧假设打脸新模板。

Target files:
- `skills/harness-builder/scripts/validate_harness.py`
- `skills/harness-builder/scripts/scan_project.py`
- `scripts/check-plugin.mjs`
- 对应 packaged / Cursor 镜像文件

Actions:
- 给 `validate_harness.py` 增加模式感知或 repo-shape 感知。
- 让 `scan_project.py` 识别 plugin manifests、rules、preview skills、真实 Node 验证脚本。
- 必要时给 `check-plugin.mjs` 增加模板/递归一致性检查，但不扩大到无关政策。

Acceptance:
- 当前仓库不再被 `validate_harness.py` 误判为缺失必需 `.harness`。
- `scan_project.py` 能把当前仓库识别为多表面 plugin repo，而不是 `unknown`。

### Phase 4 - Fix skill-flow review extraction

Purpose:
让 HTML 审阅页能读懂当前 `harness-builder` 的英文 heading 和新结构。

Target files:
- `scripts/generate-skill-flow-html.mjs`
- `docs/skill-flow-review/*.html`

Actions:
- 扩展 heading 抽取逻辑，支持当前 `SKILL.md` 的英文 section。
- 让流程步、输入、输出、验收、路由不再依赖旧中文标题。
- 重新生成 HTML。

Acceptance:
- `docs/skill-flow-review/harness-builder.html` 不再大面积出现“未抽取到条目”。
- 审阅页能反映 `Mandatory execution gates`、`Workflow`、`Output contract` 这类真实内容。

### Phase 5 - Final sync and verification

Purpose:
确保 root、packaged、Cursor preview surface 同步，并拿到 fresh evidence。

Target files:
- 本次所有改动文件

Actions:
- 同步 root / packaged / Cursor preview。
- 运行 Node 验证、dry-run、HTML 重建与抽查。
- 记录剩余风险和后续建议。

Acceptance:
- 所有相关校验通过。
- `git status --short` 只剩本次预期改动。

## Current Next Item

`Phase 1 - Reconfirm implementation baseline`

Reason:
当前实现会同时触及模板、辅助脚本和镜像表面；先锁定基线，再改代码更稳。

## Commit Units

1. `AGENTS` 模板与文案契约重写
2. helper scripts 对齐新契约
3. HTML 生成与镜像同步

## Known Risks / Blockers

- `skills/`、`plugins/harness-workflow/skills/`、`.cursor/skills/` 三套镜像必须一起维护。
- 现有模板占位符集合较少，若需要新增字段，必须确认生成链是否消费这些字段。
- helper 脚本和模板之间当前没有统一 mode contract，改一侧很容易让另一侧继续误报。

## Handoff

- Next skill: `implement`
- Entry condition:
  - 用户确认按本计划推进；
  - 先完成 `Phase 1` 的基线确认；
  - 再开始模板与脚本改造。
