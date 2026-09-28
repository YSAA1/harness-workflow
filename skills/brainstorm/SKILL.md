---
name: brainstorm
description: "方案头脑风暴：把模糊需求聊成定型的方案，收敛成用户批准的 Spec。可带档位（低=少问快出 / 中=默认 / 高=研究性深挖，针对瓶颈与创新设计）。触发：方案/目标/边界/取舍/成功标准/验证策略未定，或用户说先讨论/grill/先落 Spec。已有完整 Spec 或小补丁时不用；批准后交给 plan。"
---

# 方案头脑风暴（Frontier Grill）

头脑风暴的对象是**方案**：先在对话里把方案空间聊开、当轮拍板定型，再写 **Spec** 记录结论 → `plan`。不写生产代码，不写 Executable Plan。

Leading words: **frontier** · **design tree** · **shared understanding**

Canonical Spec：`docs/specs/YYYY-MM-DD--<topic>.md`（仅用户或 `AGENTS.md` 明示时可 override）。默认不写 `.harness/`；唯一例外：项目已有 `.harness/` 恢复面时执行「落盘即登记」（见流程步骤 1–2）。

用户可见语言跟随用户；协议 token（`BRAINSTORM …`、`Spec`、`Gate`、路径）可保留英文。

## 路由

- **Use**: 意图开放、方案未定、要 grill。含糊不是等待的理由——含糊正是这场会话要吃掉的东西。
- **Don't**: Spec 已批；单点小补丁；只要事实回答。
- **Next**: Spec 批准 → `plan`；工作面缺口 →（Spec 批准后或用户明示）`harness-builder`。

## 档位

深度比例尺在用户手上，agent 不静默定深浅：

- **调用**：`brainstorm <话题>` 可带档位（低/中/高；自然语言亦可：低档/少问、高档/深挖/研究级/遇到瓶颈了）。未指定即**中档**；首轮 banner 明示档位；用户一个词随时改档，改档以用户原话为准。
- **推断（须明示、可否决）**：仅当用户原话已锚定目标+边界且明显是小事可推低档；仅当用户明确说瓶颈/创新/研究才推高档；其余一律中档。
- 档位只调**问题面宽度与拷问强度**；轮次永远跟 frontier 走，不设轮数配额（不设最少轮数，已定不重问）。

| 档位 | 适用 | 方案空间 | 拷问强度 | Spec |
| --- | --- | --- | --- | --- |
| 低 | 锚点已齐的短需求、想少被打扰 | 推荐方案 + 1 备选，同轮确认 | 可豁免分支整体豁免；压力场景可整体 waive | Thin Spec |
| 中（默认） | 日常方案定型 | 2–3 个具体方案，**须结构级差异**（机制/边界/数据形态不同——三个微调变体是墙纸不是方案），各带取舍+失败模式+`➡️` 推荐；只有一条显然路径时降为确认题并记一个被考虑过的备选 | 设计敏感题必带压力场景（好到能触发「等等，这不该可能」） | 标准 Spec |
| 高 | 研究性方案创新、遇到瓶颈 | 3+ 候选含至少一个非显然/跨域候选；候选素材先查证（sub-agent 并行）；每候选带反转视角（什么条件下它反而成立）；落选方案必须落败因 | 关键方案逐个反例场景；四个动作见下 | 标准 Spec，rejected alternatives 必填 |

**高档四动作**：

1. **立瓶颈题**（第一 frontier 轮）：目的地先行——突破之后到达哪里（它决定后面每一题）；卡在哪、试过什么、死因各是什么；约束绑在哪（哪些不可动）；范围线先画（out of scope 写明）。
2. **广度优先扫雾**：横扫整个方案空间记**雾区**——看得出会来、还说不尖锐的决策（判据：现在能否把问题说尖锐，不是能否回答）；frontier 每前进一步，雾区逐片转正为新题。**扫完无雾＝不需要高档**：告知用户并降中档。
3. **方案空间升级**：候选里至少放一个非显然/跨域方案；候选素材先查证（事实归 agent，查证不阻塞）；每个候选带「什么条件下它反而成立」的反转视角；**落选方案必须落败因**，不许无声淘汰。
4. **最小验证出口**：方案之争谈到谈不出（要看到东西才能答）→ 造一次性 spike/线框/单文件 demo 裁决——只答那一题、看完即弃，答案一句话回填 frontier，原型不进主干。

**低档语义**：少问但仍等确认——问题发出后仍逐条等用户确认或修改；所有档沉默≠批准。

## 拷问纪律（正文即全量工艺，无第二来源）

一场 relentless interview，直到 shared understanding。八条机制承载全部：

1. **设计树，方案置顶**：把需求映射成决策树，**顶层分叉＝候选方案**——头脑风暴的主战场。framing（目标/边界）问到「够选方案」即止，不等四要素全绿；**完成判据/验证策略是所选方案的下游，方案未定不问**（依赖题规则）。
2. **frontier 整批轮**：frontier＝前置已定的全部未决决策。**一轮一条消息问完整个 frontier**：编号、每题带 `➡️` 推荐答案；题干可多段、可带 2–3 个具体选项，让用户按编号作答（「1 同意，2 选第二个，3 不同意，理由…」）；问题间用 `---` 分隔；依赖题拆后轮。
3. **分支与压力**：每题标 `Design branch`（Branch Order 支名），设计敏感题附一条具体压力场景；纯 framing 题可省锚定行。Branch Order：**方案空间（候选+取舍+落选记录）** → actors/boundaries → happy path → failure/edge → data/state → interfaces → NFR → verification hooks。
4. **事实归 agent，决策归用户**：环境可查的事实（代码、文档、工具）自己查或派 sub-agent 查，**绝不问用户**；查证不阻塞——进行中的查证＝未定前置，只有其下游的问题等。偏好、取舍、验证力度、范围边界是**决策**，必须问用户并等答案；agent 自答决策＝破坏协议，不是灵活执行。
5. **每轮重塑树**：用户答案落定后重算 frontier 再问下一轮；事后发现误并轮或漏支 → 受影响分支重开进下轮，不装没发生。
6. **不可谈问题出口**：识别「要看到东西才能答」的题（形态、手感、一页还是三段）——停拷问，走最小验证出口（全档可用，高档默认）；「我不知道」是真实答案，用户答不出＝先原型再猜，不硬谈。硬谈不可谈题是会话膨胀的根源。
7. **纸痕**：术语冲突当场对质（「你的词汇表把 X 定义为 A，你现在说的像 B」）；模糊词提规范名（「account 是 Customer 还是 User？」）；已解决的术语**当轮**落目标项目既有词汇表（不攒批，不自动创建）；ADR 三门全过（难逆转＋无上下文会惊讶＋真取舍）才提，会话零 ADR 是正常工作态。
8. **判空才算完**：frontier 空＝Branch Order 每支已答/显式豁免/仓库可证（高档另附落选方案败因），framing 四要素（目标→边界→**方案**→成功标准→验证策略，按此依赖顺序）confirmed 或 waived。**宣告判空的同条消息附八支一行对账**；自评「已想清」不构成判空。常识默认、业界惯例、可延后不构成免问。判空后仍须用户确认 shared understanding（完整 brief 与起草授权，或单次确认）才起草 Spec。

用户要求一次一题时改逐题问，同一棵树照常维护。

**会话健康自检**（收尾前对照）：用户至少否决过一次推荐；至少一题暴露过用户一直在隐式做的决定；结束时用户能向不在场的人辩护每个选择——三条全无＝这场拷问没产生价值，补问再收。问题质量越问越降（dumb zone）＝面太大，建议先拆成多轨道再 grill。

## 轮出格式（唯一源）

```text
BRAINSTORM CLARIFICATION IN PROGRESS · Gear: L/M/H
❓ Q1 - <title>: <body; 可多段、可带选项>
Design branch: <Branch Order 支名>
Stress scenario: <一条具体压力场景；设计敏感题必带>
➡️ <recommended answer>
---
❓ Q2 - <title>: <body>
Design branch: <branch>
➡️ <recommended answer>
Framing: <confirmed+waived>/4; Gate: BLOCKED; Frontier: open
Needs: frontier answers | shared understanding
```

Gate 过后切换为（Branches 行即判空对账；高档在方案支内附落选败因；仓库证来源随对账行或 Spec 给出）：

```text
BRAINSTORM SPEC READY
Spec: <path>; Gear: M; Gate: PASSED; Frontier: empty
Branches: 方案✓(A 选定；B 落选:<败因>) · actors✓ · happy✓ · failure 豁免 · data✓ · ifaces✓ · NFR 仓库证 · verify✓
Needs: approve Spec
Next after approval: plan
```

判空前如有剩余**事实型**推断，按假设批一次性呈报（逐条附来源）确认后并账；偏好与取舍永不入批。

## 流程

### 1. 方案 grill

按「拷问纪律」执行：档位先行（明示/确认）→ 方案空间当轮拍板 → 分支细化 → 判空对账 → shared understanding 确认。开工先读：既有 Spec/代码/`AGENTS.md`、`git status`、用户材料。

恢复面接续（仅项目已有 `.harness/` 时）：第一轮 frontier 发出后，为本轨道在 work_index 登记行——Status `active`、Primary artifact 填 `（Spec 未落盘：<预定 Spec 路径>）`；每轮 grill 结束顺手把该行 Last verified 格更新为「日期 · 已定 n/m · 未决题号」。断会话后新会话按行内进度续问，不从头重问；无恢复面项目跳过本段，维持零文件。

### 2. Spec

按 `references/spec-drafting.md`：验证策略 → **记录 grill 已定的方案比较** → 写 Spec → 自审 → 求批准。未批准不 `plan`。Spec 落盘的同一动作里，把本轨道 work_index 行的 Primary artifact 翻转为实际 Spec 路径（grill 阶段未登记者此时补登记；无恢复面项目不登记，批准后由 `plan` 接管建档）。未批准 Spec 因该行出链而非孤儿。

完成：独立 Spec 路径已给，等待批准。

## 硬规则

- 存在未决偏好/取舍时，用户可见的第一条消息必须是编号 frontier 问题；禁止只发计分行或假设批代替提问。
- **方案选定发生在对话里**：Spec 只记录 grill 已定的方案与落选败因，不替用户做没聊过的选择。
- 一条消息一个 frontier round；依赖题拆到后轮，独立题同轮发出。
- 沉默 ≠ 批准（全档一致）；shared understanding 由完整 brief 与明确起草授权覆盖，否则单问一次，不重复索要相同确认。
- 判空须对账：宣告 Gate 过 / frontier 空的同条消息附 Branch Order 八支一行对账；自评「已想清」或只报计分不构成判空。

## 验收

- [ ] 档位首轮已明示，改档以用户原话为准
- [ ] 方案空间在对话内拍板（中/高档有结构级差异候选），Spec 只记录结论
- [ ] Gate 过；四要素 confirmed 或 waived，不以 inferred 过闸（顺序：目标→边界→方案→成功标准→验证策略）
- [ ] 判空宣告附八支一行对账（高档含落选败因）
- [ ] 会话健康自检已对照（零否决、零隐式决定暴露 → 补问再收）
- [ ] Shared understanding 已覆盖；Spec 已求批
- [ ] 有恢复面项目：Spec 落盘时本轨道 work_index 行已指向该 Spec（项目确无恢复面则免）

## 按需读取

- 步骤 2 起：`references/spec-drafting.md` · `spec-review-checklist.md` · `templates/spec.md`
- 文中 `CONTEXT.md` 指目标项目根目录的领域词汇表（若存在），不是插件包文件；先按项目 `AGENTS.md` 找实际词汇来源，不存在不强制创建。

## Recommended next skill

| Situation | Next |
| --- | --- |
| Spec approved | `plan` |
| Spec rejected / 讨论放弃（含 grill 中止） | 同 commit 翻行 `abandoned` 走退休四步（删未批准 Spec；无恢复面或 grill 中止时无件可删）→ 结束 |
| Workbench gap（批准后或用户明示） | `harness-builder` |
