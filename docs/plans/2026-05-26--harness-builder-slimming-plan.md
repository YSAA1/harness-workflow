# Harness Builder 瘦身与资产降噪 Executable Plan

## Objective

把已批准的 `Harness Builder 瘦身与资产降噪 Spec` 转成可执行工作合同：在不破坏 `harness-builder` 核心能力和现有 workflow 路由的前提下，完成主 skill 瘦身、资产层审计、冗余资产处理、ownership / reachability 验证和三端同步。

## Planning Surface

- Surface: `plan document`
- Artifact: `docs/plans/2026-05-26--harness-builder-slimming-plan.md`
- Spec source: `docs/specs/2026-05-26--harness-builder-slimming.md`
- Reason: 当前 canonical plan artifact surface 是 `docs/plans/`；AGENTS.md 声明 lightweight state，当前任务需要 durable plan，但不需要引入 three-file backend。

## Active Slice

完成 `harness-builder` 第一轮保能力降噪：建立资产审计表，瘦身主 `SKILL.md`，处理无主或低价值附属资产，新增最小 ownership / reachability 检查，并保持 root / packaged / Cursor 三端同步。

## Non-goals

- 不重写整个 `harness-workflow`。
- 不新增 public workflow lane。
- 不取消 `harness-builder` 作为 canonical 项目 harness skill 的定位。
- 不删除 Research Route、Capability Discovery、recovery surface、verification、anti-entropy、hooks/MCP/subagents/skills 按需决策这些核心能力。
- 不为了行数好看大砍功能。
- 不默认安装 hooks、MCP、用户级配置或外部 marketplace。
- 不把项目改成新的状态系统或 workflow runner。
- 不在 `AGENTS.md` 写入本次临时计划状态。

## Success Criteria

- 主要 workflow 路由仍成立：`brainstorm -> plan -> harness-builder -> implement/review/verify/cleanup` 语义不被破坏。
- `harness-builder` 仍能落地用户的核心 harness engineering 思路：
  - project harness 设计；
  - project map / thin entry；
  - selected recovery surface；
  - verification path / fresh evidence；
  - Capability Discovery；
  - Research Route；
  - anti-entropy；
  - hooks / MCP / subagents / skills 的按需判断。
- `skills/harness-builder/SKILL.md` 从重说明文档收敛为 controller：触发、硬门禁、执行骨架、输出契约、关键 routing 保留，重复解释下沉或删除。
- `skills/harness-builder/` 附属资产都有分类：`keep / merge / downgrade / archive / delete`。
- 每个保留核心资产都有 owner gate、coverage row、read_when 或验证价值。
- 每个删除、合并、降级、归档项都有理由和替代路径。
- 新增或更新的检查能发现无 owner 的新增 reference/template/script。
- root canonical、`plugins/harness-workflow/`、`.cursor/skills/` 三端递归一致。
- 全部相关验证命令通过，或阻塞项被明确记录且不声明 ready。

## Verification Path

Verification path status: `runnable`

Required capabilities:

- 本地 Node 脚本：`scripts/check-*.mjs`、`scripts/install-cursor.mjs`、`scripts/generate-skill-flow-html.mjs`。
- 本地 Python：用于 `skills/harness-builder/scripts/*.py` 校验和新增 ownership / reachability 检查。
- 本地 git：检查工作区、diff、commit unit。
- 不需要网络、浏览器、MCP、外部 API 或用户级配置。

Fallback evidence: `none`。当前验证路径可本地运行；如果后续某个新增 smoke prompt 无法自动化，则必须记录为 manual check，而不能替代结构验证。

Final integration claim:

```text
harness-builder 保留核心 harness engineering 能力，同时主入口和资产层噪音下降；三端插件表面一致；资产 ownership / reachability 检查可以防止无主文件继续堆积。
```

## Baseline Evidence To Collect Before Implementation

必须在 Phase 1 重新收集，不使用旧聊天结论替代：

```bash
git status --short
git rev-parse HEAD origin/master
git log --oneline -10
wc -l skills/harness-builder/SKILL.md
find skills/harness-builder -type f | sort
find skills/harness-builder -type f | wc -l
node scripts/check-plugin.mjs
node scripts/check-claude-code-install.mjs
node scripts/check-cursor-install.mjs
node scripts/install-cursor.mjs --target . --dry-run
```

如果 Python helper 会被修改，还要在基线中确认：

```bash
python skills/harness-builder/scripts/scan_project.py
python scripts/validate_harness.py
```

第二条命令的 cwd 应为 `skills/harness-builder/`，或在命令中改成正确相对路径。

## Work Items

### Phase 1 - Reconfirm Baseline And Asset Inventory

Purpose:
锁定当前真实资产面和验证基线，避免靠印象做删改。

Actions:

- 检查 git 状态、HEAD 与 origin/master。
- 读取 `skills/harness-builder/SKILL.md`、关键 references、templates、scripts、schemas、evals。
- 生成完整资产清单，至少包含 path、类型、行数、当前引用点、是否三端同步。
- 记录当前 `SKILL.md` 行数、`harness-builder` 文件总数、当前验证结果。
- 标记 protected / generated 路径，避免手改生成物或漏同步镜像面。

acceptance_criteria:

- 有完整资产清单，覆盖 `references/**`、`templates/**`、`scripts/**`、`schemas/**`、`evals/**`。
- 当前三端同步状态已记录。
- 当前验证命令结果已记录。
- 工作区中已有用户改动已识别，不被覆盖。

verification_commands:

```bash
git status --short
git rev-parse HEAD origin/master
wc -l skills/harness-builder/SKILL.md
find skills/harness-builder -type f | sort
find skills/harness-builder -type f | wc -l
node scripts/check-plugin.mjs
node scripts/check-claude-code-install.mjs
node scripts/check-cursor-install.mjs
node scripts/install-cursor.mjs --target . --dry-run
```

success_definition:
当前状态和资产面被真实记录，后续瘦身有可比较 baseline。

### Phase 2 - Define Asset Classification And Ownership Contract

Purpose:
先定义“什么该留、什么该删”，防止资产处理变成主观大砍。

Actions:

- 新增或更新资产审计 / routing artifact，例如 `skills/harness-builder/references/asset-routing.md`。
- 定义分类：`keep / merge / downgrade / archive / delete`。
- 对每类写明判断标准：
  - 是否支撑核心能力；
  - 是否有 owner gate；
  - 是否绑定 coverage row；
  - 是否有 read_when；
  - 是否有验证或生成路径；
  - 是否只是 AI 常识、理念重复或历史沉积。
- 给每个核心能力列出必须保留的最小资产集合。
- 明确 archive / downgrade 的目标位置和触发方式。

acceptance_criteria:

- 分类标准足够具体，两个实现者不会对同一资产得出完全相反结论。
- 核心能力有最小保留清单。
- 删除或降级必须要求替代路径。
- asset routing 不成为新的大而全说明文档。

verification_commands:

```bash
rg -n "keep|merge|downgrade|archive|delete|owner gate|coverage row|read_when" skills/harness-builder
node scripts/check-plugin.mjs
```

success_definition:
资产审计有统一规则，后续每个删改都能追溯到分类标准。

### Phase 3 - Slim `harness-builder/SKILL.md` Into Controller

Purpose:
把主 skill 从重说明文档收敛成行为入口，减少模型加载时的噪音。

Actions:

- 保留 frontmatter、Routing Snapshot、Hard rules、Mandatory gates、Workflow skeleton、Output contract、Recommended next skill。
- 删除或下沉重复解释、长背景、过细 policy 细节。
- 用明确 read_when 指向按需 reference，而不是在主文件展开所有细节。
- 确保主 skill 仍明确：
  - evidence first；
  - Harness Charter；
  - Coverage Matrix；
  - Capability Discovery；
  - Pack Selection；
  - User Checkpoint；
  - Verification gate；
  - Research Graduation gate。
- 同步更新 packaged plugin 和 Cursor preview skill。

acceptance_criteria:

- `SKILL.md` 更短且语义完整；目标不是固定行数，但应明显少于当前约 295 行。
- 所有硬门禁仍可在文件中直接找到。
- 主 skill 不再承载低层模板说明或重复理念解释。
- `scripts/check-plugin.mjs` 不因关键词缺失而失败，或者对应检查被更新为更精确的 gate 检查。

verification_commands:

```bash
wc -l skills/harness-builder/SKILL.md
rg -n "Mandatory execution gates|Question gate|Harness Charter gate|Coverage Matrix gate|Capability Discovery gate|USER CHECKPOINT|Verification gate|Research Graduation gate" skills/harness-builder/SKILL.md
node scripts/check-plugin.mjs
node scripts/check-cursor-install.mjs
```

success_definition:
主 skill 更像 controller，关键行为门禁不丢。

### Phase 4 - Consolidate, Downgrade, Archive, Or Delete Redundant Assets

Purpose:
处理真正的噪音来源：无主、重复、低价值、AI 常识型或历史保留资产。

Actions:

- 按 Phase 2 分类逐项处理 assets。
- `merge`: 合并到更少、更强的 policy 文件，删除重复源。
- `downgrade`: 从核心路径降到 docs、pack 内部参考、示例或非必读说明。
- `archive`: 移出默认核心路径，保留历史价值但不影响主 skill。
- `delete`: 删除无 owner、重复、无验证价值或已被其他资产覆盖的文件。
- 对 templates/scripts/schemas/evals 分别判断：
  - template 是否真有安装或生成路径；
  - script 是否真有调用入口或验证入口；
  - schema 是否真被脚本消费；
  - eval 是否真被当前检查使用。
- 每项处理记录理由和替代路径。
- 同步 root / packaged / Cursor preview。

acceptance_criteria:

- 每个被删改资产都有分类、理由、替代路径。
- 核心能力资产不因低频被误删。
- 没有 orphan reference/template/script 留在核心路径。
- 三端文件列表保持一致。

verification_commands:

```bash
find skills/harness-builder -type f | sort
find plugins/harness-workflow/skills/harness-builder -type f | sort
find .cursor/skills/harness-builder -type f | sort
node scripts/check-plugin.mjs
node scripts/check-cursor-install.mjs
```

success_definition:
资产层噪音下降，同时核心能力仍有明确支撑路径。

### Phase 5 - Add Ownership / Reachability Validation

Purpose:
把“不要堆无主资产”变成可检查规则，而不是一次性人工整理。

Actions:

- 更新 `skills/harness-builder/scripts/validate_harness.py`、`scripts/check-plugin.mjs` 或新增小脚本。
- 检查每个核心 reference/template/script 至少满足一种：
  - 被 asset routing manifest 覆盖；
  - 被主 skill 明确 read_when 指向；
  - 被 pack adapter / renderer / installer 消费；
  - 被验证脚本消费；
  - 被明确标为 archived / deprecated。
- 对新增无 owner 资产 fail 或至少 warn；核心路径建议 fail。
- 避免 validator 变成复杂工作流引擎，只检查最小字段。
- 同步 packaged / Cursor 相关文件。

acceptance_criteria:

- 手动新增一个无 owner 测试样例时，validator 能发现。
- 当前保留资产能通过检查。
- 检查信息能告诉维护者该补 owner、降级、归档还是删除。

verification_commands:

```bash
python scripts/validate_harness.py
node scripts/check-plugin.mjs
node scripts/check-claude-code-install.mjs
node scripts/check-cursor-install.mjs
```

其中 `python scripts/validate_harness.py` 的 cwd 为 `skills/harness-builder/`。

success_definition:
未来新增 harness-builder 资产时，不能无 owner 地悄悄进入核心包。

### Phase 6 - Align Docs, Generated Review Surface, And Mirrors

Purpose:
让用户入口、方法论合同、生成 HTML 和三端镜像与瘦身后结构一致。

Actions:

- 若主流程或术语变化，更新 `README.md`、`README.zh-CN.md`、`docs/skill-routing.md`、`docs/harness-method-contract.md`。
- 如果只是内部瘦身且语义不变，不做无必要文档扩张。
- 如修改 `SKILL.md` 结构，运行 `scripts/generate-skill-flow-html.mjs` 重新生成 HTML。
- 抽查 `docs/skill-flow-review/harness-builder.html` 是否反映真实 gate 和 workflow。
- 确保 `plugins/harness-workflow/skills/harness-builder/**` 和 `.cursor/skills/harness-builder/**` 与 root 同步。

acceptance_criteria:

- 用户可见文档没有描述已删除或降级的资产为核心路径。
- 生成 HTML 没有大面积“未抽取到条目”或 stale 内容。
- 三端递归一致检查通过。

verification_commands:

```bash
node scripts/generate-skill-flow-html.mjs
node scripts/check-plugin.mjs
node scripts/check-claude-code-install.mjs
node scripts/check-cursor-install.mjs
node scripts/install-cursor.mjs --target . --dry-run
```

success_definition:
源码、文档、生成物和插件镜像对同一个瘦身后契约达成一致。

### Phase 7 - Final Review And Verification

Purpose:
在声明 ready 前确认没有能力丢失、无关改动或验证缺口。

Actions:

- 对 diff 做结构性 review：
  - 是否过度删除；
  - 是否保留核心能力；
  - 是否存在 orphan asset；
  - 是否同步三端；
  - 是否更新必要 docs 和生成物。
- 运行完整验证。
- 记录 skipped checks、manual checks 和剩余风险。
- 确认是否形成一个或多个中文 commit。

acceptance_criteria:

- review 无 Critical。
- verify PASS。
- `git status --short` 只包含预期改动。
- ready claim 能映射到本计划 Success Criteria。

verification_commands:

```bash
git status --short
node scripts/check-plugin.mjs
node scripts/check-claude-code-install.mjs
node scripts/check-cursor-install.mjs
node scripts/install-cursor.mjs --target . --dry-run
node scripts/generate-skill-flow-html.mjs
node scripts/check-plugin.mjs
```

success_definition:
可以明确声明 `harness-builder` 第一轮瘦身 ready，且有 fresh evidence。

## Current Next Item

`Review / verify corrective slice - canonical Spec/Plan artifact surfaces and Harness Builder checkpoint gating`

Reason:
用户实际操作暴露了 workflow 缺陷：Spec / Plan 默认工件面不够固定，且 Harness Builder 把“开始初始化”误当成写文件授权。纠偏实现已完成并有本地检查证据；下一步应先 review / verify 这组变更，再回到 Phase 4 资产合并、降级、归档或删除。

## Commit Units

### Commit Unit 1 - 资产审计契约与 baseline

- scope: 资产清单、分类规则、asset routing / ownership contract、必要的轻量审计文档。
- 对应阶段: Phase 1, Phase 2
- 提交前置条件: review 无 Critical；Phase 1-2 verification PASS；无实现性资产删除。

### Commit Unit 2 - 主 skill controller 瘦身

- scope: `skills/harness-builder/SKILL.md` 及 root / packaged / Cursor 镜像；必要的 check 调整。
- 对应阶段: Phase 3
- 提交前置条件: review 无 Critical；核心 gate 检查 PASS；三端同步 PASS；verify PASS。

### Commit Unit 3 - 冗余资产合并、降级、归档、删除

- scope: `references/**`、`templates/**`、`scripts/**`、`schemas/**`、`evals/**` 的资产处理和镜像同步。
- 对应阶段: Phase 4
- 提交前置条件: 每个删改项有分类理由和替代路径；review 无 Critical；三端同步 PASS；verify PASS。

### Commit Unit 4 - Ownership / reachability validator

- scope: `validate_harness.py`、`check-plugin.mjs` 或新增验证脚本；相关 docs / generated review surface。
- 对应阶段: Phase 5, Phase 6
- 提交前置条件: 无 owner 测试能被检查发现；当前保留资产通过检查；review 无 Critical；verify PASS。

### Commit Unit 5 - 最终文档、生成物和收尾

- scope: README / method contract / skill-flow HTML / PRD 状态更新 / final cleanup。
- 对应阶段: Phase 7
- 提交前置条件: final integration claim PASS；完整验证 PASS；工作区无无关改动。

## Known Risks / Blockers

- 过度瘦身可能隐性削弱低频但关键能力，尤其 Research Route、subagent policy、hook/MCP policy。
- `check-plugin.mjs` 当前包含不少关键词检查，主 skill 瘦身时可能需要把关键词检查改成更精确的结构检查。
- `scripts/validate_harness.py` 运行时容易生成 `__pycache__`；验证后要清理未跟踪缓存或设置合适环境。
- 三端镜像面多：root、`plugins/harness-workflow/`、`.cursor/skills/`，任何资产处理都必须同步。
- generated HTML 不能手改；如果 `SKILL.md` 结构变化，必须改 generator 后重建。
- validator 如果设计过重，会把“减少噪音”变成新的噪音。

## Handoff

- Next skill: `implement`
- Entry condition:
  - 用户批准本 Executable Plan；
  - 工作区只包含预期 plan/spec 改动或已明确纳入 baseline；
  - 从 Phase 1 开始执行，不跳过资产清单和现有验证。
