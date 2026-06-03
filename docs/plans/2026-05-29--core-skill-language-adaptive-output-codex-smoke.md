# Codex Exec Smoke - 核心 Skill 语言自适应输出

> Status: passed
> Date: 2026-05-29
> Plan: `docs/plans/2026-05-29--core-skill-language-adaptive-output-plan.md`

## 目的

记录最后一次相关修改后的真实 `codex exec` 中文 smoke。这个文件是当前任务的 evidence log，不替代 `verify` ready gate。

## Smoke 场景

| 场景 | 命令 | 期望 | 状态 |
| --- | --- | --- | --- |
| brainstorm 中文 brief | `codex exec --ephemeral --sandbox read-only -C /home/ssy/桌面/harness-workflow -o docs/plans/2026-05-29--core-skill-language-adaptive-output-brainstorm-smoke.md ...` | 澄清输出、Coverage、Spec 契约中文为主；协议 token 稳定 | passed |
| plan 中文 brief | `codex exec --ephemeral --sandbox read-only -C /home/ssy/桌面/harness-workflow -o docs/plans/2026-05-29--core-skill-language-adaptive-output-plan-smoke.md ...` | Plan 输出中文为主；`runnable | blocked`、路径、命令、skill 名稳定 | passed |
| harness-builder 中文 brief | `codex exec --ephemeral --sandbox read-only -C /home/ssy/桌面/harness-workflow -o docs/plans/2026-05-29--core-skill-language-adaptive-output-harness-smoke.md ...` | Harness Charter、Coverage Matrix、User Checkpoint 中文为主，必要英文 token 有中文标签 | passed |

## 结果记录

### brainstorm

- Command:
  - `codex exec --ephemeral --sandbox read-only -C /home/ssy/桌面/harness-workflow -o docs/plans/2026-05-29--core-skill-language-adaptive-output-brainstorm-smoke.md "请只阅读本仓库的 skills/brainstorm/SKILL.md 和相关 references/templates，不要修改文件。模拟一个中文用户请求：先 brainstorm，优化一个 CLI 工具的配置加载错误提示。输出一次 Phase A 或 Phase B 的示例结果。要求：中文为主；稳定协议 token 保持；不要原样输出 占位标签 占位。"`
- Result: pass
- Output artifact: `docs/plans/2026-05-29--core-skill-language-adaptive-output-brainstorm-smoke.md`
- Output summary: 产出 Phase A 示例，包含澄清覆盖矩阵、单一问题和推荐回答。
- Language assessment: 中文为主，英文只作为稳定 token、双语标签或枚举值出现。
- Protocol token assessment: 保留 `BRAINSTORM CLARIFICATION IN PROGRESS`、`Spec`、`Coverage`、`Gate`、`Next skill after approval: plan`；未出现原样 `占位标签` 占位。

### plan

- Command:
  - `codex exec --ephemeral --sandbox read-only -C /home/ssy/桌面/harness-workflow -o docs/plans/2026-05-29--core-skill-language-adaptive-output-plan-smoke.md "请只阅读本仓库的 skills/plan/SKILL.md 和 templates，不要修改文件。给定已批准中文 Spec：目标是优化 CLI 配置加载错误提示；非目标是不改配置格式；成功标准是错误提示含配置文件路径、失败原因和可执行修复建议；验证是 node scripts/check-plugin.mjs 加一个 CLI smoke。请输出一个简短 Executable Plan 示例。要求：中文为主；保留 runnable、blocked、skill 名、路径和命令等稳定 token；不要原样输出 占位标签 占位。"`
- Result: pass
- Output artifact: `docs/plans/2026-05-29--core-skill-language-adaptive-output-plan-smoke.md`
- Output summary: 产出简短 Executable Plan 示例，包含 active slice、success criteria、阶段、验证命令和 commit unit。
- Language assessment: 中文为主，保留 `Executable Plan`、`runnable`、skill 名、路径和命令。
- Protocol token assessment: 保留 `EXECUTABLE PLAN WRITTEN`、`Verification path status: runnable`、`Next skill: implement`；未出现原样 `占位标签` 占位。

### harness-builder

- Command:
  - `codex exec --ephemeral --sandbox read-only -C /home/ssy/桌面/harness-workflow -o docs/plans/2026-05-29--core-skill-language-adaptive-output-harness-smoke.md "请只阅读本仓库的 skills/harness-builder/SKILL.md 和核心 templates，不要修改文件。模拟中文用户要求：基于当前小型仓库做 read-only harness audit，并停在 USER CHECKPOINT 前。输出 Harness Evidence、Harness Charter、Coverage Matrix、User Checkpoint 示例。要求：中文为主；协议 token 行必须 exact，例如 USER CHECKPOINT 单独一行；保留必要英文 token；不要原样输出 占位标签 占位。"`
- Result: pass
- Output artifact: `docs/plans/2026-05-29--core-skill-language-adaptive-output-harness-smoke.md`
- Output summary: 产出 read-only Harness Evidence、Harness Charter、Coverage Matrix 和 USER CHECKPOINT 示例。
- Language assessment: 中文为主，Capability、Recovery surface、Coverage Matrix 等必要术语保留英文 token 或中英并列。
- Protocol token assessment: `HARNESS EVIDENCE`、`HARNESS CHARTER`、`HARNESS COVERAGE MATRIX`、`USER CHECKPOINT` 均为独立 exact token 行；未出现原样 `占位标签` 占位。

## 失败处理

如果 `codex exec` 因 auth、网络、sandbox、模型或 token 限制失败，记录命令、退出码、错误摘要和影响；不能用静态检查结果替代真实 smoke 通过。
