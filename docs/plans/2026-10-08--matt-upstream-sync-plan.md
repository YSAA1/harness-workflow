# 任务 031：吸收 mattpocock/skills 09-24→10-08 更新（插件 0.15.0）

## Context

上次对照 Matt 上游是任务 029/030（2026-09-24，只动了 brainstorm）。上游此后到 `b0618bc`（2026-10-08）有三类可借鉴变化：
1. **并行交付**：`implement-spec`（任务图 frontier + 每 ticket 一 worktree + 唯一集成分支 + 最后只 review 一次）及其 FAQ 里的 6 个实测坑；`to-tickets` 的纵向切片 / expand–contract 规则。
2. **单技能纪律收紧**：grilling「答 yes 即采纳推荐」、tdd seam 附「抓什么/漏什么」、diagnosing-bugs「先建能变红的反馈回路」+ 强制红须 diff 证明、code-review 规范源搜索 + Fowler 坏味基线、handoff 临时目录解析顺序、retro 的环境改进分类、chief-of-staff 的「按指针传上下文」。
3. **仓库方针**：`SCOPE.md` 的「改动须有真实失败」门槛 + `.out-of-scope/` 拒绝留档。

用户已拍板：并行＝**ship 加并行模式**（不新增 skill）；diagnose＝**默认硬闸门 + 明示豁免**；retro＝**并进 cleanup lessons 步**；方针三项全要（观察到的失败铁律、out-of-scope 留档、首跑观察点）。

目标：一次版本（0.15.0）把以上全部落进中英双树 + 双语指南 + 安装面，check-plugin 全绿，独立 subagent 复核通过。

## 全局纪律（每批都适用）

- **双树同步**：每改 `skills/<x>/…` 同 commit 改 `skills-en/<x>/…`（lessons：等式闸门拦不住条款漂移）。
- 核心行为进 SKILL.md 正文，菜单/长清单才进 references（lessons：一级载荷住主文件）。
- 本批属「上游实证、本仓未首跑」：每条改动在 commit 信息/state Evidence 注明上游出处（文件或 FAQ 条目），不冒称本仓观察到的失败——这正是新铁律要求的标注方式。
- 显式 `git add <路径>`，不用 `-A`；commit 中文。

## 0. 建档

- `.harness/work_index.md` 加 031 行 active，primary artifact＝`docs/plans/2026-10-08--matt-upstream-sync-plan.md`（本文件精简副本）；`state.md` 改写 Objective/Status/Evidence/Next。

## A. 小补丁批（一行级）

| 文件（中英双树） | 改动 |
|---|---|
| `brainstorm/SKILL.md` frontier 整批轮（第 50 行附近） | 加：「题干措辞让用户答『是／同意』即等于采纳 `➡️` 推荐答案。」 |
| `tdd/SKILL.md` Seams 节「问法」后 | 加：「每个提议的 seam 附一行：它能抓到什么、漏掉什么。」 |
| `implement/SKILL.md` 流程 1 | 加：「用户传入 issue/计划/Spec 引用时先读取并复述其标题；引用有歧义先问。」 |
| `handoff/SKILL.md` 流程 2 | 「如 /tmp」→「`$TMPDIR`，未设则 `/tmp`；Windows 用 `%TEMP%`；每次同一顺序解析并回报完整路径」 |
| `docs/install.md` 同名冲突段 | 补绕行：Claude Code 插件用命名空间调用 `/harness-workflow:implement`；skills.sh 安装可改本地副本目录名与 `name:`；不为避让宿主内置命令改名（链 out-of-scope 条目，见 F） |

## B. diagnose 重写（默认硬闸门 + 明示豁免）

`skills/diagnose/SKILL.md` 流程改为六阶段，保留现有「成本纪律、不以固定轮数宣布阻塞、state Evidence 中途落笔、lessons 提升」：

1. **保护现场与脱敏**（现 1）：密钥写 `<REDACTED>`，循环用环境变量传凭据。
2. **先建反馈回路（闸门）**：提出任何根因假设前，先有一条**已至少跑过一次**的命令，满足：能变红（走真实故障路径、断言用户原症状）、确定（同判决；flaky 则提高复现率而非求干净复现）、快、agent 可无人值守跑。回路要「当产品打磨」：更快、信号更尖、更确定。构造手段菜单（失败测试→curl→CLI 快照 diff→无头浏览器→回放 trace→一次性 harness→property/fuzz→bisect harness→新旧差分→HITL 脚本）放新 reference `references/feedback-loops.md`。
   **豁免**：昂贵 GPU、线上、破坏性或外部环境确实建不出回路时，明示「已尝试的手段 + 缺什么（环境访问/脱敏采集物/临时埋点许可）」，可继续用日志与源码推理，但结论一律标「未验证假设」，不得声称修复已验证（承接现 3）。
3. **复现并最小化**：确认红的是用户描述的症状而非邻近故障；逐项削减输入/配置/步骤直到每个剩余元素都承重。
4. **排序可证伪假设**：每条写「若 X 是原因，则改 Y 会消失/改 Z 会加重」；写不出预测的丢弃。排序清单给用户看但不阻塞（用户可能当场重排）。不强制固定条数（保留现规则）。
5. **埋点**：每个探针对应一条预测、一次只变一个量；调试日志统一前缀 `[DEBUG-xxxx]`，收尾 grep 清除；性能问题先建基线测量再二分。
6. **修复 + 回归测试**：在**正确 seam**（复现真实故障形态的位置）上先写失败测试→看它红（若红是靠篡改代码/fixture 强造的，先 diff 原样副本证明改动生效）→修→绿→回跑第 2 步原始回路。**无正确 seam 本身是发现**：记入报告并作为 cleanup 环境改进候选（见 E）。commit 信息写明被证实的假设。

完成清单：原回路不再复现、回归测试通过（或无 seam 已记录）、`[DEBUG-` 零残留、一次性原型已删。
docs/skills 双语 diagnose 节同步重写流程列表。

## C. review：规范源 + 坏味基线

`skills/review/SKILL.md`：
- 流程 1 后加：「搜出仓库里所有记载代码应如何写的文件（`CODING_STANDARDS.md`、`CONTRIBUTING.md` 存在即必列；还有 lint 配置说明、ADR、`CONTEXT.md`），作为标准源清单写进输出；工具已强制的规则跳过。」
- 「正确性与风险」节之外，标准轴兜底：仓库无文档化规范时仍对照 `references/smell-baseline.md`（新建，Fowler 12 坏味，每条「是什么→怎么修」，MIT 来源标注）；**规则：仓库明文规范优先，可压制基线；坏味永远是判断级，不是硬违规**。
- 流程 3 subagent：若派多轴审查子代理，**同一消息并行发出、前台等待汇总**，各轴报告不合并不重排（与现「两节分列」一致）。
- 按需读取加 `smell-baseline.md` 指针。

## D. 并行交付：plan 任务图 + ship 并行模式

**plan/SKILL.md 流程 4** 扩写（约 +5 行）：
- 多工作项计划每项带 `依赖: #N`（无依赖写「无」）；按**纵向切片**拆：每片贯穿所需各层、可独立验证、一个新上下文窗口装得下；需要的预重构排最前（先让改动变容易，再做容易的改动）。
- 一处机械改动波及全仓（改名、改共享类型）不硬切纵向：**expand–contract**——先加新形式不破坏旧的 → 按爆炸半径分批迁移（每批一项，依赖 expand）→ 最后删旧形式（依赖全部迁移批）。
- 碰同一共享文件（配置表、消息目录、共享类型）的两项：加依赖边串行，或在计划里预先定死新增名字。

**ship/SKILL.md 新增「并行模式」节**（约 +15 行），触发条件＝计划含依赖边且 ≥2 项可同时开工 + 宿主支持后台子代理与 git worktree；否则走原串行流程：
1. 建唯一**集成分支**；可选先派探索子代理把笔记写到仓库外公共目录。
2. frontier＝依赖已全部**合入集成分支**的项（按集成分支实况算，不看 tracker 计数）；frontier 上每项派一个后台实现子代理，各自 worktree + 分支。
3. 派发靠**上下文指针**（计划路径、项编号、笔记路径、相关 commit），不贴摘要；派发词显式要求按 `implement`/`tdd` 先红后绿（子代理不会自动继承）。
4. 子代理开工先确认 worktree 基于集成分支，交付前把集成分支最新提交合进自己分支（落地即 fast-forward）；总控合入后重算 frontier 继续派。
5. 验证依赖未跟踪文件（gitignore 的 fixture、本地库、凭据）的项回主工作区跑，worktree 里的静默跳过不算绿。
6. **全部合入后才跑一次 `review`**（中途 review 会把未建项判为失败、陷入修-审循环）；发现交一个修复子代理统一修，之后只对修过的点做针对性复验，不再开第二轮全面审查。
7. **恢复面只由总控写**：子代理只交 commit 与简报；cleanup 照常在集成分支上走。清理全部 worktree。
- 适用边界一句：真正无人值守的批量执行用确定性脚本/CI 更可靠；本模式适合在会话内可观察、可干预的并行。

**autoresearch/SKILL.md 干活段**：派后台代理加一句「派发与回收靠上下文指针（日志路径、假设编号、来源链接），不贴摘要」。
**harness-builder/references/subagent_orchestration.md**：「紧耦合编辑类并行」句后加指针「任务图并行交付见 `ship` 并行模式」。
docs/skills 双语 plan/ship 节同步；README 双语 lane 行 ship 描述补「可按任务图并行」。

## E. cleanup：环境改进（retro 吸收）

`cleanup/SKILL.md` 流程 6 lessons 落笔处扩为两问（约 +4 行）：
- 本次的坑/失误，**机械性的**（固定语法模式、禁用 API、导入形态、文件位置规则）→ 优先提议确定性检查（项目 linter 自定义规则、pre-commit、CI 或 check 脚本），而不是写成文字规则；只有判断级问题才进规范文档或 lessons。先读仓库现有检查入口——已存在但未接线/已坏的检查才是发现，不重造。
- 另扫五类候选：导航（找文件慢→导航指针）、持久指令膨胀（AGENTS.md 里该迁去规范/检查的规则、不改变行为的空规则）、工具开销（昂贵调用）、信息获取（缺日志/只读访问）、无正确测试 seam（来自 diagnose）。
- 候选**只在报告里按严重度列出**；落地检查/hook 需用户授权（hooks 属受保护路径）。零候选即「无新增」。
docs/skills 双语 cleanup 节同步一句。

## F. 仓库方针

1. **AGENTS.md 铁律**加一条：「修改 skill 行为须附观察到的失败（会话里跑了什么、技能做了什么、期望什么）或首跑观察点；仅凭上游/设想的改动标注『未首跑』，首跑后回填。」项目地图加 `docs/out-of-scope/`。
2. **新建 `docs/out-of-scope/`**（面向第三方：说明为何不做），首批条目（每条：拒绝内容／理由／替代做法／来源）：
   - `question-limits.md`：brainstorm 不设提问轮数上限（档位调宽度，用户随时可喊停）。
   - `native-question-tool.md`：拷问不绑宿主提问工具（跨宿主中立；选择题 UI 把拷问带偏；个人偏好写自己的 CLAUDE.md）。
   - `name-collision-renames.md`：不为避让其他套件/宿主内置同名命令改名（用命名空间或本地改名）。
   - `new-lane-skills.md`：能由现有 lane 组合出的能力不新开 lane（实例：并行交付并入 ship、retro 并入 cleanup）。
   在 README 双语加一行「贡献与范围」指向该目录（保证可达性）。
3. **首跑观察点**：`docs/skills.md` / `docs/skills.zh-CN.md` 每个 lane 技能节末尾加「**运转正常的信号**」2–4 条可观察信号（例：brainstorm＝首轮 banner 明示档位、方案结构级差异；diagnose＝提假设前已出现一条跑过的变红命令；ship 并行＝多个实现子代理同时在跑、合并全是 fast-forward、只出现一次全面 review）。不进 SKILL.md（避免常驻上下文负载）。
4. `CONTEXT.md` 补术语：frontier、集成分支、上下文指针、反馈回路（若无相应节则加一个短表）。

## G. 收口

- `.claude-plugin/plugin.json` 0.14.0→0.15.0；README 双语徽章 0.15.0。
- `THIRD_PARTY_NOTICES.md` mattpocock 节补：diagnose（diagnosing-bugs）、review 坏味基线（code-review）、ship 并行模式与 plan 切片（implement-spec / to-tickets）、cleanup 环境改进（retro）、brainstorm 措辞（grilling），pinned `b0618bc`（2026-10-08）。
- 独立只读 subagent 复核（lessons：跨面改动必派）：重点查双树条款一致、ship 并行模式与 cleanup 退休契约/恢复面单写者不冲突、diagnose 豁免与原成本纪律不矛盾、README/install/docs/skills/manifest 语义一致。
- 退休：031 行翻 complete → lessons 继承（如「上游田野 FAQ 是比 SKILL 正文更值钱的吸收源」）→ 删 `docs/plans/2026-10-08--…` → state 同步，同一 commit。

## 建议 commit 切分

A 小补丁 → B diagnose → C review → D 并行交付 → E cleanup → F 方针 → G 收口+退休。每个 commit 前跑验证。

## 关键文件

`skills/{brainstorm,tdd,implement,handoff,diagnose,review,plan,ship,autoresearch,cleanup}/SKILL.md` 及 `skills-en/` 镜像；新增 `skills{,-en}/diagnose/references/feedback-loops.md`、`skills{,-en}/review/references/smell-baseline.md`、`docs/out-of-scope/*.md`；`skills{,-en}/harness-builder/references/subagent_orchestration.md`；`docs/skills.md`、`docs/skills.zh-CN.md`、`docs/install.md`、`README.md`、`README.zh-CN.md`、`AGENTS.md`、`CONTEXT.md`、`THIRD_PARTY_NOTICES.md`、`.claude-plugin/plugin.json`、`.harness/*`。

## 验证

- 每批：`node scripts/check-plugin.mjs`（12 项全 PASS，含恢复面一致性/孤儿检查）、`bash scripts/agent/check.sh`。
- 收口：`python3 -B skills/harness-builder/tests/test_scripts.py`（动了 harness-builder reference）。
- 双树对账：`diff <(ls -R skills/X) <(ls -R skills-en/X)` 确认新增 reference 两树都有；人工/subagent 逐条比对改动条款。
- `grep -rn "0.14.0"` 无残留；`grep -rn "out-of-scope"` 确认 README 入边存在。
- 首跑观察（交付后用户实测，回填 state）：在一个代码项目用 ship 跑一份 ≥3 项带依赖边的计划，看第 D 节信号；diagnose 跑一次真实故障看闸门是否先于假设出现。
- 不做：同步 `~/.agents/skills` 安装面（用户级路径，需你另行明确要求）。
