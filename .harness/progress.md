# Progress / Evidence

## 2026-06-24

- 用户确认：①非平凡 Design Grill 强制 ②Work Index 必填 ③统一 `.harness/` ④dogfood + 验证
- 更新 `recovery_surface_policy.md`、`recovery_policy.md`、`plan/SKILL.md`、`CONTEXT.md`
- 待验证：`check-plugin.mjs`、`check-cursor-install.mjs`

## 2026-06-24 — harness-builder slimming review fix

- 用户担忧：`harness-builder` 默认流程太沉，legacy root three-file 模板仍可能误导 agent，`.harness` 运行时纪律需要更硬。
- 改动：`skills/harness-builder/SKILL.md` 增加 Quick repair / Full recommendation 分流；`recommendation_matrix_policy.md` 限制 Quick repair 默认矩阵行；`plan/SKILL.md` 和 `skills/plan/templates/` 将 root three-file 降级为 legacy migration reference。
- 同步：`plugins/harness-workflow/skills/`、`.cursor/skills/`、`docs/skill-flow-review/*.html` 已同步。
- 验证：
  - `node scripts/generate-skill-flow-html.mjs` -> PASS，生成 9 个 HTML 文件
  - `node scripts/check-plugin.mjs` -> PASS
  - `node scripts/check-claude-code-install.mjs` -> PASS
  - `node scripts/check-cursor-install.mjs` -> PASS
  - `node scripts/install-cursor.mjs --target . --dry-run` -> PASS
  - `bash scripts/agent/check.sh` -> PASS
- Review：已启动只读隔离 reviewer `019ef979-e693-7682-8b01-37c0899cac3c`，等待结果。
- Review result：`CONDITIONAL`，Important findings 指向 `plan` 把 `.harness sync` 混成 Planning Surface，以及按需读取误指 `../harness-builder/templates/`；Minor finding 指向 Quick repair 矩阵范围两套说法。
- Follow-up fixes：`plan/SKILL.md` 改为 Planning Surface 只包含 `docs plan | issue | feature-list | existing`，`.harness` 作为 runtime sync；按需读取改为使用本 `SKILL.md` 的 Executable Plan 字段结构；`recommendation_matrix_policy.md` 改为 Quick repair 省略 out-of-scope rows。
- Re-verification：
  - `node scripts/generate-skill-flow-html.mjs` -> PASS，生成 9 个 HTML 文件
  - `node scripts/check-plugin.mjs` -> PASS
  - `node scripts/check-claude-code-install.mjs` -> PASS
  - `node scripts/check-cursor-install.mjs` -> PASS
  - `node scripts/install-cursor.mjs --target . --dry-run` -> PASS
  - `bash scripts/agent/check.sh` -> PASS
  - targeted `rg` for stale `.harness sync` planning surface / default three-file / stale `findings.md` fallback -> only explicit prohibition or historical decision entries remain
