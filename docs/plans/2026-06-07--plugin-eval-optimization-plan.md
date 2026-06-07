# Plugin Eval 优化计划

日期：2026-06-07

状态：待执行

计划承载面：`docs/plans/`

需求来源：用户要求“按照 Plugin Eval skill 给一份修改计划文档”。当前目标、边界和验证策略已经足够清楚，因此不单独创建 Spec。

## 目标

把 `harness-workflow` 从 Plugin Eval 判定的高风险状态推进到可发布、可验证、可持续优化的状态，同时保持 Harness Method Contract 的核心语义不变。

本计划不重写 workflow 方法论，只修复 Plugin Eval 和仓库自检暴露的结构、包装、token 成本和可测性问题。

## 当前证据

Plugin Eval 评估对象：`plugins/harness-workflow`

最新命令证据：

```text
node C:\Users\shash\.codex\plugins\cache\openai-curated\plugin-eval\3f0def1b\scripts\plugin-eval.js start plugins/harness-workflow --request "请给我一份修改计划文档" --format markdown
结果：推荐路径为 Evaluate Plugin；没有 benchmark 配置；没有 usage log。

node C:\Users\shash\.codex\plugins\cache\openai-curated\plugin-eval\3f0def1b\scripts\plugin-eval.js analyze plugins/harness-workflow --format markdown
结果：Score 0/100，Grade F，Risk high，6 个 fail，15 个 warn，2 个 info。

node C:\Users\shash\.codex\plugins\cache\openai-curated\plugin-eval\3f0def1b\scripts\plugin-eval.js explain-budget plugins/harness-workflow --format markdown
结果：trigger_cost_tokens 564，invoke_cost_tokens 16496，deferred_cost_tokens 34593，total_tokens 51653。

node scripts/check-plugin.mjs
结果：FAIL，packaged plugin 中的 brainstorm skill 与根目录 canonical skill 漂移。

node scripts/check-cursor-install.mjs
结果：FAIL，Cursor project-preview 中的 brainstorm/SKILL.md 与 canonical skill 漂移。

node scripts/check-claude-code-install.mjs
结果：PASS。

node scripts/install-cursor.mjs --target . --dry-run
结果：PASS。
```

计划创建时的已知 dirty worktree：

```text
M .gitignore
M skills/brainstorm/SKILL.md
?? .codex/
?? revise_plan.md
```

除非用户明确批准，不把这些无关改动混入本计划的实施提交。

## 当前 Active Slice

第一个 active slice：恢复本地插件包和多端镜像的一致性，然后按 commit-sized 步骤处理 Plugin Eval 结构性失败。

同一时间只允许一个实施切片处于进行中。第一个实施切片是 **P1：修复 brainstorm 漂移并同步插件镜像**。

## 非目标

- 不重命名八条 active workflow lane。
- 不把 `harness-builder` 改成所有任务的强制前置步骤。
- 不移除 `find-skills`；它仍然是 helper，不是第九条 workflow lane。
- 不改变 `verify` 是唯一 ready gate 的规则。
- 本轮优化不安装 hooks、MCP 配置、subagents 或用户级 Codex 配置。
- 除非验证检查要求，不重写无关 README、deck、PRD 或生成物。

## 成功标准

1. 仓库结构验证通过：
   - `node scripts/check-plugin.mjs`
   - `node scripts/check-claude-code-install.mjs`
   - `node scripts/check-cursor-install.mjs`
   - `node scripts/install-cursor.mjs --target . --dry-run`
2. `plugins/harness-workflow` 的 Plugin Eval manifest failure 消失。
3. Plugin Eval budget failure 被降低，或转化为有真实测量证据支撑的取舍说明。
4. 通过改写 frontmatter description，减少 skill trigger warning；目标格式可以保留 Plugin Eval 要求的 `Use when...` 触发句。
5. 任何 token 瘦身都必须保留 `docs/harness-method-contract.md` 中的方法论不变量。
6. 任何脚本重构都必须保持行为，并为被改 helper 增加至少一个小型本地验证路径。
7. 每个里程碑在 review + verify 后用简短中文 commit message 提交。

## 验证路径

验证路径状态：可运行

必跑命令：

```text
node scripts/check-plugin.mjs
node scripts/check-claude-code-install.mjs
node scripts/check-cursor-install.mjs
node scripts/install-cursor.mjs --target . --dry-run
node C:\Users\shash\.codex\plugins\cache\openai-curated\plugin-eval\3f0def1b\scripts\plugin-eval.js analyze plugins/harness-workflow --format markdown
node C:\Users\shash\.codex\plugins\cache\openai-curated\plugin-eval\3f0def1b\scripts\plugin-eval.js explain-budget plugins/harness-workflow --format markdown
git status --short
```

配置 benchmark 后的可选命令：

```text
node C:\Users\shash\.codex\plugins\cache\openai-curated\plugin-eval\3f0def1b\scripts\plugin-eval.js init-benchmark plugins/harness-workflow
node C:\Users\shash\.codex\plugins\cache\openai-curated\plugin-eval\3f0def1b\scripts\plugin-eval.js benchmark plugins/harness-workflow --dry-run
```

Fallback evidence：当前不需要。核心检查都是本地可运行命令。

最终集成声明：打包后的 `harness-workflow` 插件在 Codex、Claude Code、Cursor 三个 surface 上结构一致，并且 Plugin Eval 不再报告可避免的 manifest/package failure。

## 工作项

| ID | 状态 | 范围 | 主要检查 |
| --- | --- | --- | --- |
| P0 | 已完成 | 根据 Plugin Eval 证据写出本计划 | 计划文档存在于 `docs/plans/` |
| P1 | 下一步 | 修复 `brainstorm` 漂移，必要时重新生成或同步镜像 surface | `check-plugin`、`check-cursor-install` |
| P2 | 待处理 | 补齐 Codex manifest 元数据，必要时添加 legal docs | Plugin Eval manifest checks、`check-plugin` |
| P3 | 待处理 | 把 skill description 改成更强的触发句 | Plugin Eval skill description warnings |
| P4 | 待处理 | 精简高成本 `SKILL.md`，但不改变方法语义 | Plugin Eval budget、contract checks |
| P5 | 待处理 | 用最小重构和测试处理 Python helper warning | Plugin Eval Python warnings、相关 helper 检查 |
| P6 | 待处理 | 添加 benchmark starter scenarios，并比较优化前后结果 | Plugin Eval benchmark dry-run/report |
| P7 | 待处理 | 最终 review、verify、cleanup 和里程碑提交 | 全部必跑命令、干净的相关 diff |

## 阶段详情

### P1 - 修复 Brainstorm 漂移

改动范围：

- 从 `skills/brainstorm/SKILL.md` 删除误写的 `plan` 和 `1`。
- 将 canonical skill 内容同步到 `plugins/harness-workflow/skills/brainstorm/SKILL.md`。
- 将 canonical skill 内容同步到 `.cursor/skills/brainstorm/SKILL.md`，或按既有路径运行 Cursor adapter。

验收标准：

- `skills/brainstorm/SKILL.md`、`plugins/harness-workflow/skills/brainstorm/SKILL.md`、`.cursor/skills/brainstorm/SKILL.md` 内容一致。
- 没有暂存无关 dirty 文件。
- 除删除误写文本外，不改变方法语义。

验证命令：

```text
node scripts/check-plugin.mjs
node scripts/check-cursor-install.mjs
git diff -- skills/brainstorm/SKILL.md plugins/harness-workflow/skills/brainstorm/SKILL.md .cursor/skills/brainstorm/SKILL.md
```

成功定义：本地 package/Cursor drift failure 消失。

### P2 - 修复 Manifest 元数据

改动范围：

- 在 `.codex-plugin/plugin.json` 中添加缺失的 `author`。
- 添加 `interface.websiteURL`、`interface.privacyPolicyURL`、`interface.termsOfServiceURL`。
- 将 manifest 同步到 `plugins/harness-workflow/.codex-plugin/plugin.json`。
- 如果没有稳定的隐私政策或服务条款 URL，则在 `docs/legal/` 下添加极简静态文档，并链接到稳定的公开 GitHub URL 或已记录的公开 URL。
- 如果公共元数据约定发生变化，保持 `.claude-plugin/` 和 `.cursor-plugin/` 版本语义一致。

验收标准：

- Plugin Eval 不再报告：
  - `manifest-missing-author`
  - `interface-missing-websiteURL`
  - `interface-missing-privacyPolicyURL`
  - `interface-missing-termsOfServiceURL`
- `node scripts/check-plugin.mjs` 仍然通过。

验证命令：

```text
node scripts/check-plugin.mjs
node C:\Users\shash\.codex\plugins\cache\openai-curated\plugin-eval\3f0def1b\scripts\plugin-eval.js analyze plugins/harness-workflow --format markdown
```

成功定义：Plugin Eval 中所有可避免的 manifest failure 消失。

### P3 - 优化触发描述

改动范围：

- 将所有 active skill 的 frontmatter description 改写为清晰的英文 `Use when...` 触发句。
- 正文中的中文解释按需保留。
- description 保持简洁，避免明显增加 trigger cost。
- 同步 packaged plugin 和 Cursor 镜像 skill。

验收标准：

- Plugin Eval 的 description-trigger warning 减少或消失。
- 每个 skill 的 `name` 仍然匹配目录名。
- 每个 `SKILL.md` 保留 YAML frontmatter 和 `## Recommended next skill`。

验证命令：

```text
node scripts/check-plugin.mjs
node scripts/check-cursor-install.mjs
node C:\Users\shash\.codex\plugins\cache\openai-curated\plugin-eval\3f0def1b\scripts\plugin-eval.js analyze plugins/harness-workflow --format markdown
```

成功定义：触发描述更清楚，同时不破坏 skill 发现和镜像一致性。

### P4 - 降低 Token 成本

改动范围：

- 先处理 invoke token 最大的组件：
  - `skills/harness-builder/SKILL.md`，约 5186 tokens。
  - `skills/plan/SKILL.md`，约 1846 tokens。
  - `skills/verify/SKILL.md`，约 1792 tokens。
  - `skills/find-skills/SKILL.md`，约 1666 tokens。
  - `skills/cleanup/SKILL.md`，约 1443 tokens。
- 每个主 `SKILL.md` 只保留 routing、mandatory gates、紧凑 workflow、output contract 和 references。
- 首次调用不需要的细节移入 `references/`。
- 如果某些全局方法说明已经由 `docs/harness-method-contract.md` 覆盖，则减少重复表述。

验收标准：

- `invoke_cost_tokens` 低于当前 16496 的估算值。
- `trigger_cost_tokens` 不高于当前 564。
- contract-critical phrases 仍然通过 `scripts/check-plugin.mjs`。
- 如果 `SKILL.md` 结构改变，生成的 skill-flow HTML 仍然正确。

验证命令：

```text
node scripts/check-plugin.mjs
node scripts/generate-skill-flow-html.mjs
node scripts/check-plugin.mjs
node C:\Users\shash\.codex\plugins\cache\openai-curated\plugin-eval\3f0def1b\scripts\plugin-eval.js explain-budget plugins/harness-workflow --format markdown
node C:\Users\shash\.codex\plugins\cache\openai-curated\plugin-eval\3f0def1b\scripts\plugin-eval.js analyze plugins/harness-workflow --format markdown
```

成功定义：active budget 明显下降，同时方法覆盖检查仍然通过。

### P5 - 重构 Helper 脚本告警

改动范围：

- 检查 Plugin Eval 对 packaged helper scripts 的 Python warning。
- 优先处理高复杂度 helper，例如 `skills/harness-builder/scripts/scan_project.py` 和 `validate_harness.py`。
- 只在行为仍然清楚的地方把复杂函数拆成具名 helper。
- 如果仓库没有 Python 测试框架，则添加最小本地测试或 smoke command。

验收标准：

- Plugin Eval 的 Python complexity 和 long-line warning 减少。
- 被改脚本仍能以预期本地模式运行。
- 除非确有必要，不引入 package manager 或新的测试框架。

验证命令：

```text
node C:\Users\shash\.codex\plugins\cache\openai-curated\plugin-eval\3f0def1b\scripts\plugin-eval.js analyze plugins/harness-workflow --format markdown
node scripts/check-plugin.mjs
```

额外的定向命令应在读取被改脚本后再选择。

成功定义：helper 脚本更容易检查，同时保持当前行为。

### P6 - 添加 Benchmark Starter Scenarios

改动范围：

- 初始化 `.plugin-eval/benchmark.json`。
- 添加代表性场景：
  - 评估 plugin 健康度。
  - 修复 packaging drift。
  - 精简 skill 且不破坏 contract checks。
  - 验证 ready claim。
  - workflow 改动后的 cleanup。
- benchmark 数据保持本地、轻量。

验收标准：

- benchmark config 存在并有文档说明。
- dry-run 成功。
- 计划或后续记录说明如何收集 observed usage。

验证命令：

```text
node C:\Users\shash\.codex\plugins\cache\openai-curated\plugin-eval\3f0def1b\scripts\plugin-eval.js init-benchmark plugins/harness-workflow
node C:\Users\shash\.codex\plugins\cache\openai-curated\plugin-eval\3f0def1b\scripts\plugin-eval.js benchmark plugins/harness-workflow --dry-run
```

成功定义：未来 Plugin Eval 报告可以基于真实场景覆盖，而不只依赖静态结构。

### P7 - 最终 Review、Verify 和 Cleanup

改动范围：

- 对变更后的 manifests、skills、mirrors、scripts、docs 和 generated files 做结构性 review。
- 运行 fresh verification commands。
- 只有当用户可见元数据或命令发生变化时，才同步 README 或 install docs。
- 保持 `AGENTS.md` 为薄入口；不把会话状态写进去。

验收标准：

- 没有 Critical review finding。
- 所有必跑检查通过，或有明确 blocker。
- Plugin Eval 报告相对 baseline 有改善。
- `git status --short` 能区分本轮优化改动和既有无关 dirty 文件。

验证命令：

```text
node scripts/check-plugin.mjs
node scripts/check-claude-code-install.mjs
node scripts/check-cursor-install.mjs
node scripts/install-cursor.mjs --target . --dry-run
node C:\Users\shash\.codex\plugins\cache\openai-curated\plugin-eval\3f0def1b\scripts\plugin-eval.js analyze plugins/harness-workflow --format markdown
node C:\Users\shash\.codex\plugins\cache\openai-curated\plugin-eval\3f0def1b\scripts\plugin-eval.js explain-budget plugins/harness-workflow --format markdown
git status --short
```

成功定义：插件具备带 fresh evidence 的里程碑提交或后续 PR 条件。

## 提交单元

| 提交单元 | 范围 | 包含阶段 | 提交前置条件 | 建议中文提交信息 |
| --- | --- | --- | --- | --- |
| CU1 | 恢复包一致性 | P1 | review 无 Critical + verify PASS | `修复 brainstorm skill 同步漂移` |
| CU2 | manifest 元数据 | P2 | review 无 Critical + verify PASS | `补齐 Codex 插件元数据` |
| CU3 | 触发描述 | P3 | review 无 Critical + verify PASS | `优化 workflow skill 触发描述` |
| CU4 | token 瘦身 | P4 | review 无 Critical + verify PASS | `精简 workflow skill 主入口` |
| CU5 | helper 脚本质量 | P5 | review 无 Critical + verify PASS | `降低 harness-builder 脚本复杂度` |
| CU6 | Plugin Eval benchmark | P6 | review 无 Critical + verify PASS | `添加插件评估基准场景` |
| CU7 | 最终收尾 | P7 | verify PASS | `同步插件优化收尾文档` |

## 风险和决策

| 风险 | 影响 | 缓解方式 |
| --- | --- | --- |
| token 瘦身误删方法护栏 | agent 可能跳过必需 gate | 以 `docs/harness-method-contract.md` 为不变量来源，每个 slice 后运行 `check-plugin` |
| 镜像 surface 再次漂移 | Codex/Cursor package checks 失败 | 先更新 canonical skills，再在同一提交单元同步 mirrors |
| 修完 manifest 后 Plugin Eval 分数仍然偏低 | 静态 evaluator 可能继续惩罚 budget | 先添加 benchmark 和 observed usage 路径，再继续过度压缩文字 |
| legal URL 元数据不明确 | manifest 可能链接到不稳定 URL | 优先使用稳定仓库文档或公开 GitHub URL |
| 既有 dirty 文件干扰 review | 误暂存无关改动 | 使用 `git diff -- <paths>` 检查，并只暂存当前提交单元文件 |

## 交接

下一步 skill：`implement`

原因：第一个 active slice 范围很小、验证可运行：修复 `brainstorm` 漂移并同步 package mirrors。

在 P1 有 fresh verification evidence 之前，不开始 P2。在 manifest failure 和 package drift 解决之前，不开始大范围 token 瘦身。
