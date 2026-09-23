# autoresearch goal 契约入口改造计划

- 日期：2026-09-23
- 轨道：work_index #026
- 状态：待用户批准
- 设计输入：2026-09-23 会话讨论（用户否决循环内 grill——中断 goal 运行；采纳 goal 契约模式）＋ [Kimi: goal-setting skills for agents](https://www.kimi.ai/resources/goal-setting-skills-for-agents)（goal-creator / write-goal / goal-forge 等开源 skill 的共性：goal 合同含 done state、proof、constraints、operating loop、review depth、stop policy、completion receipt；交互模式为一次性生成草稿＋用户审阅 refine，不是访谈）

## 目标

把 autoresearch 的入口从「直接立首轮获批包」改造为「goal 契约立项 → 无中断自动迭代」，并补上有界扫描段与一手来源纪律。改造后：

1. 用户一次触点（refine/批准 goal 契约）之后，研究循环全自动运行，不因访谈中断。
2. goal 即持久文档：新会话可凭日志文件直接开跑或续跑（`autoresearch <日志路径>`）。
3. 四端安装面（README 双语、install、技能指南双语）口径一致，双语两树同 commit 同步。

## 硬性约束（用户裁决）

- **R1 循环内零访谈**：需要用户输入只发生在 goal 立项阶段与 strict 档轮批；循环中断只允许 blocked / 预算尽 / 授权边界。禁止把 frontier grill 搬进循环（2026-09-21 Grok 对抗审查教训仍然有效：逐轮 Spec 会把用户卡死在第 0 轮）。
- **R2 立项也用草稿模式，不用访谈**：开放项全部以推荐默认值写进 goal 契约草稿，用户改哪条答哪条（Kimi 的 one-shot + refine 模式），一次触点收敛。

## 设计决定

- **D1 入口两态**：`autoresearch <问题/材料>`（默认：立项→批准→迭代连续走）与 `autoresearch <既有日志路径>`（goal 已批：直接进迭代/续跑）。
- **D2 Goal 契约节 = 研究日志头部升格（单文件轨道）**：不新增独立 goal 文档类别、不新增斜杠命令——规避新产物类别的守卫三件套成本（登记/lint/sweep 裁决）与双份真相漂移。字段对齐 Kimi 文章的 goal contract：
  - 研究问题与边界（范围，全程固定）
  - **answered 定义**（done state：成功判据，直接决定终态判定）
  - **证据要求**（proof：一手来源优先；观察＝实际结果＋来源＋获取时点）
  - **约束**（constraints：允许动作、数据范围、费用授权）
  - **停止规则**（stop policy：五终态＋预算默认 3 轮 × 每轮 1 次有成本实验，goal 时可调）
  - **运行环**（operating loop：四段轮次，不变）
  - 授权档位＋批准原话（原话回填）
- **D3 完成回执（completion receipt）**：终态节从「最终答案（覆盖范围与成功判据达成情况）」升格为逐条对照 goal 成功判据的覆盖映射＋证据链接。
- **D4 扫描段入协议**：首轮前增加有界版图扫描（检索＋一手来源阅读，不耗实验预算），产出去向＝日志「背景与已知事实」节，直接喂给首轮包的竞争解释列表；一手来源优先纪律写在此段（解决取证段此前未明写一手来源的缺口）。
- **D5 单触点授权**：goal 契约批准**吸收** default 档的首轮包批准（批准原话同场回填 goal 节与第 1 轮包）；strict 档仍每轮批；全权档免批但 goal 仍落盘备查。
- **D6 goal 契约自检清单**（goal-creator 的 linter 思路，无脚本形式——目标项目无 CI）：answered 定义可验证？停止规则与预算齐？约束三件（动作/数据/费用）齐？批准原话在？运行环指向四段？
- **D7 兼容性**：依赖与降级语义不变（无恢复面＝日志单文件即轨道）；五终态、排除法三问、对抗验证含重开提案必审——全部保留不动。

## 工作流程走查（用户视角，改造后）

```text
你说一句话问题（例：「研究一下：推送该用长轮询还是 WebSocket，查到有结论为止」）
   ↓
① 扫描（agent 自己干，不打扰你，不耗实验预算）
   读 lessons 与既有研究日志 → 检索+读一手来源 → 列出候选解释清单
   ↓
② Goal 契约草稿（agent 写，每个字段带推荐默认值）
   新建 docs/research/日期--主题.md，头部即 Goal 契约
   ↓
你 refine / 批准 ←—— 全程唯一一次需要你参与
   （回「批准」；或「边界加一条：也要考虑服务端成本；预算改 5 轮」→ 改完即批）
   ↓
③ 自动迭代（每轮四段：立包→取证→对抗→蒸馏；中间零打扰）
   第 1 轮起自动放行（goal 批准已吸收首轮包批准）
   重开须过排除法三问：上轮排除了什么（附证据）？还剩哪些解释没区分？下轮怎么区分？
   只在四种情况停下来找你：需要新授权（如要花钱）/ blocked / 预算尽 / 你叫停
   ↓
④ 终态 + 完成回执
   answered / inconclusive / blocked / budget-exhausted / cancelled
   回执逐条对照 Goal 的 answered 定义交账（每条 ✅/⚠️ + 证据链接）
   ↓
你拿到一份完整日志：契约 + 每轮假设/证据/裁决 + 终态 + 回执
会话断了：新会话说「autoresearch <这份日志的路径>」直接续跑
```

各阶段时间感：①② 是立项（一次会话内几分钟到几十分钟）；③ 是主体（可能跨多轮多会话，全自动）；④ 收口。strict 档位下 ③ 每轮开头多一次批准，其余不变。

## 工作项

- [ ] W1 `skills/autoresearch/SKILL.md`（中文树）按 D1–D6 重构：入口两态、立项流程（扫描→草稿→refine/批准）、Goal 契约字段、自检清单、档位表注解（goal 批准吸收首轮包）
- [ ] W2 `skills/autoresearch/templates/research-log.md`：头部换 Goal 契约节（含约束/停止规则/answered 定义/批准行），终态节加完成回执
- [ ] W3 `skills-en/autoresearch/` 两文件同步翻译（**与 W1/W2 同一 commit**——双语两树条款级漂移须同 commit 同步）
- [ ] W4 文档面同步：`CONTEXT.md`（AutoResearch 条目）、`README.md`/`README.zh-CN.md`（技能地图 autoresearch 行的"怎么用"补 `autoresearch <log>` 形态）、`docs/install.md`（技能清单行）、`docs/skills.zh-CN.md`/`docs/skills.md`（autoresearch 节重写：扫描→goal 契约→自动迭代流程、新增"循环中不打断你"卖点、触发例句补续跑形态）
- [ ] W5 `.claude-plugin/plugin.json` 升版 0.11.1 → 0.12.0（行为级变更），README 双语徽章同步
- [ ] W6 独立只读 subagent 审校：zh/en 逐节条款对照＋文档面口径对照（lessons 强制：跨面合同级改动必派独立复核，generator/evaluator 分离）
- [ ] W7 全部闸门：`node scripts/check-plugin.mjs`、`bash scripts/agent/check.sh`、`python3 -B skills/harness-builder/tests/test_scripts.py`
- [ ] W8 恢复面退休四步（翻行 complete → lessons 继承，若首跑校准有新坑 → 删本计划文件 → state 同步）＋ 中文 commit ＋ push（走 7890 代理）

## 验证方式

- 三闸门全绿；W6 审校报告无未裁决分歧。
- goal 流程纸面推演：用一个示例问题走一遍「扫描→契约草稿→批准→迭代→完成回执」，检查模板字段自洽、R1 成立（全程除批准外零用户触点）。
- 徽章 0.12.0 与 plugin.json 同步（check-plugin 守卫）。

## final_integration_claim

安装后的第三方用户：① 用「autoresearch + 一句话问题」触发立项，refine/批准一次后循环无中断自动运行；② 用「autoresearch <既有研究日志路径>」在新会话直接续跑；③ 两种入口在 README 双语、install、技能指南双语的描述口径一致；④ check-plugin 全绿、0.12.0 徽章同步。

## 依赖与风险

- **真实首跑校准债（已知，不阻塞本计划）**：autoresearch 至今未真实首跑；本计划是纸面入口改造，循环本身的校准仍是独立后续动作——建议改造合入后立即拿一个真实小问题首跑一次（goal 立项即首跑入口，正好覆盖）。
- **双语漂移**：同 commit 同步＋W6 审校兜底（任务 024 实证 F1-F5 类缺口靠审校轮捕获）。
- **草稿质量依赖扫描段**：D4 扫描是 goal 契约草稿质量的兜底，若扫描不充分，契约的 answered 定义会失真——自检清单 D6 第一条即查此项。
