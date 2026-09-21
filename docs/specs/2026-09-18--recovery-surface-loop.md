# Spec - 恢复面与文档生命周期闭环（退休契约 + 一致性 lint + sweep）

> 状态 / Status: user-approved
> Owner: user
> Date: 2026-09-18
> 修订 / Revised: 2026-09-21 合入 15 条定案修订（R1-R15，含魔鬼代言人修正），状态 draft → user-approved。
> 来源请求 / Source request: 用户对 cleanup 全局意识缺失、.harness/AGENTS.md 不闭环的反思讨论（本会话），三 frontier 均按推荐定案。

## 背景

仓库的 workflow skills 有完整的"创建纪律"（plan 建档、work_index 行、状态枚举），但没有"退休纪律"：任务关闭时无人负责翻行状态、处置计划文档，也没有任何脚本校验恢复面一致性。当前活证据：

1. work_index 第 019 行仍为 `active`，而 `.harness/state.md` 同任务 `Status: complete`（退休漏执行）。
2. 第 004 行 `blocked` 自 2026-06-29 起无 revisit（僵尸条目）。
3. 批 017（4b43ce6）靠一次性手工大扫除删除 18+ 份 plan/spec/review 文档，work_index 留下成片死指针；plan skill 仍会向 `docs/plans/` 建新档，问题会重新堆积。

cleanup 的任务作用域（"不扩展为全仓清理"）是正确边界；缺的是退休契约、全局对账者和验证闸门三样。

## 目标

- 任务状态翻转时的退休契约：主落点 `AGENTS.md` 恢复面写侧纪律，`plan`/`ship`/`cleanup` 协议为补充——翻行状态 → lessons 继承 → 删除已完成计划文档（git 历史即归档）。
- "每个文档必须是活的"落成可机检判据：**可达性**（artifact 活 ⟺ 被 `.harness/` 全部状态文件出链或持久入口引用）。
- 恢复面一致性 lint 并入 `scripts/check-plugin.mjs`，接入 CI 与 `scripts/agent/check.sh`，hard fail 两项（状态矛盾 + plans/specs 孤儿），无年龄类警告。
- 新增 `sweep` 工具 skill（cleanup 路由 + 显式触发，不新增 workflow lane）：全局对账，SKILL.md 内联同判据的手动对账清单，目标项目无脚本也能执行。
- dogfood：lint 合入同批修复本仓现存漂移（019/004），CI 绿到绿不留红窗。

## 非目标（Non-goals）

- work_index complete 历史行折叠/限数（低烈度，sweep 汇报行数即可，本次不动）。
- 归档目录（删除优于归档；git 已是历史，归档目录是第二块墓地）。
- 死活判定全自动（abandoned vs paused 需人裁，sweep 只给证据）。
- 向安装面/目标项目新增脚本或 harness-builder 模板文件（目标项目靠 sweep 内联清单）。
- 不改 `remove-deadcode-py`（代码符号域，与 artifact 域职责不混）。

## 用户 / 调用者（Users / Callers）

- 本仓 agent 会话：经 AGENTS.md 读取顺序消费恢复面，退休后不再被僵尸行误导。
- CI（`.github/workflows/ci.yml`）：push/PR 时跑 lint。
- 安装面用户：skills.sh / 插件安装后，在目标项目经 `sweep` skill 获得等价对账能力。

## 行为规格（Behavior Spec）

### 正常路径（Happy Path）

**退休契约（push，触发＝状态翻转事件）**

- 触发：任何把 work_index 行翻出 active 的动作（停训 abandoned、置 blocked、换轨、收尾 complete）必须在同一 commit 内走完退休四步。

1. 该轨道 work_index 行翻 `complete`/`abandoned`/`blocked`；同轨道换轨则更新旧入口。
2. lessons 继承：已完成计划/Spec 文档中的非显然经验（坑、环境、取舍）先蒸馏进 `.harness/lessons.md`，每条原子、按概念组织、带触发条件。
3. 删除本轨道已完成的 plan/Spec 衍生文档，两个前置：已 commit 进当前分支主树；入度守卫＝只删唯一入边来自本退休轨道的文档，多入边者翻指针不删、留 sweep 定罪。ADR 类决策文档不删，退休时补 superseded-by 指向后任。
4. `state.md` 保留最后任务快照直到被新任务替换，不重置空，但 `Status` 必须与行同步翻转。

**可达性判据**

- 根集合（root set）：`.harness/` 下全部状态文件的出链 + 持久入口（AGENTS.md、根 README、docs/README）。
- 引用操作定义：根集合文件中出现该文件的精确路径字符串，或 basename 匹配（防裸文件名引用被误判为孤儿）。
- 活 ⟺ 从根集合可达。不可达判据分域：lint 层只查 `docs/plans/`、`docs/specs/`；sweep 层任务产物域（plans/specs/reports）进定罪流，research/runbooks/archive 无引用仅汇报、不入定罪流。

**lint（并入 check-plugin.mjs，同一退出码语义）**

- hard fail（退出非零，CI 红）两项：
  1. 状态矛盾：active/blocked 行 primary artifact 路径不存在（存在性＝文件系统存在或 `git worktree list` 注册树内存在；只查 primary artifact 列，拒绝行内全 token 扩面），或 state.md 所指轨道行状态与 state.Status 矛盾（如行 active 而 state complete；complete 快照指向已删文档不算）。
  2. `docs/plans/`、`docs/specs/` 存在孤儿文件。
- 无 warn 项：不加任何年龄类警告（active>90d 与更短方案均裁决拒绝）；年龄只进 sweep 定罪证据维度。
- 不查：complete/abandoned 行死指针（维护规则明确允许）。

**sweep（pull，低频全局对账）**

- 触发：显式（sweep / 盘点 / 大扫除 / 项目对账）或 cleanup 发现跨文档漂移、用户要求全量时路由。
- 首步探测：实测 `.harness/` 实际文件集（覆盖四文件等异构形态），按实际文件集取根集合；state 不可解析时跳过状态矛盾检查并显式声明，不推孤儿结论。
- 流程：跑对账清单（与 lint 同判据的 agent 手动版）→ 分类（complete-未退休 / superseded / 僵尸 blocked / 孤儿 tracked / 孤儿 untracked scratch / 恢复面文件超本分）→ 机械项自动修（翻状态），模糊项列证据请用户裁决 → 执行退休（harvest lessons → 删 → 翻行）→ 汇报（已退休 / needs-review / 保留 / 下一轮候选，同 remove-deadcode 汇报格式）。
- scratch 分档：tracked 文件走 remove-deadcode 同款定罪纪律（全仓零引用 + git 溯源 + 动态/文档引用守卫，定罪域限任务产物 plans/specs/reports，年龄仅证据维度之一），定罪成立可删；untracked 文件一律只列证据建议、不删，处置出口＝补 commit 或补 .gitignore 二选一。
- 域边界：research/runbooks/archive 无引用仅汇报、不入定罪流；既有归档目录（docs/archive/ 类）内容一律归 needs-review，不入可删档。
- 第六档「恢复面文件超本分」：state 超快照、decisions/lessons 双记账 → 蒸馏进 lessons 后截断/合并（接住目标项目存量）。
- 无漂移时零修改结束（与 cleanup 哲学对齐）。

### 边界情况（Edge Cases）

- 多轨道并行：退休/对账只动本轨道或被定罪项，不写其他 active 行的文件。
- `docs/plans/`、`docs/specs/` 目录不存在：孤儿检查空集通过，不强制建目录。
- 中断会话（未经 cleanup）：sweep 兜底发现"active 行长期无证据更新"，分类后请人裁决。
- 019 dogfood 特例：state 的 Next 有未了事项（推送远端、实测）——翻 complete 前按 git/远端证据裁决未了项去向（lessons、新轨道或 Limits）。
- state 快照指向已删文档且 Status=complete：合法（等待新任务替换）。
- worktree：primary artifact 在 `git worktree list` 注册树内存在而当前文件系统缺失 → 不判路径不存在（存在性双判据）。

### 接口 / 状态（Interfaces / State）

- `scripts/check-plugin.mjs`：新增恢复面一致性检查段（含上述分级）。
- `scripts/agent/check.sh`：串联不变（已调 check-plugin.mjs 即自动覆盖）。
- `AGENTS.md`（退休契约主落点）：恢复面节补写侧纪律（状态翻转触发、退休四步、可达性判据、lint 是闸门）；铁律行登记 sweep 为工具 skill。
- `skills/plan/SKILL.md`、`skills/ship/SKILL.md`、`skills/cleanup/SKILL.md`（补充落点）：收尾步骤接入退休契约；cleanup 的 Recommended next skill 加 sweep 路由。
- `skills/writing-for-agents/references/recovery_surface_policy.md`：补恢复面生命周期合同（谁建、谁更新、谁退休）与 lessons 写法纪律（原子、按概念组织、持续修订）；不做继承条数 lint。
- `skills/sweep/SKILL.md`（新增，含 YAML frontmatter，中文协议，同仓惯例）。
- 全枚举面同步：`README.md`、`README.zh-CN.md`、`CONTEXT.md`、`docs/install.md`、`docs/harness-method-contract.md`、`.claude-plugin/plugin.json`（version bump）、`scripts/check-plugin.mjs` 的 skill 计数；不改 THIRD_PARTY_NOTICES（无外部文本借鉴）。
- `.harness/work_index.md` 新增本任务 active 行（由 plan 建立）。

## 约束（Constraints）

- 项目铁律：安装面以 skills.sh 为主；全枚举面语义必须一致；中文 commit；无 fresh verification 不声明可用。
- sweep 以 tool-skill 方式接入（同 remove-deadcode-py 先例），不新增 workflow lane。
- lint 判据保持简单（字符串/路径级），不做语义解析。
- 目标项目零新增文件。

## 选定方案（Chosen Approach）

三层机制，每层成本低：**push**（退休契约锚定状态翻转事件，源头止漏）+ **verify**（lint 闸门两项，漂移即红）+ **pull**（sweep 低频对账兜底）。统一"活"判据为可达性（root set = `.harness/` 全部状态文件出链 + 持久入口），使 push/verify/pull 三层共享同一标准；若 push 正常运转，sweep 大多数时候零修改结束。

## 拒绝方案（Rejected Options）

- 归档目录方案：git 已是历史；归档目录自身会变成新清理对象，与 lessons"不设历史归档"先例冲突。
- cleanup 每次全仓扫：慢、意外动作多，违背 ship"不扩大 cleanup"纪律；全局意识应为独立低频角色而非改掉原子性。
- 扩展 remove-deadcode-py 承载 artifact 清理：代码符号域（AST/语言工具）与 artifact 域（可达性/年龄/状态）证据与风险模型不同，合并互相搅浑。
- lint 做独立脚本 + 新 CI step：多一个维护入口，且 check-plugin/agent-check 双入口需同步；并入既有结构检查入口成本更低。
- 年龄类 lint 警告（active>90d、blocked>60d 及更短方案）：误报与阈值维护成本大于收益，一律不加（裁决关闭，R6）；年龄只进 sweep 定罪证据维度。

## 验证策略（Verification Strategy）

### 基线证据（Baseline Evidence）

- `node scripts/check-plugin.mjs` 当前全 PASS 的输出。
- 漂移现况留档：019 行 `active` vs state `complete`（状态矛盾负样本基线）；004 行 blocked 81 天（僵尸行，处置走 sweep/人裁，lint 不因年龄报错）。

### 自动检查（Automated Checks）

- `node scripts/check-plugin.mjs`（含新恢复面检查）。
- CI 全链（structure checks / README assets / harness-builder tests）。
- `bash scripts/agent/check.sh`。

### Smoke / E2E 检查

- dogfood 批：019 翻正、004 处置（revisit 或 abandoned）、plans/specs 孤儿为零，与 lint 合入同批提交，CI 绿到绿。
- TienKung-Lab 只读实测 sweep 清单＝批3 合入前必做（非 optional）：在真实异构 `.harness/` 形态上跑通首步探测与六档分类。

### 负向 / 边界检查（Negative / Boundary Checks）

- 临时构造漂移（改行状态成矛盾、删 active 行 primary artifact、放 plans/specs 孤儿文件）逐一验证 lint 报错退出非零；构造 blocked/active 超龄验证不产生任何警告（无年龄项）；构造 complete 死指针验证不触发；恢复后全绿。
- worktree 负样本：primary artifact 移入 `git worktree list` 注册树后 lint 不误报路径不存在。
- 目录不存在（现状）时孤儿检查空集通过。

### 文档 / 状态检查（Documentation / State Checks）

- 全枚举面对照：README×2、CONTEXT.md、install、方法合同、AGENTS.md 铁律行、plugin.json version、check-plugin skill 计数与 sweep 一致。
- 本任务自身按新契约走一遍：plan 建行、收尾退休（元验证）。

### 完成前所需 fresh evidence

- 重跑 `node scripts/check-plugin.mjs`、`bash scripts/agent/check.sh`、`python3 -B skills/harness-builder/tests/test_scripts.py`，全绿后才声明批次完成。

## 能力缺口（Capability Gaps）

- 无自动化能力缺口（纯本仓文件与脚本）。
- by design 保留人工判断：abandoned vs paused、未了事项去向，sweep 列证据交用户裁决；fallback 为不裁决不删除（保守停）。

## 成功标准（Success Criteria）

- lint 合入后 master CI 绿，且 019 行状态与 state.md 一致、004 有明确处置结果（可 grep 验证）；lint 全程无年龄类警告。
- 构造状态矛盾与 plans/specs 孤儿两类漂移时 check-plugin.mjs 退出非零并指出具体行/文件（负样本可复现）。
- sweep skill 通过 check-plugin 结构与计数检查，枚举面文档（含 CONTEXT.md）全部提及且语义一致；批3 合入前完成 TienKung-Lab 只读实测。
- `AGENTS.md` 恢复面节（主落点）含状态翻转触发与退休四步，plan/ship/cleanup SKILL.md（补充落点）接入；recovery_surface_policy 含 lessons 写法纪律。

## 残余风险（Residual Risks)

- state.md 格式漂移导致 lint 误报 → lint 判据只锚 Status 行与 primary artifact 路径字符串；sweep 首步实测 `.harness/` 文件集，state 不可解析即跳过状态矛盾检查并显式声明，不推孤儿结论。
- sweep 误删知识 → untracked 不删（出口只有补 commit 或补 .gitignore）、tracked 走定罪纪律（年龄仅证据）、既有归档目录只进 needs-review、多入边不删、模糊项人裁；删除前 lessons 继承与已 commit 主树是硬前置。
- 目标项目无脚本闸门，push 侧纪律依赖 agent 遵循 SKILL.md → 残余接受（最小面原则），sweep 内联清单是等价补偿。

## Plan 交接（Plan Handoff）

- 当前切片 / Active slice: 批1 = lint 并入 check-plugin.mjs + dogfood 修复 019/004，同批提交。
- 建议下一 skill / Suggested next skill: plan
- 计划提示 / Planning notes: 依赖顺序：批1（验证闸门先行，立刻可抓现存漂移）→ 批2（退休契约写进 AGENTS.md 主落点 + plan/ship/cleanup 补充落点 + recovery_surface_policy 生命周期合同与 lessons 写法纪律）→ 批3（sweep skill + 全枚举面同步（含 CONTEXT.md）+ version bump；合入前必做 TienKung-Lab 只读实测）。批3 依赖批2 的契约文本作为 sweep 协议的引用基础。
- 建议里程碑 / Suggested milestones: M1 lint+dogfood 绿到绿；M2 契约进协议与恢复面政策；M3 sweep skill 与枚举面全同步。
- 里程碑验收提示 / Per-milestone acceptance hints: M1 = 负样本两类（状态矛盾、plans/specs 孤儿）可复现报红、dogfood 后全绿且无年龄类警告；M2 = 协议文本含退休契约（AGENTS.md 主落点）且互相一致；M3 = check-plugin 计数/文档/manifest 同步（含 CONTEXT.md）、TienKung-Lab 只读实测完成，本任务按新契约完成首次退休演练。
