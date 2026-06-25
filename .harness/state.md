# Harness State（Hot Index）

本文件是热恢复索引，不是追加式报告。

## Objective

收紧 `harness-builder` 的 `check.sh` 生成协议，防止真实项目把 `scripts/agent/check.sh` 退化成"历史快照断言机"——硬编码 run_id、测试计数、实验数值、recovery surface 字面内容。

## Active slice

在 `verification_policy.md`、`check.sh.j2`、`anti_entropy.md` 三处加结构性约束，并在 `check-plugin.mjs` 加 token 断言验证约束在场。

## Non-goals

- 不改 `harness-builder` 的 Recommendation Matrix 行结构。
- 不改 `recovery_policy.md` 会话启动顺序（check.sh 仍在第 5 步，但约束它不脆）。
- 不改 `check.sh` 模板的 `{{ check_commands }}` 注入点（保持生成自由度，只加边界）。

## Current phase

implement → verify

## Success criteria

- `verification_policy.md` 明确禁止 fragile check patterns：run_id 字面值、测试计数、实验数值、recovery surface 字段值字面镜像、文件系统镜像式 required_files。
- `check.sh.j2` 顶部注释包含结构性禁令，不止 "Keep this command short"。
- `anti_entropy.md` 把 "check/selftest scripts must not mirror recovery state" 落成可执行判定。
- `check-plugin.mjs` 断言三处 token 在场，防止约束被无声删掉。
- 三端同步：root skills → `plugins/harness-workflow/skills` → `.cursor/skills`。
- `node scripts/check-plugin.mjs`、`node scripts/check-claude-code-install.mjs`、`node scripts/check-cursor-install.mjs`、`node scripts/install-cursor.mjs --target . --dry-run`、`bash scripts/agent/check.sh` PASS。

## Verification path

```bash
node scripts/check-plugin.mjs
node scripts/check-claude-code-install.mjs
node scripts/check-cursor-install.mjs
node scripts/install-cursor.mjs --target . --dry-run
bash scripts/agent/check.sh
```

## Next actions

- 改 `verification_policy.md`
- 改 `check.sh.j2`
- 改 `anti_entropy.md`
- 改 `check-plugin.mjs` 加断言
- 三端同步
- 验证 + commit

## Risks

- 约束写得过死可能让简单项目的 check.sh 也无法生成；用"禁止字面镜像 + 允许结构化提取"留口子。
- token 断言只能证明约束文本在场，不能证明生成者真的遵守；这是 check 脚本能做的上限。
