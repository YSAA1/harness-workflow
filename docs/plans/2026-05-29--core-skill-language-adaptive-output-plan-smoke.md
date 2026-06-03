只读了 `skills/plan/SKILL.md` 和 `skills/plan/templates/*`，未修改文件。

```text
EXECUTABLE PLAN WRITTEN

计划面 / Planning surface: docs plan
工件 / Artifact: n/a，本次按要求只输出示例，不写入文件
Spec 来源 / Spec source: 用户提供的已批准中文 Spec
Active slice / Active slice: 优化 CLI 配置加载失败时的用户可见错误提示
Success criteria / Success criteria: 错误提示同时包含配置文件路径、失败原因、可执行修复建议，且不改变配置格式
Verification path status / Verification path status: runnable
Required capabilities / Required capabilities: Node.js、本仓库脚本、CLI smoke 命令
Fallback evidence / Fallback evidence: none
Final integration claim / Final integration claim: CLI 配置加载错误提示已覆盖路径、原因、修复建议，并通过结构检查和 smoke 验证
Next skill / Next skill: implement
Reason / Reason: Spec、non-goals、成功标准和验证路径已明确，可以进入实现

阶段 1 - 定位 CLI 配置加载错误出口：`in_progress`
acceptance_criteria: 找到负责读取配置和格式化错误提示的最小代码路径。
verification_commands: `node scripts/check-plugin.mjs`
success_definition: 能明确后续只需修改错误提示生成逻辑，不改配置格式。

阶段 2 - 实现错误提示优化：`pending`
acceptance_criteria: 配置加载失败输出包含配置文件路径、失败原因、可执行修复建议。
verification_commands: `node scripts/check-plugin.mjs`
success_definition: 用户看到错误后能知道哪个配置文件坏了、为什么坏、下一步怎么修。

阶段 3 - 验证与收尾：`pending`
acceptance_criteria: 结构检查通过，CLI smoke 覆盖坏配置路径。
verification_commands: `node scripts/check-plugin.mjs`, `CLI smoke: 使用一个无效配置文件触发加载失败并检查输出`
success_definition: fresh evidence 证明成功标准成立，且 non-goal “不改配置格式” 未被突破。

Commit unit:
M1 | 阶段 1-3 | CLI 配置加载错误提示 | review 无 Critical + verify PASS | 优化 CLI 配置加载错误提示
```