# Spec - 核心 Skill 语言自适应输出

> 状态：user-approved
> Owner: user / agent
> Date: 2026-05-29
> Source request: 用户希望优化 `brainstorm`、`plan`、`harness-builder` 的输出契约和 Spec / Plan / Harness 文档产物，解决中文用户场景下中英混杂的问题；要求语言跟随用户输入，并用真实 `codex exec` 验证。

## 背景

当前 `harness-workflow` 的核心 workflow skill 已经大量中文化，但仍存在明显模板惯性：

- `brainstorm` 的 Spec 模板仍使用 `Background`、`Goals`、`Non-goals`、`Verification Strategy` 等英文段落标题。
- `plan` 和 `harness-builder` 的说明、输出契约、模板字段中仍混有英文标题或英文状态说明。
- 生成的 skill-flow HTML 会直接展示这些输出契约，因此中英混杂会被放大。
- 现有结构检查主要验证文件存在、关键词和方法论覆盖，尚不能防止英文模板标题回归。

用户主要是中文用户，但期望规则不是硬编码中文，而是“跟随用户语言”：中文用户得到中文为主的输出，其他语言用户得到对应语言的用户可见说明。遇到“更中文”和“协议稳定”冲突时，协议稳定优先。

## 目标

- 为核心 skill 增加明确的语言自适应输出规则：用户可见文本默认跟随用户当前语言。
- 中文用户场景下，`brainstorm`、`plan`、`harness-builder` 的输出契约说明、文档模板标题和提示文本基本中文化。
- 需要机器识别、脚本校验、路由或跨工具稳定的 token 保持英文，或使用“中文标签 + 英文 token”的中英并列形式。
- 更新相关 checker，防止核心模板重新出现明显英文标题污染。
- 同步重新生成 skill-flow HTML，确保审阅页展示的契约与更新后的 skill 一致。
- 用真实 `codex exec` smoke test 验证中文用户场景，不只依赖静态检查。

## 非目标

- 不在第一版扩展到所有 active workflow skills；本轮只覆盖 `brainstorm`、`plan`、`harness-builder`。
- 不把协议 token、路径、命令、skill 名、状态枚举全部强行翻译。
- 不改变 workflow lane 数量、路由关系、recovery surface 语义或默认 artifact 路径。
- 不新增用户级 hooks、MCP 配置、全局 skill 安装或外部 marketplace 配置。
- 不把历史 `docs/prd/` 文档全部迁移或批量翻译。

## 用户 / 调用者

- 中文用户：希望在自然对话、澄清问题、Spec、Executable Plan、Harness Charter、Coverage Matrix、Checkpoint 等用户可见内容中看到中文为主的表达。
- 非中文用户：希望输出跟随其输入语言，而不是被硬编码成中文。
- Codex / Claude Code / Cursor 三端 agent：需要保留稳定协议 token，避免破坏已有 checker、生成脚本、路由和安装识别。
- 维护者：需要一个静态检查面，能在 PR 或本地验证时发现明显英文模板标题回归。

## 行为规格

### 正常路径

- `brainstorm`：
  - Phase A 澄清输出跟随用户语言。
  - Phase B 写 Spec 时，中文用户场景默认使用中文标题和中文提示文本。
  - `templates/spec.zh-CN.md` 提供中文主标题；`templates/spec.md` 保持英文/default 模板，避免非中文用户被强制中文化。
- `plan`：
  - 输出契约中面向人的说明跟随用户语言。
  - 中文用户场景下，Executable Plan 文档标题、阶段、验收、风险、下一步等标题为中文；英文/default 模板仍保留给非中文用户。
  - 需要脚本或跨端识别的状态枚举保留英文，例如 `runnable | blocked`、skill 名、路径和命令。
- `harness-builder`：
  - Harness Evidence、Harness Charter、Coverage Matrix、User Checkpoint 等用户可见报告在中文用户场景下使用中文标题，必要时附英文 token。
  - Harness 模板和 checkpoint 文案避免英文段落标题污染。
  - Capability Discovery、Pack Selection 等术语可保留英文 token，但应有中文标签或中文解释。
- 静态检查：
  - 检查核心模板中是否仍存在明显英文-only 段落标题。
  - 检查核心 skill 是否声明语言自适应和协议稳定边界。
  - 不误伤代码块、命令、路径、枚举、字段名、YAML / JSON / TOML、license 或第三方来源说明。
- 真实验证：
  - 使用 `codex exec` 在临时/隔离场景中触发中文 brief，检查实际输出是否中文为主且协议稳定。

### 边界情况

- 用户用英文提问：不强制中文输出，按英文用户场景处理。
- 用户中英混合：以用户主要自然语言为准；若无法判断，沿用当前对话语言。
- 协议稳定冲突：保留英文 token，使用中英并列或中文说明补足可读性。
- 生成脚本依赖英文标题：应扩展脚本识别中文标题或中英并列标题，而不是让用户文档继续英文化。
- `codex exec` 受环境、权限、模型、网络或 token 限制失败：记录为验证 blocker；不能把静态检查结果伪装成真实 smoke 通过。

### 接口 / 状态

本轮预计涉及：

- `skills/brainstorm/SKILL.md`
- `skills/brainstorm/references/clarification-coverage.md`
- `skills/brainstorm/references/spec-drafting.md`
- `skills/brainstorm/templates/spec.md`
- `skills/brainstorm/templates/spec.zh-CN.md`
- `skills/plan/SKILL.md`
- `skills/plan/templates/task_plan.md`
- `skills/plan/templates/task_plan.zh-CN.md`
- `skills/plan/templates/progress.md`
- `skills/plan/templates/progress.zh-CN.md`
- `skills/plan/templates/findings.md`
- `skills/plan/templates/findings.zh-CN.md`
- `skills/harness-builder/SKILL.md`
- `skills/harness-builder/templates/*.j2` 中与 Harness Charter、state、manifest、verification、reports 或 AGENTS 输出直接相关的模板
- `scripts/check-plugin.mjs`
- `scripts/generate-skill-flow-html.mjs`
- `docs/skill-flow-review/*.html` 生成物
- 必要时同步 `README.md`、`README.zh-CN.md` 或 `docs/harness-method-contract.md`

不写临时状态到 `AGENTS.md`。

## 约束

- 协议稳定优先：机器读取、脚本检查、路由和跨端识别依赖的 token 不应被无条件翻译。
- 保持三端一致：Codex、Claude Code、Cursor 的 skill 入口和安装识别不能被破坏。
- 保持小 diff：第一版只处理用户最痛的核心输出面，不做全仓库历史文档清洗。
- 不把“中文化”做成硬编码中文；规则是跟随用户语言。
- 真实 `codex exec` 验证是本轮成功标准的一部分。
- 修改 `SKILL.md` 或生成脚本后必须重新生成 skill-flow HTML。

## 选定方案

选定“共享语言策略 + 三个核心 skill 精准改造 + 静态回归检查 + 真实 `codex exec` smoke”的方案。

具体做法：

- 在三个核心 skill 中加入一致的语言策略：用户可见文本跟随用户语言；协议 token 稳定优先。
- 为 `brainstorm` 增加中文 Spec 模板，同时保留英文/default 模板，避免把“中文化”误做成中文-only。
- 调整 `plan` 和 `harness-builder` 的输出契约展示方式，中文用户场景使用中文标签，必要时保留英文 token。
- 更新生成脚本和 checker，让中文标题成为被支持、被检查的正式形态。
- 用真实 `codex exec` 验证 agent 在中文 brief 下的实际输出，而不是只看 Markdown 文件。

## 拒绝方案

- 只翻译 `brainstorm/templates/spec.md`：拒绝。这样只能解决一个表面模板，`plan` / `harness-builder` 输出契约和 HTML 仍会混杂。
- 把所有英文 token 全部翻译成中文：拒绝。会破坏脚本、路由、状态枚举、跨端识别和已有验证。
- 第一版扩展到所有 workflow skill：拒绝。范围过大，容易把输出契约、ready gate、review/verify 边界一起搅乱；本轮先修最影响 Spec / Plan / Harness 产物的核心面。
- 只加一句“请用中文回答”的软规则：拒绝。模板和 checker 不改，仍会被英文标题惯性拉回去。
- 只跑静态验证，不跑真实 `codex exec`：拒绝。用户明确要求真实机制验证，且本问题本质是实际 agent 输出体验。

## 验证策略

### 基线证据

- 记录修改前核心模板和输出契约中的英文标题位置：
  - `rg -n "Background|Goals|Non-goals|Verification Strategy|Success Criteria|Output contract|HARNESS EVIDENCE|EXECUTABLE PLAN" skills/brainstorm skills/plan skills/harness-builder`
- 记录当前工作区状态：
  - `git status --short --branch`
- 记录当前生成脚本对输出契约标题的识别逻辑：
  - `rg -n "输出契约|Output contract|Output Contract" scripts/generate-skill-flow-html.mjs`

### 自动检查

- `node scripts/check-plugin.mjs`
- `node scripts/check-claude-code-install.mjs`
- `node scripts/check-cursor-install.mjs`
- `node scripts/install-cursor.mjs --target . --dry-run`
- 修改 `SKILL.md`、模板或生成逻辑后运行：
  - `node scripts/generate-skill-flow-html.mjs`
  - `node scripts/check-plugin.mjs`
- 新增或更新轻量语言回归检查，至少覆盖：
  - `skills/brainstorm/templates/spec.zh-CN.md` 不再使用英文-only Spec 标题，且 `skills/brainstorm/templates/spec.md` 保持非中文默认路径可用。
  - `brainstorm`、`plan`、`harness-builder` 都声明语言自适应和协议稳定边界。
  - 生成脚本能识别中文输出契约标题。

### 真实 `codex exec` smoke

必须在最后一次相关修改后运行真实 `codex exec`，至少覆盖：

- `brainstorm` 中文 brief：
  - 输入：中文用户要求先 brainstorm 一个小型非平凡改造。
  - 期望：澄清问题、Coverage、Spec 契约说明中文为主；协议 token 保持稳定。
- `plan` 中文 brief：
  - 输入：给定一个已批准中文 Spec，要求产出 Executable Plan。
  - 期望：计划文档和用户可见说明中文为主；`runnable | blocked`、skill 名、路径、命令等稳定 token 未被破坏。
- `harness-builder` 中文 brief：
  - 输入：中文用户要求对一个小型 repo 做 read-only harness audit 或 Harness Plan。
  - 期望：Harness Charter、Coverage Matrix、User Checkpoint 等中文为主，必要英文 token 有中文标签或说明。

如果 `codex exec` 因环境限制失败：

- 记录准确命令、退出码、错误摘要和影响。
- 标记为 blocker 或 residual risk。
- 不允许用“静态检查通过”替代真实 smoke 通过。

### 负向 / 边界检查

- 英文用户 brief 不应被强制输出中文。
- 命令、路径、JSON/YAML/TOML、枚举值、skill 名和状态 token 不应被翻译到脚本无法识别。
- checker 不应误判第三方 license、历史 PRD、引用链接或代码块中的英文。
- `AGENTS.md` 不应写入本次临时计划或一次性状态。

### 文档 / 状态检查

- 若 README 或 Method Contract 中描述了输出契约或用户语言行为，必须同步更新。
- `docs/skill-flow-review/*.html` 只能通过生成脚本更新。
- 最终 `git status --short` 必须确认改动范围只对应本 Spec 和后续批准的实现。

### 完成前 fresh evidence

- 所有自动检查必须在最后一次相关文件修改后重跑。
- `codex exec` 三个 smoke 场景必须在最后一次相关文件修改后运行。
- 最终 ready claim 必须由 `verify` 映射到本 Spec 的成功标准；`implement` 不能直接声明 ready。

## 能力缺口

- 真实 `codex exec` 可能依赖本机 auth、模型、网络、sandbox 或 token 预算；如果不可用，需要作为 blocker 记录。
- 静态 checker 很难完美判断“语言自然度”，只能防止明显英文模板标题和契约规则回归。
- 非中文语言 smoke 可以先用英文边界检查覆盖，不要求本轮做多语言矩阵。
- Claude Code / Cursor 的真实端到端输出不作为第一版硬验收，但结构和安装检查必须保持三端可识别。

## 成功标准

- 中文用户场景下，`brainstorm` 的 `spec.zh-CN.md` 模板标题和提示文本基本中文化；非中文用户仍可走英文/default `spec.md`。
- 中文用户场景下，`plan` 的输出契约和中文 three-file 模板使用中文用户可见标签；英文/default three-file 模板保持非中文路径可用；必要英文 token 保留或中英并列。
- 中文用户场景下，`harness-builder` 的 Harness Charter、Coverage Matrix、User Checkpoint 等用户可见报告使用中文标签；必要英文 token 保留或中英并列。
- 三个核心 skill 都明确声明“用户可见文本跟随用户语言；协议 token 稳定优先”。
- checker 能防止核心模板和输出契约出现明显英文标题回归。
- skill-flow HTML 已重新生成并通过结构检查。
- 默认验证命令通过：
  - `node scripts/check-plugin.mjs`
  - `node scripts/check-claude-code-install.mjs`
  - `node scripts/check-cursor-install.mjs`
  - `node scripts/install-cursor.mjs --target . --dry-run`
- 真实 `codex exec` 三个中文 smoke 场景在最后一次相关修改后运行，并产生可审查证据。
- 没有把临时任务状态写入 `AGENTS.md`。

## 残余风险

- 输出语言“自然、智能”部分无法完全由静态 checker 证明，需要真实 smoke 和人工审阅结合。
- 为保协议稳定保留英文 token 后，仍可能被用户感知为少量中英混排；实现时应优先把英文 token 放在括号或代码格式中，避免污染主标题。
- `codex exec` smoke 可能耗时或受环境影响；计划阶段需要给出明确命令、输出保存路径和失败处理。
- 如果只改 Codex 侧 skill cache 而不改 repo，改动会丢失；实现必须以仓库源码为主，再按需同步本地插件缓存。

## Plan 交接

- Active slice: 更新 `brainstorm`、`plan`、`harness-builder` 的语言自适应输出契约、核心模板和验证检查，并用真实 `codex exec` 验证中文用户场景。
- Suggested next skill: plan
- Planning notes:
  - 先做 baseline 搜索，列出英文模板标题和输出契约污染点。
  - 第一实现切片优先处理 `brainstorm` Spec 模板和三核心 skill 的语言规则。
  - 第二切片处理 checker 和生成脚本。
  - 第三切片运行默认检查、重生成 HTML、真实 `codex exec` smoke，并按需同步本地插件 cache。
- Suggested milestones:
  - M1: 语言策略和核心模板改造。
  - M2: checker / skill-flow HTML 同步。
  - M3: 真实 `codex exec` smoke 与最终 verify。
- Per-milestone acceptance hints:
  - M1: 三个核心 skill 都写清语言跟随规则和协议稳定边界；中文模板标题不再英文-only。
  - M2: 静态检查能发现明显英文模板标题回归；HTML 生成物反映新契约。
  - M3: 三个 `codex exec` 中文 smoke 均有命令和输出证据；失败则记录 blocker，不声明 ready。
